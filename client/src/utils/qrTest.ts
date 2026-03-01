// Test script to demonstrate QR generation after form submission
// This can be run in the browser console or as a test endpoint

async function testDonationFlow() {
  console.log('🚀 Testing VIX Donation Flow with QR Generation');
  
  // Test data for donation
  const testData = {
    type: "Salbutamol",
    expiry: "2026-12-31",
    donorName: "Test Donor",
    donorContact: "test@example.com"
  };
  
  try {
    console.log('📤 Submitting donation form...');
    
    // Submit to the donation endpoint
    const response = await fetch('/api/inhalers/donate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Donation submitted successfully!');
    console.log('📋 Response:', result);
    
    if (result.success) {
      console.log('\n📱 QR CODE GENERATED:');
      console.log('🆔 ID:', result.inhaler.id);
      console.log('🏷️ Type:', result.inhaler.type);
      console.log('📅 Expiry:', result.inhaler.expiry);
      console.log('📊 Status:', result.inhaler.status);
      console.log('🔐 Hash:', result.inhaler.current_hash.substring(0, 16) + '...');
      
      // Display QR code in console (base64)
      console.log('\n🖼️ QR Code (base64):', result.qrDataUrl.substring(0, 100) + '...');
      
      // If PDF data is available
      if (result.pdf) {
        console.log('📄 PDF Stickers: Available (base64)');
        console.log('   Length:', result.pdf.length, 'characters');
      }
      
      console.log('\n✅ COMPLETE: QR code generated and ready for download!');
      console.log('📥 Next steps:');
      console.log('   1. Download the QR code image');
      console.log('   2. Print the PDF sticker sheet');
      console.log('   3. Attach to inhaler packaging');
      console.log('   4. Deliver to nearest VIX clinic');
      
      return result;
    } else {
      console.error('❌ Donation failed:', result.error);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error during donation flow:', error);
    return null;
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testDonationFlow = testDonationFlow;
  console.log('🔧 Test function available: window.testDonationFlow()');
}

// Run the test automatically if this is imported as a module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testDonationFlow };
}

console.log('🧪 VIX QR Generation Test Ready');
console.log('💡 Run testDonationFlow() to see the complete flow');