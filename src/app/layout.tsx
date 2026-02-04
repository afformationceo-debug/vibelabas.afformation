import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AFFORMATION | 마케팅을 알고 코드를 짜는 조직',
  description:
    'Hashed Vibe Labs 지원 - AI Native 개발과 마케팅 전문성을 결합한 어포메이션. 6개의 라이브 프로덕트, 100억+ 매출, Claude Opus 4.5 활용.',
  keywords: [
    'Afformation',
    '어포메이션',
    'Hashed Vibe Labs',
    'AI Native',
    'Claude',
    '인플루언서 마케팅',
    'Scout Manager',
    'Infleos',
  ],
  authors: [{ name: 'Afformation Inc.' }],
  openGraph: {
    title: 'AFFORMATION | 마케팅을 알고 코드를 짜는 조직',
    description:
      'AI Native 개발과 마케팅 전문성의 결합. 6개 라이브 프로덕트, 100억+ 매출.',
    url: 'https://afformation.co.kr',
    siteName: 'Afformation',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AFFORMATION | 마케팅을 알고 코드를 짜는 조직',
    description:
      'AI Native 개발과 마케팅 전문성의 결합. 6개 라이브 프로덕트, 100억+ 매출.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-[#fafafa]`}
      >
        {children}
      </body>
    </html>
  );
}
