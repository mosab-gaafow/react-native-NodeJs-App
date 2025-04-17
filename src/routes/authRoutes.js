import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';


const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' });
}
router.post('/register', async(req, res) => {
    try{

        const {username, email,  password} = req.body;

        if(!email || !username || !password){
            return res.status(400).json({message: "Please fill all fields"})
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }

        if(username.length < 3) {
            return res.status(400).json({message: "Username must be at least 3 characters"})
        }

        // check if user exits

        const existingUsername = await User.findOne({email});
        if(existingUsername) {
            return res.status(400).json({message: "Username already exists"})
        }
        const existingEmail = await User.findOne({email});
        if(existingEmail) {
            return res.status(400).json({message: "Email already exists"})
        }

        // randomImage
        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`

        const user = new User ({
            username,
            email,
            password,
            profileImage
        });

        await user.save();

        // token

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        })

    }catch(e){
        console.log(e.message)
        res.status(500).json({message: e.message})
    }
})

router.post('/login', async(req, res) => {
    try{

        const {email, password} = req.body;

        
        if(!email || !password){
            return res.status(400).json({message: "Please fill all fields"})
        }

        // check if user exits

        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Invalid credentials"})
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if(!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid credentials"})
        }

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        })


    }catch(e){
        console.log(e.message)
        res.status(500).json({message: e.message})
    }
} )

export default router;