import OpenAI from "openai";
import { revalidatePath } from "next/cache";
import { getObjectBuffer } from "@/lib/s3";
import { prisma } from "@/lib/prisma";

export const AI_SUMMARY_STATUS = {
  PENDING: "pending",
  READY: "ready",
  FAILED: "failed",
  SKIPPED: "skipped",
} as const;

const MAX_TEXT_CHARS = 12_000;

function getExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

async function extractTextFromBuffer(
  buffer: Buffer,
  fileName: string,
): Promise<string | null> {
  const ext = getExtension(fileName);

  if (ext === "txt") {
    return buffer.toString("utf-8").trim();
  }

  if (ext === "pdf") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text?.trim() || null;
    } finally {
      await parser.destroy();
    }
  }

  return null;
}

async function summarizeText(documentName: string, text: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const openai = new OpenAI({ apiKey });
  const clipped = text.slice(0, MAX_TEXT_CHARS);

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You summarize documents for busy professionals. Use 3-5 short bullet points. Be factual. Do not invent details not present in the text. Keep under 120 words.",
      },
      {
        role: "user",
        content: `Document filename: ${documentName}\n\nContent:\n${clipped}`,
      },
    ],
  });

  const summary = response.choices[0]?.message?.content?.trim();
  if (!summary) {
    throw new Error("OpenAI returned an empty summary");
  }

  return summary;
}

export async function runDocumentSummaryJob(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) return;

  await prisma.document.update({
    where: { id: documentId },
    data: {
      aiSummaryStatus: AI_SUMMARY_STATUS.PENDING,
      aiSummaryError: null,
    },
  });

  try {
    const buffer = await getObjectBuffer(document.s3Key);
    const text = await extractTextFromBuffer(buffer, document.name);

    if (!text) {
      await prisma.document.update({
        where: { id: documentId },
        data: {
          aiSummaryStatus: AI_SUMMARY_STATUS.SKIPPED,
          aiSummary: null,
          aiSummaryError:
            "AI summary supports PDF and TXT files only for this MVP.",
        },
      });
      return;
    }

    const summary = await summarizeText(document.name, text);

    await prisma.document.update({
      where: { id: documentId },
      data: {
        aiSummary: summary,
        aiSummaryStatus: AI_SUMMARY_STATUS.READY,
        aiSummaryError: null,
      },
    });
  } catch (error) {
    await prisma.document.update({
      where: { id: documentId },
      data: {
        aiSummaryStatus: AI_SUMMARY_STATUS.FAILED,
        aiSummaryError:
          error instanceof Error ? error.message : "Summary generation failed",
      },
    });
  } finally {
    revalidatePath("/dashboard/documents");
  }
}
