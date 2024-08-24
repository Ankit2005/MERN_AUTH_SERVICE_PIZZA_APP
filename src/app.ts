import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import "reflect-metadata";
import express from "express";
// import createError from "http-errors";
import cors from "cors";
import authRouter from "./routes/auth";
import tenantRouter from "./routes/tenant";
import userRouter from "./routes/user";
import cookieParser from "cookie-parser";
/// "http://localhost:5173",
const app = express();
app.use(
    cors({
        origin: ["http://localhost:5173"],
        // origin: ["http://127.0.0.1:5173"],
        credentials: true,
    }),
);
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
    res.send("Welcome to Auth service");
});

app.use("/auth", authRouter);
app.use("/tenants", tenantRouter);
app.use("/users", userRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(globalErrorHandler);

export default app;
