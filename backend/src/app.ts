import express from "express";
import { authRouter } from "./routes/index.js";
import { errorHandler } from "./middlewares/global-error-handle.js";
import { NotFoundException } from "./errors/not-found.js";

export const app = express();

app.use(express.json());

app.use("/auth", authRouter);

app.use(errorHandler);
