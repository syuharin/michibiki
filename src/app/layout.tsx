import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "みちびき - Michibiki Pipeline",
  description: "P2P Serverless Board Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-michibiki-white text-michibiki-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
