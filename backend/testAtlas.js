// Test MongoDB Atlas Connection
const mongoose = require('mongoose');
require('dotenv').config();

async function testAtlasConnection() {
  console.log('🧪 Testing MongoDB Atlas Connection...');
  
  const ATLAS_URI = process.env.MONGODB_URI;
  
  if (!ATLAS_URI || ATLAS_URI.includes('localhost')) {
    console.log('❌ MONGODB_URI not set for Atlas or still using localhost');
    console.log('📝 Please update your .env file with MongoDB Atlas connection string');
    console.log('Example: mongodb+srv://username:password@cluster.mongodb.net/notes-saas');
    process.exit(1);
  }
  
  try {
    console.log('Connecting to:', ATLAS_URI.replace(/:[^:@]*@/, ':****@'));
    
    await mongoose.connect(ATLAS_URI, {
      serverSelectionTimeoutMS: 10000
    });
    
    console.log('✅ MongoDB Atlas connection successful!');
    
    // Test database operations
    const testCollection = mongoose.connection.db.collection('connection_test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    await testCollection.deleteOne({ test: true });
    
    console.log('✅ Database operations test successful!');
    console.log('🎯 Ready for production deployment!');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log('❌ MongoDB Atlas connection failed:', error.message);
    console.log('\n🔧 Common fixes:');
    console.log('1. Check connection string format');
    console.log('2. Verify username/password');
    console.log('3. Ensure IP 0.0.0.0/0 is whitelisted');
    console.log('4. Confirm database user permissions');
    
    process.exit(1);
  }
}

testAtlasConnection();