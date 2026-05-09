import type { Metadata } from "next";
import { Noto_Serif_KR, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "9월 12일, 우리 결혼합니다",
  description: "9월 12일 토요일, 저희의 결혼식에 소중한 분들을 초대합니다.",
  openGraph: {
    title: "정훈 & 희원 결혼식에 초대합니다",
    description: "2026년 9월 12일 토요일 오후 1시 30분, 더엠컨벤션",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "https://picsum.photos/id/237/800/600",
        width: 800,
        height: 600,
        alt: "Wedding Invitation",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSerifKR.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full font-serif">
        {children}
      </body>
    </html>
  );
}
