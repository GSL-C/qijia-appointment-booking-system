'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type UserRole = 'counselor' | 'visitor';
type AuthMode = 'login' | 'register';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function AuthCard() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'visitor'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 邮箱格式验证
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 密码格式验证（≥8位且含字母数字）
  const validatePassword = (password: string): boolean => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= 8 && hasLetter && hasNumber;
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = '请输入邮箱';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '请输入正确的邮箱格式';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = '密码至少8位，需包含字母和数字';
    }

    if (authMode === 'register') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '请确认密码';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '两次密码输入不一致';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (authMode === 'login') {
        setSuccessMessage('登录成功！正在跳转...');
        // 模拟登录成功后跳转
        setTimeout(() => {
          if (formData.role === 'counselor') {
            window.location.href = '/counselor/schedule';
          } else {
            window.location.href = '/visitor/counselors';
          }
        }, 1500);
      } else {
        setSuccessMessage('注册成功！正在自动登录...');
        // 注册成功后自动登录
        setTimeout(() => {
          if (formData.role === 'counselor') {
            window.location.href = '/counselor/schedule';
          } else {
            window.location.href = '/visitor/counselors';
          }
        }, 1500);
      }
    } catch (error) {
      setErrorMessage(authMode === 'login' ? '登录失败，请检查邮箱和密码' : '注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 切换登录/注册模式
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setErrors({});
    setErrorMessage('');
    setSuccessMessage('');
    setFormData({
      ...formData,
      confirmPassword: ''
    });
  };

  return (
    <Card className="qijia-card w-full max-w-md mx-auto">
      <CardHeader>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--qijia-yellow)] to-[#f4c861] rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="qijia-title-sub text-[var(--ink-black)] mb-2">
            {authMode === 'login' ? '欢迎回来' : '加入齐家'}
          </h2>
          <p className="qijia-text-body text-[var(--ink-gray)]">
            {authMode === 'login' ? '请登录您的账户' : '创建您的专属账户'}
          </p>
        </div>
      </CardHeader>
      
      <div className="qijia-divider mx-6"></div>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 用户身份选择 - 仅在注册时显示 */}
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-[var(--ink-black)] mb-2">
                选择身份
              </label>
              <div className="grid grid-cols-2 gap-2">
                                 <button
                   type="button"
                   onClick={() => setFormData({...formData, role: 'visitor'})}
                   className={`auth-role-button p-3 rounded-lg border-2 transition-all duration-200 ${
                     formData.role === 'visitor'
                       ? 'border-[var(--qijia-yellow)] bg-[var(--qijia-yellow)] bg-opacity-10 text-[var(--ink-black)]'
                       : 'border-gray-200 hover:border-gray-300'
                   }`}
                 >
                   <div className="text-sm font-medium">来访者</div>
                   <div className="text-xs text-gray-500">寻求咨询服务</div>
                 </button>
                 <button
                   type="button"
                   onClick={() => setFormData({...formData, role: 'counselor'})}
                   className={`auth-role-button p-3 rounded-lg border-2 transition-all duration-200 ${
                     formData.role === 'counselor'
                       ? 'border-[var(--qijia-yellow)] bg-[var(--qijia-yellow)] bg-opacity-10 text-[var(--ink-black)]'
                       : 'border-gray-200 hover:border-gray-300'
                   }`}
                 >
                   <div className="text-sm font-medium">咨询师</div>
                   <div className="text-xs text-gray-500">提供咨询服务</div>
                 </button>
              </div>
            </div>
          )}

          {/* 邮箱输入 */}
          <div>
            <label className="block text-sm font-medium text-[var(--ink-black)] mb-1">
              邮箱
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`neu-input w-full ${errors.email ? 'border-red-500' : ''}`}
              placeholder="请输入您的邮箱"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* 密码输入 */}
          <div>
            <label className="block text-sm font-medium text-[var(--ink-black)] mb-1">
              密码
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className={`neu-input w-full ${errors.password ? 'border-red-500' : ''}`}
              placeholder={authMode === 'login' ? '请输入密码' : '至少8位，包含字母和数字'}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* 确认密码 - 仅在注册时显示 */}
          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-[var(--ink-black)] mb-1">
                确认密码
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className={`neu-input w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="请再次输入密码"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* 错误和成功提示 */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          {/* 提交按钮 */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isLoading}
            disabled={isLoading}
          >
            {authMode === 'login' ? '登录' : '注册'}
          </Button>

          {/* 切换登录/注册 */}
          <div className="text-center">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-sm text-[var(--ink-gray)] hover:text-[var(--ink-black)] transition-colors"
              disabled={isLoading}
            >
              {authMode === 'login' ? '还没有账户？点击注册' : '已有账户？点击登录'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 