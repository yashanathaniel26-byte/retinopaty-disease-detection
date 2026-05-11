const sharp = require('sharp');
const ort = require('onnxruntime-node');
const fs = require('fs');
const path = require('path');

// 19 class labels sesuai dengan model
const CLASS_LABELS = [
  'age-macular-degeneration',
  'branch-retinal-vein-occlusion',
  'cataract',
  'central-serous-chorioretinopathy',
  'diabetic-retinopathy-mild',
  'diabetic-retinopathy-proliferative',
  'diabetic-retinopathy-severe',
  'disc-edema',
  'drusen',
  'glaucoma',
  'macular-epiretinal-membrane',
  'macular-hole',
  'macular-scar',
  'myopia',
  'normal',
  'pterygium',
  'refractive-media-opacity',
  'retinal-detachment',
  'retinitis-pigmentosa',
];

// Normalisasi ImageNet (sama dengan PyTorch transforms.Normalize)
const IMAGENET_MEAN = [0.485, 0.456, 0.406];
const IMAGENET_STD = [0.229, 0.224, 0.225];

/**
 * Preprocess image sesuai dengan Albumentations val_transforms:
 * 1. A.Resize(IMG_SIZE, IMG_SIZE) - Resize ke ukuran model
 * 2. A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
 * 3. ToTensorV2() - Convert ke tensor CHW format
 * 
 * Note: Sharp otomatis load image sebagai RGB (tidak perlu BGR→RGB seperti cv2)
 */
async function preprocessImage(imagePath, imgSize = 288) {
  console.log('📸 Loading image:', imagePath);
  console.log('🔧 Target size:', imgSize, 'x', imgSize);
  
  // Step 1: A.Resize(IMG_SIZE, IMG_SIZE)
  // Sharp default behavior mirip dengan Albumentations resize
  const imageBuffer = await sharp(imagePath)
    .resize(imgSize, imgSize, {
      fit: 'fill', // Albumentations default: stretch to exact size
      kernel: sharp.kernel.lanczos3 // High-quality interpolation
    })
    .removeAlpha() // Remove alpha channel jika ada
    .toColorspace('srgb') // Ensure RGB colorspace
    .raw() // Get raw pixel data
    .toBuffer({ resolveWithObject: true });
  
  const { data, info } = imageBuffer;
  console.log('✅ Image resized to:', info.width, 'x', info.height, 'channels:', info.channels);
  
  // Step 2 & 3: A.Normalize + ToTensorV2
  // Albumentations Normalize: (pixel/255.0 - mean) / std
  // ToTensorV2: Convert HWC → CHW format
  const pixels = new Float32Array(3 * imgSize * imgSize);
  
  for (let c = 0; c < 3; c++) {
    for (let h = 0; h < imgSize; h++) {
      for (let w = 0; w < imgSize; w++) {
        // HWC format dari sharp: (h * width + w) * channels + c
        const idx = (h * imgSize + w) * 3 + c;
        
        // Albumentations Normalize:
        // 1. Divide by 255.0 to get [0, 1]
        // 2. Subtract mean
        // 3. Divide by std
        const pixelValue = data[idx] / 255.0;
        const normalized = (pixelValue - IMAGENET_MEAN[c]) / IMAGENET_STD[c];
        
        // ToTensorV2: Convert to CHW format (Channel, Height, Width)
        pixels[c * imgSize * imgSize + h * imgSize + w] = normalized;
      }
    }
  }
  
  console.log('✅ Image preprocessed:');
  console.log('   - Resized to', imgSize, 'x', imgSize);
  console.log('   - Normalized with ImageNet stats');
  console.log('   - Converted to CHW tensor format');
  console.log('   - Sample values (first 5):', Array.from(pixels.slice(0, 5)).map(v => v.toFixed(4)));
  
  return { pixels, imgSize };
}

/**
 * Softmax function untuk convert logits ke probabilities
 */
function softmax(logits) {
  const maxLogit = Math.max(...logits);
  const expScores = logits.map(x => Math.exp(x - maxLogit));
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  return expScores.map(x => x / sumExp);
}

/**
 * Run inference dengan ONNX model
 */
async function runInference(modelPath, imagePath) {
  console.log('\n🚀 Starting inference...\n');
  
  // Load model
  console.log('📦 Loading ONNX model:', modelPath);
  const session = await ort.InferenceSession.create(modelPath);
  console.log('✅ Model loaded successfully');
  
  // Print model info
  console.log('\n📋 Model Information:');
  console.log('   Input names:', session.inputNames);
  console.log('   Output names:', session.outputNames);
  
  // Preprocess image (gunakan imgSize sesuai model requirement)
  const { pixels, imgSize } = await preprocessImage(imagePath, 288);
  
  // Create ONNX tensor with dynamic size
  const tensor = new ort.Tensor('float32', pixels, [1, 3, imgSize, imgSize]);
  console.log('✅ Tensor created with shape: [1, 3,', imgSize + ',', imgSize + ']');
  
  // Run inference
  console.log('\n🔮 Running inference...');
  const feeds = { [session.inputNames[0]]: tensor };
  const results = await session.run(feeds);
  
  // Get output
  const output = results[session.outputNames[0]];
  const logits = Array.from(output.data);
  
  console.log('✅ Inference completed');
  console.log('   Raw logits sample:', logits.slice(0, 5));
  
  // Apply softmax
  const probabilities = softmax(logits);
  
  // Get top 5 predictions
  const predictions = probabilities
    .map((prob, idx) => ({
      class: CLASS_LABELS[idx],
      probability: prob,
      confidence: (prob * 100).toFixed(2) + '%'
    }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);
  
  return predictions;
}

/**
 * Main function
 */
async function main() {
  const modelPath = path.join(__dirname, 'public', 'retinal_classifier_efficientnet_b1.onnx');
  const imagePath = path.join(__dirname, '0a4e1a29ffff.png');
  
  // Check if files exist
  if (!fs.existsSync(modelPath)) {
    console.error('❌ Model file not found:', modelPath);
    process.exit(1);
  }
  
  if (!fs.existsSync(imagePath)) {
    console.error('❌ Image file not found:', imagePath);
    process.exit(1);
  }
  
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔬 ONNX Model Testing - Retinal Disease Classification');
  console.log('═══════════════════════════════════════════════════════');
  
  try {
    const predictions = await runInference(modelPath, imagePath);
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📊 TOP 5 PREDICTIONS:');
    console.log('═══════════════════════════════════════════════════════\n');
    
    predictions.forEach((pred, idx) => {
      const bar = '█'.repeat(Math.floor(pred.probability * 50));
      console.log(`${idx + 1}. ${pred.class.toUpperCase()}`);
      console.log(`   Confidence: ${pred.confidence}`);
      console.log(`   ${bar}\n`);
    });
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Testing completed successfully!');
    console.log('═══════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('\n❌ Error during inference:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
main();
