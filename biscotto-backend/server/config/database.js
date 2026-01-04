import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create default admin user if it doesn't exist-
    const User = (await import('../models/User.js')).default;
    const adminExists = await User.findOne({ email: 'admin@biscotto.com' });
    
    if (!adminExists) {
      const admin = new User({
        email: 'admin@biscotto.com',
        name: 'Admin User',
        password: 'admin123',
        role: 'admin',
        isVerified: true
      });
      await admin.save();
      console.log('✅ Default admin user created: admin@biscotto.com / admin123');
    }

    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
