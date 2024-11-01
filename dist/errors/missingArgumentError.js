import { ArgumentError } from './argumentError.js';
export class MissingArgumentError extends ArgumentError {
    argName;
    constructor(argName) {
        super(`Argument '${argName}' is missing.`);
        this.argName = argName;
    }
}
//# sourceMappingURL=missingArgumentError.js.map