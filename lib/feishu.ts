import { AITool, Book, Food, Course, HealthRecord } from '@/types'

// 飞书配置接口
export interface FeishuConfig {
  appId: string
  appSecret: string
  appToken: string
  tables: {
    ai_tool: string
    book: string
    food: string
    course: string
    health: string
  }
}

// 飞书服务类 - 使用API路由
export class FeishuService {
  private config: FeishuConfig | null = null

  // 初始化飞书客户端
  init(config: FeishuConfig): void {
    console.log('初始化飞书客户端...')
    this.config = config
    console.log('飞书客户端初始化完成')
  }

  // 检查是否已初始化
  private checkInitialized(): void {
    if (!this.config) {
      throw new Error('飞书客户端未初始化，请先配置飞书信息')
    }
  }

  // 调用API路由
  private async callApi(action: string, data: any): Promise<any> {
    console.log(`调用飞书同步API，操作: ${action}`)
    
    try {
      // 确保使用正确的API URL
      const apiUrl = '/api/feishu-sync'
      console.log(`API URL: ${apiUrl}`)
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          ...data
        })
      })

      if (!response.ok) {
        // 尝试获取详细的错误信息
        try {
          const errorData = await response.json()
          throw new Error(`API请求失败: ${response.statusText} - ${errorData.error || ''}`)
        } catch (parseError) {
          throw new Error(`API请求失败: ${response.statusText}`)
        }
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'API返回失败')
      }

      console.log(`API调用成功，操作: ${action}`)
      return result.data
    } catch (error) {
      console.error(`API调用失败，操作: ${action}`, error)
      // 重新抛出错误，包含更详细的信息
      if (error instanceof Error) {
        throw new Error(`飞书同步API错误: ${error.message}`)
      }
      throw error
    }
  }

  // 批量同步数据到飞书
  async syncToFeishu(tableId: string, data: any[], type: string): Promise<void> {
    this.checkInitialized()
    
    try {
      console.log(`开始同步数据到飞书，类型: ${type}，数据量: ${data.length}`)
      
      await this.callApi('syncToFeishu', {
        config: this.config,
        tableId,
        data,
        type
      })

      console.log(`同步数据到飞书完成，类型: ${type}`)
    } catch (error) {
      console.error('同步到飞书失败:', error)
      throw error
    }
  }

  // 从飞书同步数据到本地
  async syncFromFeishu(tableId: string, type: string): Promise<any[]> {
    this.checkInitialized()
    
    try {
      // 清理表格ID，移除可能的视图参数
      const cleanedTableId = tableId.split('&')[0]
      console.log(`开始从飞书同步数据，类型: ${type}，表格ID: ${cleanedTableId}`)
      
      const result = await this.callApi('syncFromFeishu', {
        config: this.config,
        tableId: cleanedTableId,
        type
      })

      console.log(`从飞书同步数据完成，类型: ${type}，返回记录数: ${result?.length || 0}`)
      return result || []
    } catch (error) {
      console.error('从飞书同步失败:', error)
      throw error
    }
  }

  // 双向同步所有数据
  async syncAll(data?: any): Promise<any> {
    this.checkInitialized()
    
    try {
      console.log('开始双向同步所有数据...')
      
      // 清理配置中的表格ID
      const cleanedConfig = {
        ...this.config,
        tables: Object.fromEntries(
          Object.entries((this.config?.tables || {})).map(([key, tableId]) => [
            key,
            String(tableId).split('&')[0]
          ])
        )
      }
      
      console.log('清理后的表格配置:', cleanedConfig.tables)
      
      const result = await this.callApi('syncAll', {
        config: cleanedConfig,
        data
      })

      console.log('双向同步所有数据完成')
      return result
    } catch (error) {
      console.error('双向同步失败:', error)
      throw error
    }
  }
}

// 导出单例实例
export const feishuService = new FeishuService()
