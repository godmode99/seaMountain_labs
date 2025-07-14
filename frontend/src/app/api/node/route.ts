import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ message: 'node list placeholder' })
}

export async function POST(request: Request) {
  return NextResponse.json({ message: 'create node placeholder' })
}
