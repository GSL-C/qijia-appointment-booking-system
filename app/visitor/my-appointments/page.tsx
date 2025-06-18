'use client';

import { useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { UserRole, AppointmentStatus } from '@/types';
import { mockAppointments, mockCounselors } from '@/lib/mockData';
import { formatDateTime, getAppointmentStatusText, getAppointmentStatusClass, canCancelAppointment } from '@/lib/utils';

export default function MyAppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  // 过滤预约
  const filteredAppointments = mockAppointments.filter(appointment => {
    switch (activeTab) {
      case 'upcoming':
        return appointment.status === AppointmentStatus.CONFIRMED || appointment.status === AppointmentStatus.PENDING;
      case 'completed':
        return appointment.status === AppointmentStatus.COMPLETED;
      case 'cancelled':
        return appointment.status === AppointmentStatus.CANCELLED;
      default:
        return true;
    }
  });

  const handleCancelAppointment = (appointmentId: string) => {
    // 模拟取消预约
    if (confirm('确定要取消这个预约吗？')) {
      console.log('取消预约:', appointmentId);
      // 在实际应用中，这里会调用API更新预约状态
    }
  };

  const tabs = [
    { id: 'all', label: '全部', count: mockAppointments.length },
    { id: 'upcoming', label: '即将进行', count: mockAppointments.filter(a => a.status === AppointmentStatus.CONFIRMED || a.status === AppointmentStatus.PENDING).length },
    { id: 'completed', label: '已完成', count: mockAppointments.filter(a => a.status === AppointmentStatus.COMPLETED).length },
    { id: 'cancelled', label: '已取消', count: mockAppointments.filter(a => a.status === AppointmentStatus.CANCELLED).length }
  ];

  return (
    <Layout userRole={UserRole.VISITOR}>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">我的预约</h1>
          <p className="text-gray-600 mt-1">查看和管理您的咨询预约</p>
        </div>

        {/* 标签页筛选 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* 预约列表 */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无预约记录</h3>
              <p className="text-gray-600 mb-6">您还没有任何{activeTab !== 'all' ? tabs.find(t => t.id === activeTab)?.label : ''}预约</p>
              <Button>
                <Link href="/visitor/counselors">浏览咨询师</Link>
              </Button>
            </div>
          ) : (
            filteredAppointments.map(appointment => {
              const counselor = mockCounselors.find(c => c.id === appointment.counselorId);
              const canCancel = canCancelAppointment(appointment.timeSlot.startTime) && 
                               (appointment.status === AppointmentStatus.CONFIRMED || appointment.status === AppointmentStatus.PENDING);
              
              return (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* 咨询师头像 */}
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>

                        <div className="flex-1">
                          {/* 咨询师姓名 */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {counselor?.name || '未知咨询师'}
                          </h3>

                          {/* 预约时间 */}
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDateTime(appointment.timeSlot.startTime)}
                          </div>

                          {/* 预约状态 */}
                          <div className="flex items-center space-x-3 mb-3">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusClass(appointment.status)}`}>
                              {getAppointmentStatusText(appointment.status)}
                            </span>
                            {appointment.status === AppointmentStatus.PENDING && (
                              <span className="text-xs text-amber-600">
                                等待咨询师确认
                              </span>
                            )}
                          </div>

                          {/* 备注信息 */}
                          {appointment.notes && (
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              <span className="font-medium">备注：</span>
                              {appointment.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button variant="outline" size="sm">
                          查看详情
                        </Button>
                        
                        {canCancel && (
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            取消预约
                          </Button>
                        )}

                        {appointment.status === AppointmentStatus.COMPLETED && (
                          <Button variant="ghost" size="sm">
                            评价咨询师
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* 取消提醒 */}
                    {(appointment.status === AppointmentStatus.CONFIRMED || appointment.status === AppointmentStatus.PENDING) && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start">
                          <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-sm text-blue-700">
                            {canCancel ? (
                              <span>可在预约开始前24小时取消</span>
                            ) : (
                              <span>距离预约开始不足24小时，无法取消</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
} 