import { supabase } from '@/lib/supabase';
import type { 
  ApiResponse, 
  Appointment,
  AppointmentWithDetails,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentFilter
} from '@/types/database';

/**
 * 创建预约
 */
export async function createAppointment(request: CreateAppointmentRequest): Promise<ApiResponse<Appointment>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('用户未登录');

    // 获取用户信息
    const { data: userData } = await supabase
      .from('users')
      .select('id, role')
      .eq('auth_user_id', user.id)
      .single();

    if (!userData) throw new Error('用户信息不存在');
    if (userData.role !== 'visitor') throw new Error('只有来访者可以创建预约');

    // 检查时间段是否可用
    const { data: timeSlot } = await supabase
      .from('time_slots')
      .select('*, counselor_profiles(id)')
      .eq('id', request.time_slot_id)
      .eq('is_available', true)
      .single();

    if (!timeSlot) throw new Error('该时间段不可用');

    // 检查是否已预约
    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('id')
      .eq('time_slot_id', request.time_slot_id)
      .eq('visitor_id', userData.id)
      .in('status', ['pending', 'confirmed']);

    if (existingAppointment && existingAppointment.length > 0) {
      throw new Error('您已预约过该时间段');
    }

    // 创建预约
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        counselor_id: timeSlot.counselor_profiles.id,
        visitor_id: userData.id,
        time_slot_id: request.time_slot_id,
        visitor_notes: request.visitor_notes,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // 可选：更新时间段为不可用（根据业务需求）
    // await supabase
    //   .from('time_slots')
    //   .update({ is_available: false })
    //   .eq('id', request.time_slot_id);

    return {
      success: true,
      data,
      message: '预约创建成功，等待咨询师确认',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '创建预约失败',
    };
  }
}

/**
 * 更新预约状态
 */
export async function updateAppointment(
  appointmentId: string,
  updates: UpdateAppointmentRequest
): Promise<ApiResponse<Appointment>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('用户未登录');

    // 准备更新数据
    const updateData: any = { ...updates };

    // 根据状态设置相关时间戳
    if (updates.status === 'confirmed') {
      updateData.confirmed_at = new Date().toISOString();
    } else if (updates.status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString();
      
      // 获取用户信息以确定取消方
      const { data: userData } = await supabase
        .from('users')
        .select('id, role')
        .eq('auth_user_id', user.id)
        .single();

      if (userData) {
        updateData.cancelled_by = userData.role === 'visitor' ? 'visitor' : 'counselor';
      }
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;

    // 如果预约被取消，可以将时间段重新设为可用
    if (updates.status === 'cancelled') {
      await supabase
        .from('time_slots')
        .update({ is_available: true })
        .eq('id', data.time_slot_id);
    }

    return {
      success: true,
      data,
      message: '预约状态更新成功',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '更新预约失败',
    };
  }
}

/**
 * 获取用户的预约列表
 */
export async function getUserAppointments(filter?: AppointmentFilter): Promise<ApiResponse<AppointmentWithDetails[]>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('用户未登录');

    // 获取用户信息
    const { data: userData } = await supabase
      .from('users')
      .select('id, role')
      .eq('auth_user_id', user.id)
      .single();

    if (!userData) throw new Error('用户信息不存在');

    let query = supabase
      .from('appointments')
      .select(`
        *,
        counselor_profiles (
          *,
          users (*)
        ),
        visitors:users!appointments_visitor_id_fkey (*),
        time_slots (*)
      `);

    // 根据用户角色筛选
    if (userData.role === 'visitor') {
      query = query.eq('visitor_id', userData.id);
    } else {
      // 咨询师查看自己的预约
      const { data: profileData } = await supabase
        .from('counselor_profiles')
        .select('id')
        .eq('user_id', userData.id)
        .single();

      if (profileData) {
        query = query.eq('counselor_id', profileData.id);
      }
    }

    // 应用筛选条件
    if (filter?.status) {
      query = query.eq('status', filter.status);
    }
    if (filter?.start_date) {
      query = query.gte('created_at', filter.start_date);
    }
    if (filter?.end_date) {
      query = query.lte('created_at', filter.end_date);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取预约列表失败',
    };
  }
}

/**
 * 获取预约详情
 */
export async function getAppointmentById(appointmentId: string): Promise<ApiResponse<AppointmentWithDetails>> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        counselor_profiles (
          *,
          users (*)
        ),
        visitors:users!appointments_visitor_id_fkey (*),
        time_slots (*)
      `)
      .eq('id', appointmentId)
      .single();

    if (error) throw error;

    if (!data) {
      throw new Error('预约不存在');
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取预约详情失败',
    };
  }
}

/**
 * 取消预约
 */
export async function cancelAppointment(
  appointmentId: string,
  reason?: string
): Promise<ApiResponse> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('用户未登录');

    // 获取预约信息
    const { data: appointment } = await supabase
      .from('appointments')
      .select('*, time_slots(*)')
      .eq('id', appointmentId)
      .single();

    if (!appointment) throw new Error('预约不存在');

    // 检查是否可以取消（例如：提前24小时）
    const startTime = new Date(appointment.time_slots.start_time);
    const now = new Date();
    const hoursDiff = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      throw new Error('预约开始前24小时内不能取消');
    }

    // 更新预约状态
    const result = await updateAppointment(appointmentId, {
      status: 'cancelled',
      cancel_reason: reason,
    });

    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '取消预约失败',
    };
  }
}

/**
 * 确认预约（咨询师专用）
 */
export async function confirmAppointment(appointmentId: string): Promise<ApiResponse> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('用户未登录');

    // 检查用户是否为咨询师
    const { data: userData } = await supabase
      .from('users')
      .select('id, role')
      .eq('auth_user_id', user.id)
      .single();

    if (!userData || userData.role !== 'counselor') {
      throw new Error('只有咨询师可以确认预约');
    }

    const result = await updateAppointment(appointmentId, {
      status: 'confirmed',
    });

    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '确认预约失败',
    };
  }
}

/**
 * 完成预约（咨询师专用）
 */
export async function completeAppointment(
  appointmentId: string,
  counselorNotes?: string
): Promise<ApiResponse> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('用户未登录');

    // 检查用户是否为咨询师
    const { data: userData } = await supabase
      .from('users')
      .select('id, role')
      .eq('auth_user_id', user.id)
      .single();

    if (!userData || userData.role !== 'counselor') {
      throw new Error('只有咨询师可以完成预约');
    }

    const result = await updateAppointment(appointmentId, {
      status: 'completed',
      counselor_notes: counselorNotes,
    });

    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '完成预约失败',
    };
  }
}

/**
 * 获取预约统计信息
 */
export async function getAppointmentStats(): Promise<ApiResponse<{
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('用户未登录');

    // 获取用户信息
    const { data: userData } = await supabase
      .from('users')
      .select('id, role')
      .eq('auth_user_id', user.id)
      .single();

    if (!userData) throw new Error('用户信息不存在');

    let query = supabase.from('appointments').select('status');

    if (userData.role === 'visitor') {
      query = query.eq('visitor_id', userData.id);
    } else {
      // 咨询师查看自己的预约统计
      const { data: profileData } = await supabase
        .from('counselor_profiles')
        .select('id')
        .eq('user_id', userData.id)
        .single();

      if (profileData) {
        query = query.eq('counselor_id', profileData.id);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

         const stats = {
       total: data?.length || 0,
       pending: data?.filter((a: any) => a.status === 'pending').length || 0,
       confirmed: data?.filter((a: any) => a.status === 'confirmed').length || 0,
       completed: data?.filter((a: any) => a.status === 'completed').length || 0,
       cancelled: data?.filter((a: any) => a.status === 'cancelled').length || 0,
     };

    return {
      success: true,
      data: stats,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取统计信息失败',
    };
  }
} 