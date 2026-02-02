import { NextRequest, NextResponse } from 'next/server'

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'

interface QuoteData {
  record_id?: string
  fields: {
    内容: string
    书籍: string
    作者: string
    标签?: string
  }
}

async function getFeishuAccessToken(): Promise<string> {
  const response = await fetch(`${FEISHU_API_BASE}/auth/v3/app_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: process.env.FEISHU_APP_ID,
      app_secret: process.env.FEISHU_APP_SECRET,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`获取访问令牌失败: ${data.msg}`)
  }

  return data.app_access_token
}

export async function GET() {
  try {
    const accessToken = await getFeishuAccessToken()
    const quotesToken = process.env.FEISHU_QUOTES_TOKEN
    const quotesTableId = process.env.FEISHU_QUOTES_TABLE_ID

    if (!quotesToken || !quotesTableId) {
      return NextResponse.json({
        success: true,
        quotes: [
          { id: '1', content: '阅读是灵魂的粮食，思考是心灵的呼吸。', book: '阅读的力量', author: '弗朗西斯·培根' },
          { id: '2', content: '一本书就像一艘船，带领我们从狭隘的地方驶向无限广阔的海域。', book: '书的世界', author: '海伦·凯勒' },
          { id: '3', content: '学习不是填满一个桶，而是点燃一把火。', book: '教育之道', author: '威廉·巴特勒·叶芝' },
          { id: '4', content: '知识的价值不在于占有，而在于使用。', book: '智慧之路', author: '苏格拉底' },
        ],
        source: 'local',
      })
    }

    const response = await fetch(
      `${FEISHU_API_BASE}/sheets/v3/spreadsheets/${quotesToken}/sheets/${quotesTableId}/records`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({
        success: true,
        quotes: [
          { id: '1', content: '阅读是灵魂的粮食，思考是心灵的呼吸。', book: '阅读的力量', author: '弗朗西斯·培根' },
          { id: '2', content: '一本书就像一艘船，带领我们从狭隘的地方驶向无限广阔的海域。', book: '书的世界', author: '海伦·凯勒' },
          { id: '3', content: '学习不是填满一个桶，而是点燃一把火。', book: '教育之道', author: '威廉·巴特勒·叶芝' },
          { id: '4', content: '知识的价值不在于占有，而在于使用。', book: '智慧之路', author: '苏格拉底' },
        ],
        source: 'local',
      })
    }

    const quotes = (data.data?.records || []).map((record: any, index: number) => ({
      id: record.record_id || `quote-${index}`,
      content: record.fields?.内容 || '',
      book: record.fields?.书籍 || '',
      author: record.fields?.作者 || '',
    }))

    return NextResponse.json({ success: true, quotes, source: 'feishu' })
  } catch (error) {
    console.error('获取好词好句失败:', error)
    return NextResponse.json({
      success: true,
      quotes: [
        { id: '1', content: '阅读是灵魂的粮食，思考是心灵的呼吸。', book: '阅读的力量', author: '弗朗西斯·培根' },
        { id: '2', content: '一本书就像一艘船，带领我们从狭隘的地方驶向无限广阔的海域。', book: '书的世界', author: '海伦·凯勒' },
        { id: '3', content: '学习不是填满一个桶，而是点燃一把火。', book: '教育之道', author: '威廉·巴特勒·叶芝' },
        { id: '4', content: '知识的价值不在于占有，而在于使用。', book: '智慧之路', author: '苏格拉底' },
      ],
      source: 'local',
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const quoteData: QuoteData = await request.json()
    const accessToken = await getFeishuAccessToken()
    const quotesToken = process.env.FEISHU_QUOTES_TOKEN
    const quotesTableId = process.env.FEISHU_QUOTES_TABLE_ID

    if (!quotesToken || !quotesTableId) {
      return NextResponse.json(
        { success: false, error: '飞书表格配置不完整' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `${FEISHU_API_BASE}/sheets/v3/spreadsheets/${quotesToken}/sheets/${quotesTableId}/records`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [quoteData],
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `添加失败: ${data.msg}` },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      record: data.data?.records?.[0],
    })
  } catch (error) {
    console.error('添加好词好句失败:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '添加失败' },
      { status: 500 }
    )
  }
}
