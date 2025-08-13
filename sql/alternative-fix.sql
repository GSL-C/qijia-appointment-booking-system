-- 备用方案：更宽松的 RLS 策略
-- 如果主要修复脚本还不能解决问题，使用这个

-- 删除现有策略
DROP POLICY IF EXISTS "Allow user registration" ON public.users;

-- 创建更宽松的策略：允许任何认证用户插入用户记录
CREATE POLICY "Allow user registration" ON public.users
    FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

-- 或者如果还是有问题，临时禁用 users 表的 RLS（仅用于测试）
-- 注意：这会降低安全性，仅在开发/测试阶段使用
/*
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
*/ 