'use client';

import { useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';
import { mockTimeSlots, mockAppointments, currentCounselor } from '@/lib/mockData';
import { formatDate, formatTime, formatWeekday, isTimeSlotExpired } from '@/lib/utils';
import { startOfWeek, addDays, addWeeks, subWeeks, startOfDay, isSameDay } from 'date-fns';
import Link from 'next/link';

export default function CounselorSchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  // 获取当前咨询师的时间段
  const counselorTimeSlots = mockTimeSlots.filter(slot => slot.counselorId === currentCounselor.id);
  
  // 获取当前咨询师的预约
  const counselorAppointments = mockAppointments.filter(apt => apt.counselorId === currentCounselor.id);

  // 生成一周的日期
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  // 获取某一天的时间段
  const getTimeSlotsForDay = (date: Date) => {
    return counselorTimeSlots.filter(slot => isSameDay(slot.startTime, date));
  };

  // 获取某一天的预约
  const getAppointmentsForDay = (date: Date) => {
    return counselorAppointments.filter(apt => isSameDay(apt.timeSlot.startTime, date));
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentWeek(subWeeks(currentWeek, 1));
    } else {
      setCurrentWeek(addWeeks(currentWeek, 1));
    }
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  return (
    <Layout userRole={UserRole.COUNSELOR}>
      <div className="space-y-6 bg-gradient-yellow p-6 rounded-lg">
        {/* 页面标题和工具栏 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="qijia-title-sub text-[var(--ink-black)]">我的日程</h1>
            <p className="qijia-text-helper text-[var(--ink-gray)] mt-1">管理您的开放时间和预约</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 视图切换 */}
            <div className="flex border border-gray-200 rounded-lg shadow-sm">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  viewMode === 'week'
                    ? 'bg-[var(--qijia-yellow)] text-[var(--ink-black)]'
                    : 'bg-white text-[var(--ink-gray)] hover:bg-[var(--hu-powder-white)]'
                }`}
              >
                周视图
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg border-l ${
                  viewMode === 'month'
                    ? 'bg-[var(--qijia-yellow)] text-[var(--ink-black)]'
                    : 'bg-white text-[var(--ink-gray)] hover:bg-[var(--hu-powder-white)]'
                }`}
              >
                月视图
              </button>
            </div>

            {/* 添加周期性空闲按钮 */}
            <Link href="/counselor/time-slots/add?recurring=true">
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                添加周期性空闲
              </Button>
            </Link>
          </div>
        </div>

        {/* 周视图 */}
        {viewMode === 'week' && (
          <Card className="qijia-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigateWeek('prev')}
                    className="p-2 hover:bg-[var(--hu-powder-white)] rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <h2 className="qijia-text-body font-medium text-[var(--ink-black)]">
                    {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
                  </h2>
                  
                  <button
                    onClick={() => navigateWeek('next')}
                    className="p-2 hover:bg-[var(--hu-powder-white)] rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <Button variant="outline" onClick={goToCurrentWeek}>
                  今天
                </Button>
              </div>
            </CardHeader>
            
            <div className="qijia-divider mx-8"></div>
            
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {weekDays.map((day, index) => {
                  const daySlots = getTimeSlotsForDay(day);
                  const dayAppointments = getAppointmentsForDay(day);
                  const isToday = isSameDay(day, new Date());
                  const isPast = day < startOfDay(new Date());

                  return (
                    <div key={index} className={`min-h-[300px] ${isPast ? 'opacity-50' : ''}`}>
                      {/* 日期标题 */}
                      <div className={`text-center mb-3 ${isToday ? 'text-[var(--qijia-yellow)] font-semibold' : 'text-[var(--ink-gray)]'}`}>
                        <div className="text-sm">{formatWeekday(day).slice(2)}</div>
                        <div className={`text-lg ${isToday ? 'bg-[var(--qijia-yellow)] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
                          {day.getDate()}
                        </div>
                      </div>

                      {/* 时间段列表 */}
                      <div className="space-y-2">
                        {daySlots.map(slot => {
                          const appointment = dayAppointments.find(apt => apt.timeSlot.id === slot.id);
                          const isExpired = isTimeSlotExpired(slot);
                          
                          return (
                            <div
                              key={slot.id}
                              className={`p-2 rounded text-xs ${
                                appointment
                                  ? 'bg-[rgba(246,204,108,0.2)] border border-[rgba(246,204,108,0.4)] text-[var(--ink-black)]'
                                  : slot.isAvailable
                                    ? 'bg-[rgba(246,204,108,0.1)] border border-[rgba(246,204,108,0.2)] text-[var(--ink-black)]'
                                    : 'bg-gray-100 border border-gray-200 text-gray-600'
                              } ${isExpired ? 'opacity-50' : ''}`}
                            >
                              <div className="font-medium">
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                              </div>
                              {appointment ? (
                                <div className="text-xs mt-1">
                                  已预约
                                </div>
                              ) : slot.isAvailable ? (
                                <div className="text-xs mt-1">
                                  开放预约
                                </div>
                              ) : (
                                <div className="text-xs mt-1">
                                  不可用
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* 添加时间段按钮 */}
                        {!isPast && (
                          <Link href={`/counselor/time-slots/add?date=${day.toISOString()}`}>
                            <button className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-[var(--ink-gray)] hover:border-[var(--qijia-yellow)] hover:text-[var(--qijia-yellow)] text-xs transition-colors">
                              <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              添加时段
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 月视图占位 */}
        {viewMode === 'month' && (
          <Card className="qijia-card">
            <CardContent className="p-12 text-center">
              <svg className="w-16 h-16 text-[var(--qijia-yellow)] mx-auto mb-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="qijia-text-body font-medium text-[var(--ink-black)] mb-2">月视图</h3>
              <p className="qijia-text-helper text-[var(--ink-gray)]">月视图功能正在开发中</p>
            </CardContent>
          </Card>
        )}

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="qijia-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[rgba(246,204,108,0.2)] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--qijia-yellow)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--ink-gray)]">开放时段</p>
                  <p className="text-2xl font-bold text-[var(--ink-black)]">
                    {counselorTimeSlots.filter(slot => slot.isAvailable && !isTimeSlotExpired(slot)).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="qijia-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[rgba(246,204,108,0.2)] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--qijia-yellow)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--ink-gray)]">已预约</p>
                  <p className="text-2xl font-bold text-[var(--ink-black)]">
                    {counselorAppointments.filter(apt => apt.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="qijia-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[rgba(246,204,108,0.2)] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--qijia-yellow)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--ink-gray)]">来访者</p>
                  <p className="text-2xl font-bold text-[var(--ink-black)]">
                    {new Set(counselorAppointments.map(apt => apt.visitorId)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 