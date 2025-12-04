import "dotenv/config";
import mongoose from "mongoose";

export async function connectToDB() {
	const uri = process.env.MONGO_URI;

	if (!uri) {
		console.error("Error: MONGO_URI is not defined in .env file");
		process.exit(1);
	}

	try {
		await mongoose.connect(uri);
		console.log("Successfully connected to MongoDB");
	} catch (err) {
		console.error(`Error connecting to MongoDB: ${err}`);
		process.exit(1);
	}
}
