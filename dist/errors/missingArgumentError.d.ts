import { ArgumentError } from './argumentError.js';
export declare class MissingArgumentError extends ArgumentError {
    readonly argName: string;
    constructor(argName: string);
}
