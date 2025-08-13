// 数据库相关类型定义

export interface User {
  id: string;
  auth_user_id: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'visitor' | 'counselor';
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CounselorProfile {
  id: string;
  user_id: string;
  bio?: string;
  gender: '男' | '女';
  qualification?: string;
  experience_years: number;
  consultation_fee?: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Specialty {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface CounselorSpecialty {
  counselor_id: string;
  specialty_id: string;
}

export interface TimeSlotTemplate {
  id: string;
  counselor_id: string;
  day_of_week: number; // 0-6 (0=周日, 1=周一...6=周六)
  start_time: string; // HH:mm 格式
  end_time: string; // HH:mm 格式
  repeat_type: 'none' | 'weekly' | 'biweekly';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  id: string;
  counselor_id: string;
  template_id?: string;
  start_time: string; // ISO 8601 格式
  end_time: string; // ISO 8601 格式
  is_available: boolean;
  max_appointments: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  counselor_id: string;
  visitor_id: string;
  time_slot_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  visitor_notes?: string;
  counselor_notes?: string;
  cancel_reason?: string;
  cancelled_by?: 'visitor' | 'counselor' | 'system';
  cancelled_at?: string;
  confirmed_at?: string;
  created_at: string;
  updated_at: string;
}

// 扩展类型（包含关联数据）
export interface CounselorWithProfile extends User {
  counselor_profiles: CounselorProfile & {
    counselor_specialties: Array<{
      specialties: Specialty;
    }>;
  };
}

export interface CounselorProfileWithSpecialties extends CounselorProfile {
  users: User;
  counselor_specialties: Array<{
    specialties: Specialty;
  }>;
}

export interface TimeSlotWithCounselor extends TimeSlot {
  counselor_profiles: CounselorProfile & {
    users: User;
  };
}

export interface AppointmentWithDetails extends Appointment {
  counselor_profiles: CounselorProfile & {
    users: User;
  };
  visitors: User;
  time_slots: TimeSlot;
}

// API 请求/响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'visitor' | 'counselor';
  phone?: string;
  counselorInfo?: {
    bio: string;
    gender: '男' | '女';
    specialties: string[];
    qualification?: string;
    experience_years?: number;
    consultation_fee?: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateTimeSlotTemplateRequest {
  day_of_week: number;
  start_time: string;
  end_time: string;
  repeat_type?: 'none' | 'weekly' | 'biweekly';
  is_active?: boolean;
}

export interface CreateTimeSlotRequest {
  start_time: string;
  end_time: string;
  is_available?: boolean;
  max_appointments?: number;
}

export interface UpdateTimeSlotRequest {
  is_available?: boolean;
  max_appointments?: number;
}

export interface CreateAppointmentRequest {
  time_slot_id: string;
  visitor_notes?: string;
}

export interface UpdateAppointmentRequest {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  counselor_notes?: string;
  cancel_reason?: string;
}

// 筛选条件类型
export interface CounselorFilter {
  specialty?: string;
  gender?: '男' | '女';
  keyword?: string;
  is_verified?: boolean;
}

export interface TimeSlotFilter {
  start_date?: string;
  end_date?: string;
  is_available?: boolean;
}

export interface AppointmentFilter {
  status?: string;
  start_date?: string;
  end_date?: string;
} 