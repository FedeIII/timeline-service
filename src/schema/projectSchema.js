import mongoose from 'mongoose';

export const projectSchema = new mongoose.Schema({
    id: {
        type: String
    },
    title: {
        type: String
    },
    date: {
        type: String
    },
});