import { CustomError } from "./custom-error.js";

export class NotFoundException extends CustomError {
	constructor(message: string) {
		super(404, message);
	}
}
