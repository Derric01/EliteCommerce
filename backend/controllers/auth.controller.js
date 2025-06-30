import User from "../models/model.user.js";
import jwt from "jsonwebtoken";
// import redis from "../lib/redis.js"; // Disabled for now

const generateTokens = (userId)=>{
    const accessToken = jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:'15m',
    })

    const refreshToken = jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{
       expiresIn:"7d"    
    })
    return {accessToken,refreshToken};
};

const storeRefreshToken = async(userId, refreshToken)=>{
    // Redis disabled for now - tokens work without caching
    console.log('Token stored (mock):', userId);
}

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const userExists = await User.findOne({ email });
        
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const user = await User.create({
            name,
            email,
            password
        });
        const { accessToken,refreshToken} = generateTokens(user._id);
        await storeRefreshToken(user._id,refreshToken);

        // Set cookies directly
        res.cookie("accessToken",accessToken,{
            httpOnly:true, //prevents xss attacks 
            secure: false, // Allow non-HTTPS in development
            sameSite: "lax", // More permissive for localhost
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure: false, // Allow non-HTTPS in development
            sameSite: "lax", // More permissive for localhost
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({ 
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
    
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        
        const {email, password} = req.body;
        // Use findOne instead of find to get a single user object, not an array
        const user = await User.findOne({email});
        
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        const {accessToken, refreshToken} = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        
        // Set cookies directly - similar to how you did in signup
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false, // Allow non-HTTPS in development
            sameSite: "lax", // More permissive for localhost
            maxAge: 15 * 60 * 1000
        });
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // Allow non-HTTPS in development
            sameSite: "lax", // More permissive for localhost
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            user: {
                _id: user._id,
                name: user.name, 
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.log("There is error in the login section:", error);
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        // Check if cookies exist before accessing them
        if (!req.cookies) {
            return res.status(400).json({ message: "No cookies found" });
        }
        
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            // Redis disabled - just clear cookies
            console.log('User logged out (mock):', decoded.userId);
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.status(200).json({ message: "Logged out successfully" }); 
        } else {
            res.status(400).json({ message: "No refresh token found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        // Redis disabled - just verify the JWT and generate new access token
        console.log('Token refreshed (mock):', decoded.userId);
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m',
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        
        // Add a response to complete the request
        res.json({ message: "Access token refreshed successfully" });
    } catch (error) {
        console.error("Error in refreshToken:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
