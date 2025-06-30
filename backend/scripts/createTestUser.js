import mongoose from 'mongoose';
import User from '../models/model.user.js';
import { connectDB } from '../lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestUser = async () => {
    try {
        await connectDB();
        
        // Delete existing test user if exists
        await User.deleteOne({ email: 'test@test.com' });
        
        // Create new test user
        const testUser = new User({
            name: 'Test User',
            email: 'test@test.com',
            password: 'password123',
            role: 'admin'
        });
        
        await testUser.save();
        console.log('✅ Test user created successfully!');
        console.log('Email: test@test.com');
        console.log('Password: password123');
        console.log('Role: admin');
        
        // Verify password hashing
        const savedUser = await User.findOne({ email: 'test@test.com' });
        console.log('\n🔍 Password verification:');
        console.log('Raw password in DB:', savedUser.password);
        console.log('Is password hashed?', savedUser.password !== 'password123');
        
        // Test password comparison
        const isValid = await savedUser.comparePassword('password123');
        console.log('Password comparison test:', isValid ? '✅ PASS' : '❌ FAIL');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating test user:', error);
        process.exit(1);
    }
};

createTestUser();
