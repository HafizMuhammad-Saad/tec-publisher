import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const setupAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne();
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: 'Admin'
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${dotenv.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('');
    console.log('You can now login to the admin dashboard at: http://localhost:5173/admin/login');

  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

setupAdmin();
