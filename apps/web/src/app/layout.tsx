import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Web3ProviderWrapper } from "@/components/providers/Web3ProviderWrapper";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MezoOS - Bitcoin-Native Treasury",
  description: "Operate on Bitcoin without selling it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <Web3ProviderWrapper>
          {children}
        </Web3ProviderWrapper>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
