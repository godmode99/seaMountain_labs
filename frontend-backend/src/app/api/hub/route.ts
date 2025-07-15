import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ message: 'hub list placeholder' })
}

export async function POST(request: Request) {
  return NextResponse.json({ message: 'create hub placeholder' })
}
