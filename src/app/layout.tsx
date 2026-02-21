import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { KakaoSDK } from "@/components/KakaoSDK";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://my-toss-benefits.vercel.app";

export const metadata: Metadata = {
  title: "내게 맞는 혜택 알리미",
  description: "몰라서 놓친 숨은 정부 지원금을 찾아드려요.",
  themeColor: "#3182f6",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "내게 맞는 혜택 알리미",
    description:
      "내게 맞는 혜택 알리미 - 앱인토스 맞춤형 정부 혜택 조회 서비스",
    url: SITE_URL,
    siteName: "내게 맞는 혜택 알리미",
    images: [
      { url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 },
    ],
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
        <KakaoSDK />
      </body>
    </html>
  );
}
