import mongoose from 'mongoose';
import User from '../models/model.user.js';
import { connectDB } from '../lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

const updateTestUserToAdmin = async () => {
    try {
        await connectDB();
        
        const user = await User.findOneAndUpdate(
            { email: 'test@test.com' }, 
            { role: 'admin' },
            { new: true }
        );
        
        if (user) {
            console.log('✅ Test user updated to admin role successfully!');
            console.log(`Name: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
        } else {
            console.log('❌ User not found');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating user:', error);
        process.exit(1);
    }
};

updateTestUserToAdmin();
