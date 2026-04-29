// we generally use redis for toekn  blacklisting in production
// but here we are using mongodb for token blacklisting

import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required for blacklisting"],
    },
}, { timestamps: true })

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema);
export default tokenBlacklistModel;