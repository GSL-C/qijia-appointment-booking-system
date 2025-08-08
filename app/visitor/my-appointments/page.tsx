'use client';

import { useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { UserRole, AppointmentStatus } from '@/types';
import { mockAppointments, mockCounselors } from '@/lib/mockData';
import { formatDateTime, getAppointmentStatusText, getAppointmentStatusClass, canCancelAppointment } from '@/lib/utils';

// 状态图标组件
function StatusIcon({ status }: { status: AppointmentStatus }) {
  switch (status) {
    case AppointmentStatus.CONFIRMED:
      return (
        <div className="status-icon bg-green-100 text-green-600">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case AppointmentStatus.PENDING:
      return (
        <div className="status-icon bg-yellow-100 text-yellow-600">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case AppointmentStatus.COMPLETED:
      return (
        <div className="status-icon bg-blue-100 text-blue-600">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case AppointmentStatus.CANCELLED:
      return (
        <div className="status-icon bg-red-100 text-red-600">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

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
      <div className="soft-gradient-bg min-h-full -m-6 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 页面标题 */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-[var(--ink-black)] mb-4 qijia-title-main">我的预约</h1>
            <p className="text-lg text-[var(--ink-gray)] qijia-text-body font-light">查看和管理您的咨询预约</p>
          </div>

          {/* 标签页筛选 */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 transform hover:scale-102 flex items-center ${
                    activeTab === tab.id
                      ? 'bg-[var(--qijia-yellow)] text-[var(--ink-black)] shadow-md'
                      : 'text-[var(--ink-gray)] hover:text-[var(--ink-black)] hover:bg-gray-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="ml-2 min-w-[20px] h-5 px-2 bg-[var(--qijia-yellow)] text-[var(--ink-black)] rounded-full text-xs font-bold flex items-center justify-center">
                    {tab.count > 99 ? '99+' : tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 预约列表 */}
          <div className="space-y-6">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[var(--qijia-yellow)] to-[#f4c861] rounded-full flex items-center justify-center shadow-lg opacity-80">
                  <svg className="w-12 h-12 text-[var(--ink-black)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[var(--ink-black)] mb-3">暂无预约记录</h3>
                <p className="text-lg text-[var(--ink-gray)] mb-8 qijia-text-body">您还没有任何{activeTab !== 'all' ? tabs.find(t => t.id === activeTab)?.label : ''}预约</p>
                <Button size="lg" className="transform hover:scale-105 transition-transform duration-200">
                  <Link href="/visitor/counselors">浏览咨询师</Link>
                </Button>
              </div>
          ) : (
            filteredAppointments.map(appointment => {
              const counselor = mockCounselors.find(c => c.id === appointment.counselorId);
              const canCancel = canCancelAppointment(appointment.timeSlot.startTime) && 
                               (appointment.status === AppointmentStatus.CONFIRMED || appointment.status === AppointmentStatus.PENDING);
              
                return (
                  <Card key={appointment.id} className="hover:shadow-xl transition-all duration-300 transform hover:scale-102 rounded-2xl border-0 bg-white shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-6 flex-1">
                          {/* 咨询师头像 */}
                          <div className="w-20 h-20 bg-gradient-to-br from-[var(--qijia-yellow)] to-[#f4c861] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-2xl font-bold text-[var(--ink-black)]">
                              {counselor?.name?.charAt(0) || '?'}
                            </span>
                          </div>

                          <div className="flex-1 space-y-4">
                            {/* 咨询师姓名 */}
                            <h3 className="text-xl font-black text-[var(--ink-black)] qijia-title-sub">
                              {counselor?.name || '未知咨询师'}
                            </h3>

                            {/* 预约时间 */}
                            <div className="flex items-center text-xl font-bold text-[var(--qijia-yellow)] bg-yellow-50 px-4 py-2 rounded-xl inline-flex">
                              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDateTime(appointment.timeSlot.startTime)}
                            </div>

                            {/* 预约状态 */}
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <StatusIcon status={appointment.status} />
                                <span className={`text-sm font-semibold ${getAppointmentStatusClass(appointment.status)}`}>
                                  {getAppointmentStatusText(appointment.status)}
                                </span>
                              </div>
                              {appointment.status === AppointmentStatus.PENDING && (
                                <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                  等待咨询师确认
                                </span>
                              )}
                            </div>

                            {/* 备注信息 */}
                            {appointment.notes && (
                              <div className="text-sm text-[var(--ink-gray)] bg-gradient-to-r from-gray-50 to-yellow-50 p-4 rounded-xl border-l-4 border-[var(--qijia-yellow)]">
                                <span className="font-semibold text-[var(--ink-black)]">备注：</span>
                                <span className="ml-2">{appointment.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex flex-col space-y-3 ml-6">
                          <Button variant="outline" size="sm" className="transform hover:scale-105 transition-transform duration-200">
                            查看详情
                          </Button>
                          
                          {canCancel && (
                            <Button 
                              variant="danger" 
                              size="sm"
                              className="transform hover:scale-105 transition-transform duration-200"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              取消预约
                            </Button>
                          )}

                          {appointment.status === AppointmentStatus.COMPLETED && (
                            <Button variant="ghost" size="sm" className="transform hover:scale-105 transition-transform duration-200">
                              评价咨询师
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* 取消提醒 */}
                      {(appointment.status === AppointmentStatus.CONFIRMED || appointment.status === AppointmentStatus.PENDING) && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                          <div className="flex items-start">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="text-sm text-blue-700 font-medium">
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
      </div>
    </Layout>
  );
} 