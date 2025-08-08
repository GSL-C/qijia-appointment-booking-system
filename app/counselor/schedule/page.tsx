'use client';

import { useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AddTimeSlotForm } from '@/components/AddTimeSlotForm';
import { UserRole, RepeatType } from '@/types';
import { mockTimeSlots, mockAppointments, currentCounselor } from '@/lib/mockData';
import { formatDate, formatTime, formatWeekday, isTimeSlotExpired } from '@/lib/utils';
import { startOfWeek, addDays, addWeeks, subWeeks, startOfDay, isSameDay } from 'date-fns';

export default function CounselorSchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDateForAdd, setSelectedDateForAdd] = useState<Date | undefined>();
  const [isSubmittingTimeSlot, setIsSubmittingTimeSlot] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSlotForDelete, setSelectedSlotForDelete] = useState<{
    id: string;
    startTime: Date;
    endTime: Date;
    isAvailable: boolean;
  } | null>(null);
  const [isDeletingTimeSlot, setIsDeletingTimeSlot] = useState(false);
  const [isRecurringDelete, setIsRecurringDelete] = useState(false);
  const [deleteRepeatType, setDeleteRepeatType] = useState<RepeatType>(RepeatType.WEEKLY);
  const [deleteEndDate, setDeleteEndDate] = useState('');

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

  const openAddModal = (date?: Date) => {
    setSelectedDateForAdd(date);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedDateForAdd(undefined);
  };

  const handleAddTimeSlot = async (data: {
    date: string;
    timeSlots: Array<{ startTime: string; endTime: string }>;
    isRecurring: boolean;
    repeatType?: RepeatType;
    endDate?: string;
  }) => {
    setIsSubmittingTimeSlot(true);
    
    // 模拟API调用
    setTimeout(() => {
      setIsSubmittingTimeSlot(false);
      console.log('保存时间段:', data);
      closeAddModal();
      // 这里可以刷新数据或者更新状态
    }, 1500);
  };

  const openDeleteModal = (slot: {
    id: string;
    startTime: Date;
    endTime: Date;
    isAvailable: boolean;
  }) => {
    setSelectedSlotForDelete(slot);
    setIsDeleteModalOpen(true);
    // 重置删除选项
    setIsRecurringDelete(false);
    setDeleteRepeatType(RepeatType.WEEKLY);
    setDeleteEndDate('');
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSlotForDelete(null);
    setIsRecurringDelete(false);
    setDeleteRepeatType(RepeatType.WEEKLY);
    setDeleteEndDate('');
  };

  const handleDeleteTimeSlot = async () => {
    if (!selectedSlotForDelete) return;
    
    if (isRecurringDelete && !deleteEndDate) {
      alert('请选择重复删除的结束日期');
      return;
    }
    
    setIsDeletingTimeSlot(true);
    
    // 模拟API调用
    setTimeout(() => {
      setIsDeletingTimeSlot(false);
      console.log('删除时间段:', {
        slotId: selectedSlotForDelete.id,
        isRecurring: isRecurringDelete,
        repeatType: isRecurringDelete ? deleteRepeatType : RepeatType.NONE,
        endDate: isRecurringDelete ? deleteEndDate : undefined
      });
      closeDeleteModal();
      // 这里可以刷新数据或者更新状态
    }, 1000);
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
            {/* 添加时段按钮 */}
            <Button onClick={() => openAddModal()}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              添加时段
            </Button>
          </div>
        </div>

        {/* 周视图 */}
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
                          const canDelete = slot.isAvailable && !appointment && !isExpired;
                          
                          return (
                            <div
                              key={slot.id}
                              className={`p-2 rounded text-xs relative group ${
                                appointment
                                  ? 'bg-[#F1C232] border border-[#E6B800] text-[var(--ink-black)]'
                                  : slot.isAvailable
                                    ? 'bg-[rgba(246,204,108,0.15)] border border-[rgba(246,204,108,0.3)] text-[var(--ink-black)] hover:bg-[rgba(246,204,108,0.25)] cursor-pointer'
                                    : 'bg-gray-100 border border-gray-200 text-gray-600'
                              } ${isExpired ? 'opacity-50' : ''}`}
                              onClick={canDelete ? () => openDeleteModal(slot) : undefined}
                            >
                              <div className="font-medium">
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                              </div>
                              {appointment ? (
                                <div className="text-xs mt-1">
                                  已预约
                                </div>
                              ) : slot.isAvailable ? (
                                <div className="flex items-center justify-between">
                                  <div className="text-xs mt-1">
                                    开放预约
                                  </div>
                                  {canDelete && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteModal(slot);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1"
                                      title="删除时间段"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  )}
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
                          <button 
                            onClick={() => openAddModal(day)}
                            className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-[var(--ink-gray)] hover:border-[var(--qijia-yellow)] hover:text-[var(--qijia-yellow)] text-xs transition-colors"
                          >
                            <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            添加时段
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

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

        {/* 添加时段弹窗 */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          title="添加开放时段"
          size="lg"
        >
          <AddTimeSlotForm
            initialDate={selectedDateForAdd}
            onSubmit={handleAddTimeSlot}
            onCancel={closeAddModal}
            isSubmitting={isSubmittingTimeSlot}
          />
        </Modal>

                 {/* 删除时段弹窗 */}
         <Modal
           isOpen={isDeleteModalOpen}
           onClose={closeDeleteModal}
           title="删除时间段"
           size="md"
         >
           <div className="p-6 space-y-6">
             <div className="text-center">
               <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
               </svg>
               <h3 className="qijia-text-body font-medium text-[var(--ink-black)] mb-2">
                 确认删除时间段
               </h3>
               {selectedSlotForDelete && (
                 <div className="bg-gray-50 p-3 rounded-lg mb-4">
                   <p className="qijia-text-body text-[var(--ink-black)] font-medium">
                     {formatTime(selectedSlotForDelete.startTime)} - {formatTime(selectedSlotForDelete.endTime)}
                   </p>
                   <p className="qijia-text-helper text-[var(--ink-gray)] mt-1">
                     {formatDate(selectedSlotForDelete.startTime)}
                   </p>
                 </div>
               )}
             </div>

             {/* 删除选项 */}
             <div>
               <label className="qijia-text-body font-medium text-[var(--ink-black)] mb-3 block">
                 删除选项
               </label>
               
               <div className="space-y-3">
                 <div className="flex items-center">
                   <input
                     type="radio"
                     id="deleteOnce"
                     name="deleteOption"
                     className="h-4 w-4 text-[var(--qijia-yellow)] focus:ring-[var(--qijia-yellow)] border-gray-300"
                     checked={!isRecurringDelete}
                     onChange={() => setIsRecurringDelete(false)}
                   />
                   <label htmlFor="deleteOnce" className="ml-2 qijia-text-body text-[var(--ink-black)]">
                     仅删除这一个时间段
                   </label>
                 </div>

                 <div className="flex items-center">
                   <input
                     type="radio"
                     id="deleteRecurring"
                     name="deleteOption"
                     className="h-4 w-4 text-[var(--qijia-yellow)] focus:ring-[var(--qijia-yellow)] border-gray-300"
                     checked={isRecurringDelete}
                     onChange={() => setIsRecurringDelete(true)}
                   />
                   <label htmlFor="deleteRecurring" className="ml-2 qijia-text-body text-[var(--ink-black)]">
                     周期性删除相同时间段
                   </label>
                 </div>

                 {isRecurringDelete && (
                   <div className="pl-6 space-y-3 border-l-2 border-red-300 border-opacity-50">
                     <div className="grid grid-cols-2 gap-3">
                       <div>
                         <label className="block qijia-text-helper text-[var(--ink-gray)] mb-1">
                           删除频率
                         </label>
                         <select
                           className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                           value={deleteRepeatType}
                           onChange={(e) => setDeleteRepeatType(e.target.value as RepeatType)}
                         >
                           <option value={RepeatType.DAILY}>每天相同时段</option>
                           <option value={RepeatType.WEEKLY}>每周相同时段</option>
                           <option value={RepeatType.BIWEEKLY}>每两周相同时段</option>
                         </select>
                       </div>

                       <div>
                         <label className="block qijia-text-helper text-[var(--ink-gray)] mb-1">
                           删除截止日期
                         </label>
                         <input
                           type="date"
                           className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                           value={deleteEndDate}
                           onChange={(e) => setDeleteEndDate(e.target.value)}
                           min={selectedSlotForDelete ? selectedSlotForDelete.startTime.toISOString().split('T')[0] : ''}
                         />
                       </div>
                     </div>

                     <div className="qijia-text-helper text-red-600 bg-red-50 p-2 rounded-lg">
                       <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                       </svg>
                       这将删除未来所有匹配的时间段，已预约的时段不会被删除
                     </div>
                   </div>
                 )}
               </div>
             </div>

             <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
               <p className="qijia-text-helper text-yellow-800">
                 <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 删除后无法恢复，请仔细确认您的选择。
               </p>
             </div>

             <div className="flex justify-center space-x-4">
               <Button variant="outline" onClick={closeDeleteModal} disabled={isDeletingTimeSlot}>
                 取消
               </Button>
               <Button variant="danger" onClick={handleDeleteTimeSlot} loading={isDeletingTimeSlot}>
                 确认删除
               </Button>
             </div>
           </div>
         </Modal>
      </div>
    </Layout>
  );
} 