import { DOMParser } from '@xmldom/xmldom';
import { MissingArgumentError } from '../errors/index.js';
import { XmlNode } from './xmlNode.js';
export class XmlParser {
    static xmlHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    static parser = new DOMParser();
    parse(str) {
        const doc = this.domParse(str);
        return XmlNode.fromDomNode(doc.documentElement);
    }
    domParse(str) {
        if (str === null || str === undefined)
            throw new MissingArgumentError(nameof(str));
        return XmlParser.parser.parseFromString(str, "text/xml");
    }
    serialize(xmlNode) {
        return XmlParser.xmlHeader + XmlNode.serialize(xmlNode);
    }
}
//# sourceMappingURL=xmlParser.js.map