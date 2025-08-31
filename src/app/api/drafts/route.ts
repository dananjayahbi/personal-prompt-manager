import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const drafts = await db.draft.findMany({
      orderBy: { updatedAt: "desc" }
    })
    
    return NextResponse.json(drafts)
  } catch (error) {
    console.error("Error fetching drafts:", error)
    return NextResponse.json(
      { error: "Failed to fetch drafts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, description } = body
    
    const draft = await db.draft.create({
      data: {
        title: title || "",
        content: content || "",
        description: description || ""
      }
    })
    
    return NextResponse.json(draft, { status: 201 })
  } catch (error) {
    console.error("Error creating draft:", error)
    return NextResponse.json(
      { error: "Failed to create draft" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { drafts } = body // Array of drafts to update
    
    if (!Array.isArray(drafts)) {
      return NextResponse.json(
        { error: "Drafts must be an array" },
        { status: 400 }
      )
    }
    
    // Update all drafts in a transaction
    const updatedDrafts = await db.$transaction(
      drafts.map(draft => 
        db.draft.upsert({
          where: { id: draft.id },
          update: {
            title: draft.title || "",
            content: draft.content || "",
            description: draft.description || ""
          },
          create: {
            title: draft.title || "",
            content: draft.content || "",
            description: draft.description || ""
          }
        })
      )
    )
    
    return NextResponse.json(updatedDrafts)
  } catch (error) {
    console.error("Error updating drafts:", error)
    return NextResponse.json(
      { error: "Failed to update drafts" },
      { status: 500 }
    )
  }
}
