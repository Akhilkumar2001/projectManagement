import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../models/User.js';

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const existing = await User.findOne({ email: 'admin@projectflow.com' });
  if (existing) {
    console.log('Superadmin already exists — skipping');
    process.exit(0);
  }

  await User.create({
    name:     'Super Admin',
    email:    'admin@projectflow.com',
    password: 'Admin@123',
    role:     'admin',
    isActive: true,
  });

  console.log('✅ Superadmin created');
  console.log('   Email    : admin@projectflow.com');
  console.log('   Password : Admin@123');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
