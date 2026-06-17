import type { Metadata } from "next";
import { Gowun_Batang } from "next/font/google";
import SecurityWrapper from "@/components/SecurityWrapper";
import "./globals.css";

const gowunBatang = Gowun_Batang({
  variable: "--font-gowun-batang",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wedding-invitation-neon-nine.vercel.app"),
  title: "9월 12일, 우리 결혼합니다",
  description: "9월 12일 토요일, 저희의 결혼식에 소중한 분들을 초대합니다.",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "정훈 & 희원 결혼식에 초대합니다",
    description: "2026년 9월 12일 토요일 오후 1시 30분, 더엠컨벤션",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/og-image-v2.jpg",
        width: 1200,
        height: 1800,
        alt: "정훈 & 희원 결혼식",
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
      className={`${gowunBatang.variable} h-full antialiased`}
    >
      <body className="min-h-full font-serif">
        <SecurityWrapper>
          {children}
        </SecurityWrapper>
      </body>
    </html>
  );
}
