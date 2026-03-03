import type { Metadata } from "next";
import "./globals.css";
import { UIProvider } from "@/context/UIContext";
import RulebookManager from "@/components/rulebook/RulebookManager";

export const metadata: Metadata = {
  title: "MICHIBIKI - Michibiki Pipeline",
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
        <UIProvider>
          {children}
          <RulebookManager />
        </UIProvider>
      </body>
    </html>
  );
}
