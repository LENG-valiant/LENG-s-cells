import { NextRequest, NextResponse } from 'next/server'

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'

interface ReadingRecord {
  record_id: string
  fields: {
    书名?: string
    作者?: string
    状态?: string
    当前页码?: number
    总页数?: number
    笔记?: string
    好词好句?: string[]
    阅读日期?: string
  }
}

async function getFeishuAccessToken(): Promise<string> {
  const appId = process.env.FEISHU_APP_ID
  const appSecret = process.env.FEISHU_APP_SECRET

  if (!appId || !appSecret) {
    throw new Error('飞书应用配置不完整')
  }

  const response = await fetch(`${FEISHU_API_BASE}/auth/v3/app_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`获取访问令牌失败: ${data.msg}`)
  }

  return data.app_access_token
}

async function getReadingBooks(accessToken: string): Promise<ReadingRecord[]> {
  const appToken = process.env.FEISHU_APP_TOKEN
  const tableId = process.env.FEISHU_TABLE_ID

  if (!appToken || !tableId) {
    throw new Error('飞书表格配置不完整')
  }

  const response = await fetch(
    `${FEISHU_API_BASE}/sheets/v3/spreadsheets/${appToken}/sheets/${tableId}/records`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`获取数据失败: ${data.msg}`)
  }

  return data.data?.records || []
}

async function sendFeishuMessage(accessToken: string, message: string): Promise<void> {
  const response = await fetch(`${FEISHU_API_BASE}/im/v1/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      receive_id_type: 'open_id',
      receive_id: process.env.FEISHU_USER_OPEN_ID,
      msg_type: 'text',
      content: JSON.stringify({ text: message }),
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('发送飞书消息失败:', errorData)
  }
}

const ENCOURAGEMENTS = [
  '今天的阅读，是你送给未来自己最好的礼物 🌟',
  '每一页都是成长的印记，继续加油！📚',
  '阅读的旅程从未如此精彩，你正在书写属于自己的故事 ✨',
  '知识的力量在你身上显现，今天也要继续闪耀！💫',
  '阅读的习惯是最珍贵的财富，坚持就是胜利！🏆',
  '书页翻动的声音，是世界上最美的乐章 🎵',
  '你的阅读进度令人欣喜，每一天都在进步！🌈',
  '阅读让你遇见更好的自己，今天也要元气满满！⚡',
]

export async function POST(request: NextRequest) {
  try {
    const { triggerManual } = await request.json().catch(() => ({ triggerManual: false }))

    const feishuAppId = process.env.FEISHU_APP_ID
    const feishuAppSecret = process.env.FEISHU_APP_SECRET

    if (!feishuAppId || !feishuAppSecret) {
      return NextResponse.json(
        { success: false, error: '飞书配置不完整' },
        { status: 500 }
      )
    }

    const accessToken = await getFeishuAccessToken()
    const books = await getReadingBooks(accessToken)

    const readingBooks = books.filter(
      (book) => book.fields.状态 === '进行中' || book.fields.状态 === 'reading'
    )

    if (readingBooks.length === 0) {
      return NextResponse.json({
        success: true,
        message: '没有进行中的书籍，跳过提醒',
        booksCount: 0,
      })
    }

    let messageContent = '📚 **今日阅读提醒** 🌟\n\n'

    for (const book of readingBooks) {
      const { 书名, 作者, 当前页码, 总页数 } = book.fields
      const progress = 总页数 ? Math.round(((当前页码 || 0) / 总页数) * 100) : 0

      messageContent += `📖 **《${书名 || '未知书籍'}》**\n`
      messageContent += `   👤 作者：${作者 || '未知'}\n`
      messageContent += `   📄 进度：${当前页码 || 0} / ${总页数 || '?'} 页 (${progress}%)\n`
      messageContent += `   🎯 距离完成还差 ${Math.max(0, (总页数 || 0) - (当前页码 || 0))} 页\n\n`
    }

    messageContent += '💪 **' + ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)] + '**\n'
    messageContent += '\n—— 来自LENG阅读细胞 📱'

    await sendFeishuMessage(accessToken, messageContent)

    return NextResponse.json({
      success: true,
      message: '阅读提醒发送成功',
      booksCount: readingBooks.length,
      triggeredAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('发送阅读提醒失败:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '发送提醒失败' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'LENG阅读细胞 - 定时提醒任务',
    status: 'active',
    endpoints: {
      POST: '触发提醒发送（手动或定时）',
    },
    schedule: '每天 08:00 自动执行（需配置Cron Job）',
    configuration: {
      feishuAppId: !!process.env.FEISHU_APP_ID,
      feishuAppSecret: !!process.env.FEISHU_APP_SECRET,
      feishuAppToken: !!process.env.FEISHU_APP_TOKEN,
      feishuTableId: !!process.env.FEISHU_TABLE_ID,
    },
  })
}
