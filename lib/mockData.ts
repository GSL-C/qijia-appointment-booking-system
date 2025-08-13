import { Counselor, Visitor, TimeSlot, Appointment, AppointmentRequest, UserRole, AppointmentStatus, RepeatType } from '@/types';
import { addDays, addHours, startOfDay } from 'date-fns';

// 模拟咨询师数据
export const mockCounselors: Counselor[] = [
  {
    id: '1',
    name: '李心理',
    role: UserRole.COUNSELOR,
    avatar: '/avatars/counselor1.jpg',
    bio: '拥有10年心理咨询经验，专注于焦虑症、抑郁症的认知行为治疗。温和细致的咨询风格深受来访者信赖。',
    specialties: ['焦虑症', '抑郁症', '认知行为治疗'],
    gender: '女'
  },
  {
    id: '2',
    name: '王医生',
    role: UserRole.COUNSELOR,
    avatar: '/avatars/counselor2.jpg',
    bio: '心理学博士，擅长情感咨询和人际关系问题。采用人本主义和家庭系统治疗方法。',
    specialties: ['情感咨询', '人际关系', '婚姻家庭'],
    gender: '男'
  },
  {
    id: '3',
    name: '张咨询师',
    role: UserRole.COUNSELOR,
    avatar: '/avatars/counselor3.jpg',
    bio: '青少年心理专家，在校园心理健康、学习压力、青春期问题方面有丰富经验。',
    specialties: ['青少年心理', '学习压力', '考试焦虑'],
    gender: '女'
  },
];

// 模拟来访者数据
export const mockVisitors: Visitor[] = [
  {
    id: 'v1',
    name: '小明',
    role: UserRole.VISITOR,
    avatar: '/avatars/visitor1.jpg'
  },
  {
    id: 'v2', 
    name: '小红',
    role: UserRole.VISITOR,
    avatar: '/avatars/visitor2.jpg'
  }
];

// 生成时间段数据
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = startOfDay(new Date());

  mockCounselors.forEach(counselor => {
    // 为每个咨询师生成未来两周的可用时间段
    for (let day = 1; day <= 14; day++) {
      const currentDay = addDays(today, day);
      
      // 每天生成几个时间段
      [9, 14, 16, 19].forEach((hour, index) => {
        const startTime = addHours(currentDay, hour);
        const endTime = addHours(startTime, 1);
        
        slots.push({
          id: `${counselor.id}-${day}-${index}`,
          startTime,
          endTime,
          counselorId: counselor.id,
          isAvailable: Math.random() > 0.3, // 70%的概率可用
          repeatType: RepeatType.NONE
        });
      });
    }
  });

  return slots;
};

export const mockTimeSlots = generateTimeSlots();

// 模拟预约数据
export const mockAppointments: Appointment[] = [
  {
    id: 'app1',
    counselorId: '1',
    visitorId: 'v1',
    timeSlot: mockTimeSlots[0],
    status: AppointmentStatus.CONFIRMED,
    notes: '最近工作压力很大，经常失眠',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'app2',
    counselorId: '2',
    visitorId: 'v1',
    timeSlot: mockTimeSlots[5],
    status: AppointmentStatus.PENDING,
    notes: '想聊聊感情问题',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  }
];

// 模拟预约请求数据
export const mockAppointmentRequests: AppointmentRequest[] = [
  {
    id: 'req1',
    counselorId: '1',
    visitorId: 'v2',
    visitor: mockVisitors[1],
    timeSlot: mockTimeSlots[10],
    status: AppointmentStatus.PENDING,
    notes: '希望能够帮助我处理社交焦虑',
    createdAt: new Date('2024-01-17')
  },
  {
    id: 'req2',
    counselorId: '3',
    visitorId: 'v1',
    visitor: mockVisitors[0],
    timeSlot: mockTimeSlots[15],
    status: AppointmentStatus.PENDING,
    notes: '孩子学习压力问题咨询',
    createdAt: new Date('2024-01-18')
  }
];

// 当前用户（用于演示）
export const currentUser: Visitor = mockVisitors[0];
export const currentCounselor: Counselor = mockCounselors[0]; 