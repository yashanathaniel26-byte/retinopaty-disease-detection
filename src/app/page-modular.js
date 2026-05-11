'use client';

import { useState, useEffect } from 'react';
import React from 'react';

// Import all modular components
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import UploadSection from '../components/UploadSection';
import HowItWorks from '../components/HowItWorks';
import AnalysisResults from '../components/AnalysisResults';
import EyeConditions from '../components/EyeConditions';
import Footer from '../components/Footer';

// Import utilities and data
import { eyeConditions } from '../data/eyeConditions';
import { demoImages } from '../data/demoImages';

export default function Home() {
  // State management
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [modelStatus, setModelStatus] = useState('loading');
  const [selectedSeverityInfo, setSelectedSeverityInfo] = useState(null);
  const [showDemo, setShowDemo] = useState(false);

  // Model loading effect
  useEffect(() => {
    const initializeModel = async () => {
      try {
        setModelStatus('loading');
        
        // Simulate model loading (replace with actual model loading)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setModelStatus('ready');
      } catch (error) {
        console.error('Model loading failed:', error);
        setModelStatus('error');
      }
    };

    initializeModel();
  }, []);

  // Handle image selection
  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setAnalysisResult(null); // Clear previous results
  };

  // Handle analysis
  const handleAnalyze = async () => {
    if (!selectedImage || modelStatus !== 'ready') return;

    setIsAnalyzing(true);
    
    try {
      // Simulate analysis (replace with actual AI inference)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock result (replace with actual analysis result)
      const conditions = Object.keys(eyeConditions);
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-99%
      
      setAnalysisResult({
        condition: randomCondition,
        confidence: confidence,
        processingTime: '2.3s'
      });

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-area')?.scrollIntoView({ 
          behavior: 'smooth' 
        });
      }, 100);
      
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle demo
  const handleDemo = () => {
    setShowDemo(true);
  };

  // Handle condition click
  const handleConditionClick = (condition) => {
    setSelectedSeverityInfo(condition);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <Header 
        modelStatus={modelStatus}
        isAnalyzing={isAnalyzing}
        onDemoClick={handleDemo}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* First Row - Upload and How It Works */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <UploadSection 
            selectedImage={selectedImage}
            onImageSelect={handleImageSelect}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            modelStatus={modelStatus}
          />
          <HowItWorks />
        </div>

        {/* Analysis Results Section - Full Width */}
        <AnalysisResults 
          analysisResult={analysisResult}
          eyeConditions={eyeConditions}
          selectedImage={selectedImage}
        />

        {/* Eye Conditions Section - Full Width */}
        <EyeConditions 
          eyeConditions={eyeConditions}
          onConditionClick={handleConditionClick}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals and overlays can be added here */}
      {selectedSeverityInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              {React.createElement(selectedSeverityInfo.icon, {
                className: `w-8 h-8 ${selectedSeverityInfo.color}`
              })}
              <h3 className="text-xl font-bold text-gray-900">
                {selectedSeverityInfo.label}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {selectedSeverityInfo.description}
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Recommendation:</h4>
              <p className="text-sm text-gray-700">
                {selectedSeverityInfo.recommendation}
              </p>
            </div>
            <button
              onClick={() => setSelectedSeverityInfo(null)}
              className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
