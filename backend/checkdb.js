const mongoose = require('mongoose');
require('dotenv').config();

async function checkConnection() {
  console.log('🔍 Checking MongoDB connection...');
  console.log('Connection string:', process.env.MONGODB_URI);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log('🎯 Database is ready. You can now run: npm run seed');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('\n📋 Setup Options:');
    console.log('1. 🌐 Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
    console.log('2. 🐳 Use Docker: docker run --name mongodb -p 27017:27017 -d mongo:latest');
    console.log('3. 💻 Install locally: choco install mongodb (as Administrator)');
    console.log('\nSee QUICKSTART.md for detailed instructions');
    
    process.exit(1);
  }
}

checkConnection();