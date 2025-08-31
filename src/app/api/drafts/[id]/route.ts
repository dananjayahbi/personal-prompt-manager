import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const existingDraft = await db.draft.findUnique({
      where: { id }
    })
    
    if (!existingDraft) {
      return NextResponse.json(
        { error: "Draft not found" },
        { status: 404 }
      )
    }
    
    await db.draft.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: "Draft deleted successfully" })
  } catch (error) {
    console.error("Error deleting draft:", error)
    return NextResponse.json(
      { error: "Failed to delete draft" },
      { status: 500 }
    )
  }
}
