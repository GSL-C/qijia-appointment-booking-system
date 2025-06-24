'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/types';

interface LayoutProps {
  children: ReactNode;
  userRole: UserRole;
}

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const visitorNavItems: NavItem[] = [
  {
    href: '/visitor/counselors',
    label: '咨询师列表',
    icon: <UserIcon />
  },
  {
    href: '/visitor/my-appointments',
    label: '我的预约',
    icon: <CalendarIcon />
  },
  {
    href: '/visitor/settings',
    label: '账户设置',
    icon: <SettingsIcon />
  }
];

const counselorNavItems: NavItem[] = [
  {
    href: '/counselor/schedule',
    label: '我的日程',
    icon: <CalendarIcon />
  },
  {
    href: '/counselor/requests',
    label: '预约请求列表',
    icon: <InboxIcon />
  },
  {
    href: '/counselor/settings',
    label: '账户设置',
    icon: <SettingsIcon />
  }
];

// 简单的图标组件
function UserIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

export function Layout({ children, userRole }: LayoutProps) {
  const pathname = usePathname();
  const navItems = userRole === UserRole.VISITOR ? visitorNavItems : counselorNavItems;

  return (
    <div className="flex h-screen bg-[var(--hu-powder-white)]">
      {/* 左侧导航栏 */}
      <div className="w-64 bg-white shadow-lg m-4 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          {/* 齐家品牌标志 */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-2">
              <img src="/qijia-logo.svg" alt="齐家" className="w-12 h-12" />
            </div>
            <h1 className="qijia-title-sub text-[var(--ink-black)]">齐家</h1>
          </div>
          <p className="qijia-text-helper text-center text-[var(--ink-gray)]">
            {userRole === UserRole.VISITOR ? '来访者服务台' : '咨询师工作台'}
          </p>
        </div>
        
        <nav className="mt-4">
          <div className="space-y-2 px-4 pb-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 qijia-text-body rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-[var(--qijia-yellow)] text-[#222222] shadow-md'
                      : 'text-[#222222] hover:bg-[#f9f9f9]'
                  )}
                >
                  <span className={cn('mr-3', isActive ? 'text-[#222222]' : 'text-[#666666]')}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* 返回首页按钮 */}
        <div className="p-4 border-t border-gray-100">
          <Link href="/" className="flex items-center px-4 py-2 qijia-text-body text-[#666666] hover:text-[#222222] transition-colors">
            <HomeIcon />
            <span className="ml-3">返回首页</span>
          </Link>
        </div>
      </div>

      {/* 右侧主内容区 */}
      <div className="flex-1 overflow-auto p-4">
        <main className="bg-white rounded-lg shadow-sm p-6 h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 