// 用户角色枚举
export enum UserRole {
  VISITOR = 'visitor',
  COUNSELOR = 'counselor'
}

// 预约状态枚举
export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// 重复类型枚举
export enum RepeatType {
  NONE = 'none',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly'
}

// 用户基础信息
export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: UserRole;
}

// 咨询师信息
export interface Counselor extends User {
  role: UserRole.COUNSELOR;
  bio: string;
  specialties: string[];
  gender: '男' | '女';
}

// 来访者信息
export interface Visitor extends User {
  role: UserRole.VISITOR;
}

// 时间段
export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  counselorId: string;
  isAvailable: boolean;
  repeatType?: RepeatType;
  repeatEndDate?: Date;
}

// 预约信息
export interface Appointment {
  id: string;
  counselorId: string;
  visitorId: string;
  timeSlot: TimeSlot;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 预约请求
export interface AppointmentRequest {
  id: string;
  counselorId: string;
  visitorId: string;
  visitor: Visitor;
  timeSlot: TimeSlot;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
}

// 筛选条件
export interface CounselorFilter {
  specialty?: string;
  gender?: '男' | '女';
  keyword?: string;
} 