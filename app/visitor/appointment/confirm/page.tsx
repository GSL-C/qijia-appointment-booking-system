'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/shared/Layout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';
import { mockCounselors, mockTimeSlots } from '@/lib/mockData';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AppointmentConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const counselorId = searchParams.get('counselorId');
  const timeSlotId = searchParams.get('timeSlotId');

  // 找到咨询师和时间段
  const counselor = mockCounselors.find(c => c.id === counselorId);
  const timeSlot = mockTimeSlots.find(t => t.id === timeSlotId);

  const handleSubmit = async () => {
    if (!counselor || !timeSlot) return;

    setIsSubmitting(true);
    
    // 模拟API调用
    setTimeout(() => {
      setIsSubmitting(false);
      // 跳转到预约成功页面
      router.push(`/visitor/appointment/success?counselorId=${counselor.id}&timeSlotId=${timeSlot.id}`);
    }, 1500);
  };

  if (!counselor || !timeSlot) {
    return (
      <Layout userRole={UserRole.VISITOR}>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">预约信息错误</h1>
          <p className="text-gray-600 mb-6">未找到相关预约信息</p>
          <Link href="/visitor/counselors">
            <Button>返回咨询师列表</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole={UserRole.VISITOR}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 返回按钮 */}
        <div>
          <Link href={`/visitor/counselors/${counselor.id}`}>
            <Button variant="ghost" className="mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回咨询师页面
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">确认预约信息</h1>
          <p className="text-gray-600 mt-1">请仔细核对预约信息，确认无误后提交</p>
        </div>

        {/* 预约信息卡片 */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">预约详情</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 咨询师信息 */}
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{counselor.name}</h3>
                <p className="text-sm text-gray-600">{counselor.gender}性咨询师</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {counselor.specialties.slice(0, 2).map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 时间信息 */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-gray-900">预约时间</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatDateTime(timeSlot.startTime)} - {formatDateTime(timeSlot.endTime).split(' ')[1]}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                预计咨询时长：1小时
              </p>
            </div>

            {/* 重要提醒 */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">取消政策</h4>
                  <p className="text-sm text-yellow-700">
                    预约开始前24小时可免费取消，24小时内不可取消。请合理安排时间。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 备注信息 */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">补充信息</h2>
            <p className="text-sm text-gray-600">请简要描述您当前的状态或期待（选填）</p>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="例如：最近工作压力较大，希望能得到一些缓解焦虑的建议..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {notes.length}/500
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex space-x-4">
          <Link href={`/visitor/counselors/${counselor.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              返回修改
            </Button>
          </Link>
          <Button 
            className="flex-1" 
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? '提交中...' : '确认预约'}
          </Button>
        </div>

        {/* 服务条款 */}
        <div className="text-center text-sm text-gray-500">
          <p>
            提交预约即表示您同意我们的
            <button className="text-blue-600 hover:underline mx-1">服务条款</button>
            和
            <button className="text-blue-600 hover:underline mx-1">隐私政策</button>
          </p>
        </div>
      </div>
    </Layout>
  );
} 