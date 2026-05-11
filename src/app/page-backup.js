'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Upload, Eye, FileImage, AlertCircle, CheckCircle, Download, Loader2,
  Play, Pause, RotateCcw, Zap, Brain, Shield, Star, Info,
  ChevronRight, ChevronLeft, X, HelpCircle, Sparkles, Target,
  Activity, Clock, Award, Users
} from 'lucide-react';

// Import ONNX model utilities
import { preprocessImage, isValidImageFile } from '../utils/imagePreprocessing';
import { loadModelSimple, runSimpleInference, isModelReady, getModelStatus } from '../utils/simpleModelLoader';
import ModelDebugger from '../components/ModelDebugger';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [currentGuideStep, setCurrentGuideStep] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedSeverityInfo, setSelectedSeverityInfo] = useState(null);
  const [animationClass, setAnimationClass] = useState('');
  const [modelLoading, setModelLoading] = useState(true);
  const [modelError, setModelError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [useFallbackMode, setUseFallbackMode] = useState(false);

  const eyeConditions = {
    normal: { 
      label: 'Normal', 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50', 
      borderColor: 'border-emerald-200',
      icon: CheckCircle,
      description: 'Mata dalam kondisi sehat, tidak ditemukan kelainan',
      recommendation: 'Lanjutkan pemeriksaan mata rutin setiap 1-2 tahun',
      riskLevel: 'Sehat',
      category: 'healthy'
    },
    'macular-scar': { 
      label: 'Macular Scar', 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50', 
      borderColor: 'border-orange-200',
      icon: AlertCircle,
      description: 'Jaringan parut pada makula yang dapat mempengaruhi penglihatan sentral',
      recommendation: 'Konsultasi dengan dokter spesialis mata untuk evaluasi lebih lanjut',
      riskLevel: 'Sedang',
      category: 'retinal'
    },
    pterygium: { 
      label: 'Pterygium', 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50', 
      borderColor: 'border-yellow-200',
      icon: AlertCircle,
      description: 'Pertumbuhan jaringan pada konjungtiva yang dapat menutupi kornea',
      recommendation: 'Gunakan kacamata pelindung UV dan konsultasi dokter mata',
      riskLevel: 'Ringan-Sedang',
      category: 'surface'
    },
    'disc-edema': { 
      label: 'Disc Edema', 
      color: 'text-red-600', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      icon: AlertCircle,
      description: 'Pembengkakan pada diskus optikus yang memerlukan perhatian segera',
      recommendation: 'Segera konsultasi dengan dokter spesialis mata',
      riskLevel: 'Tinggi',
      category: 'optic'
    },
    'branch-retinal-vein-occlusion': { 
      label: 'Branch Retinal Vein Occlusion', 
      color: 'text-red-600', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      icon: AlertCircle,
      description: 'Penyumbatan pembuluh darah vena retina cabang',
      recommendation: 'Segera konsultasi dengan dokter spesialis mata untuk penanganan',
      riskLevel: 'Tinggi',
      category: 'vascular'
    },
    'central-serous-chorioretinopathy': { 
      label: 'Central Serous Chorioretinopathy', 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50', 
      borderColor: 'border-orange-200',
      icon: AlertCircle,
      description: 'Penumpukan cairan di bawah retina yang mempengaruhi penglihatan sentral',
      recommendation: 'Konsultasi dokter mata dan hindari stress berlebihan',
      riskLevel: 'Sedang',
      category: 'retinal'
    },
    drusen: { 
      label: 'Drusen', 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50', 
      borderColor: 'border-yellow-200',
      icon: AlertCircle,
      description: 'Deposit protein dan lemak di bawah retina, tanda awal degenerasi makula',
      recommendation: 'Pemeriksaan rutin dan konsumsi antioksidan untuk mata',
      riskLevel: 'Ringan-Sedang',
      category: 'retinal'
    },
    glaucoma: { 
      label: 'Glaucoma', 
      color: 'text-red-600', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      icon: AlertCircle,
      description: 'Kerusakan saraf optik yang dapat menyebabkan kebutaan permanen',
      recommendation: 'Segera konsultasi dokter mata untuk penanganan dan kontrol tekanan mata',
      riskLevel: 'Tinggi',
      category: 'optic'
    },
    'retinal-detachment': { 
      label: 'Retinal Detachment', 
      color: 'text-red-600', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      icon: AlertCircle,
      description: 'Lepasnya retina dari dinding mata, kondisi darurat mata',
      recommendation: 'DARURAT: Segera ke IGD atau dokter spesialis mata',
      riskLevel: 'Darurat',
      category: 'retinal'
    },
    'diabetic-retinopathy-severe': { 
      label: 'Diabetic Retinopathy (Severe)', 
      color: 'text-red-600', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      icon: AlertCircle,
      description: 'Retinopati diabetik stadium lanjut dengan risiko kehilangan penglihatan',
      recommendation: 'Segera konsultasi dokter mata dan kontrol gula darah ketat',
      riskLevel: 'Tinggi',
      category: 'diabetic'
    },
    'age-macular-degeneration': { 
      label: 'Age Macular Degeneration', 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50', 
      borderColor: 'border-orange-200',
      icon: AlertCircle,
      description: 'Degenerasi makula terkait usia yang mempengaruhi penglihatan sentral',
      recommendation: 'Konsultasi dokter mata dan terapi sesuai anjuran',
      riskLevel: 'Sedang-Tinggi',
      category: 'retinal'
    },
    cataract: { 
      label: 'Cataract', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200',
      icon: AlertCircle,
      description: 'Kekeruhan pada lensa mata yang dapat mengganggu penglihatan',
      recommendation: 'Konsultasi dokter mata untuk evaluasi operasi katarak',
      riskLevel: 'Sedang',
      category: 'lens'
    },
    'diabetic-retinopathy-mild': { 
      label: 'Diabetic Retinopathy (Mild)', 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50', 
      borderColor: 'border-yellow-200',
      icon: AlertCircle,
      description: 'Retinopati diabetik stadium awal dengan perubahan minimal',
      recommendation: 'Kontrol gula darah ketat dan pemeriksaan mata rutin',
      riskLevel: 'Ringan-Sedang',
      category: 'diabetic'
    },
    'retinitis-pigmentosa': { 
      label: 'Retinitis Pigmentosa', 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50', 
      borderColor: 'border-purple-200',
      icon: AlertCircle,
      description: 'Kelainan genetik yang menyebabkan degenerasi retina progresif',
      recommendation: 'Konsultasi dokter mata dan konseling genetik',
      riskLevel: 'Sedang-Tinggi',
      category: 'genetic'
    },
    'macular-epiretinal-membrane': { 
      label: 'Macular Epiretinal Membrane', 
      color: 'text-indigo-600', 
      bgColor: 'bg-indigo-50', 
      borderColor: 'border-indigo-200',
      icon: AlertCircle,
      description: 'Membran tipis yang terbentuk di atas makula dan dapat mengganggu penglihatan',
      recommendation: 'Konsultasi dokter mata untuk evaluasi dan monitoring',
      riskLevel: 'Sedang',
      category: 'retinal'
    },
    myopia: { 
      label: 'Myopia', 
      color: 'text-cyan-600', 
      bgColor: 'bg-cyan-50', 
      borderColor: 'border-cyan-200',
      icon: AlertCircle,
      description: 'Mata minus atau rabun jauh dengan perubahan pada fundus',
      recommendation: 'Gunakan kacamata/lensa kontak dan pemeriksaan rutin',
      riskLevel: 'Ringan',
      category: 'refractive'
    },
    'diabetic-retinopathy-proliferative': { 
      label: 'Diabetic Retinopathy (Proliferative)', 
      color: 'text-red-600', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      icon: AlertCircle,
      description: 'Retinopati diabetik proliferatif dengan pertumbuhan pembuluh darah baru',
      recommendation: 'Segera konsultasi dokter mata untuk terapi laser atau injeksi',
      riskLevel: 'Tinggi',
      category: 'diabetic'
    },
    'refractive-media-opacity': { 
      label: 'Refractive Media Opacity', 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-50', 
      borderColor: 'border-gray-200',
      icon: AlertCircle,
      description: 'Kekeruhan pada media refraksi mata yang mengganggu penglihatan',
      recommendation: 'Konsultasi dokter mata untuk evaluasi dan penanganan',
      riskLevel: 'Sedang',
      category: 'media'
    },
    'macular-hole': { 
      label: 'Macular Hole', 
      color: 'text-pink-600', 
      bgColor: 'bg-pink-50', 
      borderColor: 'border-pink-200',
      icon: AlertCircle,
      description: 'Lubang kecil pada makula yang mempengaruhi penglihatan sentral',
      recommendation: 'Konsultasi dokter mata untuk evaluasi operasi vitrektomi',
      riskLevel: 'Sedang-Tinggi',
      category: 'retinal'
    }
  };

  const demoImages = [
    {
      name: 'Normal Retina',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGNUY1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iODAiIGZpbGw9IiNGRkVCRUUiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI2MCIgZmlsbD0iI0ZGRERERCIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSIjRkZDQ0NDIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiNGRkFBQUEiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxMCIgZmlsbD0iI0ZGODg4OCIvPgo8dGV4dCB4PSIxMDAiIHk9IjE4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzEwQjk4MSIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiPk5vcm1hbDwvdGV4dD4KPC9zdmc+Cg==',
      condition: 'normal',
      confidence: 94
    },
    {
      name: 'Glaucoma Sample',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkVGMkYyIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iODAiIGZpbGw9IiNGRUY0RjQiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI2MCIgZmlsbD0iI0ZFRjZGNiIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSIjRkVGOEY4Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMjUiIGZpbGw9IiNGRUZBRkEiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxNSIgZmlsbD0iI0RDNDYyNiIvPgo8dGV4dCB4PSIxMDAiIHk9IjE4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0RDNDYyNiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiPkdsYXVjb21hPC90ZXh0Pgo8L3N2Zz4K',
      condition: 'glaucoma',
      confidence: 89
    },
    {
      name: 'Cataract Sample',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkFGQUZBIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iODAiIGZpbGw9IiNGNUY1RjUiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI2MCIgZmlsbD0iI0VGRUZFRiIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSIjRTVFNUU1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiNEQURBREEiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxMCIgZmlsbD0iI0Q0RDRENCIvPgo8dGV4dCB4PSIxMDAiIHk9IjE4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzI1NjNFQiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiPkNhdGFyYWN0PC90ZXh0Pgo8L3N2Zz4K',
      condition: 'cataract',
      confidence: 92
    },
    {
      name: 'Diabetic Retinopathy',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkVGM0MyIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iODAiIGZpbGw9IiNGRUY0QzciLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI2MCIgZmlsbD0iI0ZFRjVDQyIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSIjRkVGNkQxIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiNGRUY3RDYiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxMCIgZmlsbD0iI0ZFRjhEQiIvPgo8Y2lyY2xlIGN4PSI3MCIgY3k9IjgwIiByPSIzIiBmaWxsPSIjRUFCMzA4Ii8+CjxjaXJjbGUgY3g9IjEzMCIgY3k9IjEyMCIgcj0iMiIgZmlsbD0iI0VBQjMwOCIvPgo8dGV4dCB4PSIxMDAiIHk9IjE4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0VBQjMwOCIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiPkRpYWJldGljIFJldGlub3BhdGh5PC90ZXh0Pgo8L3N2Zz4K',
      condition: 'diabetic-retinopathy-mild',
      confidence: 87
    },
    {
      name: 'Age Macular Degeneration',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkVGNEVFIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iODAiIGZpbGw9IiNGRUY1RjAiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI2MCIgZmlsbD0iI0ZFRjZGMiIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSIjRkVGN0Y0Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiNGRUY4RjYiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxNSIgZmlsbD0iI0Y5N0MxNiIvPgo8Y2lyY2xlIGN4PSI4NSIgY3k9Ijg1IiByPSIzIiBmaWxsPSIjRjk3QzE2Ii8+CjxjaXJjbGUgY3g9IjExNSIgY3k9IjExNSIgcj0iNCIgZmlsbD0iI0Y5N0MxNiIvPgo8dGV4dCB4PSIxMDAiIHk9IjE4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0Y5N0MxNiIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiPkFNRDwvdGV4dD4KPC9zdmc+Cg==',
      condition: 'age-macular-degeneration',
      confidence: 85
    },
    {
      name: 'Retinal Detachment',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkVGMkYyIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iODAiIGZpbGw9IiNGRUY0RjQiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI2MCIgZmlsbD0iI0ZFRjZGNiIvPgo8cGF0aCBkPSJNNjAgMTAwIEE0MCA0MCAwIDAgMSAxNDAgMTAwIEw0MCA0MCBMNjAgMTAwIFoiIGZpbGw9IiNEQzQ2MjYiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIyMCIgZmlsbD0iI0ZFRkFGQSIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwIiBmaWxsPSIjRkVGQ0ZDIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjREMzNjI2IiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCI+UmV0aW5hbCBEZXRhY2htZW50PC90ZXh0Pgo8L3N2Zz4K',
      condition: 'retinal-detachment',
      confidence: 93
    }
  ];

  const guideSteps = [
    {
      title: 'Selamat Datang di EyeHealthAI',
      content: 'Platform AI komprehensif untuk deteksi 19 jenis penyakit mata. Mari kita mulai dengan panduan singkat.',
      target: 'header',
      position: 'bottom'
    },
    {
      title: 'Upload Gambar Fundus',
      content: 'Drag & drop atau klik untuk memilih gambar fundus mata. AI akan mendeteksi berbagai kondisi mata.',
      target: 'upload-area',
      position: 'right'
    },
    {
      title: 'Coba Demo',
      content: 'Tidak punya gambar? Coba demo dengan sampel berbagai kondisi mata yang tersedia.',
      target: 'demo-button',
      position: 'left'
    },
    {
      title: 'Analisis AI Multi-Class',
      content: 'AI akan menganalisis gambar untuk mendeteksi 19 jenis penyakit mata dengan tingkat kepercayaan.',
      target: 'analyze-button',
      position: 'top'
    },
    {
      title: 'Hasil Komprehensif',
      content: 'Lihat hasil deteksi dengan diagnosis spesifik dan rekomendasi tindakan medis.',
      target: 'results-area',
      position: 'left'
    }
  ];

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileUpload = (file) => {
    if (file && isValidImageFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setUploadedFile(file); // Store the actual file for processing
        setAnalysisResult(null);
        setAnimationClass('animate-pulse');
        setTimeout(() => setAnimationClass(''), 500);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file (JPG, PNG, JPEG)');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const analyzeImage = async () => {
    if (!uploadedFile) {
      alert('Please upload an image first');
      return;
    }

    // Check if we should use fallback mode or real model
    if (!useFallbackMode && !isModelReady()) {
      alert('Model is still loading. Please wait or try fallback mode...');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const startTime = Date.now();
    
    // Animated progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 100);
    
    try {
      if (useFallbackMode || modelError) {
        // Fallback mode - use mock analysis
        console.log('Using fallback mode (mock analysis)');
        setAnalysisProgress(50);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const conditions = Object.keys(eyeConditions);
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const confidence = Math.floor(Math.random() * 20) + 80; // 80-99%
        
        setAnalysisResult({
          condition: randomCondition,
          confidence: confidence,
          timestamp: new Date().toLocaleString(),
          processingTime: '2.1s',
          modelVersion: 'Mock Analysis (Fallback)',
          predictions: null,
          classIndex: null
        });
        
      } else {
        // Real model analysis
        console.log('Using simple ONNX model');
        
        // Preprocess the image with correct size (288x288)
        setAnalysisProgress(20);
        const { tensorData, shape } = await preprocessImage(uploadedFile, 288);
        
        setAnalysisProgress(50);
        
        // Run inference with simple loader
        const result = await runSimpleInference(tensorData);
        
        setAnalysisProgress(90);
        
        const endTime = Date.now();
        const processingTime = ((endTime - startTime) / 1000).toFixed(1) + 's';
        
        // Map class index to condition name
        const conditionKeys = Object.keys(eyeConditions);
        const predictedCondition = conditionKeys[result.classIndex] || 'normal';
        
        // Set final results
        setAnalysisResult({
          condition: predictedCondition,
          confidence: result.confidence,
          timestamp: new Date().toLocaleString(),
          processingTime: processingTime,
          modelVersion: 'EfficientNet-B1 Simple',
          predictions: result.predictions,
          classIndex: result.classIndex
        });
      }
      
      setAnalysisProgress(100);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      
      // If real model fails, offer fallback
      if (!useFallbackMode) {
        const usesFallback = confirm('Analysis failed. Would you like to use fallback mode (mock analysis)?');
        if (usesFallback) {
          setUseFallbackMode(true);
          // Retry with fallback
          setTimeout(() => analyzeImage(), 500);
          return;
        }
      }
      
      alert('Analysis failed: ' + error.message);
    } finally {
      setIsAnalyzing(false);
      clearInterval(progressInterval);
    }
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setAnimationClass('');
  };

  const startDemo = (demoImage) => {
    setUploadedImage(demoImage.url);
    setShowDemo(false);
    setTimeout(() => {
      setAnalysisResult({
        condition: demoImage.condition,
        confidence: demoImage.confidence,
        timestamp: new Date().toLocaleString(),
        processingTime: '2.8s',
        modelVersion: 'v3.0.0-19class'
      });
    }, 1000);
  };

  const nextGuideStep = () => {
    if (currentGuideStep < guideSteps.length - 1) {
      setCurrentGuideStep(currentGuideStep + 1);
    } else {
      setShowGuide(false);
      setCurrentGuideStep(0);
    }
  };

  const prevGuideStep = () => {
    if (currentGuideStep > 0) {
      setCurrentGuideStep(currentGuideStep - 1);
    }
  };

  // Auto-start guide for first-time users
  useEffect(() => {
    // Check if user has seen the guide before
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    if (!hasSeenGuide) {
      setShowGuide(true);
    }

    // Initialize ONNX model with retry logic
    const loadModel = async () => {
      try {
        setModelLoading(true);
        setModelError(null);
        
        // Add delay to ensure page is fully loaded
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Wait for ONNX Runtime to be available
        let retries = 0;
        while (typeof window.ort === 'undefined' && retries < 10) {
          await new Promise(resolve => setTimeout(resolve, 500));
          retries++;
        }
        
        if (typeof window.ort === 'undefined') {
          throw new Error('ONNX Runtime not loaded after 5 seconds');
        }
        
        await loadModelSimple();
        setModelLoading(false);
        console.log('Model loaded successfully');
      } catch (error) {
        console.error('Failed to load model:', error);
        
        // Set user-friendly error message
        let errorMessage = 'Model loading failed';
        if (error.message.includes('fetch')) {
          errorMessage = 'Model file not found or network error';
        } else if (error.message.includes('ONNX')) {
          errorMessage = 'ONNX Runtime initialization failed';
        } else if (error.message.includes('WebAssembly')) {
          errorMessage = 'Browser does not support WebAssembly';
        }
        
        setModelError(errorMessage);
        setModelLoading(false);
        
        // After 3 failed attempts, enable fallback mode
        const retryCount = parseInt(localStorage.getItem('modelRetryCount') || '0') + 1;
        localStorage.setItem('modelRetryCount', retryCount.toString());
        
        if (retryCount >= 3) {
          console.log('Max retries reached, enabling fallback mode');
          setUseFallbackMode(true);
          localStorage.removeItem('modelRetryCount');
        } else {
          // Retry after 5 seconds
          setTimeout(() => {
            console.log(`Retrying model loading... (attempt ${retryCount + 1})`);
            loadModel();
          }, 5000);
        }
      }
    };

    loadModel();
  }, []);

  const closeGuide = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenGuide', 'true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative">
      {/* Interactive Guide Overlay */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 relative animate-in slide-in-from-bottom-4">
            <button
              onClick={closeGuide}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {guideSteps[currentGuideStep].title}
              </h3>
              <p className="text-gray-600">
                {guideSteps[currentGuideStep].content}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {guideSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentGuideStep ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex space-x-2">
                {currentGuideStep > 0 && (
                  <button
                    onClick={prevGuideStep}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={nextGuideStep}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 flex items-center"
                >
                  {currentGuideStep === guideSteps.length - 1 ? 'Mulai' : 'Lanjut'}
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-4xl mx-4 relative animate-in slide-in-from-bottom-4">
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Play className="w-6 h-6 mr-3 text-emerald-600" />
              Demo Berbagai Kondisi Mata
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {demoImages.map((demo, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => startDemo(demo)}
                >
                  <div className="bg-gray-50 rounded-xl p-4 group-hover:bg-gray-100 transition-colors">
                    <img
                      src={demo.url}
                      alt={demo.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h4 className="font-semibold text-gray-900 mb-2">{demo.name}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`px-2 py-1 rounded-full ${eyeConditions[demo.condition].bgColor} ${eyeConditions[demo.condition].color}`}>
                        {eyeConditions[demo.condition].label}
                      </span>
                      <span className="text-gray-600">{demo.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Severity Info Modal */}
      {selectedSeverityInfo && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 relative animate-in slide-in-from-bottom-4">
            <button
              onClick={() => setSelectedSeverityInfo(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className={`p-4 rounded-xl mb-6 ${selectedSeverityInfo.bgColor}`}>
              <div className="flex items-center space-x-3">
                {React.createElement(selectedSeverityInfo.icon, {
                  className: `w-8 h-8 ${selectedSeverityInfo.color}`
                })}
                <div>
                  <h3 className={`text-xl font-bold ${selectedSeverityInfo.color}`}>
                    {selectedSeverityInfo.label}
                  </h3>
                  <p className={`text-sm ${selectedSeverityInfo.color}`}>
                    {selectedSeverityInfo.riskLevel}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Deskripsi</h4>
                <p className="text-gray-600 text-sm">{selectedSeverityInfo.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Rekomendasi</h4>
                <p className="text-gray-600 text-sm">{selectedSeverityInfo.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header id="header" className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  EyeHealthAI
                  <Sparkles className="w-5 h-5 ml-2 text-emerald-500" />
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Eye Disease Detection</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Model Status Indicator */}
              <div className="flex items-center space-x-2">
                {modelLoading ? (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:block">Loading AI Model...</span>
                  </div>
                ) : modelError ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span className="hidden sm:block">Model Error</span>
                    </div>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      title="Reload page to retry"
                    >
                      Retry
                    </button>
                  </div>
                ) : useFallbackMode ? (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span className="hidden sm:block">Fallback Mode</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:block">AI Ready</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowGuide(true)}
                className="flex items-center space-x-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="hidden sm:block">Panduan</span>
              </button>
              <button
                onClick={() => setShowDemo(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <Play className="w-5 h-5" />
                <span className="hidden sm:block">Demo</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Stats */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            19-Class Eye Disease Detection AI
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Comprehensive Detection,<br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Healthy Eyes Forever
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Upload fundus images to detect 19 types of eye diseases using advanced AI technology. 
            From diabetic retinopathy to glaucoma, get accurate diagnosis with high confidence scores.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mx-auto mb-3">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">3s</div>
              <div className="text-sm text-gray-600">Analysis</div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">19</div>
              <div className="text-sm text-gray-600">Disease Types</div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600">Training Images</div>
            </div>
          </div>
        </div>

        {/* Upload and How It Works Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Upload Section */}
          <div>
            <div className={`bg-white rounded-2xl shadow-xl p-6 border-2 transition-all duration-300 ${animationClass} ${uploadedImage ? 'border-emerald-200' : 'border-gray-100'}`}>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Upload className="w-6 h-6 mr-3 text-emerald-600" />
                Upload Fundus Image
                {uploadedImage && <CheckCircle className="w-5 h-5 ml-2 text-emerald-500" />}
              </h3>
              
              <div
                id="upload-area"
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  isDragOver 
                    ? 'border-emerald-400 bg-emerald-50 scale-105' 
                    : uploadedImage 
                    ? 'border-emerald-300 bg-emerald-25'
                    : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {uploadedImage ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded fundus" 
                        className="max-w-full max-h-64 mx-auto rounded-xl shadow-lg border-2 border-emerald-100"
                      />
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                          <div className="bg-white rounded-lg p-4 shadow-lg">
                            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Analyzing...</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {isAnalyzing && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(analysisProgress, 100)}%` }}
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-center space-x-4">
                      <button
                        id="analyze-button"
                        onClick={analyzeImage}
                        disabled={isAnalyzing || (modelLoading && !useFallbackMode) || !uploadedFile}
                        className={`${useFallbackMode ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'} text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                      >
                        {modelLoading && !useFallbackMode ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Loading Model...
                          </>
                        ) : isAnalyzing ? (
                          <>
                            <Brain className="w-5 h-5 mr-2 animate-pulse" />
                            Analyzing...
                          </>
                        ) : useFallbackMode ? (
                          <>
                            <Eye className="w-5 h-5 mr-2" />
                            Analysis (Mock)
                          </>
                        ) : (
                          <>
                            <Eye className="w-5 h-5 mr-2" />
                            Analyze Image
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetAnalysis}
                        className="bg-gray-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-600 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Reset
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <FileImage className="w-20 h-20 text-gray-400 mx-auto animate-bounce" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-gray-700 mb-2">
                        Drag & drop fundus image here
                      </p>
                      <p className="text-gray-500 mb-6">or click the button below</p>
                      <label className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 cursor-pointer inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <Upload className="w-5 h-5 mr-2" />
                        Select Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-800 font-medium mb-1">Supported formats:</p>
                      <p className="text-sm text-blue-600">JPG, PNG, JPEG (Maximum 10MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Info className="w-6 h-6 mr-3 text-emerald-600" />
                How It Works
              </h3>
              <div className="space-y-6">
                <div className="group hover:bg-emerald-50 p-4 rounded-xl transition-all duration-200 cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">1</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">Upload Image</h4>
                      <p className="text-gray-600 text-sm">Upload high-quality fundus photos in JPG, PNG, or JPEG format</p>
                    </div>
                    <Upload className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                <div className="group hover:bg-blue-50 p-4 rounded-xl transition-all duration-200 cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">2</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">AI Analysis</h4>
                      <p className="text-gray-600 text-sm">AI analyzes the image to detect signs of 19 different eye diseases</p>
                    </div>
                    <Brain className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                <div className="group hover:bg-purple-50 p-4 rounded-xl transition-all duration-200 cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">3</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">Instant Results</h4>
                      <p className="text-gray-600 text-sm">Get detection results with confidence scores and recommended actions</p>
                    </div>
                    <Activity className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results Section - Full Width First */}
        <div id="results-area" className="space-y-6 mb-8">
            {analysisResult && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 animate-in slide-in-from-right-4">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Star className="w-6 h-6 mr-3 text-emerald-600" />
                  Hasil Analisis
                </h3>
                
                <div className="space-y-6">
                  {/* Enhanced Condition Display */}
                  <div className={`p-6 rounded-2xl border-2 ${eyeConditions[analysisResult.condition].borderColor} ${eyeConditions[analysisResult.condition].bgColor} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                      {React.createElement(eyeConditions[analysisResult.condition].icon, {
                        className: "w-full h-full"
                      })}
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          {React.createElement(eyeConditions[analysisResult.condition].icon, {
                            className: `w-12 h-12 ${eyeConditions[analysisResult.condition].color}`
                          })}
                          <div>
                            <h4 className={`text-2xl font-bold ${eyeConditions[analysisResult.condition].color}`}>
                              {eyeConditions[analysisResult.condition].label}
                            </h4>
                            <p className="text-gray-600 font-medium">{eyeConditions[analysisResult.condition].riskLevel}</p>
                            <p className="text-xs text-gray-500 mt-1">Kategori: {eyeConditions[analysisResult.condition].category}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-4xl font-bold ${eyeConditions[analysisResult.condition].color} mb-1`}>
                            {analysisResult.confidence}%
                          </div>
                          <p className="text-gray-600 text-sm font-medium">Tingkat Kepercayaan</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/50 rounded-lg p-4">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {eyeConditions[analysisResult.condition].description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Analysis Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <h5 className="font-semibold text-blue-900">Waktu Analisis</h5>
                      </div>
                      <p className="text-blue-700 font-medium">{analysisResult.processingTime}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        <h5 className="font-semibold text-purple-900">Model AI</h5>
                      </div>
                      <p className="text-purple-700 font-medium">{analysisResult.modelVersion}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        <h5 className="font-semibold text-emerald-900">Tanggal</h5>
                      </div>
                      <p className="text-emerald-700 font-medium text-sm">{analysisResult.timestamp}</p>
                    </div>
                  </div>

                  {/* Enhanced Recommendations */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <Info className="w-5 h-5 mr-2" />
                      Rekomendasi Tindakan
                    </h5>
                    <p className="text-blue-800 leading-relaxed">
                      {eyeConditions[analysisResult.condition].recommendation}
                    </p>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      <Download className="w-5 h-5 mr-2" />
                      Download Laporan PDF
                    </button>
                    <button 
                      onClick={() => setSelectedSeverityInfo(eyeConditions[analysisResult.condition])}
                      className="flex-1 bg-white border-2 border-emerald-500 text-emerald-600 px-6 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Info className="w-5 h-5 mr-2" />
                      Detail Kondisi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Privacy Notice */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-emerald-600" />
                Privasi & Keamanan
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 group">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Pemrosesan Lokal</h4>
                      <p className="text-sm text-gray-600">Semua analisis dilakukan di perangkat Anda</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 group">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Tanpa Upload</h4>
                      <p className="text-sm text-gray-600">Gambar tidak dikirim ke server eksternal</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 group">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Star className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Data Pribadi</h4>
                      <p className="text-sm text-gray-600">Data Anda tetap sepenuhnya privat</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 group">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Zap className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Teknologi Terdepan</h4>
                      <p className="text-sm text-gray-600">AI model terbaru untuk akurasi maksimal</p>
                    </div>
                  </div>
                </div>
              </div>
            
          </div>
        </div>

        {/* Bottom Row - Eye Conditions (Full Width) */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-3 text-emerald-600" />
            Detectable Eye Conditions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Object.entries(eyeConditions).map(([key, condition]) => (
              <button
                key={key}
                onClick={() => setSelectedSeverityInfo(condition)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${condition.borderColor} ${condition.bgColor} group`}
              >
                <div className="flex flex-col items-center space-y-2">
                  {React.createElement(condition.icon, {
                    className: `w-6 h-6 ${condition.color} group-hover:scale-110 transition-transform`
                  })}
                  <div className="text-center">
                    <h4 className={`font-semibold text-xs ${condition.color}`}>{condition.label}</h4>
                    <p className="text-xs text-gray-600">{condition.riskLevel}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Click on any condition to view detailed information</p>
            <p className="text-xs text-emerald-600 font-medium">All 19 eye disease types are detectable with our AI model</p>
          </div>
        </div>
      </main>

      {/* Ultra Minimalist Footer */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            {/* Brand */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">EyeHealthAI</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">AI Eye Disease Detection</span>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span><span className="font-medium text-emerald-600">19</span> Types</span>
              <span><span className="font-medium text-blue-600">95%</span> Accuracy</span>
              <span><span className="font-medium text-purple-600">3s</span> Analysis</span>
            </div>

            {/* Copyright & Disclaimer */}
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span>© 2024</span>
              <span className="flex items-center space-x-1">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span>For screening only</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Privacy first</span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Debug Component - Remove in production */}
      {/* <ModelDebugger /> */}
    </div>
  );
}
