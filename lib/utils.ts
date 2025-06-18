import { clsx, type ClassValue } from "clsx";
import { format, differenceInHours, isAfter } from "date-fns";
import { zhCN } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// 格式化日期时间
export function formatDateTime(date: Date): string {
  return format(date, 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy年MM月dd日', { locale: zhCN });
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

export function formatWeekday(date: Date): string {
  return format(date, 'EEEE', { locale: zhCN });
}

// 检查是否可以取消预约（24小时前）
export function canCancelAppointment(appointmentTime: Date): boolean {
  const now = new Date();
  const hoursUntilAppointment = differenceInHours(appointmentTime, now);
  return hoursUntilAppointment >= 24;
}

// 检查时间段是否已过期
export function isTimeSlotExpired(timeSlot: { startTime: Date }): boolean {
  return !isAfter(timeSlot.startTime, new Date());
}

// 获取预约状态的中文显示
export function getAppointmentStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    cancelled: '已取消',
    completed: '已完成'
  };
  return statusMap[status] || status;
}

// 获取预约状态的样式类
export function getAppointmentStatusClass(status: string): string {
  const classMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
    completed: 'bg-blue-100 text-blue-800'
  };
  return classMap[status] || 'bg-gray-100 text-gray-800';
} 