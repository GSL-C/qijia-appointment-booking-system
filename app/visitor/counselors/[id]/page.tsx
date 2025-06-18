'use client';

import { useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserRole, TimeSlot } from '@/types';
import { mockCounselors, mockTimeSlots } from '@/lib/mockData';
import { formatDate, formatTime, formatWeekday, isTimeSlotExpired } from '@/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CounselorDetailPage() {
  const { id } = useParams();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  // 找到咨询师
  const counselor = mockCounselors.find(c => c.id === id);

  // 获取咨询师的可用时间段（未来两周）
  const availableTimeSlots = mockTimeSlots.filter(slot => 
    slot.counselorId === id && 
    slot.isAvailable && 
    !isTimeSlotExpired(slot)
  );

  // 按日期分组时间段
  const timeSlotsByDate = availableTimeSlots.reduce((acc, slot) => {
    const dateKey = formatDate(slot.startTime);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  if (!counselor) {
    return (
      <Layout userRole={UserRole.VISITOR}>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">咨询师不存在</h1>
          <p className="text-gray-600 mb-6">未找到该咨询师信息</p>
          <Link href="/visitor/counselors">
            <Button>返回咨询师列表</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole={UserRole.VISITOR}>
      <div className="space-y-6">
        {/* 返回按钮 */}
        <div>
          <Link href="/visitor/counselors">
            <Button variant="ghost" className="mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回咨询师列表
            </Button>
          </Link>
        </div>

        {/* 咨询师信息卡片 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              {/* 头像 */}
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              <div className="flex-1">
                {/* 基础信息 */}
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{counselor.name}</h1>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {counselor.gender}性咨询师
                  </span>
                </div>

                {/* 擅长方向 */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {counselor.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 完整简介 */}
                <div className="text-gray-700 leading-relaxed">
                  {counselor.bio}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 可预约时间表 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">可预约时间</h2>
            <p className="text-gray-600">点击时间段进行预约</p>
          </CardHeader>
          <CardContent>
            {Object.keys(timeSlotsByDate).length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无可预约时间</h3>
                <p className="text-gray-600">该咨询师近期暂无开放时间，请稍后再试</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(timeSlotsByDate).map(([date, slots]) => (
                  <div key={date}>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {date} ({formatWeekday(slots[0].startTime)})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {slots.map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`p-3 rounded-lg border text-center transition-colors ${
                            selectedTimeSlot?.id === slot.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <div className="text-sm font-medium">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 预约确认区域 */}
        {selectedTimeSlot && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">已选择时间段</h3>
                  <p className="text-gray-600">
                    {formatDate(selectedTimeSlot.startTime)} {formatTime(selectedTimeSlot.startTime)} - {formatTime(selectedTimeSlot.endTime)}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    💡 预约开始前24小时可取消
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTimeSlot(null)}
                  >
                    重新选择
                  </Button>
                  <Link href={`/visitor/appointment/confirm?counselorId=${counselor.id}&timeSlotId=${selectedTimeSlot.id}`}>
                    <Button>
                      确认预约
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
} 