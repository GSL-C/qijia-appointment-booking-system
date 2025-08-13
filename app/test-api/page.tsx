'use client';

import { useState } from 'react';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '@/lib/api/auth';
import { createTimeSlotTemplates, getCounselorTimeSlots } from '@/lib/api/timeSlots';
import { getCounselors } from '@/lib/api/counselors';

interface TestResult {
  name: string;
  success: boolean;
  message: string;
  data?: any;
}

export default function TestAPIPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  
  // 测试数据
  const testCounselor = {
    email: 'testcounselor@gmail.com',
    password: 'test123456',
    name: '测试导师',
    phone: '13800138000',
    role: 'counselor' as const,
    counselorInfo: {
      bio: '我是一名专业的心理咨询师，具有丰富的咨询经验。',
      gender: '女' as const,
      qualification: '国家二级心理咨询师',
      experience_years: 5,
      consultation_fee: 200,
      specialties: ['焦虑症', '抑郁症']
    }
  };

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      // 测试1: 用户注册
      addResult({ name: '开始测试', success: true, message: '🚀 开始 API 接口测试...' });
      
      try {
        const registerResult = await registerUser(testCounselor);
        addResult({
          name: '用户注册',
          success: registerResult.success,
          message: registerResult.success ? '✅ 注册成功' : `❌ 注册失败: ${registerResult.error}`,
          data: registerResult.data
        });

        if (!registerResult.success) {
          addResult({ name: '测试终止', success: false, message: '❌ 注册失败，终止测试' });
          return;
        }
      } catch (error: any) {
        addResult({
          name: '用户注册',
          success: false,
          message: `❌ 注册异常: ${error.message}`,
        });
        return;
      }

      // 测试2: 用户登录
      try {
        const loginResult = await loginUser({
          email: testCounselor.email,
          password: testCounselor.password
        });
        
        addResult({
          name: '用户登录',
          success: loginResult.success,
          message: loginResult.success 
            ? `✅ 登录成功: ${loginResult.data?.user.name}` 
            : `❌ 登录失败: ${loginResult.error}`,
          data: loginResult.data
        });

        if (!loginResult.success) {
          addResult({ name: '测试终止', success: false, message: '❌ 登录失败，终止测试' });
          return;
        }
      } catch (error: any) {
        addResult({
          name: '用户登录',
          success: false,
          message: `❌ 登录异常: ${error.message}`,
        });
        return;
      }

      // 测试3: 获取当前用户
      try {
        const currentUserResult = await getCurrentUser();
        addResult({
          name: '获取当前用户',
          success: currentUserResult.success,
          message: currentUserResult.success 
            ? `✅ 获取成功: ${currentUserResult.data?.name} (${currentUserResult.data?.role})` 
            : `❌ 获取失败: ${currentUserResult.error}`,
          data: currentUserResult.data
        });
      } catch (error: any) {
        addResult({
          name: '获取当前用户',
          success: false,
          message: `❌ 获取异常: ${error.message}`,
        });
      }

      // 测试4: 创建时间段模板
      try {
        const templates = [
          {
            day_of_week: 1, // 周一
            start_time: '09:00',
            end_time: '10:00',
            repeat_type: 'weekly' as const,
            is_active: true
          },
          {
            day_of_week: 1, // 周一
            start_time: '14:00',
            end_time: '15:00',
            repeat_type: 'weekly' as const,
            is_active: true
          },
          {
            day_of_week: 3, // 周三
            start_time: '10:00',
            end_time: '11:00',
            repeat_type: 'weekly' as const,
            is_active: true
          }
        ];

        const templateResult = await createTimeSlotTemplates(templates);
        addResult({
          name: '创建时间段模板',
          success: templateResult.success,
          message: templateResult.success 
            ? `✅ 创建成功: ${templateResult.data?.length}个模板` 
            : `❌ 创建失败: ${templateResult.error}`,
          data: templateResult.data
        });
      } catch (error: any) {
        addResult({
          name: '创建时间段模板',
          success: false,
          message: `❌ 创建异常: ${error.message}`,
        });
      }

      // 测试5: 获取时间段
      try {
        const timeSlotsResult = await getCounselorTimeSlots();
        addResult({
          name: '获取时间段',
          success: timeSlotsResult.success,
          message: timeSlotsResult.success 
            ? `✅ 获取成功: ${timeSlotsResult.data?.length}个时间段` 
            : `❌ 获取失败: ${timeSlotsResult.error}`,
          data: timeSlotsResult.data?.slice(0, 5) // 只显示前5个
        });
      } catch (error: any) {
        addResult({
          name: '获取时间段',
          success: false,
          message: `❌ 获取异常: ${error.message}`,
        });
      }

      // 测试6: 获取咨询师列表
      try {
        const counselorsResult = await getCounselors();
        addResult({
          name: '获取咨询师列表',
          success: counselorsResult.success,
          message: counselorsResult.success 
            ? `✅ 获取成功: ${counselorsResult.data?.length}位咨询师` 
            : `❌ 获取失败: ${counselorsResult.error}`,
          data: counselorsResult.data?.slice(0, 3) // 只显示前3个
        });
      } catch (error: any) {
        addResult({
          name: '获取咨询师列表',
          success: false,
          message: `❌ 获取异常: ${error.message}`,
        });
      }

      // 测试完成
      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;
      addResult({
        name: '测试完成',
        success: true,
        message: `🎉 测试完成! 成功率: ${successCount}/${totalCount} (${Math.round(successCount/totalCount*100)}%)`
      });

    } catch (error: any) {
      addResult({
        name: '测试异常',
        success: false,
        message: `❌ 测试过程中发生异常: ${error.message}`
      });
    } finally {
      // 清理
      try {
        await logoutUser();
        addResult({ name: '清理', success: true, message: '✅ 已登出用户' });
      } catch (error: any) {
        addResult({ name: '清理', success: false, message: `⚠️ 清理失败: ${error.message}` });
      }
      
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API 接口测试</h1>
      
      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-semibold ${
            isRunning 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRunning ? '🔄 测试中...' : '🚀 开始测试'}
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">测试结果</h2>
        
        {results.length === 0 && !isRunning && (
          <p className="text-gray-500">点击"开始测试"按钮运行 API 测试</p>
        )}
        
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{result.name}</h3>
              <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                {result.success ? '✅' : '❌'}
              </span>
            </div>
            
            <p className={`mt-2 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.message}
            </p>
            
            {result.data && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  查看数据详情
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
        
        {isRunning && (
          <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="text-blue-700">正在运行测试...</span>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">测试说明</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 测试导师用户注册功能</li>
          <li>• 测试用户登录和认证</li>
          <li>• 测试获取当前用户信息</li>
          <li>• 测试创建时间段模板</li>
          <li>• 测试获取咨询师时间段</li>
          <li>• 测试获取咨询师列表</li>
        </ul>
      </div>
    </div>
  );
} 