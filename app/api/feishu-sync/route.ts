import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@larksuiteoapi/node-sdk'

// 飞书配置接口
interface FeishuConfig {
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

// 飞书多维表格记录接口
interface FeishuRecord {
  fields: Record<string, any>
}

// 飞书服务类
class FeishuService {
  private client: Client | null = null
  private config: FeishuConfig | null = null
  private readonly maxRetries = 3
  private readonly retryDelay = 1000

  // 初始化飞书客户端
  init(config: FeishuConfig): void {
    console.log('初始化飞书客户端...')
    this.config = config
    this.client = new Client({
        appId: config.appId,
        appSecret: config.appSecret,
        disableTokenCache: false
      })
    console.log('飞书客户端初始化完成')
  }

  // 检查是否已初始化
  private checkInitialized(): void {
    if (!this.client || !this.config) {
      throw new Error('飞书客户端未初始化，请先配置飞书信息')
    }
  }

  // 带重试机制的请求函数
  private async withRetry<T>(fn: () => Promise<T>, operationName: string): Promise<T> {
    let lastError: any
    
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        console.warn(`${operationName}失败，${i + 1}/${this.maxRetries}重试中...`, error)
        if (i < this.maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * (i + 1)))
        }
      }
    }
    
    console.error(`${operationName}最终失败:`, lastError)
    throw lastError
  }

  // 获取飞书多维表格数据
  async getTableData(tableId: string): Promise<any> {
    this.checkInitialized()
    
    // 清理表格ID，移除可能的视图参数
    const cleanedTableId = tableId.split('&')[0]
    
    return this.withRetry(async () => {
      console.log(`获取飞书表格数据，tableId: ${cleanedTableId}`)
      console.log(`使用的appToken: ${this.config!.appToken}`)
      
      // 使用正确的API路径格式 - 使用appTableRecord
      const response = await this.client!.bitable.appTableRecord.list({
        path: {
          app_token: this.config!.appToken,
          table_id: cleanedTableId
        },
        params: {
          page_size: 1000
        }
      })
      
      console.log(`获取飞书表格数据成功，返回记录数: ${response.data?.items?.length || 0}`)
      return response.data || {}
    }, '获取飞书表格数据')
  }

  // 批量添加记录
  async batchAddRecords(tableId: string, records: FeishuRecord[]): Promise<any> {
    this.checkInitialized()
    
    // 清理表格ID，移除可能的视图参数
    const cleanedTableId = tableId.split('&')[0]
    
    // 分批处理，每批最多100条记录
    const batchSize = 100
    const results = []
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      console.log(`批量添加飞书表格记录，批次: ${Math.floor(i / batchSize) + 1}，记录数: ${batch.length}`)
      
      const result = await this.withRetry(async () => {
        // 使用正确的API路径格式
        const response = await this.client!.request({
          method: 'POST',
          url: `/bitable/v1/apps/${this.config!.appToken}/tables/${cleanedTableId}/records/batch_create`,
          data: {
            records: batch
          }
        })
        return response.data
      }, '批量添加飞书表格记录')
      
      results.push(result)
    }
    
    return results
  }

  // 批量更新记录
  async batchUpdateRecords(tableId: string, updateData: Array<{ record_id: string, fields: Record<string, any> }>): Promise<any> {
    this.checkInitialized()
    
    // 清理表格ID，移除可能的视图参数
    const cleanedTableId = tableId.split('&')[0]
    
    // 分批处理，每批最多100条记录
    const batchSize = 100
    const results = []
    
    for (let i = 0; i < updateData.length; i += batchSize) {
      const batch = updateData.slice(i, i + batchSize)
      console.log(`批量更新飞书表格记录，批次: ${Math.floor(i / batchSize) + 1}，记录数: ${batch.length}`)
      
      const result = await this.withRetry(async () => {
        // 使用正确的API路径格式
        const response = await this.client!.request({
          method: 'POST',
          url: `/bitable/v1/apps/${this.config!.appToken}/tables/${cleanedTableId}/records/batch_update`,
          data: {
            records: batch
          }
        })
        return response.data
      }, '批量更新飞书表格记录')
      
      results.push(result)
    }
    
    return results
  }

  // 批量删除记录
  async batchDeleteRecords(tableId: string, recordIds: string[]): Promise<any> {
    this.checkInitialized()
    
    // 清理表格ID，移除可能的视图参数
    const cleanedTableId = tableId.split('&')[0]
    
    // 分批处理，每批最多100条记录
    const batchSize = 100
    const results = []
    
    for (let i = 0; i < recordIds.length; i += batchSize) {
      const batch = recordIds.slice(i, i + batchSize)
      console.log(`批量删除飞书表格记录，批次: ${Math.floor(i / batchSize) + 1}，记录数: ${batch.length}`)
      
      const result = await this.withRetry(async () => {
        // 使用正确的API路径格式
        const response = await this.client!.request({
          method: 'POST',
          url: `/bitable/v1/apps/${this.config!.appToken}/tables/${cleanedTableId}/records/batch_delete`,
          data: {
            record_ids: batch
          }
        })
        return response.data
      }, '批量删除飞书表格记录')
      
      results.push(result)
    }
    
    return results
  }

  // 验证数据
  private validateData(data: any, type: string): boolean {
    switch (type) {
      case 'ai_tool':
        return !!data.name && !!data.id
      case 'book':
        return !!data.title && !!data.id
      case 'food':
        return !!data.name && !!data.id
      case 'course':
        return !!data.title && !!data.id
      case 'health':
        return !!data.title && !!data.id
      default:
        return false
    }
  }

  // 批量同步数据到飞书
  async syncToFeishu(tableId: string, data: any[], type: string): Promise<void> {
    this.checkInitialized()
    
    try {
      console.log(`开始同步数据到飞书，类型: ${type}，数据量: ${data.length}`)
      
      // 过滤无效数据
      const validData = data.filter(item => this.validateData(item, type))
      console.log(`过滤后有效数据量: ${validData.length}`)
      
      if (validData.length === 0) {
        console.log('没有有效数据需要同步')
        return
      }
      
      // 先获取现有记录，用于更新或删除
      const existingData = await this.getTableData(tableId)
      const existingRecords = existingData.items || []
      const existingIds = new Map(existingRecords.map((record: any) => [record.fields['ID'], record.record_id]))
      const dataIds = new Set(validData.map(item => item.id))

      // 准备删除的记录ID
      const recordsToDelete = existingRecords.filter((record: any) => {
        const recordId = record.fields['ID']
        return record.fields['类型'] === type && !dataIds.has(recordId)
      }).map((record: any) => record.record_id)

      // 批量删除
      if (recordsToDelete.length > 0) {
        console.log(`准备删除记录数: ${recordsToDelete.length}`)
        await this.batchDeleteRecords(tableId, recordsToDelete)
      }

      // 准备添加和更新的记录
      const recordsToAdd: FeishuRecord[] = []
      const recordsToUpdate: Array<{ record_id: string, fields: Record<string, any> }> = []

      // 更新或添加记录
      for (const item of validData) {
        let feishuRecord: FeishuRecord

        // 根据类型转换数据
        switch (type) {
          case 'ai_tool':
            feishuRecord = {
              fields: {
                '名称': item.name || '',
                '描述': item.description || '',
                '分类': item.category || '',
                '标签': item.tags?.join(',') || '',
                '链接': item.url || '',
                '图标': item.icon || '🤖',
                '收藏': item.isFavorite || false,
                '使用次数': item.usageCount || 0,
                '最后使用': item.lastUsed || new Date().toISOString(),
                '类型': 'ai_tool',
                'ID': item.id || Date.now().toString()
              }
            }
            break
          case 'book':
            feishuRecord = {
              fields: {
                '书名': item.title || '',
                '作者': item.author || '',
                '状态': item.status || 'wantToRead',
                '总页数': item.totalPages || 0,
                '当前页数': item.currentPage || 0,
                '进度': item.progress || 0,
                '笔记': item.notes || '',
                '类型': 'book',
                'ID': item.id || Date.now().toString()
              }
            }
            break
          case 'food':
            feishuRecord = {
              fields: {
                '名称': item.name || '',
                '分类': item.category || '',
                '描述': item.description || '',
                '评分': item.rating || 0,
                '地点': item.location || '',
                '日期': item.date || new Date().toISOString().split('T')[0],
                '收藏': item.isFavorite || false,
                '图片': item.image,
                '类型': 'food',
                'ID': item.id || Date.now().toString()
              }
            }
            break
          case 'course':
            feishuRecord = {
              fields: {
                '课程名称': item.title || '',
                '学科': item.subject || '',
                '讲师': item.instructor || '',
                '开始日期': item.startDate || new Date().toISOString().split('T')[0],
                '结束日期': item.endDate || new Date().toISOString().split('T')[0],
                '状态': item.status || 'planned',
                '进度': item.progress || 0,
                '笔记': item.notes || '',
                '类型': 'course',
                'ID': item.id || Date.now().toString()
              }
            }
            break
          case 'health':
            feishuRecord = {
              fields: {
                '标题': item.title || '',
                '类型': item.type || 'exercise',
                '描述': item.description || '',
                '日期': item.date || new Date().toISOString().split('T')[0],
                '时长': item.duration,
                '卡路里': item.calories,
                '心情指数': item.moodLevel,
                '笔记': item.notes || '',
                '记录类型': 'health',
                'ID': item.id || Date.now().toString()
              }
            }
            break
          default:
            continue
        }

        const existingRecordId = existingIds.get(item.id)
        if (existingRecordId && typeof existingRecordId === 'string') {
          // 更新现有记录
          recordsToUpdate.push({
            record_id: existingRecordId,
            fields: feishuRecord.fields
          })
        } else {
          // 添加新记录
          recordsToAdd.push(feishuRecord)
        }
      }

      // 批量添加
      if (recordsToAdd.length > 0) {
        console.log(`准备添加记录数: ${recordsToAdd.length}`)
        await this.batchAddRecords(tableId, recordsToAdd)
      }

      // 批量更新
      if (recordsToUpdate.length > 0) {
        console.log(`准备更新记录数: ${recordsToUpdate.length}`)
        await this.batchUpdateRecords(tableId, recordsToUpdate)
      }

      console.log(`同步数据到飞书完成，类型: ${type}`)
    } catch (error) {
      console.error('同步到飞书失败:', error)
      throw error
    }
  }

  // 从飞书同步数据到本地
  async syncFromFeishu(tableId: string, type: string): Promise<any[]> {
    this.checkInitialized()
    
    return this.withRetry(async () => {
      console.log(`开始从飞书同步数据，类型: ${type}`)
      const data = await this.getTableData(tableId)
      const records = data.items || []
      const result: any[] = []

      for (const record of records) {
        // 只处理指定类型的记录
        if (record.fields['类型'] === type) {
          let item: any
          switch (type) {
            case 'ai_tool':
              item = {
                id: record.fields['ID'] || Date.now().toString(),
                name: record.fields['名称'] || '',
                description: record.fields['描述'] || '',
                category: record.fields['分类'] || '',
                tags: record.fields['标签'] ? record.fields['标签'].split(',') : [],
                url: record.fields['链接'] || '',
                icon: record.fields['图标'] || '🤖',
                isFavorite: record.fields['收藏'] || false,
                usageCount: record.fields['使用次数'] || 0,
                lastUsed: record.fields['最后使用'] || new Date().toISOString()
              }
              break
            case 'book':
              item = {
                id: record.fields['ID'] || Date.now().toString(),
                title: record.fields['书名'] || '',
                author: record.fields['作者'] || '',
                status: record.fields['状态'] || 'wantToRead',
                totalPages: record.fields['总页数'] || 0,
                currentPage: record.fields['当前页数'] || 0,
                progress: record.fields['进度'] || 0,
                notes: record.fields['笔记'] || '',
                quotes: []
              }
              break
            case 'food':
              item = {
                id: record.fields['ID'] || Date.now().toString(),
                name: record.fields['名称'] || '',
                category: record.fields['分类'] || '',
                description: record.fields['描述'] || '',
                rating: record.fields['评分'] || 0,
                location: record.fields['地点'] || '',
                date: record.fields['日期'] || new Date().toISOString().split('T')[0],
                isFavorite: record.fields['收藏'] || false,
                image: record.fields['图片']
              }
              break
            case 'course':
              item = {
                id: record.fields['ID'] || Date.now().toString(),
                title: record.fields['课程名称'] || '',
                subject: record.fields['学科'] || '',
                instructor: record.fields['讲师'] || '',
                startDate: record.fields['开始日期'] || new Date().toISOString().split('T')[0],
                endDate: record.fields['结束日期'] || new Date().toISOString().split('T')[0],
                status: record.fields['状态'] || 'planned',
                progress: record.fields['进度'] || 0,
                notes: record.fields['笔记'] || ''
              }
              break
            case 'health':
              item = {
                id: record.fields['ID'] || Date.now().toString(),
                title: record.fields['标题'] || '',
                type: record.fields['类型'] || 'exercise',
                description: record.fields['描述'] || '',
                date: record.fields['日期'] || new Date().toISOString().split('T')[0],
                duration: record.fields['时长'],
                calories: record.fields['卡路里'],
                moodLevel: record.fields['心情指数'],
                notes: record.fields['笔记'] || ''
              }
              break
            default:
              continue
          }
          if (this.validateData(item, type)) {
            result.push(item)
          }
        }
      }

      console.log(`从飞书同步数据完成，类型: ${type}，返回记录数: ${result.length}`)
      return result
    }, '从飞书同步数据')
  }
}

// 导出单例实例
const feishuService = new FeishuService()

// POST /api/feishu-sync
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, config, data, type, tableId } = body

    if (!config) {
      return NextResponse.json(
        { error: '飞书配置未提供' },
        { status: 400 }
      )
    }

    // 初始化飞书服务
    feishuService.init(config)

    let result

    switch (action) {
      case 'syncFromFeishu':
        if (!tableId || !type) {
          return NextResponse.json(
            { error: '缺少必要参数' },
            { status: 400 }
          )
        }
        result = await feishuService.syncFromFeishu(tableId, type)
        break

      case 'syncToFeishu':
        if (!tableId || !type || !data) {
          return NextResponse.json(
            { error: '缺少必要参数' },
            { status: 400 }
          )
        }
        await feishuService.syncToFeishu(tableId, data, type)
        result = { success: true, message: '同步成功' }
        break

      case 'syncAll':
        if (!config.tables) {
          return NextResponse.json(
            { error: '缺少表格配置' },
            { status: 400 }
          )
        }

        // 执行双向同步
        console.log('开始双向同步...')
        
        // 1. 先从飞书同步到本地
        console.log('步骤1: 从飞书同步到本地')
        const syncResults: any = {}
        
        for (const [key, tableIdValue] of Object.entries(config.tables)) {
          // 确保tableIdValue是字符串类型
          const tableIdStr = String(tableIdValue)
          // 清理表格ID，移除可能的视图参数
          const cleanedTableId = tableIdStr.split('&')[0]
          console.log(`同步表格: ${key}，表格ID: ${cleanedTableId}`)
          const syncData = await feishuService.syncFromFeishu(cleanedTableId, key)
          syncResults[key] = syncData
          console.log(`表格 ${key} 同步完成，返回记录数: ${syncData.length}`)
        }

        // 2. 如果有数据，再从本地同步到飞书
        if (data) {
          console.log('步骤2: 从本地同步到飞书')
          for (const [key, tableIdValue] of Object.entries(config.tables)) {
            if (data[key]) {
              // 确保tableIdValue是字符串类型
              const tableIdStr = String(tableIdValue)
              // 清理表格ID，移除可能的视图参数
              const cleanedTableId = tableIdStr.split('&')[0]
              console.log(`同步表格: ${key}，表格ID: ${cleanedTableId}，数据量: ${data[key].length}`)
              await feishuService.syncToFeishu(cleanedTableId, data[key], key)
              console.log(`表格 ${key} 同步完成`)
            }
          }
        }

        result = { success: true, message: '双向同步成功', data: syncResults }
        break

      default:
        return NextResponse.json(
          { error: '无效的操作' },
          { status: 400 }
        )
    }

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    )

  } catch (error) {
    console.error('飞书同步API错误:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '同步失败' },
      { status: 500 }
    )
  }
}
