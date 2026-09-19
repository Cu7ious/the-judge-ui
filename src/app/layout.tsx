import type { Metadata } from "next";
import { AppHeader } from "@/components/shell/AppHeader";
import { ThemeProvider } from "@/components/shell/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "the-judge",
  description: "LLM evaluation runner UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <AppHeader />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
