// test-api.js
const prisma = require('./src/utils/prismaClient');

async function testApiKey() {
  try {
    // Get the first active API key
    const apiKey = await prisma.apiKey.findFirst({
      where: { isActive: true },
      include: { user: true }
    });

    if (!apiKey) {
      console.log('❌ No active API keys found. Run create-test-key.js first.');
      return;
    }

    console.log('🔑 Testing with API key:', apiKey.key);
    console.log('👤 User:', apiKey.user.email);
    
    // Test the validate endpoint
    const response = await fetch('https://nonrestricted-scarfless-alicia.ngrok-free.dev/api/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.key
      },
      body: JSON.stringify({})
    });

    const result = await response.json();
    console.log('✅ API Response:', result);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testApiKey();