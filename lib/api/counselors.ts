import { supabase } from '@/lib/supabase';
import type { 
  ApiResponse, 
  CounselorProfile,
  CounselorProfileWithSpecialties,
  CounselorWithProfile,
  CounselorFilter,
  Specialty
} from '@/types/database';

/**
 * 获取所有专业领域
 */
export async function getSpecialties(): Promise<ApiResponse<Specialty[]>> {
  try {
    const { data, error } = await supabase
      .from('specialties')
      .select('*')
      .order('name');

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取专业领域失败',
    };
  }
}

/**
 * 获取咨询师列表（带筛选功能）
 */
export async function getCounselors(filter?: CounselorFilter): Promise<ApiResponse<CounselorWithProfile[]>> {
  try {
    let query = supabase
      .from('users')
      .select(`
        *,
        counselor_profiles (
          *,
          counselor_specialties (
            specialties (*)
          )
        )
      `)
      .eq('role', 'counselor')
      .not('counselor_profiles', 'is', null);

    // 应用验证状态筛选
    if (filter?.is_verified !== undefined) {
      query = query.eq('counselor_profiles.is_verified', filter.is_verified);
    }

    const { data, error } = await query;

    if (error) throw error;

    let filteredData = data || [];

         // 应用其他筛选条件
     if (filter?.specialty) {
       filteredData = filteredData.filter((counselor: any) => 
         counselor.counselor_profiles?.counselor_specialties?.some((cs: any) => 
           cs.specialties.name.includes(filter.specialty!)
         )
       );
     }

     if (filter?.gender) {
       filteredData = filteredData.filter((counselor: any) => 
         counselor.counselor_profiles?.gender === filter.gender
       );
     }

     if (filter?.keyword) {
       const keyword = filter.keyword.toLowerCase();
       filteredData = filteredData.filter((counselor: any) => 
         counselor.name.toLowerCase().includes(keyword) ||
         counselor.counselor_profiles?.bio?.toLowerCase().includes(keyword) ||
         counselor.counselor_profiles?.counselor_specialties?.some((cs: any) => 
           cs.specialties.name.toLowerCase().includes(keyword)
         )
       );
     }

    return {
      success: true,
      data: filteredData,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取咨询师列表失败',
    };
  }
}

/**
 * 根据ID获取咨询师详情
 */
export async function getCounselorById(counselorId: string): Promise<ApiResponse<CounselorProfileWithSpecialties>> {
  try {
    const { data, error } = await supabase
      .from('counselor_profiles')
      .select(`
        *,
        users (*),
        counselor_specialties (
          specialties (*)
        )
      `)
      .eq('id', counselorId)
      .single();

    if (error) throw error;

    if (!data) {
      throw new Error('咨询师不存在');
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取咨询师详情失败',
    };
  }
}

/**
 * 根据用户ID获取咨询师档案
 */
export async function getCounselorByUserId(userId: string): Promise<ApiResponse<CounselorProfileWithSpecialties>> {
  try {
    const { data, error } = await supabase
      .from('counselor_profiles')
      .select(`
        *,
        users (*),
        counselor_specialties (
          specialties (*)
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    if (!data) {
      throw new Error('咨询师档案不存在');
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取咨询师档案失败',
    };
  }
}

/**
 * 搜索咨询师
 */
export async function searchCounselors(keyword: string): Promise<ApiResponse<CounselorWithProfile[]>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        counselor_profiles (
          *,
          counselor_specialties (
            specialties (*)
          )
        )
      `)
      .eq('role', 'counselor')
      .not('counselor_profiles', 'is', null)
      .ilike('name', `%${keyword}%`);

    if (error) throw error;

    // 也搜索专业领域和简介
    const { data: bioData } = await supabase
      .from('users')
      .select(`
        *,
        counselor_profiles!inner (
          *,
          counselor_specialties (
            specialties (*)
          )
        )
      `)
      .eq('role', 'counselor')
      .ilike('counselor_profiles.bio', `%${keyword}%`);

    // 搜索专业领域
    const { data: specialtyData } = await supabase
      .from('users')
      .select(`
        *,
        counselor_profiles!inner (
          *,
          counselor_specialties!inner (
            specialties!inner (*)
          )
        )
      `)
      .eq('role', 'counselor')
      .ilike('counselor_profiles.counselor_specialties.specialties.name', `%${keyword}%`);

    // 合并结果并去重
    const allResults = [...(data || []), ...(bioData || []), ...(specialtyData || [])];
    const uniqueResults = allResults.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );

    return {
      success: true,
      data: uniqueResults,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '搜索咨询师失败',
    };
  }
}

/**
 * 获取热门咨询师（根据预约数量）
 */
export async function getPopularCounselors(limit: number = 10): Promise<ApiResponse<CounselorWithProfile[]>> {
  try {
    // 先获取所有咨询师
    const { data: counselors, error: counselorsError } = await supabase
      .from('users')
      .select(`
        *,
        counselor_profiles (
          *,
          counselor_specialties (
            specialties (*)
          )
        )
      `)
      .eq('role', 'counselor')
      .eq('counselor_profiles.is_verified', true)
      .not('counselor_profiles', 'is', null);

    if (counselorsError) throw counselorsError;

         // 获取每个咨询师的预约统计
     const counselorsWithStats = await Promise.all(
       (counselors || []).map(async (counselor: any) => {
         const { count } = await supabase
           .from('appointments')
           .select('*', { count: 'exact', head: true })
           .eq('counselor_id', counselor.counselor_profiles.id)
           .in('status', ['confirmed', 'completed']);

         return {
           ...counselor,
           appointmentCount: count || 0,
         };
       })
     );

     // 按预约数量排序
     const sortedCounselors = counselorsWithStats
       .sort((a: any, b: any) => b.appointmentCount - a.appointmentCount)
       .slice(0, limit);

    return {
      success: true,
      data: sortedCounselors,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取热门咨询师失败',
    };
  }
}

/**
 * 获取推荐咨询师（基于专业领域）
 */
export async function getRecommendedCounselors(
  specialties: string[],
  limit: number = 5
): Promise<ApiResponse<CounselorWithProfile[]>> {
  try {
    if (specialties.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        counselor_profiles!inner (
          *,
          counselor_specialties!inner (
            specialties!inner (*)
          )
        )
      `)
      .eq('role', 'counselor')
      .eq('counselor_profiles.is_verified', true)
      .in('counselor_profiles.counselor_specialties.specialties.name', specialties)
      .limit(limit);

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取推荐咨询师失败',
    };
  }
}

/**
 * 获取咨询师统计信息
 */
export async function getCounselorStats(counselorId: string): Promise<ApiResponse<{
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  rating: number;
  totalSlots: number;
  availableSlots: number;
}>> {
  try {
    // 获取预约统计
    const { data: appointments } = await supabase
      .from('appointments')
      .select('status')
      .eq('counselor_id', counselorId);

         const totalAppointments = appointments?.length || 0;
     const completedAppointments = appointments?.filter((a: any) => a.status === 'completed').length || 0;
     const cancelledAppointments = appointments?.filter((a: any) => a.status === 'cancelled').length || 0;

    // 获取时间段统计
    const { data: timeSlots } = await supabase
      .from('time_slots')
      .select('is_available')
      .eq('counselor_id', counselorId)
      .gte('start_time', new Date().toISOString());

         const totalSlots = timeSlots?.length || 0;
     const availableSlots = timeSlots?.filter((ts: any) => ts.is_available).length || 0;

    return {
      success: true,
      data: {
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        rating: 4.5, // 暂时固定值，后续可以实现评分系统
        totalSlots,
        availableSlots,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取统计信息失败',
    };
  }
}

/**
 * 验证咨询师资质
 */
export async function verifyCounselor(counselorId: string): Promise<ApiResponse> {
  try {
    const { error } = await supabase
      .from('counselor_profiles')
      .update({ is_verified: true })
      .eq('id', counselorId);

    if (error) throw error;

    return {
      success: true,
      message: '咨询师验证成功',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '验证咨询师失败',
    };
  }
}

 /**
  * 取消咨询师验证
  */
 export async function unverifyCounselor(counselorId: string): Promise<ApiResponse> {
   try {
     const { error } = await supabase
       .from('counselor_profiles')
       .update({ is_verified: false })
       .eq('id', counselorId);

     if (error) throw error;

     return {
       success: true,
       message: '咨询师验证已取消',
     };
   } catch (error: any) {
     return {
       success: false,
       error: error.message || '取消验证失败',
     };
   }
 } 