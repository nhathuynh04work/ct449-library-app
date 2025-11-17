import "dotenv/config";
import { app } from "./app.js";
import { connectToDB } from "./config/database.js";
import logger from "./utils/logger.js";

async function startServer() {
	await connectToDB();

	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
		logger.info(`Server running on port ${PORT}`);
	});
}

startServer();
