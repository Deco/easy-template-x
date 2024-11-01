import { MimeType } from '../mimeType.js';
import { XmlParser } from '../xml/index.js';
import { Zip } from '../zip/index.js';
export declare class ContentTypesFile {
    private readonly zip;
    private readonly xmlParser;
    private static readonly contentTypesFilePath;
    private addedNew;
    private root;
    private contentTypes;
    constructor(zip: Zip, xmlParser: XmlParser);
    ensureContentType(mime: MimeType): Promise<void>;
    count(): Promise<number>;
    save(): Promise<void>;
    private parseContentTypesFile;
}
