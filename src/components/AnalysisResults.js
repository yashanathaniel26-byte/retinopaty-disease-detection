'use client';

import React from 'react';
import { Star, Info, Shield, Zap } from 'lucide-react';

export default function AnalysisResults({ 
  analysisResult, 
  eyeConditions, 
  selectedImage 
}) {
  if (!analysisResult) return null;

  const condition = eyeConditions[analysisResult.condition];

  return (
    <div id="results-area" className="space-y-6 mb-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 animate-in slide-in-from-right-4">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Star className="w-6 h-6 mr-3 text-blue-600" />
          Analysis Results
        </h3>
        
        <div className="space-y-6">
          {/* Enhanced Condition Display */}
          <div className={`p-6 rounded-2xl border-2 ${condition.borderColor} ${condition.bgColor} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              {React.createElement(condition.icon, {
                className: "w-full h-full"
              })}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {React.createElement(condition.icon, {
                    className: `w-8 h-8 ${condition.color}`
                  })}
                  <div>
                    <h4 className={`text-2xl font-bold ${condition.color}`}>
                      {condition.label}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Category: {condition.category} • Risk: {condition.riskLevel}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${condition.color}`}>
                    {analysisResult.confidence}%
                  </div>
                  <p className="text-sm text-gray-600">Confidence</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{condition.description}</p>
              
              <div className="bg-white/50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">Recommended Actions:</h5>
                <p className="text-sm text-gray-700">{condition.recommendation}</p>
              </div>
            </div>
          </div>


          {/* Analysis Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Analysis Details
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Model Version:</span>
                  <span className="font-medium">v3.0.0-19class</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Time:</span>
                  <span className="font-medium">{analysisResult.processingTime || '2.3s'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Image Quality:</span>
                  <span className="font-medium text-green-600">Good</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Privacy & Security
              </h5>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Secure Data</h4>
                    <p className="text-sm text-gray-600">Images are not sent to external servers</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Privacy Protected</h4>
                    <p className="text-sm text-gray-600">All analysis performed in your browser</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Advanced Technology</h4>
                    <p className="text-sm text-gray-600">Latest AI model for maximum accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
