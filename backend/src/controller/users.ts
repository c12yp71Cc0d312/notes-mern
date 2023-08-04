import { RequestHandler } from "express"
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

interface SignUpBody{
    username?: string,
    email?: string,
    password?: string
}

export const getAuthenticatedUserId: RequestHandler =async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        if(!authenticatedUserId)
            throw(createHttpError(401, "User not authenticated"))

        const user = await UserModel.findById(authenticatedUserId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async(req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if(!username || !email || !passwordRaw)
            throw(createHttpError(400, "Missing parameters"));
        
        const existingUserName = await UserModel.findOne({username: username}).exec()

        if(existingUserName)
            throw(createHttpError(409, "Username already taken"));
        
        const existingEmail = await UserModel.findOne({email: email}).exec();

        if(existingEmail)
            throw(createHttpError(409, "Email already exists. Please sign-in instead."));
        
        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
        });

        req.session.userId = newUser._id;

        res.status(200).json(newUser);
    } catch (error) {
        next(error);
    }
};

interface LoginBody {
    username?: string,
    password?: string
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async(req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if(!username || !password)
            throw(createHttpError(400, "missing arguments"));
        
        const user = await UserModel.findOne({username: username}).select("+password +email").exec();

        if(!user)
            throw(createHttpError(401, "invalid credentials"));

        console.log("user info\n" + user);
        
        const passswordMatch = await bcrypt.compare(password, user.password);

        if(!passswordMatch)
            throw(createHttpError(401, "invalid credentials"));
        
        req.session.userId = user._id;
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = async (req, res, next) => {
    req.session.destroy(error => {
        if(error)
            next(error);
        else
            res.sendStatus(200);
    })
};