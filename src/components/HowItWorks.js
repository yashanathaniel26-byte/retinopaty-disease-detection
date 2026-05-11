'use client';

import { Upload, Zap, Activity } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Image",
      description: "Upload your fundus image using our secure drag & drop interface",
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      icon: Zap,
      title: "AI Analysis",
      description: "Our advanced AI model analyzes your image for 19 different eye conditions",
      color: "text-emerald-500",
      bgColor: "bg-emerald-100"
    },
    {
      icon: Activity,
      title: "Get Results",
      description: "Get detection results with confidence scores and recommended actions",
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Activity className="w-6 h-6 mr-3 text-emerald-600" />
        How It Works
      </h3>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-4 group">
            <div className={`flex-shrink-0 w-12 h-12 ${step.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <step.icon className={`w-6 h-6 ${step.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                  {index + 1}
                </span>
                <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
              </div>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
            <Activity className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-5 h-5 text-emerald-600" />
          <h4 className="font-semibold text-emerald-800">Privacy First</h4>
        </div>
        <p className="text-sm text-emerald-700">
          All processing happens locally in your browser. Your images never leave your device.
        </p>
      </div>
    </div>
  );
}
