// we will use it in the get-me route to check if the token is blacklisted or not
import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";

export const authUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized, token is missing"
        })
    }

    const blacklistedToken = await tokenBlacklistModel.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).json({
            message: "Unauthorized, token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded; // we have created a new property (user) in req object
        //  to store the decoded token data, so that we can use it in the next middlewares or controllers
        next(); 

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized, token is invalid"
        })
    }
   
}