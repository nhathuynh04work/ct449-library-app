import { CustomError } from "./custom-error.js";

export class UnauthorizedException extends CustomError {
	constructor(message: string = "Unauthorized") {
		super(401, message);
	}
}
