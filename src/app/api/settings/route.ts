import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/settings - Get settings
export async function GET() {
  try {
    let settings = await db.settings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    // If no settings exist, create default settings
    if (!settings) {
      settings = await db.settings.create({
        data: {
          theme: "light",
          autoSave: true,
          autoSaveInterval: 2000,
          defaultCategory: "general",
          exportFormat: "json",
          showLineNumbers: true,
          fontSize: 14,
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          wordWrap: true,
          lineHeight: 1.5,
          tabSize: 2,
          bracketMatching: true,
          highlightActiveLine: true,
          showInvisibles: false,
          copyableCommand: "npm run dev"
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Remove id and timestamps from update data
    const { id, createdAt, updatedAt, ...updateData } = body;

    let settings = await db.settings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!settings) {
      // Create new settings if none exist
      settings = await db.settings.create({
        data: updateData
      });
    } else {
      // Update existing settings
      settings = await db.settings.update({
        where: { id: settings.id },
        data: updateData
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
