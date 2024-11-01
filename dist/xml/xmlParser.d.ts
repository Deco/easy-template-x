import { XmlNode } from './xmlNode.js';
export declare class XmlParser {
    private static xmlHeader;
    private static readonly parser;
    parse(str: string): XmlNode;
    domParse(str: string): Document;
    serialize(xmlNode: XmlNode): string;
}
