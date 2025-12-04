import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
import v1Router from "./routes/v1/index.js";
import { corsConfig } from "./config/cors.js";

export const app = express();

app.use(cors(corsConfig));
app.use(express.json());

app.use("/api/v1", v1Router);

app.use(errorHandler);
