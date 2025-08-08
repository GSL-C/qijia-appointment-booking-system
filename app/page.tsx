'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import AuthCard from '@/components/AuthCard';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen bg-gradient-yellow flex flex-col items-center justify-center p-6 relative">
        <div className="qijia-container w-full max-w-6xl">
          {/* 品牌标题区域 - 移除白色背景，融入主背景 */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-black text-[var(--ink-black)] mb-6">
              齐家
            </h1>
            <div className="w-32 h-1 bg-[var(--qijia-yellow)] mx-auto"></div>
          </div>

          {/* 登录/注册卡片 */}
          <div className="auth-card-container mb-16 flex justify-center px-4 sm:px-0">
            <div className="w-full max-w-md">
              <AuthCard />
            </div>
          </div>

          {/* 用户身份选择区域 - 优化布局，使页面更紧凑 */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 来访者入口 */}
            <Card className="qijia-card hover:scale-[1.02] transition-all duration-300">
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
              <div className="qijia-divider mx-8"></div>
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
            <Card className="qijia-card hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--qijia-yellow)] to-[#f4c861] rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="qijia-title-sub text-[var(--ink-black)] mb-3">我是咨询师</h2>
                  <p className="qijia-text-body text-[var(--ink-gray)]">管理专业服务，助人心有所安</p>
                </div>
              </CardHeader>
              <div className="qijia-divider mx-8"></div>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-[var(--ink-black)]">
                    <div className="w-2 h-2 bg-[var(--qijia-yellow)] rounded-full mr-3"></div>
                    灵活设置咨询时间安排
                  </div>
                  <div className="flex items-center text-sm text-[var(--ink-black)]">
                    <div className="w-2 h-2 bg-[var(--qijia-yellow)] rounded-full mr-3"></div>
                    高效管理来访者预约
                  </div>
                  <div className="flex items-center text-sm text-[var(--ink-black)]">
                    <div className="w-2 h-2 bg-[var(--qijia-yellow)] rounded-full mr-3"></div>
                    专业工具助力咨询服务
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/counselor/schedule" className="block">
                    <Button className="w-full" size="lg">
                      进入咨询师工作台
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 隐私声明 - 移至右下角 */}
          <div className="absolute bottom-4 right-6">
            <p className="qijia-text-helper text-[var(--ink-gray)] text-right">
              本平台严格遵循心理咨询伦理规范，保护每一位用户的隐私与权益
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
