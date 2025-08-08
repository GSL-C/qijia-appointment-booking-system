# 🗄️ 齐家心理咨询预约系统 - 数据库设计文档

## 📋 概述

本文档描述了齐家心理咨询预约系统的完整数据库设计方案，包含9个核心表，支持咨询师排班、来访者预约、通知管理等核心功能。

---

## 🏗️ 数据库表结构

### 1. 👤 用户表 `users`

**表说明**：存储所有用户（咨询师和来访者）的基础信息

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `id` | VARCHAR(36) | PRIMARY KEY | 用户唯一标识 |
| `name` | VARCHAR(100) | NOT NULL | 用户姓名 |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | 邮箱地址 |
| `password_hash` | VARCHAR(255) | NOT NULL | 密码哈希值 |
| `phone` | VARCHAR(20) | - | 手机号码 |
| `avatar` | VARCHAR(500) | - | 头像URL |
| `role` | ENUM | NOT NULL | 用户角色：'visitor'(来访者) / 'counselor'(咨询师) |
| `created_at` | TIMESTAMP | DEFAULT NOW | 创建时间 |
| `updated_at` | TIMESTAMP | AUTO UPDATE | 更新时间 |
| `deleted_at` | TIMESTAMP | NULL | 软删除时间 |

---

### 2. 🧠 咨询师扩展信息表 `counselor_profiles`

**表说明**：存储咨询师的专业信息和认证状态

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `id` | VARCHAR(36) | PRIMARY KEY | 档案唯一标识 |
| `user_id` | VARCHAR(36) | NOT NULL, FK | 关联用户ID |
| `bio` | TEXT | - | 个人简介 |
| `gender` | ENUM | NOT NULL | 性别：'男' / '女' |
| `qualification` | VARCHAR(500) | - | 资质证书 |
| `experience_years` | INT | DEFAULT 0 | 从业年限 |
| `consultation_fee` | DECIMAL(8,2) | - | 咨询费用 |
| `is_verified` | BOOLEAN | DEFAULT FALSE | 是否认证 |
| `created_at` | TIMESTAMP | DEFAULT NOW | 创建时间 |
| `updated_at` | TIMESTAMP | AUTO UPDATE | 更新时间 |

---

### 3. 🏷️ 专业领域表 `specialties`

**表说明**：存储咨询师的专业领域分类

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `id` | VARCHAR(36) | PRIMARY KEY | 专业领域唯一标识 |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | 专业领域名称 |
| `description` | TEXT | - | 专业领域描述 |
| `created_at` | TIMESTAMP | DEFAULT NOW | 创建时间 |

**预设数据示例**：
- 焦虑症
- 抑郁症  
- 情感咨询
- 人际关系
- 青少年心理
- 学习压力

---

### 4. 🔗 咨询师专业领域关联表 `counselor_specialties`

**表说明**：多对多关联，咨询师可有多个专业领域

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `counselor_id` | VARCHAR(36) | NOT NULL, FK | 咨询师档案ID |
| `specialty_id` | VARCHAR(36) | NOT NULL, FK | 专业领域ID |

**复合主键**：(`counselor_id`, `specialty_id`)

---

### 5. 📅 时间段模板表 `time_slot_templates`

**表说明**：咨询师设置的重复时间模板，用于自动生成未来时间段

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `id` | VARCHAR(36) | PRIMARY KEY | 模板唯一标识 |
| `counselor_id` | VARCHAR(36) | NOT NULL, FK | 咨询师档案ID |
| `day_of_week` | TINYINT | NOT NULL | 星期几：0=周日, 1=周一...6=周六 |
| `start_time` | TIME | NOT NULL | 开始时间 |
| `end_time` | TIME | NOT NULL | 结束时间 |
| `repeat_type` | ENUM | DEFAULT 'weekly' | 重复类型：'none'/'weekly'/'biweekly' |
| `is_active` | BOOLEAN | DEFAULT TRUE | 是否启用 |
| `created_at` | TIMESTAMP | DEFAULT NOW | 创建时间 |
| `updated_at` | TIMESTAMP | AUTO UPDATE | 更新时间 |

**使用场景**：咨询师设置"每周二 14:00-15:00 开放预约"

---

### 6. ⏰ 具体时间段表 `time_slots`

**表说明**：具体的可预约时间段，由模板自动生成或手动添加

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `id` | VARCHAR(36) | PRIMARY KEY | 时间段唯一标识 |
| `counselor_id` | VARCHAR(36) | NOT NULL, FK | 咨询师档案ID |
| `template_id` | VARCHAR(36) | FK | 关联模板ID（手动添加为NULL） |
| `start_time` | DATETIME | NOT NULL | 开始时间 |
| `end_time` | DATETIME | NOT NULL | 结束时间 |
| `is_available` | BOOLEAN | DEFAULT TRUE | 是否可预约 |
| `max_appointments` | INT | DEFAULT 1 | 最大预约数（支持团体咨询） |
| `created_at` | TIMESTAMP | DEFAULT NOW | 创建时间 |
| `updated_at` | TIMESTAMP | AUTO UPDATE | 更新时间 |

**索引**：
- `idx_counselor_time` (counselor_id, start_time)
- `idx_available_time` (is_available, start_time)

---

### 7. 📝 预约表 `appointments`

**表说明**：核心预约记录，包含完整的预约生命周期

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `id` | VARCHAR(36) | PRIMARY KEY | 预约唯一标识 |
| `counselor_id` | VARCHAR(36) | NOT NULL, FK | 咨询师档案ID |
| `visitor_id` | VARCHAR(36) | NOT NULL, FK | 来访者用户ID |
| `time_slot_id` | VARCHAR(36) | NOT NULL, FK | 时间段ID |
| `status` | ENUM | NOT NULL | 预约状态 |
| `visitor_notes` | TEXT | - | 来访者备注 |
| `counselor_notes` | TEXT | - | 咨询师备注 |
| `cancel_reason` | TEXT | - | 取消原因 |
| `cancelled_by` | ENUM | - | 取消方：'visitor'/'counselor'/'system' |
| `cancelled_at` | TIMESTAMP | NULL | 取消时间 |
| `confirmed_at` | TIMESTAMP | NULL | 确认时间 |
| `created_at` | TIMESTAMP | DEFAULT NOW | 创建时间 |
| `updated_at` | TIMESTAMP | AUTO UPDATE | 更新时间 |

**预约状态流转**：
```
pending (待确认) 
    ↓
confirmed (已确认) 
    ↓
completed (已完成)

任何状态都可以 → cancelled (已取消)
```

**索引**：
- `idx_visitor_appointments` (visitor_id, created_at)
- `idx_counselor_appointments` (counselor_id, created_at)
- `idx_status_time` (status, created_at)

---

### 8. 🔔 通知表 `notifications`

**表说明**：系统通知记录，支持预约相关的各种提醒

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `id` | VARCHAR(36) | PRIMARY KEY | 通知唯一标识 |
| `user_id` | VARCHAR(36) | NOT NULL, FK | 接收用户ID |
| `appointment_id` | VARCHAR(36) | FK | 关联预约ID |
| `type` | ENUM | NOT NULL | 通知类型 |
| `title` | VARCHAR(255) | NOT NULL | 通知标题 |
| `content` | TEXT | - | 通知内容 |
| `is_read` | BOOLEAN | DEFAULT FALSE | 是否已读 |
| `created_at` | TIMESTAMP | DEFAULT NOW | 创建时间 |

**通知类型**：
- `appointment_request` - 新预约请求
- `appointment_confirmed` - 预约已确认
- `appointment_cancelled` - 预约已取消
- `reminder` - 预约提醒

**索引**：`idx_user_notifications` (user_id, is_read, created_at)

---

### 9. ⚙️ 系统设置表 `system_settings`

**表说明**：存储系统配置参数

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `id` | VARCHAR(36) | PRIMARY KEY | 设置唯一标识 |
| `setting_key` | VARCHAR(100) | UNIQUE, NOT NULL | 设置键名 |
| `setting_value` | TEXT | - | 设置值 |
| `description` | VARCHAR(255) | - | 设置说明 |
| `updated_at` | TIMESTAMP | AUTO UPDATE | 更新时间 |

**预设配置**：
- `cancel_hour_limit: 24` - 预约取消时间限制（小时）
- `auto_generate_days: 30` - 自动生成时间段的天数
- `reminder_hours: 2` - 预约提醒提前时间（小时）

---

## 🔄 表关系图

```
users (用户表)
├── counselor_profiles (咨询师信息) [1:1]
│   ├── counselor_specialties (专业关联) [1:N]
│   │   └── specialties (专业领域) [N:1]
│   ├── time_slot_templates (时间模板) [1:N]
│   │   └── time_slots (具体时间段) [1:N]
│   └── appointments (预约记录) [1:N]
├── appointments (预约记录) [1:N]
│   ├── time_slots (时间段) [N:1]
│   └── notifications (通知) [1:N]
└── notifications (通知) [1:N]
```

---

## 💡 核心业务逻辑

### 🔄 自动时间段生成
1. 咨询师在 `time_slot_templates` 设置重复模板
2. 定时任务扫描活跃模板，自动生成 `time_slots` 记录
3. 生成的时间段通过 `template_id` 关联原模板

### ⏱️ 24小时取消规则
```sql
-- 判断是否可以取消预约
SELECT 
    TIMESTAMPDIFF(HOUR, NOW(), ts.start_time) > 24 as can_cancel
FROM appointments a
JOIN time_slots ts ON a.time_slot_id = ts.id
WHERE a.id = '预约ID';
```

### 📊 预约状态管理
- **pending**: 来访者发起预约，等待咨询师确认
- **confirmed**: 咨询师确认预约，时间段被锁定
- **cancelled**: 任意一方取消预约
- **completed**: 预约时间结束，咨询完成
- **no_show**: 来访者未到场

---

## 🚀 性能优化策略

### 📈 索引策略
- **时间查询优化**: `(counselor_id, start_time)` 组合索引
- **用户预约历史**: `(user_id, created_at)` 组合索引
- **状态筛选**: `(status, created_at)` 组合索引

### 💾 缓存策略
- 热点咨询师的可用时间段缓存 (Redis)
- 专业领域字典数据缓存
- 用户基础信息缓存

### 📦 数据分区
- `appointments` 表按月分区
- `time_slots` 表按季度分区
- 历史数据定期归档

---

## 🛡️ 数据完整性

### 外键约束
- 确保数据引用完整性
- 级联删除策略（CASCADE/SET NULL）

### 业务规则验证
- 时间段：`end_time > start_time`
- 预约：不能预约已过期的时间段
- 取消：遵循24小时限制规则

### 软删除机制
- 用户表支持软删除 (`deleted_at`)
- 保留历史预约记录完整性

---

## 📝 初始化数据示例

```sql
-- 专业领域初始数据
INSERT INTO specialties (id, name, description) VALUES 
('spec-anxiety', '焦虑症', '焦虑障碍的心理咨询与治疗'),
('spec-depression', '抑郁症', '抑郁情绪的识别、干预与康复'),
('spec-relationship', '情感咨询', '恋爱关系、婚姻问题咨询'),
('spec-interpersonal', '人际关系', '社交技巧、人际冲突处理'),
('spec-adolescent', '青少年心理', '青春期心理发展与问题应对'),
('spec-academic', '学习压力', '学业焦虑、考试压力管理');

-- 系统设置初始数据
INSERT INTO system_settings (id, setting_key, setting_value, description) VALUES
('config-cancel-limit', 'cancel_hour_limit', '24', '预约取消时间限制（小时）'),
('config-auto-generate', 'auto_generate_days', '30', '自动生成时间段的天数'),
('config-reminder', 'reminder_hours', '2', '预约提醒提前时间（小时）'),
('config-slot-duration', 'default_slot_duration', '60', '默认咨询时长（分钟）');
```

---

*本文档将随着系统需求变化而持续更新* 