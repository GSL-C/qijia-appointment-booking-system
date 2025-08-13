import { format, parseISO, startOfDay, endOfDay, addDays, isToday, isTomorrow, isYesterday } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期时间
 */
export function formatDateTime(dateString: string, formatStr: string = 'yyyy年MM月dd日 HH:mm'): string {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr, { locale: zhCN });
  } catch (error) {
    return '无效日期';
  }
}

/**
 * 格式化日期
 */
export function formatDate(dateString: string, formatStr: string = 'yyyy年MM月dd日'): string {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr, { locale: zhCN });
  } catch (error) {
    return '无效日期';
  }
}

/**
 * 格式化时间
 */
export function formatTime(dateString: string, formatStr: string = 'HH:mm'): string {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    return '无效时间';
  }
}

/**
 * 获取相对时间描述
 */
export function getRelativeTimeDesc(dateString: string): string {
  try {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return '今天';
    } else if (isTomorrow(date)) {
      return '明天';
    } else if (isYesterday(date)) {
      return '昨天';
    } else {
      return formatDate(dateString, 'MM月dd日');
    }
  } catch (error) {
    return '无效日期';
  }
}

/**
 * 获取星期几的中文描述
 */
export function getWeekdayName(dayOfWeek: number): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[dayOfWeek] || '无效';
}

/**
 * 将时间字符串转换为分钟数（用于排序）
 */
export function timeToMinutes(timeStr: string): number {
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  } catch (error) {
    return 0;
  }
}

/**
 * 将分钟数转换为时间字符串
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * 生成日期范围
 */
export function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  let currentDate = startOfDay(startDate);
  const lastDate = endOfDay(endDate);

  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return dates;
}

/**
 * 检查时间段是否冲突
 */
export function hasTimeConflict(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  try {
    const date1Start = parseISO(start1);
    const date1End = parseISO(end1);
    const date2Start = parseISO(start2);
    const date2End = parseISO(end2);

    return date1Start < date2End && date2Start < date1End;
  } catch (error) {
    return false;
  }
}

/**
 * 计算时间段持续时间（分钟）
 */
export function getTimeSlotDuration(startTime: string, endTime: string): number {
  try {
    const start = parseISO(startTime);
    const end = parseISO(endTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  } catch (error) {
    return 0;
  }
}

/**
 * 检查时间是否已过期
 */
export function isPastTime(timeString: string): boolean {
  try {
    const time = parseISO(timeString);
    return time < new Date();
  } catch (error) {
    return true;
  }
}

/**
 * 获取今天的日期字符串
 */
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * 获取明天的日期字符串
 */
export function getTomorrowString(): string {
  return format(addDays(new Date(), 1), 'yyyy-MM-dd');
}

/**
 * 获取指定天数后的日期字符串
 */
export function getDateStringAfterDays(days: number): string {
  return format(addDays(new Date(), days), 'yyyy-MM-dd');
}

/**
 * 将日期时间字符串转换为本地时间
 */
export function toLocalDateTime(utcString: string): string {
  try {
    const utcDate = parseISO(utcString);
    return utcDate.toLocaleString('zh-CN');
  } catch (error) {
    return '无效时间';
  }
}

/**
 * 获取预约状态的中文描述
 */
export function getAppointmentStatusText(status: string): string {
  const statusMap = {
    pending: '待确认',
    confirmed: '已确认',
    cancelled: '已取消',
    completed: '已完成',
  };
  return statusMap[status as keyof typeof statusMap] || '未知状态';
}

/**
 * 获取预约状态的颜色类
 */
export function getAppointmentStatusColor(status: string): string {
  const colorMap = {
    pending: 'text-yellow-600 bg-yellow-50',
    confirmed: 'text-green-600 bg-green-50',
    cancelled: 'text-red-600 bg-red-50',
    completed: 'text-blue-600 bg-blue-50',
  };
  return colorMap[status as keyof typeof colorMap] || 'text-gray-600 bg-gray-50';
} 