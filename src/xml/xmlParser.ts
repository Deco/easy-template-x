import { DOMParser } from '@xmldom/xmldom';
import { MissingArgumentError } from '../errors/index.js';
import { XmlNode } from './xmlNode.js';

export class XmlParser {

    private static xmlHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    /**
     * We always use the DOMParser from 'xmldom', even in the browser since it
     * handles xml namespaces more forgivingly (required mainly by the
     * RawXmlPlugin).
     */
    private static readonly parser = new DOMParser();

    public parse(str: string): XmlNode {
        const doc = this.domParse(str);
        return XmlNode.fromDomNode(doc.documentElement);
    }

    public domParse(str: string): Document {
        if (str === null || str === undefined)
            throw new MissingArgumentError(nameof(str));

        return XmlParser.parser.parseFromString(str, "text/xml");
    }

    public serialize(xmlNode: XmlNode): string {
        return XmlParser.xmlHeader + XmlNode.serialize(xmlNode);
    }
}
