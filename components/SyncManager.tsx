'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/UI'
import { RefreshCw, CheckCircle2, XCircle, Info, Clock, AlertTriangle, Settings, CloudUpload, CloudDownload, Loader2, Network, Database, Server } from 'lucide-react'
import { syncService } from '@/lib/syncService'

interface SyncManagerProps {
  className?: string
}

export default function SyncManager({ className }: SyncManagerProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error' | 'syncing'>('idle')
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  const [hasFeishuConfig, setHasFeishuConfig] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')
  const [syncProgress, setSyncProgress] = useState(0)
  const [syncStep, setSyncStep] = useState('')

  // 初始化同步服务
  useEffect(() => {
    syncService.init()
    updateLastSyncTime()
    checkFeishuConfig()
  }, [])

  // 检查飞书配置
  const checkFeishuConfig = () => {
    const hasConfig = syncService.hasFeishuConfig()
    setHasFeishuConfig(hasConfig)
  }

  // 更新最后同步时间
  const updateLastSyncTime = () => {
    const time = syncService.getLastSyncTime()
    setLastSyncTime(time)
  }

  // 同步到飞书
  const handleSyncToFeishu = async () => {
    if (isSyncing) return

    // 检查飞书配置
    if (!hasFeishuConfig) {
      setSyncStatus('error')
      setSyncMessage('飞书配置未设置，请先在飞书配置页面填写配置信息')
      setTimeout(() => {
        setSyncStatus('idle')
        setSyncMessage('')
      }, 3000)
      return
    }

    setIsSyncing(true)
    setSyncStatus('syncing')
    setSyncMessage('开始同步到飞书...')
    setSyncProgress(0)
    setSyncStep('准备同步')

    try {
      console.log('开始同步到飞书')
      
      // 模拟同步进度
      const progressSteps = [
        { step: '同步AI工具', progress: 20 },
        { step: '同步书籍', progress: 40 },
        { step: '同步美食', progress: 60 },
        { step: '同步课程', progress: 80 },
        { step: '同步健康记录', progress: 100 }
      ]

      // 启动进度更新
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => {
          const nextStep = progressSteps.find(step => step.progress > prev)
          if (nextStep) {
            setSyncStep(nextStep.step)
            return nextStep.progress
          }
          return prev
        })
      }, 1000)

      const success = await syncService.syncAllToFeishu()
      
      clearInterval(progressInterval)
      setSyncProgress(100)
      setSyncStep('同步完成')

      if (success) {
        setSyncStatus('success')
        setSyncMessage('同步到飞书成功！')
        updateLastSyncTime()
      } else {
        setSyncStatus('error')
        setSyncMessage('同步到飞书失败，请检查网络连接和飞书配置')
      }
    } catch (error) {
      console.error('同步到飞书失败:', error)
      setSyncStatus('error')
      setSyncMessage(`同步到飞书失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setIsSyncing(false)
      // 3秒后重置同步状态
      setTimeout(() => {
        setSyncStatus('idle')
        setSyncMessage('')
        setSyncProgress(0)
        setSyncStep('')
      }, 3000)
    }
  }

  // 从飞书同步
  const handleSyncFromFeishu = async () => {
    if (isSyncing) return

    // 检查飞书配置
    if (!hasFeishuConfig) {
      setSyncStatus('error')
      setSyncMessage('飞书配置未设置，请先在飞书配置页面填写配置信息')
      setTimeout(() => {
        setSyncStatus('idle')
        setSyncMessage('')
      }, 3000)
      return
    }

    setIsSyncing(true)
    setSyncStatus('syncing')
    setSyncMessage('开始从飞书同步...')
    setSyncProgress(0)
    setSyncStep('准备同步')

    try {
      console.log('开始从飞书同步')
      
      // 模拟同步进度
      const progressSteps = [
        { step: '同步AI工具', progress: 20 },
        { step: '同步书籍', progress: 40 },
        { step: '同步美食', progress: 60 },
        { step: '同步课程', progress: 80 },
        { step: '同步健康记录', progress: 100 }
      ]

      // 启动进度更新
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => {
          const nextStep = progressSteps.find(step => step.progress > prev)
          if (nextStep) {
            setSyncStep(nextStep.step)
            return nextStep.progress
          }
          return prev
        })
      }, 1000)

      const success = await syncService.syncAllFromFeishu()
      
      clearInterval(progressInterval)
      setSyncProgress(100)
      setSyncStep('同步完成')

      if (success) {
        setSyncStatus('success')
        setSyncMessage('从飞书同步成功！')
        updateLastSyncTime()
      } else {
        setSyncStatus('error')
        setSyncMessage('从飞书同步失败，请检查网络连接和飞书配置')
      }
    } catch (error) {
      console.error('从飞书同步失败:', error)
      setSyncStatus('error')
      setSyncMessage(`从飞书同步失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setIsSyncing(false)
      // 3秒后重置同步状态
      setTimeout(() => {
        setSyncStatus('idle')
        setSyncMessage('')
        setSyncProgress(0)
        setSyncStep('')
      }, 3000)
    }
  }

  // 格式化时间
  const formatTime = (timeStr: string): string => {
    try {
      const date = new Date(timeStr)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch (error) {
      return timeStr
    }
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Settings size={24} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">飞书同步管理</h2>
        </div>
        <p className="text-gray-500">同步本地数据与飞书多维表格，保持数据一致性</p>
      </div>

      {/* 同步状态 */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Clock size={22} className="text-blue-500" />
            <span className="text-gray-700 font-medium">最后同步时间</span>
          </div>
          <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
            {lastSyncTime ? formatTime(lastSyncTime) : '从未同步'}
          </span>
        </div>
      </div>

      {/* 飞书配置状态 */}
      {!hasFeishuConfig && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-medium mb-1">飞书配置未设置</p>
              <p>请先在飞书配置页面填写正确的配置信息，包括App ID、App Secret、多维表格ID和工作表ID</p>
            </div>
          </div>
        </div>
      )}

      {/* 同步按钮 */}
      <div className="space-y-4">
        <button
          onClick={handleSyncToFeishu}
          disabled={isSyncing || !hasFeishuConfig}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSyncing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>同步中...</span>
            </>
          ) : (
            <>
              <CloudUpload size={20} />
              <span>同步到飞书</span>
            </>
          )}
        </button>

        <button
          onClick={handleSyncFromFeishu}
          disabled={isSyncing || !hasFeishuConfig}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {isSyncing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>同步中...</span>
            </>
          ) : (
            <>
              <CloudDownload size={20} />
              <span>从飞书同步</span>
            </>
          )}
        </button>
      </div>

      {/* 同步进度条 */}
      {syncStatus === 'syncing' && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-700">{syncStep}</span>
            <span className="text-sm font-medium text-blue-700">{syncProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${syncProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 同步结果 */}
      {syncStatus === 'success' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 shadow-sm">
          <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
          <p className="text-green-700 font-medium">{syncMessage || '同步成功！'}</p>
        </div>
      )}

      {syncStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 shadow-sm">
          <XCircle size={24} className="text-red-600 flex-shrink-0" />
          <p className="text-red-700 font-medium">{syncMessage || '同步失败，请检查飞书配置是否正确'}</p>
        </div>
      )}

      {/* 同步进行中消息 */}
      {syncStatus === 'syncing' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3 shadow-sm">
          <Network size={24} className="text-blue-600 flex-shrink-0 animate-pulse" />
          <p className="text-blue-700 font-medium">{syncMessage || '同步中，请稍候...'}</p>
        </div>
      )}

      {/* 同步说明 */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-700">
            <p className="font-medium mb-2">同步说明：</p>
            <ul className="list-disc pl-5 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-medium">同步到飞书：</span>
                <span>将本地数据上传到飞书多维表格，覆盖飞书端数据</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">从飞书同步：</span>
                <span>从飞书多维表格下载数据到本地，覆盖本地数据</span>
              </li>
              <li>请确保飞书配置页面已填写正确的配置信息</li>
              <li>同步过程中请勿刷新页面或关闭浏览器</li>
              <li>建议定期同步，保持数据最新状态</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 数据同步范围 */}
      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <Database size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-700">
            <p className="font-medium mb-2">同步范围：</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span>AI工具</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span>书籍</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span>美食</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span>课程</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span>健康记录</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 系统状态 */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <Server size={20} className="text-gray-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-2">系统状态：</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${hasFeishuConfig ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>飞书配置：{hasFeishuConfig ? '已设置' : '未设置'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>本地存储：可用</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>同步服务：运行中</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
