require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../modules/login/models/users'); // Adjust the path to your model

//const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskdb';
const MONGO_URI = 'mongodb://localhost:27017/taskdb';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      process.exit();
    }

    const passwordHash = await bcrypt.hash('admin123',10);

    const admin = new User({
      name: 'Admin',
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com',
      password: passwordHash, 
      role: 'admin',
      verified: true,
    });

    await admin.save();
    console.log('Admin created:', admin.email);
  } catch (err) {
    console.error('Failed to seed admin:', err);
  } finally {
    mongoose.disconnect();
  }
}

seedAdmin();
