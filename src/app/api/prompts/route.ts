import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const favorites = searchParams.get("favorites")
    
    let whereClause = {}
    
    if (favorites === "true") {
      whereClause = { isFavorite: true }
    }
    
    const prompts = await db.prompt.findMany({
      where: whereClause,
      orderBy: { updatedAt: "desc" }
    })
    
    return NextResponse.json(prompts)
  } catch (error) {
    console.error("Error fetching prompts:", error)
    return NextResponse.json(
      { error: "Failed to fetch prompts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, description, isFavorite } = body
    
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }
    
    const prompt = await db.prompt.create({
      data: {
        title,
        content,
        description,
        isFavorite: isFavorite || false
      }
    })
    
    return NextResponse.json(prompt, { status: 201 })
  } catch (error) {
    console.error("Error creating prompt:", error)
    return NextResponse.json(
      { error: "Failed to create prompt" },
      { status: 500 }
    )
  }
}