'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { syncService } from '@/lib/syncService'

interface SyncButtonProps {
  className?: string
}

export default function SyncButton({ className }: SyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [syncMessage, setSyncMessage] = useState('')

  const handleSync = async () => {
    if (isSyncing) return

    setIsSyncing(true)
    setSyncStatus('idle')
    setSyncMessage('开始同步...')

    try {
      // 检查飞书配置
      if (!syncService.hasFeishuConfig()) {
        throw new Error('飞书配置未设置，请先在飞书配置页面填写配置信息')
      }

      // 执行双向同步
      console.log('开始双向同步...')
      
      // 使用新的syncAll方法
      const syncSuccess = await syncService.syncAll()
      
      if (!syncSuccess) {
        throw new Error('双向同步失败，请检查浏览器控制台获取详细错误信息')
      }

      setSyncStatus('success')
      setSyncMessage('双向同步成功！')
      console.log('双向同步完成')
    } catch (error) {
      setSyncStatus('error')
      const errorMessage = error instanceof Error ? error.message : '同步失败'
      setSyncMessage(errorMessage)
      console.error('同步失败:', error)
      // 显示详细错误信息在控制台
      if (error instanceof Error) {
        console.error('错误详情:', error.stack)
      }
    } finally {
      setIsSyncing(false)
      // 5秒后重置状态，给用户足够的时间查看错误信息
      setTimeout(() => {
        setSyncStatus('idle')
        setSyncMessage('')
      }, 5000)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isSyncing
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
        }`}
        title="一键双向同步"
      >
        {isSyncing ? (
          <Loader2 size={18} className="animate-spin" />
        ) : syncStatus === 'success' ? (
          <CheckCircle2 size={18} />
        ) : syncStatus === 'error' ? (
          <XCircle size={18} />
        ) : (
          <RefreshCw size={18} />
        )}
        <span>
          {isSyncing ? '同步中...' : 
           syncStatus === 'success' ? '同步成功' : 
           syncStatus === 'error' ? '同步失败' : '一键同步'}
        </span>
      </button>

      {/* 同步状态提示 */}
      {(syncStatus === 'success' || syncStatus === 'error') && (
        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-2 px-3 py-1 rounded-full text-xs font-medium ${
          syncStatus === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {syncMessage}
        </div>
      )}
    </div>
  )
}
