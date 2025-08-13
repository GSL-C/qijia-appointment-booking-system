'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createTimeSlotTemplates } from '@/lib/api/timeSlots';
import type { CreateTimeSlotTemplateRequest } from '@/types/database';

interface AddTimeSlotFormProps {
  onSuccess?: () => void;
}

export default function AddTimeSlotForm({ onSuccess }: AddTimeSlotFormProps) {
  const [templates, setTemplates] = useState<CreateTimeSlotTemplateRequest[]>([
    {
      day_of_week: 1,
      start_time: '09:00',
      end_time: '10:00',
      repeat_type: 'weekly',
      is_active: true
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const addTemplate = () => {
    setTemplates([...templates, {
      day_of_week: 1,
      start_time: '09:00',
      end_time: '10:00',
      repeat_type: 'weekly',
      is_active: true
    }]);
  };

  const removeTemplate = (index: number) => {
    setTemplates(templates.filter((_, i) => i !== index));
  };

  const updateTemplate = (index: number, field: keyof CreateTimeSlotTemplateRequest, value: any) => {
    const newTemplates = [...templates];
    newTemplates[index] = { ...newTemplates[index], [field]: value };
    setTemplates(newTemplates);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await createTimeSlotTemplates(templates);
      
      if (result.success) {
        setMessage({ type: 'success', text: '时间段模板创建成功！' });
        // 重置表单
        setTemplates([{
          day_of_week: 1,
          start_time: '09:00',
          end_time: '10:00',
          repeat_type: 'weekly',
          is_active: true
        }]);
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setMessage({ type: 'error', text: result.error || '创建失败，请重试' });
      }
    } catch (error) {
      console.error('创建时间段模板失败:', error);
      setMessage({ type: 'error', text: '创建失败，请检查网络连接' });
    } finally {
      setIsLoading(false);
    }
  };

  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const repeatTypes = [
    { value: 'weekly', label: '每周重复' },
    { value: 'biweekly', label: '两周重复' },
    { value: 'none', label: '不重复' }
  ];

  return (
    <Card className="qijia-card">
      <CardHeader>
        <div className="text-center">
          <h2 className="qijia-title-sub text-[var(--ink-black)]">
            添加时间段模板
          </h2>
          <p className="qijia-text-body text-[var(--ink-gray)] mt-2">
            设置您的可约时间，系统会自动生成具体的时间段
          </p>
        </div>
      </CardHeader>

      <div className="qijia-divider mx-6"></div>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {templates.map((template, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-[var(--ink-black)]">时间段 {index + 1}</h3>
                {templates.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeTemplate(index)}
                  >
                    删除
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 星期 */}
                <div>
                  <label className="block text-sm font-medium text-[var(--ink-black)] mb-1">
                    星期
                  </label>
                  <select
                    value={template.day_of_week}
                    onChange={(e) => updateTemplate(index, 'day_of_week', parseInt(e.target.value))}
                    className="neu-input w-full"
                    required
                  >
                    {dayNames.map((day, dayIndex) => (
                      <option key={dayIndex} value={dayIndex}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 开始时间 */}
                <div>
                  <label className="block text-sm font-medium text-[var(--ink-black)] mb-1">
                    开始时间
                  </label>
                  <input
                    type="time"
                    value={template.start_time}
                    onChange={(e) => updateTemplate(index, 'start_time', e.target.value)}
                    className="neu-input w-full"
                    required
                  />
                </div>

                {/* 结束时间 */}
                <div>
                  <label className="block text-sm font-medium text-[var(--ink-black)] mb-1">
                    结束时间
                  </label>
                  <input
                    type="time"
                    value={template.end_time}
                    onChange={(e) => updateTemplate(index, 'end_time', e.target.value)}
                    className="neu-input w-full"
                    required
                  />
                </div>

                {/* 重复类型 */}
                <div>
                  <label className="block text-sm font-medium text-[var(--ink-black)] mb-1">
                    重复
                  </label>
                  <select
                    value={template.repeat_type}
                    onChange={(e) => updateTemplate(index, 'repeat_type', e.target.value as 'none' | 'weekly' | 'biweekly')}
                    className="neu-input w-full"
                    required
                  >
                    {repeatTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 是否激活 */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={template.is_active}
                    onChange={(e) => updateTemplate(index, 'is_active', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-[var(--ink-black)]">激活此时间段</span>
                </label>
              </div>
            </div>
          ))}

          {/* 添加更多时间段 */}
          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              onClick={addTemplate}
              disabled={isLoading}
            >
              + 添加更多时间段
            </Button>
          </div>

          {/* 消息提示 */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* 提交按钮 */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isLoading}
            disabled={isLoading || templates.length === 0}
          >
            创建时间段模板
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 