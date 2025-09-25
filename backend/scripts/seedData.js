require('dotenv').config();
const mongoose = require('mongoose');
const Tenant = require('../models/Tenant');
const User = require('../models/User');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Tenant.deleteMany({});

    // Create tenants
    const acmeTenant = await Tenant.create({
      slug: 'acme',
      name: 'Acme Corporation',
      plan: 'free'
    });

    const globexTenant = await Tenant.create({
      slug: 'globex',
      name: 'Globex Corporation',
      plan: 'free'
    });

    // Create test users
    const users = [
      {
        email: 'admin@acme.test',
        password: 'password',
        role: 'admin',
        tenantId: acmeTenant._id
      },
      {
        email: 'user@acme.test',
        password: 'password',
        role: 'member',
        tenantId: acmeTenant._id
      },
      {
        email: 'admin@globex.test',
        password: 'password',
        role: 'admin',
        tenantId: globexTenant._id
      },
      {
        email: 'user@globex.test',
        password: 'password',
        role: 'member',
        tenantId: globexTenant._id
      }
    ];

    await User.create(users);

    console.log('Seed data created successfully!');
    console.log('Test accounts:');
    console.log('- admin@acme.test (password: password) - Admin for Acme');
    console.log('- user@acme.test (password: password) - Member for Acme');
    console.log('- admin@globex.test (password: password) - Admin for Globex');
    console.log('- user@globex.test (password: password) - Member for Globex');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();