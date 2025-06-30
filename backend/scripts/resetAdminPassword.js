import mongoose from 'mongoose';
import User from '../models/model.user.js';
import { connectDB } from '../lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

const resetAdminPassword = async () => {
    try {
        await connectDB();
        
        // Find admin user
        const admin = await User.findOne({ email: 'admin@example.com' });
        
        if (!admin) {
            console.log('❌ Admin user not found');
            process.exit(1);
        }
        
        // Reset password
        admin.password = 'admin123';
        await admin.save();
        
        console.log('✅ Admin password reset successfully!');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
        console.log('Role:', admin.role);
        
        // Test the new password
        const isValid = await admin.comparePassword('admin123');
        console.log('Password test:', isValid ? '✅ PASS' : '❌ FAIL');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting admin password:', error);
        process.exit(1);
    }
};

resetAdminPassword();
