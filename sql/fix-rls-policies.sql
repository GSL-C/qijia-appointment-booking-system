-- 修复 RLS 策略，解决注册时的权限问题
-- 在 Supabase SQL 编辑器中执行此脚本

-- 1. 删除现有的有问题的策略
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- 2. 创建新的插入策略，允许注册时插入用户数据
-- 这个策略允许任何已认证的用户插入记录，只要 auth_user_id 匹配当前用户
CREATE POLICY "Allow user registration" ON public.users
    FOR INSERT 
    WITH CHECK (
        auth.uid() IS NOT NULL 
        AND auth_user_id = auth.uid()
    );

-- 3. 也可以选择更宽松的策略，仅在注册时允许插入
-- 如果上面的策略还是不行，可以尝试这个更宽松的策略
/*
DROP POLICY IF EXISTS "Allow user registration" ON public.users;

CREATE POLICY "Allow user registration" ON public.users
    FOR INSERT 
    WITH CHECK (
        auth.uid() IS NOT NULL
    );
*/

-- 4. 确保咨询师档案的插入策略也正确
DROP POLICY IF EXISTS "Counselors can insert own profile" ON public.counselor_profiles;

CREATE POLICY "Counselors can insert own profile" ON public.counselor_profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = counselor_profiles.user_id 
            AND users.auth_user_id = auth.uid()
        )
    );

-- 5. 确保咨询师专业领域关联的策略
CREATE POLICY IF NOT EXISTS "Counselors can manage own specialties" ON public.counselor_specialties
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.counselor_profiles cp
            JOIN public.users u ON cp.user_id = u.id
            WHERE cp.id = counselor_specialties.counselor_id 
            AND u.auth_user_id = auth.uid()
        )
    );

-- 6. 检查并修复咨询师档案的更新策略（原来的策略不完整）
DROP POLICY IF EXISTS "Counselors can update own profile" ON public.counselor_profiles;

CREATE POLICY "Counselors can update own profile" ON public.counselor_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = counselor_profiles.user_id 
            AND users.auth_user_id = auth.uid()
        )
    );

-- 7. 确保专业领域表可以被插入（如果需要的话）
CREATE POLICY IF NOT EXISTS "Allow specialty insertion" ON public.specialties
    FOR INSERT WITH CHECK (true);

-- 8. 预约相关策略修复（原文件中策略不完整）
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;

CREATE POLICY "Users can view own appointments" ON public.appointments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users u1 
            WHERE u1.id = appointments.visitor_id 
            AND u1.auth_user_id = auth.uid()
        )
        OR 
        EXISTS (
            SELECT 1 FROM public.counselor_profiles cp
            JOIN public.users u2 ON cp.user_id = u2.id
            WHERE cp.id = appointments.counselor_id 
            AND u2.auth_user_id = auth.uid()
        )
    );

CREATE POLICY IF NOT EXISTS "Users can create appointments" ON public.appointments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = appointments.visitor_id 
            AND users.auth_user_id = auth.uid()
        )
    );

-- 9. 完善时间段相关策略
CREATE POLICY IF NOT EXISTS "Counselors can insert time slots" ON public.time_slots
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.counselor_profiles cp
            JOIN public.users u ON cp.user_id = u.id
            WHERE cp.id = time_slots.counselor_id 
            AND u.auth_user_id = auth.uid()
        )
    );

CREATE POLICY IF NOT EXISTS "Counselors can insert time templates" ON public.time_slot_templates
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.counselor_profiles cp
            JOIN public.users u ON cp.user_id = u.id
            WHERE cp.id = time_slot_templates.counselor_id 
            AND u.auth_user_id = auth.uid()
        )
    ); 