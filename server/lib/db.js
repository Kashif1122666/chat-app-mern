import mongoose from 'mongoose';

// function to connect mongodb database 

export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
        });
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
    } catch (error) {
        console.log(error);
    }
};
