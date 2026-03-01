import { QRGenerator } from './server/utils/qrGenerator';

// Test QR code generation
async function testQRGeneration() {
  console.log('Testing QR Code Generation...');
  
  try {
    // Test data that matches what the backend sends
    const testData = {
      id: "VIX-12345",
      hash: "a3f8b2c1d9e4...",
      status: "PENDING",
      expiry: "2026-05-07"
    };
    
    console.log('Generating QR code with data:', testData);
    
    const qrDataUrl = await QRGenerator.generateQRContent(testData);
    
    console.log('✅ QR Code generated successfully!');
    console.log('QR Data URL length:', qrDataUrl.length);
    console.log('QR Data URL starts with:', qrDataUrl.substring(0, 30));
    console.log('Full QR data URL (first 100 chars):', qrDataUrl.substring(0, 100) + '...');
    
    // Verify it looks like a valid data URL
    if (qrDataUrl.startsWith('data:image/png;base64,')) {
      console.log('✅ QR Code has correct data URL format');
    } else {
      console.log('❌ QR Code format is incorrect');
    }
    
    // Test QR content parsing
    const contentToParse = JSON.stringify(testData);
    const parsed = QRGenerator.parseQRContent(contentToParse);
    console.log('✅ QR content parsing works:', parsed);
    
  } catch (error) {
    console.error('❌ Error generating QR code:', error);
  }
}

// Run the test
testQRGeneration();