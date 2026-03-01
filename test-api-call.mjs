import fetch from 'node-fetch';

// Test data
const postData = {
  type: "salbutamol",
  expiry: "2026-12-31",
  donorName: "Test Donor",
  donorContact: "test@example.com",
  donorLocation: "clinic-1",
  quantity: 1,
  condition: "unopened",
  reason: "moved"
};

console.log('Sending request to backend...');
console.log('Data:', JSON.stringify(postData));

try {
  const response = await fetch('http://localhost:3004/api/inhalers/donate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData)
  });

  console.log(`STATUS: ${response.status}`);
  console.log(`STATUS TEXT: ${response.statusText}`);

  const data = await response.text();
  console.log('Response received:');
  
  try {
    const jsonData = JSON.parse(data);
    console.log('✅ SUCCESS - API responded with JSON:', JSON.stringify(jsonData, null, 2));
    
    if (jsonData.success && jsonData.qrDataUrl) {
      console.log('✅ QR CODE GENERATED SUCCESSFULLY!');
      console.log('QR Data URL length:', jsonData.qrDataUrl.length);
      console.log('QR contains required fields:', !!jsonData.inhaler.id && !!jsonData.inhaler.hash && !!jsonData.inhaler.status);
      console.log('QR Data URL starts with:', jsonData.qrDataUrl.substring(0, 50));
    } else {
      console.log('❌ Response does not contain expected QR data');
      console.log('Full response:', data);
    }
  } catch (e) {
    console.log('Response is not valid JSON:', data.substring(0, 200) + '...');
  }
} catch (error) {
  console.error('❌ Request error:', error.message);
}