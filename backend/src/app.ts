import express from "express";
import { errorHandler } from "./middlewares/error.middleware.js";
import v1Router from "./routes/v1/index.js";

export const app = express();

app.use(express.json());

app.use("/api/v1", v1Router);

app.use(errorHandler);
