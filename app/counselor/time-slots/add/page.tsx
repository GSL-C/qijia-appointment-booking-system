'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/shared/Layout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserRole, RepeatType } from '@/types';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AddTimeSlotPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([{ startTime: '09:00', endTime: '10:00' }]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatType, setRepeatType] = useState<RepeatType>(RepeatType.WEEKLY);
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 从URL参数获取初始值
    const dateParam = searchParams.get('date');
    const recurringParam = searchParams.get('recurring');
    
    if (dateParam) {
      setSelectedDate(new Date(dateParam).toISOString().split('T')[0]);
    } else {
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
    
    if (recurringParam === 'true') {
      setIsRecurring(true);
    }
  }, [searchParams]);

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: '09:00', endTime: '10:00' }]);
  };

  const removeTimeSlot = (index: number) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((_, i) => i !== index));
    }
  };

  const updateTimeSlot = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index][field] = value;
    setTimeSlots(newTimeSlots);
  };

  const validateTimeSlots = () => {
    for (const slot of timeSlots) {
      if (slot.startTime >= slot.endTime) {
        alert('结束时间必须晚于开始时间');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateTimeSlots()) return;
    
    if (isRecurring && !endDate) {
      alert('请选择重复结束日期');
      return;
    }

    setIsSubmitting(true);
    
    // 模拟API调用
    setTimeout(() => {
      setIsSubmitting(false);
      console.log('保存时间段:', {
        date: selectedDate,
        timeSlots,
        isRecurring,
        repeatType: isRecurring ? repeatType : RepeatType.NONE,
        endDate: isRecurring ? endDate : undefined
      });
      
      // 返回日程页面
      router.push('/counselor/schedule');
    }, 1500);
  };

  return (
    <Layout userRole={UserRole.COUNSELOR}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 返回按钮 */}
        <div>
          <Link href="/counselor/schedule">
            <Button variant="ghost" className="mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回日程管理
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">设置开放时段</h1>
          <p className="text-gray-600 mt-1">设置您的可预约时间</p>
        </div>

        {/* 日期选择 */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">选择日期</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  日期
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              {selectedDate && (
                <div className="text-sm text-gray-600">
                  选择的日期：{formatDate(new Date(selectedDate))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 时间段设置 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">时间段设置</h2>
              <Button variant="outline" size="sm" onClick={addTimeSlot}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                添加时间段
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        开始时间
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        结束时间
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {timeSlots.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTimeSlot(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 周期性设置 */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">重复设置</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="recurring"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
                <label htmlFor="recurring" className="ml-2 text-sm font-medium text-gray-700">
                  设置为周期性重复
                </label>
              </div>

              {isRecurring && (
                <div className="pl-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      重复频率
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={repeatType}
                      onChange={(e) => setRepeatType(e.target.value as RepeatType)}
                    >
                      <option value={RepeatType.WEEKLY}>每周</option>
                      <option value={RepeatType.BIWEEKLY}>每两周</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      重复结束日期
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={selectedDate}
                    />
                  </div>

                  <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    周期性设置将在未来的相同时间自动创建开放时段
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex space-x-4">
          <Link href="/counselor/schedule" className="flex-1">
            <Button variant="outline" className="w-full">
              取消
            </Button>
          </Link>
          <Button 
            className="flex-1" 
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting || !selectedDate}
          >
            {isSubmitting ? '保存中...' : '保存设置'}
          </Button>
        </div>

        {/* 提示信息 */}
        <div className="text-center text-sm text-gray-500">
          <p>
            保存后，来访者将能够看到这些开放时间并进行预约
          </p>
        </div>
      </div>
    </Layout>
  );
} 