import { supabase } from '@/lib/supabase';
import type { 
  ApiResponse, 
  RegisterRequest, 
  LoginRequest, 
  User, 
  CounselorWithProfile 
} from '@/types/database';

/**
 * 用户注册
 */
export async function registerUser(data: RegisterRequest): Promise<ApiResponse<{
  user: User;
  session: any;
}>> {
  try {
    // 1. 使用 Supabase Auth 注册
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error('注册失败，请重试');
    }

    console.log('Auth user created:', authData.user.id);

    // 等待一下确保会话建立
    await new Promise(resolve => setTimeout(resolve, 100));

    // 验证当前会话
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session?.user?.id);

    // 2. 创建用户扩展信息
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        auth_user_id: authData.user.id,
        name: data.name,
        phone: data.phone,
        role: data.role,
      })
      .select()
      .single();

    if (userError) throw userError;

    // 3. 如果是咨询师，创建咨询师档案
    if (data.role === 'counselor' && data.counselorInfo) {
      const { data: profileData, error: profileError } = await supabase
        .from('counselor_profiles')
        .insert({
          user_id: userData.id,
          bio: data.counselorInfo.bio,
          gender: data.counselorInfo.gender,
          qualification: data.counselorInfo.qualification,
          experience_years: data.counselorInfo.experience_years || 0,
          consultation_fee: data.counselorInfo.consultation_fee,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // 4. 添加专业领域关联
      if (data.counselorInfo.specialties.length > 0) {
        // 先获取专业领域ID
        const { data: specialties, error: specialtiesError } = await supabase
          .from('specialties')
          .select('id, name')
          .in('name', data.counselorInfo.specialties);

        if (specialtiesError) throw specialtiesError;

        if (specialties && specialties.length > 0) {
          const counselorSpecialties = specialties.map((specialty: { id: string; name: string }) => ({
            counselor_id: profileData.id,
            specialty_id: specialty.id,
          }));

          const { error: csError } = await supabase
            .from('counselor_specialties')
            .insert(counselorSpecialties);

          if (csError) throw csError;
        }
      }
    }

    return {
      success: true,
      data: {
        user: userData,
        session: authData.session,
      },
      message: '注册成功',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '注册失败',
    };
  }
}

/**
 * 用户登录
 */
export async function loginUser(data: LoginRequest): Promise<ApiResponse<{
  user: User | CounselorWithProfile;
  session: any;
}>> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error('登录失败，请检查邮箱和密码');
    }

    // 获取用户扩展信息
    const { data: userData, error: userError } = await supabase
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
      .eq('auth_user_id', authData.user.id)
      .single();

    if (userError) throw userError;

    return {
      success: true,
      data: {
        user: userData,
        session: authData.session,
      },
      message: '登录成功',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '登录失败',
    };
  }
}

/**
 * 用户登出
 */
export async function logoutUser(): Promise<ApiResponse> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;

    return {
      success: true,
      message: '登出成功',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '登出失败',
    };
  }
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<ApiResponse<User | CounselorWithProfile>> {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      throw new Error('用户未登录');
    }

    const { data: userData, error: userError } = await supabase
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
      .eq('auth_user_id', authUser.id)
      .single();

    if (userError) throw userError;

    return {
      success: true,
      data: userData,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '获取用户信息失败',
    };
  }
}

/**
 * 更新用户基本信息
 */
export async function updateUserProfile(updates: {
  name?: string;
  phone?: string;
  avatar?: string;
}): Promise<ApiResponse<User>> {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      throw new Error('用户未登录');
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('auth_user_id', authUser.id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
      message: '更新成功',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '更新失败',
    };
  }
}

/**
 * 更新咨询师档案
 */
export async function updateCounselorProfile(updates: {
  bio?: string;
  qualification?: string;
  experience_years?: number;
  consultation_fee?: number;
  specialties?: string[];
}): Promise<ApiResponse> {
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      throw new Error('用户未登录');
    }

    // 获取用户信息
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', authUser.id)
      .single();

    if (!userData) {
      throw new Error('用户信息不存在');
    }

    // 获取咨询师档案
    const { data: profileData } = await supabase
      .from('counselor_profiles')
      .select('id')
      .eq('user_id', userData.id)
      .single();

    if (!profileData) {
      throw new Error('咨询师档案不存在');
    }

    // 更新咨询师基本信息
    const profileUpdates = { ...updates };
    delete profileUpdates.specialties; // 专业领域单独处理

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileError } = await supabase
        .from('counselor_profiles')
        .update(profileUpdates)
        .eq('id', profileData.id);

      if (profileError) throw profileError;
    }

    // 更新专业领域关联
    if (updates.specialties) {
      // 删除现有关联
      await supabase
        .from('counselor_specialties')
        .delete()
        .eq('counselor_id', profileData.id);

      // 添加新关联
      if (updates.specialties.length > 0) {
        const { data: specialties } = await supabase
          .from('specialties')
          .select('id, name')
          .in('name', updates.specialties);

        if (specialties && specialties.length > 0) {
          const counselorSpecialties = specialties.map((specialty: { id: string; name: string }) => ({
            counselor_id: profileData.id,
            specialty_id: specialty.id,
          }));

          const { error: csError } = await supabase
            .from('counselor_specialties')
            .insert(counselorSpecialties);

          if (csError) throw csError;
        }
      }
    }

    return {
      success: true,
      message: '更新成功',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '更新失败',
    };
  }
}

/**
 * 重置密码
 */
export async function resetPassword(email: string): Promise<ApiResponse> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;

    return {
      success: true,
      message: '重置链接已发送到您的邮箱',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '发送重置链接失败',
    };
  }
}

/**
 * 更新密码
 */
export async function updatePassword(newPassword: string): Promise<ApiResponse> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return {
      success: true,
      message: '密码更新成功',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '密码更新失败',
    };
  }
} 