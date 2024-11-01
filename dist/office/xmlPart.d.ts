import { XmlNode, XmlParser } from '../xml/index.js';
import { Zip } from '../zip/index.js';
import { Rels } from './rels.js';
export declare class XmlPart {
    readonly path: string;
    private readonly zip;
    private readonly xmlParser;
    readonly rels: Rels;
    private root;
    constructor(path: string, zip: Zip, xmlParser: XmlParser);
    xmlRoot(): Promise<XmlNode>;
    getText(): Promise<string>;
    saveChanges(): Promise<void>;
}
