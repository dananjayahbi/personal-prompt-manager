import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prompt Manager - AI Prompt Management System",
  description: "Advanced dashboard for managing AI prompt templates with CRUD operations, preview functionality, and modern UI.",
  keywords: ["Prompt Manager", "AI Prompts", "Template Management", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
  authors: [{ name: "Prompt Manager Team" }],
  openGraph: {
    title: "Prompt Manager",
    description: "Advanced AI prompt management system with modern UI",
    url: "https://chat.z.ai",
    siteName: "Prompt Manager",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Manager",
    description: "Advanced AI prompt management system with modern UI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
