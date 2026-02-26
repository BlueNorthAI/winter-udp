"use client"

export function ErrorChart() {
  return (
    <div className="h-[150px] w-full border-t pt-4">
      <div className="flex justify-between h-full relative">
        <div className="flex flex-col justify-between">
          <div className="text-xs text-gray-500">2</div>
          <div className="text-xs text-gray-500">1</div>
          <div className="text-xs text-gray-500">0</div>
        </div>

        <div className="flex-1 mx-4 relative">
          {/* Horizontal grid lines */}
          <div className="absolute left-0 right-0 top-0 border-t border-gray-100"></div>
          <div className="absolute left-0 right-0 top-1/3 border-t border-gray-100"></div>
          <div className="absolute left-0 right-0 top-2/3 border-t border-gray-100"></div>
          <div className="absolute left-0 right-0 bottom-0 border-t border-gray-100"></div>

          {/* Bars */}
          <div className="absolute bottom-0 left-[10%] w-6 h-2/3 bg-red-400"></div>
          <div className="absolute bottom-0 left-[40%] w-6 h-1/3 bg-red-400"></div>
          <div className="absolute bottom-0 left-[70%] w-6 h-2/3 bg-red-400"></div>
        </div>

        <div className="flex flex-col justify-between text-right">
          <div className="text-xs text-gray-500">23 Apr, 12 AM</div>
          <div className="text-xs text-gray-500">23 Apr, 12 PM</div>
          <div className="text-xs text-gray-500">24 Apr, 12 AM</div>
          <div className="text-xs text-gray-500">24 Apr, 12 PM</div>
        </div>
      </div>
    </div>
  )
}
