import User from '../models/model.user.js';
import jwt from 'jsonwebtoken';

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized- No access token provided" });
        }
        
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select("-password");
            
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            
            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Unauthorized- Invalid or expired access token" });
            }
            throw error;
        }
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        return res.status(401).json({ message: "Unauthorized- Invalid access token" });
    }
};

export const adminRoute = (req, res, next) => {
    if(req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Forbidden- Admin access required" });
    }
};