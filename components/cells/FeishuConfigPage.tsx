'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/UI'
import { Settings, Save, CheckCircle2, XCircle, ArrowLeft, AlertCircle } from 'lucide-react'

interface FeishuConfigPageProps {
  onNavigate: (page: string) => void
}

export default function FeishuConfigPage({ onNavigate }: FeishuConfigPageProps) {
  const [config, setConfig] = useState({
    appId: '',
    appSecret: '',
    appToken: '',
    tables: {
      ai_tool: '',
      book: '',
      food: '',
      course: '',
      health: ''
    }
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  // 从环境变量或本地存储加载配置
  useEffect(() => {
    const loadConfig = () => {
      try {
        const savedConfig = localStorage.getItem('feishu_config')
        if (savedConfig) {
          setConfig(JSON.parse(savedConfig))
        }
      } catch (error) {
        console.error('加载飞书配置失败:', error)
      }
    }

    loadConfig()
  }, [])

  // 保存配置
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    setSaveError('')

    try {
      // 验证配置
      if (!config.appId || !config.appSecret || !config.appToken) {
        throw new Error('请填写所有必填字段')
      }
      
      // 验证表格ID
      if (!config.tables || Object.keys(config.tables).length === 0) {
        throw new Error('请填写至少一个表格配置')
      }

      // 保存到本地存储
      localStorage.setItem('feishu_config', JSON.stringify(config))

      // 模拟保存到环境变量（实际应用中需要后端支持）
      console.log('保存飞书配置:', config)

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : '保存失败')
      setTimeout(() => setSaveError(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // 处理表格配置的输入变化
    if (name === 'ai_tool' || name === 'book' || name === 'food' || name === 'course' || name === 'health') {
      setConfig(prev => ({
        ...prev,
        tables: {
          ...prev.tables,
          [name]: value
        }
      }))
    } else {
      // 处理顶层配置的输入变化
      setConfig(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 头部装饰 - 莫娣风格 */}
      <div className="h-8 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 rounded-b-3xl shadow-md"></div>

      {/* 导航栏 */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
          <span className="font-medium text-gray-800">返回大脑</span>
        </button>

        {/* 标题 */}
        <div className="mt-8 text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-2 bg-gray-200 rounded-full opacity-50"></div>
            <div className="relative bg-white rounded-full p-6 border-4 border-double border-gray-400 shadow-lg">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                飞书集成配置
              </h1>
              <p className="text-lg text-gray-600">
                连接飞书多维表格，实现数据同步
              </p>
            </div>
          </div>
        </div>

        {/* 配置表单 */}
        <div className="mt-12 max-w-2xl mx-auto">
          <Card className="bg-white border-2 border-gray-200 rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Settings size={24} className="text-gray-600" />
              飞书配置信息
            </h2>

            {/* 配置说明 */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1">配置说明</h3>
                  <p className="text-sm text-yellow-700">
                    请根据 <a href="#" className="text-blue-600 hover:underline">FEISHU_ID_GUIDE.md</a> 中的说明获取配置信息
                  </p>
                </div>
              </div>
            </div>

            {/* 表单 */}
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label htmlFor="appId" className="block text-sm font-medium text-gray-700 mb-1">
                  App ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="appId"
                  name="appId"
                  value={config.appId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="输入飞书应用App ID"
                />
              </div>

              <div>
                <label htmlFor="appSecret" className="block text-sm font-medium text-gray-700 mb-1">
                  App Secret <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="appSecret"
                  name="appSecret"
                  value={config.appSecret}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="输入飞书应用App Secret"
                />
              </div>

              <div>
                <label htmlFor="appToken" className="block text-sm font-medium text-gray-700 mb-1">
                  多维表格ID (App Token) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="appToken"
                  name="appToken"
                  value={config.appToken}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="输入飞书多维表格ID"
                />
              </div>

              {/* 表格配置 */}
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">表格配置</h3>
                
                <div>
                  <label htmlFor="ai_tool" className="block text-sm font-medium text-gray-700 mb-1">
                    AI工具表格ID
                  </label>
                  <input
                    type="text"
                    id="ai_tool"
                    name="ai_tool"
                    value={config.tables.ai_tool}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      tables: {
                        ...prev.tables,
                        ai_tool: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="输入AI工具表格ID"
                  />
                </div>
                
                <div>
                  <label htmlFor="book" className="block text-sm font-medium text-gray-700 mb-1">
                    书籍表格ID
                  </label>
                  <input
                    type="text"
                    id="book"
                    name="book"
                    value={config.tables.book}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      tables: {
                        ...prev.tables,
                        book: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="输入书籍表格ID"
                  />
                </div>
                
                <div>
                  <label htmlFor="food" className="block text-sm font-medium text-gray-700 mb-1">
                    美食表格ID
                  </label>
                  <input
                    type="text"
                    id="food"
                    name="food"
                    value={config.tables.food}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      tables: {
                        ...prev.tables,
                        food: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="输入美食表格ID"
                  />
                </div>
                
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                    课程表格ID
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    value={config.tables.course}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      tables: {
                        ...prev.tables,
                        course: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="输入课程表格ID"
                  />
                </div>
                
                <div>
                  <label htmlFor="health" className="block text-sm font-medium text-gray-700 mb-1">
                    健康记录表格ID
                  </label>
                  <input
                    type="text"
                    id="health"
                    name="health"
                    value={config.tables.health}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      tables: {
                        ...prev.tables,
                        health: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="输入健康记录表格ID"
                  />
                </div>
              </div>

              {/* 保存按钮 */}
              <div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      保存配置
                    </>
                  )}
                </button>
              </div>

              {/* 保存结果 */}
              {saveSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                  <p className="text-green-700">配置保存成功！</p>
                </div>
              )}

              {saveError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <XCircle size={20} className="text-red-600 flex-shrink-0" />
                  <p className="text-red-700">{saveError}</p>
                </div>
              )}
            </form>
          </Card>

          {/* 配置指南 */}
          <Card className="bg-white border-2 border-gray-200 rounded-2xl shadow-md p-8 mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">配置指南</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h3 className="font-medium text-gray-800 mb-1">1. 获取 App ID 和 App Secret</h3>
                <p>
                  登录飞书开发者平台，创建企业自建应用，在「凭证与基础信息」中获取
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">2. 获取 App Token (多维表格ID)</h3>
                <p>
                  打开飞书多维表格，查看浏览器地址栏的 URL，格式为：
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">https://bytedance.larkoffice.com/sheets/{'{APP_TOKEN}'}?sheet={'{SHEET_ID}'}</code>
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">3. 获取 Table ID (工作表ID)</h3>
                <p>
                  在同一表格页面，URL 中的 <code className="bg-gray-100 px-2 py-1 rounded text-sm">sheet={'{SHEET_ID}'}</code> 部分
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">4. 权限设置</h3>
                <p>
                  在飞书开发者平台中，为应用添加「文档」和「电子表格」的相关权限
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 底部装饰 - 莫娣风格 */}
      <div className="mt-16">
        <div className="h-8 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-300 rounded-t-3xl shadow-md"></div>
        <div className="bg-gray-100 py-6 text-center">
          <p className="text-gray-600">
            飞书集成配置 • 连接飞书多维表格 • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}
