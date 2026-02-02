import { NextRequest, NextResponse } from 'next/server'

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'

interface BookData {
  record_id?: string
  fields: {
    书名: string
    作者: string
    状态: string
    当前页码: number
    总页数: number
    笔记?: string
    阅读日期?: string
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

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getFeishuAccessToken()
    const appToken = process.env.FEISHU_APP_TOKEN
    const tableId = process.env.FEISHU_TABLE_ID

    if (!appToken || !tableId) {
      return NextResponse.json(
        { success: false, error: '飞书表格配置不完整' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `${FEISHU_API_BASE}/sheets/v3/spreadsheets/${appToken}/sheets/${tableId}/records`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `获取数据失败: ${data.msg}` },
        { status: response.status }
      )
    }

    const books = (data.data?.records || []).map((record: any) => ({
      record_id: record.record_id,
      title: record.fields?.书名 || '',
      author: record.fields?.作者 || '',
      status: record.fields?.状态 || 'wantToRead',
      currentPage: record.fields?.当前页码 || 0,
      totalPages: record.fields?.总页数 || 0,
      notes: record.fields?.笔记 || '',
    }))

    return NextResponse.json({ success: true, books })
  } catch (error) {
    console.error('获取书籍数据失败:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '获取数据失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookData: BookData = await request.json()
    const accessToken = await getFeishuAccessToken()
    const appToken = process.env.FEISHU_APP_TOKEN
    const tableId = process.env.FEISHU_TABLE_ID

    if (!appToken || !tableId) {
      return NextResponse.json(
        { success: false, error: '飞书表格配置不完整' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `${FEISHU_API_BASE}/sheets/v3/spreadsheets/${appToken}/sheets/${tableId}/records`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: [bookData],
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `添加记录失败: ${data.msg}` },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      record: data.data?.records?.[0],
    })
  } catch (error) {
    console.error('添加书籍失败:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '添加失败' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { recordId, fields } = await request.json()
    const accessToken = await getFeishuAccessToken()
    const appToken = process.env.FEISHU_APP_TOKEN
    const tableId = process.env.FEISHU_TABLE_ID

    if (!appToken || !tableId || !recordId) {
      return NextResponse.json(
        { success: false, error: '参数不完整' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${FEISHU_API_BASE}/sheets/v3/spreadsheets/${appToken}/sheets/${tableId}/records/${recordId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `更新记录失败: ${data.msg}` },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, data: data.data })
  } catch (error) {
    console.error('更新书籍失败:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '更新失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { recordId } = await request.json()
    const accessToken = await getFeishuAccessToken()
    const appToken = process.env.FEISHU_APP_TOKEN
    const tableId = process.env.FEISHU_TABLE_ID

    if (!appToken || !tableId || !recordId) {
      return NextResponse.json(
        { success: false, error: '参数不完整' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${FEISHU_API_BASE}/sheets/v3/spreadsheets/${appToken}/sheets/${tableId}/records/${recordId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `删除记录失败: ${data.msg}` },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除书籍失败:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '删除失败' },
      { status: 500 }
    )
  }
}
