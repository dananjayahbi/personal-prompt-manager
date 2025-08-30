import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prompt = await db.prompt.findUnique({
      where: { id: params.id }
    })
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(prompt)
  } catch (error) {
    console.error("Error fetching prompt:", error)
    return NextResponse.json(
      { error: "Failed to fetch prompt" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, content, description, isFavorite } = body
    
    const existingPrompt = await db.prompt.findUnique({
      where: { id: params.id }
    })
    
    if (!existingPrompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      )
    }
    
    const prompt = await db.prompt.update({
      where: { id: params.id },
      data: {
        title: title ?? existingPrompt.title,
        content: content ?? existingPrompt.content,
        description: description ?? existingPrompt.description,
        isFavorite: isFavorite ?? existingPrompt.isFavorite
      }
    })
    
    return NextResponse.json(prompt)
  } catch (error) {
    console.error("Error updating prompt:", error)
    return NextResponse.json(
      { error: "Failed to update prompt" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingPrompt = await db.prompt.findUnique({
      where: { id: params.id }
    })
    
    if (!existingPrompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      )
    }
    
    await db.prompt.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: "Prompt deleted successfully" })
  } catch (error) {
    console.error("Error deleting prompt:", error)
    return NextResponse.json(
      { error: "Failed to delete prompt" },
      { status: 500 }
    )
  }
}