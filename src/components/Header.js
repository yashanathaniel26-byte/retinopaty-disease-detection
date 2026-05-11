'use client';

import { Eye, Play, Zap } from 'lucide-react';

export default function Header({ 
  modelStatus, 
  isAnalyzing, 
  onDemoClick 
}) {
  const getStatusColor = () => {
    switch (modelStatus) {
      case 'ready': return 'text-green-600';
      case 'loading': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (modelStatus) {
      case 'ready': return 'AI Ready';
      case 'loading': return 'Loading...';
      case 'error': return 'Unavailable';
      default: return 'Initializing...';
    }
  };

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4">
      <nav className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl shadow-black/10" style={{backdropFilter: 'blur(40px)'}}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 border-2 border-white rounded-full relative">
                  <div className="absolute inset-1 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">RetinaScan</h1>
                <p className="text-xs text-gray-600 -mt-0.5">AI Medical Diagnostics</p>
              </div>
              <div className="block sm:hidden">
                <h1 className="text-base font-bold text-gray-900">RetinaScan</h1>
              </div>
            </div>

            {/* Right: Status & Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              
              {/* Status Indicator */}
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-full border border-white/50">
                <div className={`w-2 h-2 rounded-full ${
                  modelStatus === 'ready' ? 'bg-green-500' : 
                  modelStatus === 'loading' ? 'bg-yellow-500 animate-pulse' : 
                  'bg-red-500'
                }`}></div>
                <span className={`text-xs font-medium ${getStatusColor()} hidden sm:block`}>
                  {getStatusText()}
                </span>
                <span className={`text-xs font-medium ${getStatusColor()} sm:hidden`}>
                  {modelStatus === 'ready' ? 'Ready' : modelStatus === 'loading' ? 'Loading' : 'Error'}
                </span>
              </div>

              {/* Demo Button */}
              <button
                onClick={onDemoClick}
                disabled={isAnalyzing}
                className="inline-flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium text-sm backdrop-blur-sm"
              >
                <Play className="w-4 h-4" />
                <span className="hidden sm:block">Try Demo</span>
                <span className="block sm:hidden">Demo</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
