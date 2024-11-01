import JSZip from 'jszip';
import { Constructor } from '../types.js';
import { Binary } from '../utils/index.js';
export declare class JsZipHelper {
    static toJsZipOutputType(binary: Binary): JSZip.OutputType;
    static toJsZipOutputType(binaryType: Constructor<Binary>): JSZip.OutputType;
}
