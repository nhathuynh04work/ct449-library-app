import { ErrorCode } from "@/constants/errorCode.js";
import { CustomError } from "@/errors/custom-error.js";
import logger from "@/utils/logger.js";
import type { NextFunction, Request, Response } from "express";
import { flattenError, ZodError } from "zod";

export function errorHandler(
	error: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (error instanceof ZodError) {
		logger.warn(flattenError(error), "Validation Error");
		return res.status(400).json({
			error: { message: flattenError(error).fieldErrors },
		});
	}

	if (error instanceof CustomError) {
		logger.warn(error, "Handled Error");
		return res.status(error.statusCode).json({
			error: { message: error.message },
		});
	}

	if (error.code === ErrorCode.MONGOOSE_DUPLICATE) {
		const field = Object.keys(error.keyValue)[0];
		logger.warn(`Duplicate Key: ${field}`);

		return res.status(409).json({
			error: { message: `${field} này đã tồn tại.` },
		});
	}

	logger.error(error, "An unexpected error occurred");
	return res.status(500).json({
		error: { message: "Internal server error" },
	});
}
