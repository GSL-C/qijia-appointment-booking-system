'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen bg-gradient-to-br from-[var(--hu-powder-white)] to-white flex items-center justify-center p-6">
        <div className="qijia-container w-full">
          {/* 品牌标题区域 */}
          <div className="text-center mb-16">
            <div className="inline-block p-8 rounded-lg bg-white shadow-lg mb-8">
              <h1 className="qijia-title-main text-[var(--ink-black)] mb-4">
                齐家
              </h1>
              <div className="w-16 h-1 bg-[var(--qijia-yellow)] mx-auto mb-4"></div>
              <p className="qijia-title-sub text-[var(--ink-gray)] mb-2">
                心理咨询预约平台
              </p>
              <p className="qijia-text-body text-[var(--ink-gray)]">
                以家的名义，守护你所珍视的一切
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* 来访者入口 */}
            <Card className="hover:scale-[1.02] transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--qijia-yellow)] to-[#f4c861] rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="qijia-title-sub text-[var(--ink-black)] mb-3">我是来访者</h2>
                  <p className="qijia-text-body text-[var(--ink-gray)]">寻找专业咨询师，让心灵有所依靠</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-[var(--ink-black)]">
                    <div className="w-2 h-2 bg-[var(--qijia-yellow)] rounded-full mr-3"></div>
                    浏览专业咨询师资料与专长
                  </div>
                  <div className="flex items-center text-sm text-[var(--ink-black)]">
                    <div className="w-2 h-2 bg-[var(--qijia-yellow)] rounded-full mr-3"></div>
                    便捷预约适合的咨询时间
                  </div>
                  <div className="flex items-center text-sm text-[var(--ink-black)]">
                    <div className="w-2 h-2 bg-[var(--qijia-yellow)] rounded-full mr-3"></div>
                    安全私密的咨询环境保障
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/visitor/counselors" className="block">
                    <Button className="w-full" size="lg">
                      开始寻找咨询师
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 咨询师入口 */}
            <Card className="hover:scale-[1.02] transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--ink-gray)] to-[#888888] rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="qijia-title-sub text-[var(--ink-black)] mb-3">我是咨询师</h2>
                  <p className="qijia-text-body text-[var(--ink-gray)]">管理专业服务，助人心有所安</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-[var(--ink-black)]">
                    <div className="w-2 h-2 bg-[var(--ink-gray)] rounded-full mr-3"></div>
                    灵活设置咨询时间安排
                  </div>
                  <div className="flex items-center text-sm text-[var(--ink-black)]">
                    <div className="w-2 h-2 bg-[var(--ink-gray)] rounded-full mr-3"></div>
                    高效管理来访者预约
                  </div>
                  <div className="flex items-center text-sm text-[var(--ink-black)]">
                    <div className="w-2 h-2 bg-[var(--ink-gray)] rounded-full mr-3"></div>
                    专业工具助力咨询服务
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/counselor/schedule" className="block">
                    <Button className="w-full" size="lg" variant="secondary">
                      进入咨询师工作台
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 品牌理念区域 */}
          <div className="text-center mt-16">
            <div className="inline-block p-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md">
              <p className="qijia-text-body text-[var(--ink-gray)] mb-2">
                万事齐家，心有所依
              </p>
              <p className="qijia-text-helper text-[var(--ink-gray)]">
                本平台严格遵循心理咨询伦理规范，保护每一位用户的隐私与权益
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
