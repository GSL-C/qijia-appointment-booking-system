import { supabase } from '@/lib/supabase';
import type { 
  ApiResponse, 
  TimeSlotTemplate, 
  TimeSlot, 
  CreateTimeSlotTemplateRequest,
  CreateTimeSlotRequest,
  UpdateTimeSlotRequest,
  TimeSlotFilter,
  TimeSlotWithCounselor
} from '@/types/database';

/**
 * 创建时间段模板
 */
export async function createTimeSlotTemplates(
  templates: CreateTimeSlotTemplateRequest[]
): Promise<ApiResponse<TimeSlotTemplate[]>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('用户未登录');

    // 获取咨询师档案ID
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!userData) throw new Error('用户信息不存在');

    const { data: profileData } = await supabase
      .from('counselor_profiles')
      .select('id')
      .eq('user_id', userData.id)
      .single();

    if (!profileData) throw new Error('咨询师档案不存在');

    // 插入模板数据
    const templatesWithCounselorId = templates.map(template => ({
      counselor_id: profileData.id,
      ...template,
    }));

    const { data, error } = await supabase
      .from('time_slot_templates')
      .insert(templatesWithCounselorId)
      .select();

    if (error) throw error;

    // 根据模板生成具体时间段
    await generateTimeSlotsFromTemplates(profileData.id);

    return {
      success: true,
      data,
      message: '时间段模板创建成功',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '创建时间段模板失败',
    };
  }
}

/**
 * 根据模板生成具体时间段
 */
export async function generateTimeSlotsFromTemplates(
  counselorId: string,
  daysAhead: number = 30
): Promise<ApiResponse<{ created: number }>> {
  try {
    // 获取活跃的模板
    const { data: templates, error: templatesError } = await supabase
      .from('time_slot_templates')
      .select('*')
      .eq('counselor_id', counselorId)
      .eq('is_active', true);

    if (templatesError) throw templatesError;

    if (!templates || templates.length === 0) {
      return {
        success: true,
        data: { created: 0 },
        message: '没有活跃的时间段模板',
      };
    }

    const now = new Date();
    const endDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    
    const timeSlotsToCreate = [];

    // 为每个模板生成时间段
    for (const template of templates) {
      let currentDate = new Date(now);
      
      while (currentDate <= endDate) {
        // 找到下一个符合星期要求的日期
        while (currentDate.getDay() !== template.day_of_week) {
          currentDate.setDate(currentDate.getDate() + 1);
        }

        if (currentDate > endDate) break;

        // 检查这个时间段是否已存在
        const startTime = new Date(currentDate);
        const [hours, minutes] = template.start_time.split(':');
        startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const endTime = new Date(currentDate);
        const [endHours, endMinutes] = template.end_time.split(':');
        endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

        // 检查时间段是否已存在
        const { data: existing } = await supabase
          .from('time_slots')
          .select('id')
          .eq('counselor_id', counselorId)
          .eq('start_time', startTime.toISOString())
          .eq('end_time', endTime.toISOString());

        if (!existing || existing.length === 0) {
          timeSlotsToCreate.push({
            counselor_id: counselorId,
            template_id: template.id,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            is_available: true,
          });
        }

        // 根据重复类型计算下一个日期
        switch (template.repeat_type) {
          case 'weekly':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case 'biweekly':
            currentDate.setDate(currentDate.getDate() + 14);
            break;
          default:
            currentDate.setDate(currentDate.getDate() + 1);
            break;
        }
      }
    }

    // 批量创建时间段
    if (timeSlotsToCreate.length > 0) {
      const { error } = await supabase
        .from('time_slots')
        .insert(timeSlotsToCreate);

      if (error) throw error;
    }

    return {
      success: true,
      data: { created: timeSlotsToCreate.length },
      message: `成功生成 ${timeSlotsToCreate.length} 个时间段`,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '生成时间段失败',
    };
  }
}

/**
 * 获取咨询师的时间段模板
 */
export async function getCounselorTimeSlotTemplates(): Promise<ApiResponse<TimeSlotTemplate[]>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('用户未登录');

    // 获取咨询师档案ID
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!userData) throw new Error('用户信息不存在');

    const { data: profileData } = await supabase
      .from('counselor_profiles')
      .select('id')
      .eq('user_id', userData.id)
      .single();

    if (!profileData) throw new Error('咨询师档案不存在');

    const { data, error } = await supabase
      .from('time_slot_templates')
      .select('*')
      .eq('counselor_id', profileData.id)
      .order('day_of_week')
      .order('start_time');

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取时间段模板失败',
    };
  }
}

/**
 * 更新时间段模板
 */
export async function updateTimeSlotTemplate(
  templateId: string,
  updates: Partial<CreateTimeSlotTemplateRequest>
): Promise<ApiResponse<TimeSlotTemplate>> {
  try {
    const { data, error } = await supabase
      .from('time_slot_templates')
      .update(updates)
      .eq('id', templateId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      message: '时间段模板更新成功',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '更新时间段模板失败',
    };
  }
}

/**
 * 删除时间段模板
 */
export async function deleteTimeSlotTemplate(templateId: string): Promise<ApiResponse> {
  try {
    // 先删除基于此模板生成的未来时间段
    const now = new Date().toISOString();
    await supabase
      .from('time_slots')
      .delete()
      .eq('template_id', templateId)
      .gte('start_time', now);

    // 删除模板
    const { error } = await supabase
      .from('time_slot_templates')
      .delete()
      .eq('id', templateId);

    if (error) throw error;

    return {
      success: true,
      message: '时间段模板删除成功',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '删除时间段模板失败',
    };
  }
}

/**
 * 创建单个时间段
 */
export async function createTimeSlot(timeSlot: CreateTimeSlotRequest): Promise<ApiResponse<TimeSlot>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('用户未登录');

    // 获取咨询师档案ID
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!userData) throw new Error('用户信息不存在');

    const { data: profileData } = await supabase
      .from('counselor_profiles')
      .select('id')
      .eq('user_id', userData.id)
      .single();

    if (!profileData) throw new Error('咨询师档案不存在');

    const { data, error } = await supabase
      .from('time_slots')
      .insert({
        counselor_id: profileData.id,
        ...timeSlot,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      message: '时间段创建成功',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '创建时间段失败',
    };
  }
}

/**
 * 获取咨询师的时间段
 */
export async function getCounselorTimeSlots(
  counselorId?: string,
  filter?: TimeSlotFilter
): Promise<ApiResponse<TimeSlot[]>> {
  try {
    let query = supabase.from('time_slots').select('*');

    if (counselorId) {
      query = query.eq('counselor_id', counselorId);
    } else {
      // 如果没有指定咨询师ID，获取当前登录咨询师的时间段
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('用户未登录');

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('用户信息不存在');

      const { data: profileData } = await supabase
        .from('counselor_profiles')
        .select('id')
        .eq('user_id', userData.id)
        .single();

      if (!profileData) throw new Error('咨询师档案不存在');

      query = query.eq('counselor_id', profileData.id);
    }

    // 应用筛选条件
    if (filter?.start_date) {
      query = query.gte('start_time', filter.start_date);
    }
    if (filter?.end_date) {
      query = query.lte('start_time', filter.end_date);
    }
    if (filter?.is_available !== undefined) {
      query = query.eq('is_available', filter.is_available);
    }

    query = query.order('start_time');

    const { data, error } = await query;

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取时间段失败',
    };
  }
}

/**
 * 获取可用的时间段（包含咨询师信息）
 */
export async function getAvailableTimeSlots(
  filter?: TimeSlotFilter & { specialty?: string; gender?: string }
): Promise<ApiResponse<TimeSlotWithCounselor[]>> {
  try {
    let query = supabase
      .from('time_slots')
      .select(`
        *,
        counselor_profiles (
          *,
          users (*),
          counselor_specialties (
            specialties (*)
          )
        )
      `)
      .eq('is_available', true)
      .gte('start_time', new Date().toISOString());

    // 应用筛选条件
    if (filter?.start_date) {
      query = query.gte('start_time', filter.start_date);
    }
    if (filter?.end_date) {
      query = query.lte('start_time', filter.end_date);
    }

    query = query.order('start_time');

    const { data, error } = await query;

    if (error) throw error;

    let filteredData = data || [];

         // 应用专业领域筛选
     if (filter?.specialty) {
       filteredData = filteredData.filter((slot: any) => 
         slot.counselor_profiles?.counselor_specialties?.some((cs: any) => 
           cs.specialties.name === filter.specialty
         )
       );
     }

     // 应用性别筛选
     if (filter?.gender) {
       filteredData = filteredData.filter((slot: any) => 
         slot.counselor_profiles?.gender === filter.gender
       );
     }

    return {
      success: true,
      data: filteredData,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取可用时间段失败',
    };
  }
}

/**
 * 更新时间段
 */
export async function updateTimeSlot(
  timeSlotId: string,
  updates: UpdateTimeSlotRequest
): Promise<ApiResponse<TimeSlot>> {
  try {
    const { data, error } = await supabase
      .from('time_slots')
      .update(updates)
      .eq('id', timeSlotId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      message: '时间段更新成功',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '更新时间段失败',
    };
  }
}

/**
 * 删除时间段
 */
export async function deleteTimeSlot(timeSlotId: string): Promise<ApiResponse> {
  try {
    const { error } = await supabase
      .from('time_slots')
      .delete()
      .eq('id', timeSlotId);

    if (error) throw error;

    return {
      success: true,
      message: '时间段删除成功',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '删除时间段失败',
    };
  }
}

/**
 * 批量更新时间段可用性
 */
export async function batchUpdateTimeSlotAvailability(
  timeSlotIds: string[],
  isAvailable: boolean
): Promise<ApiResponse> {
  try {
    const { error } = await supabase
      .from('time_slots')
      .update({ is_available: isAvailable })
      .in('id', timeSlotIds);

    if (error) throw error;

    return {
      success: true,
      message: `成功更新 ${timeSlotIds.length} 个时间段`,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '批量更新失败',
    };
  }
} 