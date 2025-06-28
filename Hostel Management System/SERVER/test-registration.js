const fetch = require('node-fetch');

async function testRegistration() {
  try {
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'tenant',
      rollNumber: 'TEST123'
    };

    console.log('Testing registration with data:', testData);

    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (!response.ok) {
      console.error('Registration failed:', data);
    } else {
      console.log('Registration successful!');
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testRegistration(); 