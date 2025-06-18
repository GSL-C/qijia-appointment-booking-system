'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 neu-card p-8">
          <h1 className="text-4xl font-bold text-[var(--text-color)] mb-4">
            心理咨询预约系统
          </h1>
          <p className="text-xl text-[var(--text-color)] opacity-80">
            专业的心理健康服务平台，连接来访者与专业咨询师
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 来访者入口 */}
          <Card className="hover:scale-[1.02] neu-transition">
            <CardHeader>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 neu-convex rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-[var(--text-color)]">我是来访者</h2>
                <p className="text-[var(--text-color)] opacity-75 mt-2">寻找合适的心理咨询师，预约咨询时间</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-[var(--text-color)] opacity-80">
                  <svg className="w-4 h-4 text-[var(--success-color)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  浏览专业咨询师信息
                </div>
                <div className="flex items-center text-sm text-[var(--text-color)] opacity-80">
                  <svg className="w-4 h-4 text-[var(--success-color)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  在线预约咨询时间
                </div>
                <div className="flex items-center text-sm text-[var(--text-color)] opacity-80">
                  <svg className="w-4 h-4 text-[var(--success-color)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  管理我的预约
                </div>
              </div>
              <div className="mt-8">
                <Link href="/visitor/counselors" className="block">
                  <Button className="w-full" size="lg">
                    进入来访者端
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 咨询师入口 */}
          <Card className="hover:scale-[1.02] neu-transition" variant="convex">
            <CardHeader>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 neu-convex rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--success-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-[var(--text-color)]">我是咨询师</h2>
                <p className="text-[var(--text-color)] opacity-75 mt-2">管理我的咨询日程，处理预约请求</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-[var(--text-color)] opacity-80">
                  <svg className="w-4 h-4 text-[var(--success-color)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  设置开放时间段
                </div>
                <div className="flex items-center text-sm text-[var(--text-color)] opacity-80">
                  <svg className="w-4 h-4 text-[var(--success-color)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  管理预约请求
                </div>
                <div className="flex items-center text-sm text-[var(--text-color)] opacity-80">
                  <svg className="w-4 h-4 text-[var(--success-color)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  查看我的日程
                </div>
              </div>
              <div className="mt-8">
                <Link href="/counselor/schedule" className="block">
                  <Button className="w-full" size="lg" variant="secondary">
                    进入咨询师端
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 neu-card p-6">
          <p className="text-[var(--text-color)] opacity-70 text-sm">
            本系统遵循严格的隐私保护政策，确保所有咨询信息的安全性与保密性
          </p>
        </div>
      </div>
    </div>
  );
}
