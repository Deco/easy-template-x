import { XmlNode } from '../../xml/index.js';
import { TemplatePlugin } from '../templatePlugin.js';
export class RawXmlPlugin extends TemplatePlugin {
    contentType = 'rawXml';
    simpleTagReplacements(tag, data) {
        const value = data.getScopeData();
        const replaceNode = value?.replaceParagraph ?
            this.utilities.docxParser.containingParagraphNode(tag.xmlTextNode) :
            this.utilities.docxParser.containingTextNode(tag.xmlTextNode);
        if (typeof value?.xml === 'string') {
            const newNode = this.utilities.xmlParser.parse(value.xml);
            XmlNode.insertBefore(newNode, replaceNode);
        }
        XmlNode.remove(replaceNode);
    }
}
//# sourceMappingURL=rawXmlPlugin.js.map