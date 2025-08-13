'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getCurrentUser, updateCounselorProfile } from '@/lib/api/auth';
import { getSpecialties } from '@/lib/api/counselors';
import { useRouter } from 'next/navigation';
import type { User, CounselorWithProfile, Specialty } from '@/types/database';

interface CounselorSettings {
  bio: string;
  gender: '男' | '女';
  qualification: string;
  experience_years: number;
  consultation_fee: number;
  specialties: string[];
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<CounselorWithProfile | null>(null);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [settings, setSettings] = useState<CounselorSettings>({
    bio: '',
    gender: '女',
    qualification: '',
    experience_years: 0,
    consultation_fee: 0,
    specialties: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 获取当前用户信息
        const userResult = await getCurrentUser();
        if (!userResult.success) {
          router.push('/');
          return;
        }

        const userData = userResult.data as CounselorWithProfile;
        if (userData.role !== 'counselor') {
          router.push('/');
          return;
        }

        setUser(userData);

        // 设置表单数据
        if (userData.counselor_profiles) {
          const profile = userData.counselor_profiles;
          setSettings({
            bio: profile.bio || '',
            gender: profile.gender,
            qualification: profile.qualification || '',
            experience_years: profile.experience_years || 0,
            consultation_fee: profile.consultation_fee || 0,
            specialties: profile.counselor_specialties?.map(cs => cs.specialties.name) || []
          });
        }

        // 获取所有专业领域
        const specialtiesResult = await getSpecialties();
        if (specialtiesResult.success && specialtiesResult.data) {
          setSpecialties(specialtiesResult.data);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        setMessage({ type: 'error', text: '加载数据失败，请刷新页面重试' });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const result = await updateCounselorProfile(settings);
      
      if (result.success) {
        setMessage({ type: 'success', text: '资料更新成功！' });
        // 更新成功后可以跳转到工作台
        setTimeout(() => {
          router.push('/counselor/schedule');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || '更新失败，请重试' });
      }
    } catch (error) {
      console.error('更新失败:', error);
      setMessage({ type: 'error', text: '更新失败，请检查网络连接' });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSpecialty = (specialtyName: string) => {
    setSettings(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialtyName)
        ? prev.specialties.filter(s => s !== specialtyName)
        : [...prev.specialties, specialtyName]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-yellow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[var(--qijia-yellow)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[var(--ink-gray)]">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-yellow p-6">
      <div className="qijia-container max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[var(--ink-black)] mb-4">
            完善咨询师资料
          </h1>
          <p className="text-[var(--ink-gray)]">
            请完善您的专业信息，让来访者更好地了解您
          </p>
        </div>

        <Card className="qijia-card">
          <CardHeader>
            <div className="text-center">
              <h2 className="qijia-title-sub text-[var(--ink-black)]">
                专业信息设置
              </h2>
              <p className="qijia-text-body text-[var(--ink-gray)] mt-2">
                填写完整的专业信息有助于提升您的可信度
              </p>
            </div>
          </CardHeader>

          <div className="qijia-divider mx-6"></div>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 个人简介 */}
              <div>
                <label className="block text-sm font-medium text-[var(--ink-black)] mb-2">
                  个人简介 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={settings.bio}
                  onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                  className="neu-input w-full h-32 resize-none"
                  placeholder="请介绍您的专业背景、从业经验、咨询理念等..."
                  required
                />
              </div>

              {/* 性别 */}
              <div>
                <label className="block text-sm font-medium text-[var(--ink-black)] mb-2">
                  性别 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="女"
                      checked={settings.gender === '女'}
                      onChange={(e) => setSettings(prev => ({ ...prev, gender: e.target.value as '女' }))}
                      className="mr-2"
                    />
                    女
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="男"
                      checked={settings.gender === '男'}
                      onChange={(e) => setSettings(prev => ({ ...prev, gender: e.target.value as '男' }))}
                      className="mr-2"
                    />
                    男
                  </label>
                </div>
              </div>

              {/* 资质证书 */}
              <div>
                <label className="block text-sm font-medium text-[var(--ink-black)] mb-2">
                  资质证书
                </label>
                <input
                  type="text"
                  value={settings.qualification}
                  onChange={(e) => setSettings(prev => ({ ...prev, qualification: e.target.value }))}
                  className="neu-input w-full"
                  placeholder="如：国家二级心理咨询师、临床心理学博士等"
                />
              </div>

              {/* 从业年限 */}
              <div>
                <label className="block text-sm font-medium text-[var(--ink-black)] mb-2">
                  从业年限 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={settings.experience_years}
                  onChange={(e) => setSettings(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                  className="neu-input w-full"
                  placeholder="请输入您的从业年限"
                  required
                />
              </div>

              {/* 咨询费用 */}
              <div>
                <label className="block text-sm font-medium text-[var(--ink-black)] mb-2">
                  咨询费用（元/小时）
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={settings.consultation_fee}
                  onChange={(e) => setSettings(prev => ({ ...prev, consultation_fee: parseInt(e.target.value) || 0 }))}
                  className="neu-input w-full"
                  placeholder="请输入您的咨询费用"
                />
              </div>

              {/* 专业领域 */}
              <div>
                <label className="block text-sm font-medium text-[var(--ink-black)] mb-2">
                  专业领域
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {specialties.map((specialty) => (
                    <label key={specialty.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.specialties.includes(specialty.name)}
                        onChange={() => toggleSpecialty(specialty.name)}
                        className="mr-2"
                      />
                      <span className="text-sm">{specialty.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-[var(--ink-gray)] mt-2">
                  选择您擅长的咨询领域，有助于匹配合适的来访者
                </p>
              </div>

              {/* 消息提示 */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}

              {/* 按钮组 */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  size="lg"
                  loading={isSaving}
                  disabled={isSaving}
                >
                  保存设置
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/counselor/schedule')}
                  disabled={isSaving}
                >
                  稍后设置
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
