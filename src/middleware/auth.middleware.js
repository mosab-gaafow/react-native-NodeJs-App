import jwt from 'jsonwebtoken';

import User from '../models/User.js';

const protectRoute = async (req, res, next) => {
    try{
        const token = req.headers("Authorization").replace("Bearer ", "");
        if(!token) return res.status(401).json({message: "Unauthorized, Access denied"});

        // verify token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find user
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(401).json({message: "Token is not valid"});

        req.user = user;
        next();

    }catch(e){
        console.log(e.message);
        res.status(401).json({message: "Unauthorized, Access denied"});
    }
}

export default protectRoute;