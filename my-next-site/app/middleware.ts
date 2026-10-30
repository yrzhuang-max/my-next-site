import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const host = request.headers.get('host') || ''
  const targetHost = 'filedocswift.com'

  // 两种情况重定向：带 www  或者 http 协议
  if (host.startsWith('www.') || url.protocol === 'http:') {
    const newUrl = new URL(`https://${targetHost}${url.pathname}${url.search}`, request.url)
    return NextResponse.redirect(newUrl, 301)
  }

  return NextResponse.next()
}

// 匹配全站所有路由
export const config = {
  matcher: ['/:path*'],
}