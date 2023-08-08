import "dotenv/config"
import express, { Request, Response, NextFunction } from "express";
import usersRoutes from "./routes/users";
import notesRoutes from "./routes/notes";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

const app = express();

app.use(morgan("dev"));

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000      // 1 hour in millisecs
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
}));

app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/notes", requiresAuth, notesRoutes);

app.use((req, res, next) => {
    // next(Error("Endpoint not found"));
    next(createHttpError(404, "Endpoint not found"))
})


// error handler middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars 
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let statusCode = 500;
    let errorMessage = "An unknown error occured";
    if(isHttpError(error)) {
        errorMessage = error.message;
        statusCode = error.status;
    }
        
    res.status(statusCode).json({error: errorMessage});
})

export default app;