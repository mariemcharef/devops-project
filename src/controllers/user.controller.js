import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {   
        const { username, password, email } = req.body;
        if (!username || !password || !email) { 
            return res.status(400).json({ message: "All fields are required" });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });

        if (existing) { 
            return res.status(400).json({ message: "Email already in use" });}
        const user = await User.create({ username, email: email.toLowerCase(), password});
        res.status(201).json({ user: {id: user._id, email: user.email, username: user.username} })
    } catch (err) { 
        res.status(500).json({ message: `Server error: ${err}`, err: err.message });
    }

};
export { registerUser, loginUser };