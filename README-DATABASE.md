# 齐家心理咨询系统 - 数据库 & API 指南

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install @supabase/supabase-js date-fns
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入您的 Supabase 配置：

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 创建数据库表

在 Supabase SQL 编辑器中执行 `sql/schema.sql` 文件：

```sql
-- 复制并粘贴 sql/schema.sql 文件内容到 Supabase SQL 编辑器中执行
```

## 📋 核心功能

### 🔐 用户认证

```typescript
import { registerUser, loginUser, logoutUser } from '@/lib/api/auth';
import { useAuth } from '@/lib/hooks/useAuth';

// 注册咨询师
const result = await registerUser({
  email: 'counselor@example.com',
  password: 'password123',
  name: '李心理',
  role: 'counselor',
  phone: '13800138000',
  counselorInfo: {
    bio: '拥有10年心理咨询经验',
    gender: '女',
    specialties: ['焦虑症', '抑郁症'],
    experience_years: 10,
  },
});

// 注册来访者
const result = await registerUser({
  email: 'visitor@example.com',
  password: 'password123',
  name: '小明',
  role: 'visitor',
  phone: '13800138001',
});

// 登录
const loginResult = await loginUser({
  email: 'counselor@example.com',
  password: 'password123',
});

// 在组件中使用认证状态
function MyComponent() {
  const { user, isAuthenticated, isCounselor, loading } = useAuth();
  
  if (loading) return <div>加载中...</div>;
  if (!isAuthenticated) return <div>请先登录</div>;
  
  return (
    <div>
      <h1>欢迎，{user.name}</h1>
      {isCounselor && <p>您是咨询师</p>}
    </div>
  );
}
```

### ⏰ 时间段管理

```typescript
import { 
  createTimeSlotTemplates, 
  getCounselorTimeSlots,
  updateTimeSlot 
} from '@/lib/api/timeSlots';

// 创建时间段模板（咨询师设置定期可用时间）
const templates = [
  {
    day_of_week: 1, // 周一
    start_time: '09:00',
    end_time: '10:00',
    repeat_type: 'weekly',
    is_active: true,
  },
  {
    day_of_week: 3, // 周三
    start_time: '14:00',
    end_time: '15:00',
    repeat_type: 'weekly',
    is_active: true,
  },
];

const result = await createTimeSlotTemplates(templates);

// 获取咨询师的时间段
const timeSlots = await getCounselorTimeSlots(counselorId, {
  start_date: '2024-01-01',
  end_date: '2024-01-31',
  is_available: true,
});

// 更新时间段可用性
await updateTimeSlot(timeSlotId, {
  is_available: false,
});
```

### 👩‍⚕️ 咨询师管理

```typescript
import { getCounselors, getCounselorById } from '@/lib/api/counselors';

// 获取咨询师列表（支持筛选）
const counselors = await getCounselors({
  specialty: '焦虑症',
  gender: '女',
  keyword: '经验丰富',
  is_verified: true,
});

// 获取咨询师详情
const counselor = await getCounselorById(counselorId);
```

### 📅 预约管理

```typescript
import { 
  createAppointment, 
  getUserAppointments,
  confirmAppointment,
  cancelAppointment 
} from '@/lib/api/appointments';

// 创建预约（来访者）
const appointment = await createAppointment({
  time_slot_id: 'slot-id',
  visitor_notes: '希望咨询焦虑问题',
});

// 获取用户预约列表
const appointments = await getUserAppointments({
  status: 'pending',
  start_date: '2024-01-01',
});

// 确认预约（咨询师）
await confirmAppointment(appointmentId);

// 取消预约
await cancelAppointment(appointmentId, '临时有事');
```

## 🎯 使用示例

### 咨询师设置时间段页面

```typescript
'use client';

import { useState } from 'react';
import { createTimeSlotTemplates } from '@/lib/api/timeSlots';
import { useAuth } from '@/lib/hooks/useAuth';

export default function TimeSlotSettings() {
  const { isCounselor } = useAuth();
  const [templates, setTemplates] = useState([
    { day_of_week: 1, start_time: '09:00', end_time: '10:00', repeat_type: 'weekly' }
  ]);

  const handleSubmit = async () => {
    const result = await createTimeSlotTemplates(templates);
    if (result.success) {
      alert('时间段设置成功！');
    } else {
      alert(result.error);
    }
  };

  if (!isCounselor) {
    return <div>只有咨询师可以设置时间段</div>;
  }

  return (
    <div>
      <h1>设置可预约时间</h1>
      {/* 时间段设置表单 */}
      <button onClick={handleSubmit}>保存设置</button>
    </div>
  );
}
```

### 来访者预约页面

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getAvailableTimeSlots } from '@/lib/api/timeSlots';
import { createAppointment } from '@/lib/api/appointments';
import { formatDateTime } from '@/lib/utils/dateUtils';

export default function BookingPage({ counselorId }: { counselorId: string }) {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const loadTimeSlots = async () => {
    const result = await getAvailableTimeSlots({
      start_date: new Date().toISOString(),
    });
    
    if (result.success) {
      // 筛选指定咨询师的时间段
      const filtered = result.data.filter(slot => 
        slot.counselor_id === counselorId
      );
      setTimeSlots(filtered);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    const result = await createAppointment({
      time_slot_id: selectedSlot.id,
      visitor_notes: '希望进行心理咨询',
    });

    if (result.success) {
      alert('预约成功，等待咨询师确认！');
      loadTimeSlots(); // 刷新时间段
    } else {
      alert(result.error);
    }
  };

  return (
    <div>
      <h1>选择预约时间</h1>
      
      <div className="grid gap-4">
        {timeSlots.map(slot => (
          <div 
            key={slot.id}
            className={`p-4 border rounded cursor-pointer ${
              selectedSlot?.id === slot.id ? 'border-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => setSelectedSlot(slot)}
          >
            <div className="font-medium">
              {formatDateTime(slot.start_time)} - {formatDateTime(slot.end_time, 'HH:mm')}
            </div>
            <div className="text-sm text-gray-600">
              {slot.counselor_profiles.users.name}
            </div>
          </div>
        ))}
      </div>

      {selectedSlot && (
        <button 
          onClick={handleBooking}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          确认预约
        </button>
      )}
    </div>
  );
}
```

## 🔧 工具函数

### 日期时间处理

```typescript
import { 
  formatDateTime, 
  formatDate, 
  getWeekdayName,
  getAppointmentStatusText 
} from '@/lib/utils/dateUtils';

// 格式化显示
const displayTime = formatDateTime(slot.start_time, 'MM月dd日 HH:mm');
const weekday = getWeekdayName(template.day_of_week);
const statusText = getAppointmentStatusText(appointment.status);
```

## 📊 数据表关系

```
users (用户表)
├── counselor_profiles (咨询师档案) [1:1]
│   ├── counselor_specialties (专业关联) [1:N]
│   │   └── specialties (专业领域) [N:1]
│   ├── time_slot_templates (时间模板) [1:N]
│   │   └── time_slots (具体时间段) [1:N]
│   └── appointments (预约记录) [1:N]
├── appointments (预约记录) [1:N]
└── notifications (通知) [1:N]
```

## 🛡️ 安全策略

系统采用 Supabase Row Level Security (RLS) 确保数据安全：

- 用户只能访问自己的数据
- 咨询师只能管理自己的时间段和预约
- 来访者只能查看可用时间段和自己的预约
- 所有敏感操作都需要身份验证

## 📚 API 参考

### 认证 API
- `registerUser(data)` - 用户注册
- `loginUser(data)` - 用户登录
- `logoutUser()` - 用户登出
- `getCurrentUser()` - 获取当前用户
- `updateUserProfile(updates)` - 更新用户信息

### 时间段 API
- `createTimeSlotTemplates(templates)` - 创建时间段模板
- `getCounselorTimeSlots(counselorId, filter)` - 获取时间段
- `getAvailableTimeSlots(filter)` - 获取可用时间段
- `updateTimeSlot(id, updates)` - 更新时间段
- `deleteTimeSlot(id)` - 删除时间段

### 咨询师 API
- `getCounselors(filter)` - 获取咨询师列表
- `getCounselorById(id)` - 获取咨询师详情
- `searchCounselors(keyword)` - 搜索咨询师
- `getSpecialties()` - 获取专业领域

### 预约 API
- `createAppointment(data)` - 创建预约
- `getUserAppointments(filter)` - 获取预约列表
- `confirmAppointment(id)` - 确认预约
- `cancelAppointment(id, reason)` - 取消预约
- `completeAppointment(id, notes)` - 完成预约

## 🎨 类型定义

所有 TypeScript 类型定义在 `types/database.ts` 中，确保类型安全的开发体验。

---

这套数据库设计和 API 为您的心理咨询预约系统提供了完整的后端基础，支持用户注册登录、咨询师时间段管理、预约流程等核心功能。 