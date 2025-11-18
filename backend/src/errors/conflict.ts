import { CustomError } from "./custom-error.js";

export class ConflictException extends CustomError {
	constructor(message: string) {
		super(409, message);
	}
}
