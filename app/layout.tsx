import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Agentation } from "agentation";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SecureDoc — Secure document delivery",
  description: "Upload, share, and revoke access to sensitive documents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/login"
      signUpUrl="/signup"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "hsl(var(--primary))",
          colorBackground: "hsl(var(--background))",
          borderRadius: "0.5rem",
        },
        elements: {
          card: "shadow-none border border-border",
        },
      }}
    >
      <html lang="en" className={`${inter.variable}  h-full antialiased`}>
        <body className="min-h-full flex flex-col font-sans">
          {children}
          <Toaster />
        </body>
        <Agentation />
      </html>
    </ClerkProvider>
  );
}
