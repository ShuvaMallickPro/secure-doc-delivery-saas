"use client";

import { useState } from "react";
import {
  createDocument,
  createShareLink,
  revokeShareLink,
} from "@/actions/documents";
import type { DocumentModel } from "@/generated/prisma/models/Document";
import type { ShareLinkModel } from "@/generated/prisma/models/ShareLink";

type DocumentWithShares = DocumentModel & { shares: ShareLinkModel[] };

export function DocumentList({
  documents,
}: {
  documents: DocumentWithShares[];
}) {
  const [shareUrl, setShareUrl] = useState("");

  async function handleUpload(formData: FormData) {
    await createDocument(formData);
    window.location.reload();
  }

  async function handleShare(docId: string) {
    const result = await createShareLink(docId, "recipient@example.com");
    setShareUrl(result.shareUrl);
  }

  async function handleRevoke(shareId: string) {
    await revokeShareLink(shareId);
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <form
        action={handleUpload}
        className="rounded-lg border border-gray-200 bg-white p-6"
      >
        <h2 className="mb-4 text-lg font-semibold">Upload Document</h2>
        <input type="file" name="file" required className="mb-4 block w-full" />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Upload
        </button>
      </form>

      {shareUrl && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-800">Share link generated:</p>
          <p className="break-all font-mono text-sm">{shareUrl}</p>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No documents yet. Upload your first file above.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {doc.name}
                  </td>
                  <td className="px-6 py-4">
                    {doc.shares.length > 0 ? (
                      doc.shares[0].revokedAt ? (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
                          Revoked
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                          Active
                        </span>
                      )
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">
                        No shares
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="space-x-2 px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleShare(doc.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Share
                    </button>
                    {doc.shares.length > 0 && !doc.shares[0].revokedAt && (
                      <button
                        type="button"
                        onClick={() => handleRevoke(doc.shares[0].id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
