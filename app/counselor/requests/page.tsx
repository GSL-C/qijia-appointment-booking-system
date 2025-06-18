'use client';

import { useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserRole, AppointmentStatus } from '@/types';
import { mockAppointmentRequests, currentCounselor } from '@/lib/mockData';
import { formatDateTime } from '@/lib/utils';

export default function AppointmentRequestsPage() {
  const [requests, setRequests] = useState(
    mockAppointmentRequests.filter(req => req.counselorId === currentCounselor.id)
  );

  const handleConfirmRequest = (requestId: string) => {
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId
          ? { ...req, status: AppointmentStatus.CONFIRMED }
          : req
      )
    );
    // 在实际应用中，这里会调用API确认预约
    console.log('确认预约请求:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    if (confirm('确定要拒绝这个预约请求吗？')) {
      setRequests(prevRequests =>
        prevRequests.filter(req => req.id !== requestId)
      );
      // 在实际应用中，这里会调用API拒绝预约
      console.log('拒绝预约请求:', requestId);
    }
  };

  const pendingRequests = requests.filter(req => req.status === AppointmentStatus.PENDING);
  const processedRequests = requests.filter(req => req.status !== AppointmentStatus.PENDING);

  return (
    <Layout userRole={UserRole.COUNSELOR}>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">预约请求列表</h1>
          <p className="text-gray-600 mt-1">处理来访者的预约申请</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">待处理</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">今日处理</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {processedRequests.filter(req => 
                      new Date(req.createdAt).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">总请求</p>
                  <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 待处理请求 */}
        {pendingRequests.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              待处理请求 ({pendingRequests.length})
            </h2>
            <div className="space-y-4">
              {pendingRequests.map(request => (
                <Card key={request.id} className="border-l-4 border-yellow-400">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* 来访者头像 */}
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>

                        <div className="flex-1">
                          {/* 来访者姓名 */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {request.visitor.name}
                          </h3>

                          {/* 请求时间 */}
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDateTime(request.timeSlot.startTime)}
                          </div>

                          {/* 申请时间 */}
                          <div className="flex items-center text-xs text-gray-500 mb-3">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            申请时间：{formatDateTime(request.createdAt)}
                          </div>

                          {/* 备注信息 */}
                          {request.notes && (
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-4">
                              <span className="font-medium">来访者备注：</span>
                              <p className="mt-1">{request.notes}</p>
                            </div>
                          )}

                          {/* 状态 */}
                          <div className="flex items-center">
                            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              待处理
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          onClick={() => handleConfirmRequest(request.id)}
                          className="min-w-[80px]"
                        >
                          确认
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleRejectRequest(request.id)}
                          className="min-w-[80px]"
                        >
                          拒绝
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="min-w-[80px]"
                        >
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 已处理请求 */}
        {processedRequests.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              最近处理 ({processedRequests.length})
            </h2>
            <div className="space-y-4">
              {processedRequests.slice(0, 5).map(request => (
                <Card key={request.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* 来访者头像 */}
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">
                              {request.visitor.name}
                            </h3>
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              已确认
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatDateTime(request.timeSlot.startTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {requests.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无预约请求</h3>
            <p className="text-gray-600">当您有新的预约请求时，会在这里显示</p>
          </div>
        )}
      </div>
    </Layout>
  );
} 