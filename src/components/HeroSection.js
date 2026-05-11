'use client';

import { Zap, Eye, Target, Users, Clock, Sparkles, Brain, Shield } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative text-center mb-12 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-5 md:left-10 w-48 h-48 md:w-72 md:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 md:opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-5 md:right-10 w-48 h-48 md:w-72 md:h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 md:opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute -top-10 left-1/2 w-48 h-48 md:w-72 md:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 md:opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Enhanced Badge with Animation */}
      <div className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 text-blue-800 rounded-full text-xs md:text-sm font-medium mb-6 md:mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
          <span className="flex items-center space-x-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">19</span>
            <span>Retinal Conditions</span>
          </span>
          <span className="text-blue-400">•</span>
          <span className="flex items-center space-x-1">
            <Brain className="w-3 h-3" />
            <span>AI-Powered</span>
          </span>
          <span className="text-blue-400">•</span>
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Real-Time</span>
          </span>
        </div>
      </div>
      
      {/* Dynamic Animated Title */}
      <div className="relative mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
          <span className="inline-block transition-transform duration-300">
            The Future of
          </span>
          <br />
          <span className="relative inline-block group">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x bg-300% font-extrabold">
              Retinal Intelligence
            </span>
            {/* Animated underline */}
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"></div>
          </span>
        </h1>
        
        {/* Floating Icons - Hidden on mobile */}
        <div className="hidden md:block absolute -top-8 -left-8 opacity-20">
          <Eye className="w-12 h-12 text-blue-500 animate-bounce animation-delay-1000" />
        </div>
        <div className="hidden md:block absolute -top-4 -right-8 opacity-20">
          <Brain className="w-10 h-10 text-indigo-500 animate-bounce animation-delay-2000" />
        </div>
      </div>
      
      {/* Simple Modern Description */}
      <div className="max-w-4xl mx-auto mb-12 md:mb-16 px-4">
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed mb-6 md:mb-8 font-light">
          Advanced AI technology that analyzes retinal images with 
          <span className="text-blue-600 font-medium"> clinical-grade precision</span>, 
          delivering comprehensive diagnostic insights in seconds.
        </p>
        
        {/* Simple Process Flow */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-6 md:space-x-12">
          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Eye className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">Upload</span>
          </div>
          
          <div className="hidden sm:block w-6 md:w-12 h-0.5 bg-gradient-to-r from-blue-300 to-indigo-300"></div>
          
          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-indigo-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Brain className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">Analyze</span>
          </div>
          
          <div className="hidden sm:block w-6 md:w-12 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300"></div>
          
          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-purple-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">Results</span>
          </div>
        </div>
      </div>

      {/* Simple Clean Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mb-12 px-4">
        <div className="text-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-lg md:rounded-xl mx-auto flex items-center justify-center mb-2 md:mb-3">
              <Eye className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">19</div>
          <div className="text-xs md:text-sm text-gray-600 font-medium">Disease Classes</div>
        </div>
        
        <div className="text-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500 rounded-lg md:rounded-xl mx-auto flex items-center justify-center mb-2 md:mb-3">
              <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">95%</div>
          <div className="text-xs md:text-sm text-gray-600 font-medium">Clinical Accuracy</div>
        </div>
        
        <div className="text-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 rounded-lg md:rounded-xl mx-auto flex items-center justify-center mb-2 md:mb-3">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">10K+</div>
          <div className="text-xs md:text-sm text-gray-600 font-medium">Medical Images</div>
        </div>
        
        <div className="text-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-lg md:rounded-xl mx-auto flex items-center justify-center mb-2 md:mb-3">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">&lt;3s</div>
          <div className="text-xs md:text-sm text-gray-600 font-medium">Analysis Time</div>
        </div>
      </div>
    </div>
  );
}
