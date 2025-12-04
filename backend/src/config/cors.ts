import type { CorsOptions } from "cors";
import "dotenv/config";

export const corsConfig: CorsOptions = {
	origin: [process.env.CLIENT_URL || "http://localhost:5173"],
};
