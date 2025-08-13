-- 齐家心理咨询预约系统数据库结构
-- 在Supabase SQL编辑器中执行此文件

-- 1. 用户扩展信息表
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar TEXT,
    role VARCHAR(20) NOT NULL CHECK (role IN ('visitor', 'counselor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. 咨询师档案表
CREATE TABLE public.counselor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('男', '女')),
    qualification TEXT,
    experience_years INTEGER DEFAULT 0,
    consultation_fee DECIMAL(8,2),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 专业领域表
CREATE TABLE public.specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 咨询师专业领域关联表
CREATE TABLE public.counselor_specialties (
    counselor_id UUID REFERENCES public.counselor_profiles(id) ON DELETE CASCADE,
    specialty_id UUID REFERENCES public.specialties(id) ON DELETE CASCADE,
    PRIMARY KEY (counselor_id, specialty_id)
);

-- 5. 时间段模板表
CREATE TABLE public.time_slot_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    counselor_id UUID REFERENCES public.counselor_profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    repeat_type VARCHAR(20) DEFAULT 'weekly' CHECK (repeat_type IN ('none', 'weekly', 'biweekly')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_template_time CHECK (end_time > start_time)
);

-- 6. 具体时间段表
CREATE TABLE public.time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    counselor_id UUID REFERENCES public.counselor_profiles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.time_slot_templates(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    max_appointments INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- 7. 预约表（为将来扩展预留）
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    counselor_id UUID REFERENCES public.counselor_profiles(id) ON DELETE CASCADE,
    visitor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    time_slot_id UUID REFERENCES public.time_slots(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    visitor_notes TEXT,
    counselor_notes TEXT,
    cancel_reason TEXT,
    cancelled_by VARCHAR(20) CHECK (cancelled_by IN ('visitor', 'counselor', 'system')),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_users_auth_id ON public.users(auth_user_id);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_counselor_profiles_user_id ON public.counselor_profiles(user_id);
CREATE INDEX idx_time_slots_counselor_time ON public.time_slots(counselor_id, start_time);
CREATE INDEX idx_time_slots_available ON public.time_slots(is_available, start_time);
CREATE INDEX idx_appointments_visitor ON public.appointments(visitor_id, created_at);
CREATE INDEX idx_appointments_counselor ON public.appointments(counselor_id, created_at);

-- 自动更新 updated_at 字段的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加触发器
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_counselor_profiles_updated_at 
    BEFORE UPDATE ON public.counselor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_slot_templates_updated_at 
    BEFORE UPDATE ON public.time_slot_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_slots_updated_at 
    BEFORE UPDATE ON public.time_slots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 启用 Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slot_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselor_specialties ENABLE ROW LEVEL SECURITY;

-- RLS 策略
-- 用户可以查看和修改自己的数据
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- 咨询师档案策略
CREATE POLICY "Counselors can view own profile" ON public.counselor_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = counselor_profiles.user_id 
            AND users.auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view counselor profiles" ON public.counselor_profiles
    FOR SELECT USING (true);

CREATE POLICY "Counselors can update own profile" ON public.counselor_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = counselor_profiles.user_id 
            AND users.auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Counselors can insert own profile" ON public.counselor_profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = counselor_profiles.user_id 
            AND users.auth_user_id = auth.uid()
        )
    );

-- 专业领域策略（所有人可查看）
CREATE POLICY "Anyone can view specialties" ON public.specialties
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view counselor specialties" ON public.counselor_specialties
    FOR SELECT USING (true);

-- 时间段模板策略
CREATE POLICY "Counselors can manage own time templates" ON public.time_slot_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.counselor_profiles cp
            JOIN public.users u ON cp.user_id = u.id
            WHERE cp.id = time_slot_templates.counselor_id 
            AND u.auth_user_id = auth.uid()
        )
    );

-- 时间段策略
CREATE POLICY "Anyone can view available time slots" ON public.time_slots
    FOR SELECT USING (is_available = true);

CREATE POLICY "Counselors can manage own time slots" ON public.time_slots
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.counselor_profiles cp
            JOIN public.users u ON cp.user_id = u.id
            WHERE cp.id = time_slots.counselor_id 
            AND u.auth_user_id = auth.uid()
        )
    );

-- 预约策略
CREATE POLICY "Users can view own appointments" ON public.appointments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = appointments.visitor_id 
            AND users.auth_user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.counselor_profiles cp
            JOIN public.users u ON cp.user_id = u.id
            WHERE cp.id = appointments.counselor_id 
            AND u.auth_user_id = auth.uid()
        )
    );

-- 初始化专业领域数据
INSERT INTO public.specialties (name, description) VALUES 
('焦虑症', '焦虑障碍的心理咨询与治疗'),
('抑郁症', '抑郁情绪的识别、干预与康复'),
('情感咨询', '恋爱关系、婚姻问题咨询'),
('人际关系', '社交技巧、人际冲突处理'),
('青少年心理', '青春期心理发展与问题应对'),
('学习压力', '学业焦虑、考试压力管理'),
('职场压力', '工作压力、职业规划咨询'),
('家庭关系', '家庭矛盾、亲子关系咨询'),
('创伤治疗', 'PTSD及创伤后应激障碍治疗'),
('睡眠障碍', '失眠、睡眠质量问题咨询'); 