"use client"

import { Suspense } from "react"
import { MainLayout } from "@/components/main-layout"

function PreviewPageContent() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Preview Page</h1>
        <p className="text-xl text-gray-600">Coming Soon</p>
        <p className="text-sm text-gray-500 max-w-md">
          This page will be redesigned with advanced preview functionality. 
          Please check back later for updates.
        </p>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <MainLayout collapseSidebar={true}>
      <Suspense 
        fallback={
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        }
      >
        <PreviewPageContent />
      </Suspense>
    </MainLayout>
  )
}
