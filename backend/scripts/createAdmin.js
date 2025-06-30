import mongoose from 'mongoose';
import User from '../models/model.user.js';
import { connectDB } from '../lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();
        
        // Replace this email with your actual user email
        const userEmail = 'admin@example.com'; // CHANGE THIS TO YOUR EMAIL
        
        const user = await User.findOne({ email: userEmail });
        
        if (!user) {
            console.log('User not found. Creating new admin user...');
            
            const newAdmin = new User({
                name: 'Admin User',
                email: userEmail,
                password: 'admin123', // CHANGE THIS PASSWORD
                role: 'admin'
            });
            
            await newAdmin.save();
            console.log('✅ Admin user created successfully!');
            console.log('Email:', userEmail);
            console.log('Password: admin123');
            console.log('⚠️  Please change the password after first login!');
        } else {
            // Make existing user an admin
            user.role = 'admin';
            await user.save();
            console.log('✅ User role updated to admin successfully!');
            console.log('User:', user.name, '(' + user.email + ')');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
