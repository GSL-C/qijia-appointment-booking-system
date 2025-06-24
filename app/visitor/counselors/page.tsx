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
        <div className="border-b border-gray-100 pb-4">
          <h1 className="qijia-title-sub text-[#222222]">专业咨询师</h1>
          <p className="qijia-text-body text-[#333333] mt-2">寻找适合的心理咨询师，开启心灵对话</p>
        </div>

        {/* 筛选区 */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 关键词搜索 */}
              <div>
                <label className="block qijia-text-body font-medium text-[#222222] mb-2">
                  关键词搜索
                </label>
                <input
                  type="text"
                  placeholder="输入姓名或专长"
                  className="w-full px-3 py-2 border-0 border-b-2 border-[#DDDDDD] bg-transparent focus:outline-none focus:border-[var(--qijia-yellow)] transition-colors qijia-text-body text-[#333333]"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              {/* 擅长领域 */}
              <div>
                <label className="block qijia-text-body font-medium text-[#222222] mb-2">
                  擅长领域
                </label>
                <select
                  className="w-full px-3 py-2 border-0 border-b-2 border-[#DDDDDD] bg-transparent focus:outline-none focus:border-[var(--qijia-yellow)] transition-colors qijia-text-body text-[#333333]"
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
                <label className="block qijia-text-body font-medium text-[#222222] mb-2">
                  性别
                </label>
                <select
                  className="w-full px-3 py-2 border-0 border-b-2 border-[#DDDDDD] bg-transparent focus:outline-none focus:border-[var(--qijia-yellow)] transition-colors qijia-text-body text-[#333333]"
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
            <Card key={counselor.id} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* 头像 */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[var(--qijia-yellow)] to-[#f4c861] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-8 h-8 text-[#222222]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* 姓名和性别 */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="qijia-title-sub text-[#222222]">{counselor.name}</h3>
                      <span className="qijia-text-helper text-[#666666]">{counselor.gender}</span>
                    </div>

                    {/* 擅长标签 */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {counselor.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="qijia-tag"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    {/* 简介（前两行） */}
                    <p className="qijia-text-body text-[#333333] line-clamp-2 mb-4">
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
            <div className="w-16 h-16 bg-[#f9f9f9] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="qijia-title-sub text-[#222222] mb-2">未找到符合条件的咨询师</h3>
            <p className="qijia-text-body text-[#333333]">请尝试调整筛选条件，或联系客服获得帮助</p>
          </div>
        )}
      </div>
    </Layout>
  );
} 