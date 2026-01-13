import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    { name: { type: String, required: true, trim: true},
     description: { type: String, required: true, trim: true}
    },{ timestamps: true, }
);
export const Post = mongoose.model('Post', postSchema);