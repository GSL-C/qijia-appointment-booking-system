'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';
import { mockCounselors, mockTimeSlots } from '@/lib/mockData';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AppointmentSuccessPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  const counselorId = searchParams.get('counselorId');
  const timeSlotId = searchParams.get('timeSlotId');

  // 找到咨询师和时间段
  const counselor = mockCounselors.find(c => c.id === counselorId);
  const timeSlot = mockTimeSlots.find(t => t.id === timeSlotId);

  useEffect(() => {
    // 模拟加载数据
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Layout userRole={UserRole.VISITOR}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">处理中，请稍候...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 成功图标和标题 */}
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">预约成功！</h1>
          <p className="text-lg text-gray-600">您的预约请求已提交，等待咨询师确认</p>
        </div>

        {/* 预约信息卡片 */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">预约详情</h2>
            
            <div className="space-y-4">
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
              </div>

              {/* 状态信息 */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">等待确认</h4>
                    <p className="text-sm text-yellow-700">
                      您的预约请求已提交，咨询师将在24小时内确认。确认后，我们将通过短信和邮件通知您。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 下一步提示 */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">后续步骤</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">等待确认</h3>
                  <p className="text-sm text-gray-600">咨询师将在24小时内确认您的预约请求</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">收到确认通知</h3>
                  <p className="text-sm text-gray-600">确认后，您将收到短信和邮件通知</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">准时参加咨询</h3>
                  <p className="text-sm text-gray-600">请提前5-10分钟做好准备，确保网络和设备正常</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <Link href="/visitor/my-appointments" className="flex-1">
            <Button className="w-full">
              查看我的预约
            </Button>
          </Link>
          <Link href="/visitor/counselors" className="flex-1">
            <Button variant="outline" className="w-full">
              浏览更多咨询师
            </Button>
          </Link>
        </div>

        {/* 帮助信息 */}
        <div className="text-center text-sm text-gray-500">
          <p>
            如有任何问题，请联系客服：
            <a href="tel:+8610012345678" className="text-blue-600 hover:underline ml-1">
              010-12345678
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
} 