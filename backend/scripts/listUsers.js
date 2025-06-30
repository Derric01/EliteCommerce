import mongoose from 'mongoose';
import User from '../models/model.user.js';
import { connectDB } from '../lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

const listUsers = async () => {
    try {
        await connectDB();
        
        const users = await User.find({}, 'name email role createdAt').sort({ createdAt: -1 });
        
        console.log('\n📋 Users in database:');
        console.log('='.repeat(60));
        
        if (users.length === 0) {
            console.log('No users found in database.');
        } else {
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Created: ${user.createdAt}`);
                console.log('   ' + '-'.repeat(40));
            });
        }
        
        console.log(`\nTotal users: ${users.length}`);
        console.log('='.repeat(60));
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error listing users:', error);
        process.exit(1);
    }
};

listUsers();
