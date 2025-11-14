import "dotenv/config";
import { app } from "./app.js";
import { connectToDB } from "./config/database.js";

async function startServer() {
	await connectToDB();

	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

startServer();
