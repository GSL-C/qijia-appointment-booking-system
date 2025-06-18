'use client';

import { useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserRole, CounselorFilter } from '@/types';
import { mockCounselors } from '@/lib/mockData';
import Link from 'next/link';

export default function CounselorsPage() {
  const [filter, setFilter] = useState<CounselorFilter>({});
  const [searchKeyword, setSearchKeyword] = useState('');

  // 筛选咨询师
  const filteredCounselors = mockCounselors.filter(counselor => {
    if (filter.specialty && !counselor.specialties.some(s => s.includes(filter.specialty!))) {
      return false;
    }
    if (filter.gender && counselor.gender !== filter.gender) {
      return false;
    }
    if (searchKeyword && !counselor.name.includes(searchKeyword) && 
        !counselor.bio.includes(searchKeyword) &&
        !counselor.specialties.some(s => s.includes(searchKeyword))) {
      return false;
    }
    return true;
  });

  const specialties = ['焦虑症', '抑郁症', '情感咨询', '人际关系', '青少年心理', '学习压力'];

  return (
    <Layout userRole={UserRole.VISITOR}>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">咨询师列表</h1>
          <p className="text-gray-600 mt-1">选择合适的心理咨询师，预约咨询时间</p>
        </div>

        {/* 筛选区 */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 关键词搜索 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  关键词搜索
                </label>
                <input
                  type="text"
                  placeholder="输入关键词"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              {/* 擅长领域 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  擅长领域
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filter.specialty || ''}
                  onChange={(e) => setFilter({ ...filter, specialty: e.target.value || undefined })}
                >
                  <option value="">全部领域</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              {/* 性别 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  性别
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filter.gender || ''}
                  onChange={(e) => setFilter({ ...filter, gender: e.target.value as '男' | '女' || undefined })}
                >
                  <option value="">不限</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>

              {/* 清除筛选 */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilter({});
                    setSearchKeyword('');
                  }}
                  className="w-full"
                >
                  清除筛选
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 咨询师卡片列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCounselors.map(counselor => (
            <Card key={counselor.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* 头像 */}
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* 姓名和性别 */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{counselor.name}</h3>
                      <span className="text-sm text-gray-500">{counselor.gender}</span>
                    </div>

                    {/* 擅长标签 */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {counselor.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    {/* 简介（前两行） */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {counselor.bio}
                    </p>

                    {/* 查看按钮 */}
                    <Link href={`/visitor/counselors/${counselor.id}`}>
                      <Button className="w-full">
                        查看可预约时间
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 空状态 */}
        {filteredCounselors.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到符合条件的咨询师</h3>
            <p className="text-gray-600">请尝试调整筛选条件</p>
          </div>
        )}
      </div>
    </Layout>
  );
} 