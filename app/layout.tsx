import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "齐家 - 心理咨询预约平台",
  description: "以家的名义，守护你所珍视的一切。专业的心理健康服务平台，连接来访者与专业咨询师。",
  keywords: "心理咨询,心理健康,心理医生,咨询师预约,齐家",
  authors: [{ name: "齐家团队" }],
  robots: "index, follow",
  openGraph: {
    title: "齐家 - 心理咨询预约平台",
    description: "以家的名义，守护你所珍视的一切",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/qijia-logo.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&family=Noto+Sans:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
