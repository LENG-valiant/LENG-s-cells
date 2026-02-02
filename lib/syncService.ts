import { feishuService } from './feishu'
import {
  getAITools,
  saveAITools,
  getBooks,
  saveBooks,
  getPreferences,
  savePreferences
} from './store'
import { AITool, Book, Food, Course, HealthRecord } from '@/types'

// 同步服务类
export class SyncService {
  private _isSyncing = false
  private syncStartTime: number | null = null

  // 初始化同步服务
  init(): void {
    console.log('初始化同步服务...')
    // 从本地存储加载飞书配置
    const feishuConfig = localStorage.getItem('feishu_config')
    if (feishuConfig) {
      try {
        const config = JSON.parse(feishuConfig)
        feishuService.init(config)
        console.log('飞书客户端初始化成功')
      } catch (error) {
        console.error('加载飞书配置失败:', error)
      }
    } else {
      console.log('未找到飞书配置，需要在飞书配置页面填写配置信息')
    }
  }

  // 检查是否可以同步
  private canSync(): boolean {
    return !this._isSyncing
  }

  // 同步所有数据到飞书
  async syncAllToFeishu(): Promise<boolean> {
    if (!this.canSync()) {
      console.warn('同步正在进行中，请稍后再试')
      return false
    }

    try {
      console.log('开始同步所有数据到飞书...')
      this._isSyncing = true
      this.syncStartTime = Date.now()
      
      // 获取飞书配置
      const feishuConfig = localStorage.getItem('feishu_config')
      if (!feishuConfig) {
        throw new Error('飞书配置未设置，请先在飞书配置页面填写配置信息')
      }

      const config = JSON.parse(feishuConfig)
      const tables = config.tables

      // 获取本地数据
      const localData = {
        ai_tool: getAITools(),
        book: getBooks(),
        food: this.getLocalFoods(),
        course: this.getLocalCourses(),
        health: this.getLocalHealthRecords()
      }

      // 执行同步
      for (const [type, data] of Object.entries(localData)) {
        const tableId = tables[type as keyof typeof tables]
        if (tableId && Array.isArray(data) && data.length > 0) {
          console.log(`开始同步${type}到飞书...`)
          await feishuService.syncToFeishu(String(tableId), data, type)
          console.log(`${type}同步完成`)
        }
      }

      // 更新最后同步时间
      this.updateLastSyncTime()

      const duration = Date.now() - this.syncStartTime
      console.log(`所有数据同步到飞书完成，耗时: ${duration}ms`)

      return true
    } catch (error) {
      console.error('同步到飞书失败:', error)
      return false
    } finally {
      this._isSyncing = false
      this.syncStartTime = null
    }
  }

  // 从飞书同步所有数据到本地
  async syncAllFromFeishu(): Promise<boolean> {
    if (!this.canSync()) {
      console.warn('同步正在进行中，请稍后再试')
      return false
    }

    try {
      console.log('开始从飞书同步所有数据...')
      this._isSyncing = true
      this.syncStartTime = Date.now()
      
      // 获取飞书配置
      const feishuConfig = localStorage.getItem('feishu_config')
      if (!feishuConfig) {
        throw new Error('飞书配置未设置，请先在飞书配置页面填写配置信息')
      }

      const config = JSON.parse(feishuConfig)
      const tables = config.tables

      // 执行同步
      for (const [type, tableId] of Object.entries(tables)) {
        console.log(`开始从飞书同步${type}...`)
        const data = await feishuService.syncFromFeishu(String(tableId), type)
        
        // 保存数据到本地
        switch (type) {
          case 'ai_tool':
            saveAITools(data as AITool[])
            break
          case 'book':
            this.saveLocalBooks(data as Book[])
            break
          case 'food':
            this.saveLocalFoods(data as Food[])
            break
          case 'course':
            this.saveLocalCourses(data as Course[])
            break
          case 'health':
            this.saveLocalHealthRecords(data as HealthRecord[])
            break
        }
        
        console.log(`${type}同步完成`)
      }

      // 更新最后同步时间
      this.updateLastSyncTime()

      const duration = Date.now() - this.syncStartTime
      console.log(`所有数据从飞书同步完成，耗时: ${duration}ms`)

      return true
    } catch (error) {
      console.error('从飞书同步失败:', error)
      return false
    } finally {
      this._isSyncing = false
      this.syncStartTime = null
    }
  }

  // 双向同步所有数据
  async syncAll(): Promise<boolean> {
    if (!this.canSync()) {
      console.warn('同步正在进行中，请稍后再试')
      return false
    }

    try {
      console.log('开始双向同步所有数据...')
      this._isSyncing = true
      this.syncStartTime = Date.now()
      
      // 获取飞书配置
      const feishuConfig = localStorage.getItem('feishu_config')
      if (!feishuConfig) {
        throw new Error('飞书配置未设置，请先在飞书配置页面填写配置信息')
      }

      console.log('飞书配置存在，解析配置...')
      const config = JSON.parse(feishuConfig)
      
      // 验证配置完整性
      if (!config.appId || !config.appSecret || !config.appToken) {
        throw new Error('飞书配置不完整，请检查App ID、App Secret和多维表格ID是否填写正确')
      }
      
      if (!config.tables) {
        throw new Error('飞书配置不完整，缺少表格配置')
      }
      
      console.log('飞书配置验证通过')

      // 重新初始化飞书服务，确保使用最新配置
      console.log('重新初始化飞书服务...')
      feishuService.init(config)
      console.log('飞书服务初始化成功')

      // 获取本地数据
      console.log('获取本地数据...')
      const localData = {
        ai_tool: getAITools(),
        book: getBooks(),
        food: this.getLocalFoods(),
        course: this.getLocalCourses(),
        health: this.getLocalHealthRecords()
      }
      
      console.log('本地数据获取完成:', {
        ai_tool: localData.ai_tool.length,
        book: localData.book.length,
        food: localData.food.length,
        course: localData.course.length,
        health: localData.health.length
      })

      // 执行双向同步
      console.log('调用飞书同步API...')
      const apiResult = await feishuService.syncAll(localData)
      console.log('双向同步API调用成功:', apiResult)

      // 保存从飞书同步的数据到本地
      if (apiResult && apiResult.data) {
        const syncData = apiResult.data
        console.log('从飞书同步的数据:', {
          ai_tool: syncData.ai_tool?.length,
          book: syncData.book?.length,
          food: syncData.food?.length,
          course: syncData.course?.length,
          health: syncData.health?.length
        })
        
        if (syncData.ai_tool) {
          console.log('保存AI工具数据...')
          saveAITools(syncData.ai_tool as AITool[])
        }
        if (syncData.book) {
          console.log('保存书籍数据...')
          this.saveLocalBooks(syncData.book as Book[])
        }
        if (syncData.food) {
          console.log('保存美食数据...')
          this.saveLocalFoods(syncData.food as Food[])
        }
        if (syncData.course) {
          console.log('保存课程数据...')
          this.saveLocalCourses(syncData.course as Course[])
        }
        if (syncData.health) {
          console.log('保存健康记录数据...')
          this.saveLocalHealthRecords(syncData.health as HealthRecord[])
        }
      }

      // 更新最后同步时间
      console.log('更新最后同步时间...')
      this.updateLastSyncTime()

      const duration = Date.now() - this.syncStartTime
      console.log(`双向同步所有数据完成，耗时: ${duration}ms`)

      return true
    } catch (error) {
      console.error('双向同步失败:', error)
      if (error instanceof Error) {
        console.error('错误详情:', error.stack)
      }
      return false
    } finally {
      this._isSyncing = false
      this.syncStartTime = null
    }
  }

  // 获取本地存储的美食数据
  private getLocalFoods(): Food[] {
    try {
      const foodsStr = localStorage.getItem('personal_homepage_foods')
      return foodsStr ? JSON.parse(foodsStr) : []
    } catch (error) {
      console.error('获取本地美食数据失败:', error)
      return []
    }
  }

  // 保存美食数据到本地存储
  private saveLocalFoods(foods: Food[]): void {
    try {
      localStorage.setItem('personal_homepage_foods', JSON.stringify(foods))
      console.log(`保存了 ${foods.length} 条美食数据到本地存储`)
    } catch (error) {
      console.error('保存本地美食数据失败:', error)
    }
  }

  // 获取本地存储的课程数据
  private getLocalCourses(): Course[] {
    try {
      const coursesStr = localStorage.getItem('personal_homepage_courses')
      return coursesStr ? JSON.parse(coursesStr) : []
    } catch (error) {
      console.error('获取本地课程数据失败:', error)
      return []
    }
  }

  // 保存课程数据到本地存储
  private saveLocalCourses(courses: Course[]): void {
    try {
      localStorage.setItem('personal_homepage_courses', JSON.stringify(courses))
      console.log(`保存了 ${courses.length} 条课程数据到本地存储`)
    } catch (error) {
      console.error('保存本地课程数据失败:', error)
    }
  }

  // 获取本地存储的健康记录数据
  private getLocalHealthRecords(): HealthRecord[] {
    try {
      const recordsStr = localStorage.getItem('personal_homepage_health_records')
      return recordsStr ? JSON.parse(recordsStr) : []
    } catch (error) {
      console.error('获取本地健康记录数据失败:', error)
      return []
    }
  }

  // 保存健康记录数据到本地存储
  private saveLocalHealthRecords(records: HealthRecord[]): void {
    try {
      localStorage.setItem('personal_homepage_health_records', JSON.stringify(records))
      console.log(`保存了 ${records.length} 条健康记录数据到本地存储`)
    } catch (error) {
      console.error('保存本地健康记录数据失败:', error)
    }
  }

  // 保存书籍数据到本地存储
  private saveLocalBooks(books: Book[]): void {
    try {
      // 优先使用store.ts中的saveBooks函数
      try {
        saveBooks(books)
        console.log(`使用store.ts保存了 ${books.length} 条书籍数据`)
      } catch (error) {
        // 如果store.ts中的saveBooks函数失败，直接保存到localStorage
        console.warn('使用store.ts保存书籍数据失败，尝试直接保存到localStorage:', error)
        localStorage.setItem('personal_homepage_books', JSON.stringify(books))
        console.log(`直接保存了 ${books.length} 条书籍数据到本地存储`)
      }
    } catch (error) {
      console.error('保存本地书籍数据失败:', error)
    }
  }

  // 更新最后同步时间
  private updateLastSyncTime(): void {
    try {
      const preferences = getPreferences()
      const now = new Date().toISOString()
      savePreferences({
        ...preferences,
        lastSyncTime: now
      })
      console.log(`更新最后同步时间为: ${now}`)
    } catch (error) {
      console.error('更新最后同步时间失败:', error)
    }
  }

  // 获取最后同步时间
  getLastSyncTime(): string | null {
    try {
      const preferences = getPreferences()
      return preferences.lastSyncTime || null
    } catch (error) {
      console.error('获取最后同步时间失败:', error)
      return null
    }
  }

  // 检查同步状态
  isSyncing(): boolean {
    return this._isSyncing
  }

  // 获取同步进度信息
  getSyncInfo(): {
    isSyncing: boolean
    syncStartTime: number | null
    lastSyncTime: string | null
  } {
    return {
      isSyncing: this._isSyncing,
      syncStartTime: this.syncStartTime,
      lastSyncTime: this.getLastSyncTime()
    }
  }

  // 验证飞书配置是否存在
  hasFeishuConfig(): boolean {
    const feishuConfig = localStorage.getItem('feishu_config')
    return !!feishuConfig
  }
}

// 导出单例实例
export const syncService = new SyncService()
