import { Constructor } from '../types.js';
import { Binary } from '../utils/index.js';
import { ZipObject } from './zipObject.js';
export declare class Zip {
    private readonly zip;
    static load(file: Binary): Promise<Zip>;
    private constructor();
    getFile(path: string): ZipObject;
    setFile(path: string, content: string | Binary): void;
    isFileExist(path: string): boolean;
    listFiles(): string[];
    export<T extends Binary>(outputType: Constructor<T>): Promise<T>;
}
