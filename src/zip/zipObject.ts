import JSZip from 'jszip';
import { Constructor } from '../types.js';
import { Binary } from '../utils/index.js';
import { JsZipHelper } from './jsZipHelper.js';

export class ZipObject {

    public get name(): string {
        return this.zipObject.name;
    }

    public set name(value: string) {
        this.zipObject.name = value;
    }

    public get isDirectory(): boolean {
        return this.zipObject.dir;
    }

    constructor(private readonly zipObject: JSZip.JSZipObject) { }

    public getContentText(): Promise<string> {
        return this.zipObject.async('text');
    }

    public getContentBase64(): Promise<string> {
        return this.zipObject.async('binarystring');
    }

    public getContentBinary<T extends Binary>(outputType: Constructor<T>): Promise<T> {
        const zipOutputType: JSZip.OutputType = JsZipHelper.toJsZipOutputType(outputType);
        return this.zipObject.async(zipOutputType) as any;
    }
}
