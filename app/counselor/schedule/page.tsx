'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import AddTimeSlotForm from '@/components/AddTimeSlotForm';
import TestNavigation from '@/components/TestNavigation';
import { getCurrentUser } from '@/lib/api/auth';
import { getCounselorTimeSlots } from '@/lib/api/timeSlots';
import type { User, CounselorWithProfile, TimeSlot } from '@/types/database';
import { useRouter } from 'next/navigation';

export default function CounselorSchedulePage() {
  const router = useRouter();
  const [user, setUser] = useState<CounselorWithProfile | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 获取当前用户信息
        const userResult = await getCurrentUser();
        if (!userResult.success) {
          router.push('/');
          return;
        }

        const userData = userResult.data as CounselorWithProfile;
        if (userData.role !== 'counselor') {
          router.push('/');
          return;
        }

        setUser(userData);

        // 获取时间段
        const timeSlotsResult = await getCounselorTimeSlots();
        if (timeSlotsResult.success) {
          setTimeSlots(timeSlotsResult.data || []);
        } else {
          setMessage({ type: 'error', text: '加载时间段失败' });
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        setMessage({ type: 'error', text: '加载数据失败，请刷新页面重试' });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleTimeSlotSuccess = async () => {
    setIsAddModalOpen(false);
    setMessage({ type: 'success', text: '时间段创建成功！' });
    
    // 重新加载时间段
    try {
      const timeSlotsResult = await getCounselorTimeSlots();
      if (timeSlotsResult.success) {
        setTimeSlots(timeSlotsResult.data || []);
      }
    } catch (error) {
      console.error('重新加载时间段失败:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 按日期分组时间段
  const groupedTimeSlots = timeSlots.reduce((groups, slot) => {
    const date = new Date(slot.start_time).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(slot);
    return groups;
  }, {} as Record<string, TimeSlot[]>);

  // 排序日期
  const sortedDates = Object.keys(groupedTimeSlots).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-yellow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[var(--qijia-yellow)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[var(--ink-gray)]">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-yellow p-6">
      <TestNavigation />
      <div className="qijia-container max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[var(--ink-black)] mb-4">
            咨询师工作台
          </h1>
          <p className="text-[var(--ink-gray)]">
            欢迎回来，{user?.name}！管理您的时间安排和预约。
          </p>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-4 mb-8">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加时间段模板
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => router.push('/counselor/settings')}
          >
            完善资料
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="qijia-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[rgba(246,204,108,0.2)] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--qijia-yellow)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--ink-gray)]">总时间段</p>
                  <p className="text-2xl font-bold text-[var(--ink-black)]">
                    {timeSlots.length}
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
                  <p className="text-sm font-medium text-[var(--ink-gray)]">可预约</p>
                  <p className="text-2xl font-bold text-[var(--ink-black)]">
                    {timeSlots.filter(slot => slot.is_available).length}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--ink-gray)]">已设置天数</p>
                  <p className="text-2xl font-bold text-[var(--ink-black)]">
                    {Object.keys(groupedTimeSlots).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 时间段列表 */}
        <Card className="qijia-card">
          <CardHeader>
            <div className="text-center">
              <h2 className="qijia-title-sub text-[var(--ink-black)]">
                我的时间段
              </h2>
              <p className="qijia-text-body text-[var(--ink-gray)] mt-2">
                查看和管理您的可约时间段
              </p>
            </div>
          </CardHeader>

          <div className="qijia-divider mx-6"></div>

          <CardContent>
            {timeSlots.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-[var(--ink-gray)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-[var(--ink-black)] mb-2">
                  还没有设置时间段
                </h3>
                <p className="text-[var(--ink-gray)] mb-6">
                  创建时间段模板，让来访者可以预约您的咨询服务
                </p>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  创建第一个时间段
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedDates.map((dateKey) => {
                  const daySlots = groupedTimeSlots[dateKey];
                  const date = new Date(dateKey);
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isPast = date < new Date();

                  return (
                    <div key={dateKey} className={`${isPast ? 'opacity-60' : ''}`}>
                      <div className={`flex items-center gap-2 mb-3 ${isToday ? 'text-[var(--qijia-yellow)]' : 'text-[var(--ink-black)]'}`}>
                        <h3 className="font-semibold">
                          {formatDate(dateKey)}
                        </h3>
                        {isToday && (
                          <span className="bg-[var(--qijia-yellow)] text-white text-xs px-2 py-1 rounded-full">
                            今天
                          </span>
                        )}
                        <span className="text-sm text-[var(--ink-gray)]">
                          ({daySlots.length} 个时间段)
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {daySlots.map((slot) => (
                          <div
                            key={slot.id}
                            className={`p-3 rounded-lg border ${
                              slot.is_available
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}
                          >
                            <div className="font-medium">
                              {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                            </div>
                            <div className="text-sm mt-1">
                              {slot.is_available ? '可预约' : '不可用'}
                            </div>
                            <div className="text-xs mt-1 text-gray-500">
                              最多 {slot.max_appointments} 人
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 添加时间段模板弹窗 */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title=""
          size="lg"
        >
          <AddTimeSlotForm onSuccess={handleTimeSlotSuccess} />
        </Modal>
      </div>
    </div>
  );
} 