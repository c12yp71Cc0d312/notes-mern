// type definition file for session

import mongoose from "mongoose";

// declaring additional properties on the session object
declare module "express-session" {
    interface SessionData {
        userId: mongoose.Types.ObjectId;
    }
}