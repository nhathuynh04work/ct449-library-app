import { CustomError } from "./custom-error.js";

export class BadRequestException extends CustomError {
	constructor(message: string) {
		super(400, message);
	}
}
