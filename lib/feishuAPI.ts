// 飞书API服务

interface FeishuConfig {
  appId: string
  appSecret: string
  appToken: string
  tableId: string
}

interface FeishuToken {
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: string
}

interface FeishuRecord {
  record_id: string
  fields: Record<string, any>
}

class FeishuAPI {
  private config: FeishuConfig
  private token: FeishuToken | null = null
  private tokenExpiry: number = 0

  constructor(config: FeishuConfig) {
    this.config = config
  }

  // 获取访问令牌
  private async getAccessToken(): Promise<string> {
    // 检查令牌是否有效
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token.access_token
    }

    try {
      const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: this.config.appId,
          app_secret: this.config.appSecret,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`)
      }

      const data: FeishuToken = await response.json()
      this.token = data
      this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000 // 提前60秒刷新

      return data.access_token
    } catch (error) {
      console.error('Error getting access token:', error)
      throw error
    }
  }

  // 获取表格数据
  async getRecords(tableId: string = this.config.tableId): Promise<FeishuRecord[]> {
    try {
      const accessToken = await this.getAccessToken()
      const response = await fetch(`https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/${this.config.appToken}/sheets/${tableId}/records`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to get records: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data.records || []
    } catch (error) {
      console.error('Error getting records:', error)
      throw error
    }
  }

  // 添加记录
  async addRecord(record: Record<string, any>, tableId: string = this.config.tableId): Promise<FeishuRecord> {
    try {
      const accessToken = await this.getAccessToken()
      const response = await fetch(`https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/${this.config.appToken}/sheets/${tableId}/records`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [{
            fields: record,
          }],
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to add record: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data.records[0]
    } catch (error) {
      console.error('Error adding record:', error)
      throw error
    }
  }

  // 更新记录
  async updateRecord(recordId: string, record: Record<string, any>, tableId: string = this.config.tableId): Promise<void> {
    try {
      const accessToken = await this.getAccessToken()
      const response = await fetch(`https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/${this.config.appToken}/sheets/${tableId}/records/${recordId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: record,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update record: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error updating record:', error)
      throw error
    }
  }

  // 删除记录
  async deleteRecord(recordId: string, tableId: string = this.config.tableId): Promise<void> {
    try {
      const accessToken = await this.getAccessToken()
      const response = await fetch(`https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/${this.config.appToken}/sheets/${tableId}/records/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to delete record: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting record:', error)
      throw error
    }
  }
}

// 从环境变量获取配置
function getFeishuConfig(): FeishuConfig {
  return {
    appId: process.env.FEISHU_APP_ID || '',
    appSecret: process.env.FEISHU_APP_SECRET || '',
    appToken: process.env.FEISHU_APP_TOKEN || '',
    tableId: process.env.FEISHU_TABLE_ID || '',
  }
}

// 创建飞书API实例
const feishuAPI = new FeishuAPI(getFeishuConfig())

export default feishuAPI
export type { FeishuRecord }
