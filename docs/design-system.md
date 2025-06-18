# 设计系统

# Time Appointment - 设计系统文档

## 🧭 产品品牌调性 Brand Essence

- **产品类型**：心理咨询预约 × 时间管理
- **用户定位**：来访者（焦虑低、操作直观）、专业咨询师（效率高、可控）
- **视觉调性**：安心、克制、柔和、可信赖
- **参考风格**：Google Calendar + Calm + Stripe Dashboard

---

## 🌈 颜色 Color Palette

| Token | Hex | 用途说明 |
| --- | --- | --- |
| **Primary** | #437EF7 | 主操作按钮、选中状态 |
| **Accent** | #3DD68C | 正向反馈（确认成功、可预约） |
| **Danger** | #EF4444 | 错误、删除、取消提醒 |
| **Warning** | #F59E0B | 24 h 规则提示、待确认 |
| **Background** | #F8FAFC | 页面背景（浅灰） |
| **Surface / Card** | #FFFFFF | 面板、卡片底色 |
| **Text Primary** | #1E293B | 标题 / 核心信息 |
| **Text Secondary** | #64748B | 说明 / 次要信息 |
| **Border** | #E2E8F0 | 分隔线 / 输入框边框 |
| **Disabled** | #CBD5E1 | 禁用按钮、不可选时段填充 |

---

## 🧾 字体 Typography

| 层级 | 示例 | 用法 |
| --- | --- | --- |
| **H1** | 32 px / Bold | 页面主标题（如“我的日程”） |
| **H2** | 24 px / SemiBold | 面板 / 卡片标题 |
| **H3** | 20 px / SemiBold | 时间段、标签小标题 |
| **Body** | 16 px / Regular | 常规正文 |
| **Sub** | 14 px / Medium | 说明、辅助文字 |
| **Caption** | 12 px / Regular | 时间戳、占位提示 |

**字体推荐**：Inter / Noto Sans SC

---

## ✨ 动效 Micro-Interactions

| 场景 | 动效说明 |
| --- | --- |
| 新建空闲时段 | Time Slot Chip 弹入 + 小幅缩放放大 |
| 确认预约成功 | Appointment Card 滑入 + Accent 闪光边框 300 ms |
| 24 h 取消限制 | 按钮禁用时轻微晃动 + Warning 颜色闪烁 |
| 切换周 / 月视图 | Calendar Grid 网格淡入淡出过渡 200 ms |
| 侧边栏切换 | 选中项背景滑块平滑过渡至新标签 |

---

## 🧱 间距 & 大小 Layout Spacing & Sizing

- **8 px 网格**：所有尺寸、间距均为 8 的倍数
- **页面内边距**：24 px（Desktop） / 16 px（Mobile Web）
- **卡片圆角**：16 px
- **按钮高度**：48 px；FAB 56 px
- **Sidebar 宽度**：240 px
- **图标尺寸**：20–24 px，保持一致视觉重量
