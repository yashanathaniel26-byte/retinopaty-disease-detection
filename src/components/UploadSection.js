'use client';

import { useState } from 'react';
import { Upload, Image as ImageIcon, Zap, AlertCircle } from 'lucide-react';

export default function UploadSection({ 
  selectedImage, 
  onImageSelect, 
  onAnalyze, 
  isAnalyzing, 
  modelStatus 
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Upload className="w-6 h-6 mr-3 text-blue-600" />
        Upload Fundus Image
      </h3>
      
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : selectedImage 
              ? 'border-blue-300 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {selectedImage ? (
          <div className="space-y-4">
            <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border-2 border-blue-200">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected fundus"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-blue-700 font-medium">{selectedImage.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Drop your fundus image here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <div className="mt-6">
        <button
          onClick={onAnalyze}
          disabled={!selectedImage || isAnalyzing || modelStatus !== 'ready'}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Analyze Image</span>
            </>
          )}
        </button>
        
        {modelStatus !== 'ready' && (
          <div className="mt-3 flex items-center justify-center space-x-2 text-sm text-amber-600">
            <AlertCircle className="w-4 h-4" />
            <span>AI model is loading, please wait...</span>
          </div>
        )}
      </div>

      {/* File Requirements */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>• Supported formats: JPG, PNG, JPEG</p>
        <p>• Maximum file size: 10MB</p>
        <p>• Best quality: High-resolution fundus images</p>
      </div>
    </div>
  );
}
