import "dotenv/config"
import express, { Request, Response, NextFunction } from "express";
import notesRoutes from "./routes/notes";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/notes", notesRoutes);

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