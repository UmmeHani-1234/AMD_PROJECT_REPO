const http = require('http');

// Test data
const postData = JSON.stringify({
  type: "salbutamol",
  expiry: "2026-12-31",
  donorName: "Test Donor",
  donorContact: "test@example.com",
  donorLocation: "clinic-1",
  quantity: 1,
  condition: "unopened",
  reason: "moved"
});

const options = {
  hostname: 'localhost',
  port: 3004,
  path: '/api/inhalers/donate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Sending request to backend...');
console.log('Data:', postData);

const req = http.request(options, (res) => {
  let data = '';
  
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response received:');
    try {
      const jsonData = JSON.parse(data);
      console.log('✅ SUCCESS - API responded with JSON:', JSON.stringify(jsonData, null, 2));
      
      if (jsonData.success && jsonData.qrDataUrl) {
        console.log('✅ QR CODE GENERATED SUCCESSFULLY!');
        console.log('QR Data URL length:', jsonData.qrDataUrl.length);
        console.log('QR contains required fields:', !!jsonData.inhaler.id && !!jsonData.inhaler.hash && !!jsonData.inhaler.status);
      } else {
        console.log('❌ Response does not contain expected QR data');
      }
    } catch (e) {
      console.log('Response is not valid JSON:', data.substring(0, 200) + '...');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.write(postData);
req.end();