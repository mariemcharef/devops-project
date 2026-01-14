import { Post } from "../models/post.model.js";

const createPost = async (req, res) => {
    try{
        const { name, description } = req.body;
        if(!name || !description){
            return res.status(400).json({ message: "All fields are required" });
        }
        const post = await Post.create({
            name,
            description
        });
        res.status(201).json({
            post: {id: post._id, name: post.name, description: post.description}
        })
        }catch(err){ 
            res.status(500).json({ message: `Server error: ${err}`, err: err.message });
    }
}
const getPosts = async (req, res) => {
    try{
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json({ message: `Server error: ${err}`, err: err.message });
    }
}
export { createPost, getPosts };
