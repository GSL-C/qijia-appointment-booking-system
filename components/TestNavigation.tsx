'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TestNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '首页', description: '登录注册' },
    { href: '/test-api', label: 'API测试', description: '接口测试页面' },
    { href: '/counselor/settings', label: '咨询师设置', description: '完善资料' },
    { href: '/counselor/schedule', label: '咨询师工作台', description: '时间管理' },
    { href: '/visitor/counselors', label: '寻找咨询师', description: '来访者页面' },
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-4 max-w-xs">
        <h3 className="font-semibold text-sm mb-3 text-gray-700">测试导航</h3>
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block p-2 rounded text-xs transition-colors ${
                pathname === item.href
                  ? 'bg-yellow-100 text-yellow-800 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-gray-500">{item.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 