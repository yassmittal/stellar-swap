'use client'

import { Card, CardContent } from '@/components/ui/card'

export default function SwapInterface() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gray-900 border-gray-800 shadow-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
