import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { password } = body
  
  if (password === (process.env.ADMIN_PASSWORD || 'masterman-editor')) {
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'true', { httpOnly: true, path: '/' })
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json({ success: false }, { status: 401 })
}

export async function DELETE(request: Request) {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    return NextResponse.json({ success: true })
}
