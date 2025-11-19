import "dotenv/config";
import { app } from "./app.js";
import { connectToDB } from "./config/database.js";
import logger from "./utils/logger.js";
import { seedAdmin } from "./seeders/admin.seeder.js";

async function startServer() {
	await connectToDB();
	await seedAdmin();

	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
		logger.info(`Server running on port ${PORT}`);
	});
}

startServer();
