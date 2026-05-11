'use client';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Mobile: Ultra minimal centered */}
        <div className="block sm:hidden text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-2.5 h-2.5 border border-white rounded-full relative">
                <div className="absolute inset-0.5 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="font-semibold text-gray-900">RetinaScan</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">AI-Powered Eye Disease Detection</p>
            <p className="text-xs text-gray-400">© 2025 RetinaScan. All rights reserved.</p>
          </div>
          <div className="pt-1">
            <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200">
              For Medical Screening Only
            </span>
          </div>
        </div>

        {/* Tablet & Desktop: Clean two-section layout */}
        <div className="hidden sm:flex items-center justify-between">
          
          {/* Left: Brand & Copyright */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 border border-white rounded-full relative">
                  <div className="absolute inset-0.5 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-900">RetinaScan</span>
                <span className="text-gray-500 text-sm ml-2">by AI Medical</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              © 2025 All rights reserved
            </div>
          </div>

          {/* Right: Disclaimer */}
          <div className="flex items-center">
            <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200 font-medium">
              For Medical Screening Only
            </span>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
