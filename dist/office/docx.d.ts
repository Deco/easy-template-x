import { Constructor } from '../types.js';
import { Binary } from '../utils/index.js';
import { XmlParser } from '../xml/index.js';
import { Zip } from '../zip/index.js';
import { ContentPartType } from './contentPartType.js';
import { ContentTypesFile } from './contentTypesFile.js';
import { MediaFiles } from './mediaFiles.js';
import { XmlPart } from './xmlPart.js';
export declare class Docx {
    private readonly zip;
    private readonly xmlParser;
    private static readonly mainDocumentRelType;
    static open(zip: Zip, xmlParser: XmlParser): Promise<Docx>;
    private static getMainDocumentPath;
    readonly mainDocument: XmlPart;
    readonly mediaFiles: MediaFiles;
    readonly contentTypes: ContentTypesFile;
    private readonly _parts;
    get rawZipFile(): Zip;
    private constructor();
    getContentPart(type: ContentPartType): Promise<XmlPart>;
    justGetMeTheStuff(): Promise<XmlPart[]>;
    getContentParts(): Promise<XmlPart[]>;
    export<T extends Binary>(outputType: Constructor<T>): Promise<T>;
    private getHeaderOrFooter;
    private headerFooterNodeName;
    private headerFooterType;
    private saveChanges;
}
