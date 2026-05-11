'use client';

import React, { useState, useEffect } from 'react';
import { isModelReady, getModelStatus } from '../utils/simpleModelLoader';

export default function ModelDebugger() {
  const [debugInfo, setDebugInfo] = useState({
    modelReady: false,
    error: null,
    logs: []
  });

  const addLog = (message) => {
    setDebugInfo(prev => ({
      ...prev,
      logs: [...prev.logs, `${new Date().toLocaleTimeString()}: ${message}`]
    }));
  };

  const checkModelStatus = () => {
    const status = getModelStatus();
    setDebugInfo(prev => ({
      ...prev,
      modelReady: status.isLoaded
    }));
    
    if (status.isLoaded) {
      addLog('✓ Model is ready');
    } else if (status.isLoading) {
      addLog('⏳ Model is loading...');
    } else {
      addLog('✗ Model not loaded');
    }
  };

  const testModelFile = async () => {
    try {
      addLog('Testing model file accessibility...');
      const response = await fetch('/retinal_classifier_efficientnet_b1.onnx', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const size = response.headers.get('content-length');
        addLog(`✓ Model file accessible (${size} bytes)`);
      } else {
        addLog(`✗ Model file not accessible: ${response.status}`);
      }
    } catch (error) {
      addLog(`✗ Error checking model file: ${error.message}`);
    }
  };

  const testONNXRuntime = () => {
    if (typeof window !== 'undefined' && window.ort) {
      addLog('✓ ONNX Runtime available');
      addLog(`Version: ${window.ort.env?.versions?.web || 'unknown'}`);
    } else {
      addLog('✗ ONNX Runtime not available');
    }
  };

  const clearLogs = () => {
    setDebugInfo(prev => ({ ...prev, logs: [] }));
  };

  useEffect(() => {
    // Auto-run basic checks
    checkModelStatus();
    testONNXRuntime();
    testModelFile();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-y-auto z-50">
      <h3 className="text-lg font-semibold mb-3">Model Debug Info</h3>
      
      <div className="space-y-2 mb-4">
        <div className={`flex items-center space-x-2 ${debugInfo.modelReady ? 'text-green-600' : 'text-red-600'}`}>
          <span>{debugInfo.modelReady ? '✓' : '✗'}</span>
          <span>Model: {debugInfo.modelReady ? 'Ready' : 'Not Ready'}</span>
        </div>
      </div>

      {debugInfo.error && (
        <div className="bg-red-50 border border-red-200 rounded p-2 mb-4">
          <p className="text-red-800 text-sm font-medium">Error:</p>
          <p className="text-red-700 text-xs">{debugInfo.error}</p>
        </div>
      )}

      <div className="space-y-1">
        <h4 className="text-sm font-medium">Debug Logs:</h4>
        <div className="bg-gray-50 rounded p-2 text-xs max-h-32 overflow-y-auto">
          {debugInfo.logs.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1">
        <button
          onClick={checkModelStatus}
          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Check Model
        </button>
        <button
          onClick={testModelFile}
          className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
        >
          Test File
        </button>
        <button
          onClick={testONNXRuntime}
          className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
        >
          Test ONNX
        </button>
        <button
          onClick={clearLogs}
          className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
        >
          Clear Logs
        </button>
      </div>
    </div>
  );
}
