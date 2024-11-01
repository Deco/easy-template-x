import JSZip from 'jszip';
import { Constructor } from '../types.js';
import { Binary } from '../utils/index.js';
export declare class ZipObject {
    private readonly zipObject;
    get name(): string;
    set name(value: string);
    get isDirectory(): boolean;
    constructor(zipObject: JSZip.JSZipObject);
    getContentText(): Promise<string>;
    getContentBase64(): Promise<string>;
    getContentBinary<T extends Binary>(outputType: Constructor<T>): Promise<T>;
}
