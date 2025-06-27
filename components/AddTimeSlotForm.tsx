import React, { useState } from 'react';
import { Button } from './ui/Button';
import { RepeatType } from '@/types';
import { formatDate } from '@/lib/utils';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface AddTimeSlotFormProps {
  initialDate?: Date;
  onSubmit: (data: {
    date: string;
    timeSlots: TimeSlot[];
    isRecurring: boolean;
    repeatType?: RepeatType;
    endDate?: string;
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const AddTimeSlotForm: React.FC<AddTimeSlotFormProps> = ({
  initialDate,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [selectedDate, setSelectedDate] = useState(
    initialDate ? initialDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { startTime: '09:00', endTime: '10:00' }
  ]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatType, setRepeatType] = useState<RepeatType>(RepeatType.WEEKLY);
  const [endDate, setEndDate] = useState('');

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

  const handleSubmit = () => {
    if (!validateTimeSlots()) return;
    
    if (isRecurring && !endDate) {
      alert('请选择重复结束日期');
      return;
    }

    onSubmit({
      date: selectedDate,
      timeSlots,
      isRecurring,
      repeatType: isRecurring ? repeatType : RepeatType.NONE,
      endDate: isRecurring ? endDate : undefined
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* 日期选择 */}
      <div>
        <label className="block qijia-text-body font-medium text-[var(--ink-black)] mb-2">
          选择日期
        </label>
        <input
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--qijia-yellow)] focus:border-transparent"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
        {selectedDate && (
          <div className="qijia-text-helper text-[var(--ink-gray)] mt-1">
            选择的日期：{formatDate(new Date(selectedDate))}
          </div>
        )}
      </div>

      {/* 时间段设置 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="qijia-text-body font-medium text-[var(--ink-black)]">
            时间段设置
          </label>
          <Button variant="outline" size="sm" onClick={addTimeSlot}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加时段
          </Button>
        </div>

        <div className="space-y-3">
          {timeSlots.map((slot, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="block qijia-text-helper text-[var(--ink-gray)] mb-1">
                    开始时间
                  </label>
                  <input
                    type="time"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--qijia-yellow)] focus:border-transparent"
                    value={slot.startTime}
                    onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block qijia-text-helper text-[var(--ink-gray)] mb-1">
                    结束时间
                  </label>
                  <input
                    type="time"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--qijia-yellow)] focus:border-transparent"
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
                  className="text-[var(--soft-red)] hover:text-[var(--soft-red)] hover:bg-red-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 重复设置 */}
      <div>
        <label className="qijia-text-body font-medium text-[var(--ink-black)] mb-3 block">
          重复设置
        </label>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="recurring"
              className="h-4 w-4 text-[var(--qijia-yellow)] focus:ring-[var(--qijia-yellow)] border-gray-300 rounded"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            <label htmlFor="recurring" className="ml-2 qijia-text-body text-[var(--ink-black)]">
              设置为周期性重复
            </label>
          </div>

          {isRecurring && (
            <div className="pl-6 space-y-3 border-l-2 border-[var(--qijia-yellow)] border-opacity-30">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block qijia-text-helper text-[var(--ink-gray)] mb-1">
                    重复频率
                  </label>
                  <select
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--qijia-yellow)] focus:border-transparent"
                    value={repeatType}
                    onChange={(e) => setRepeatType(e.target.value as RepeatType)}
                  >
                    <option value={RepeatType.DAILY}>每天</option>
                    <option value={RepeatType.WEEKLY}>每周</option>
                    <option value={RepeatType.BIWEEKLY}>每两周</option>
                  </select>
                </div>

                <div>
                  <label className="block qijia-text-helper text-[var(--ink-gray)] mb-1">
                    结束日期
                  </label>
                  <input
                    type="date"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--qijia-yellow)] focus:border-transparent"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={selectedDate}
                  />
                </div>
              </div>

              <div className="qijia-text-helper text-[var(--qijia-yellow)] bg-[rgba(246,204,108,0.1)] p-2 rounded-lg">
                <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                周期性设置将在未来的相同时间自动创建开放时段
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-3 pt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
          disabled={isSubmitting}
        >
          取消
        </Button>
        <Button 
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting || !selectedDate}
          className="flex-1"
        >
          {isSubmitting ? '保存中...' : '保存设置'}
        </Button>
      </div>
    </div>
  );
}; 