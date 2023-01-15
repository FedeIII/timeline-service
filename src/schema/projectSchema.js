import mongoose from 'mongoose';

export const projectSchema = new mongoose.Schema({
  id: String,
  userId: String,
  title: String,
  description: String,
  tags: [{
    type: { type: String },
    label: String,
  }],
  events: [{
    id: String,
    imgUrl: String,
    videoUrl: String,
    title: String,
    description: String,
    date: String,
    type: {
      type: String,
      enum: [
        'START_PROJECT',
        'PROMPT',
        'START',
        'MIDDLE',
        'END',
        'END_PROJECT',
      ],
    },
    topic: String,
  }],
  twitter: {
    mainThreadId: String,
    subThreadId: String,
  }
});