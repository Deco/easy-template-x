import { DocxParser } from '../../office/index.js';
import { stringValue } from '../../utils/index.js';
import { XmlNode } from '../../xml/index.js';
import { TemplatePlugin } from '../templatePlugin.js';
export const TEXT_CONTENT_TYPE = 'text';
export class TextPlugin extends TemplatePlugin {
    contentType = TEXT_CONTENT_TYPE;
    simpleTagReplacements(tag, data) {
        const value = data.getScopeData();
        const lines = stringValue(value).split('\n');
        if (lines.length < 2) {
            this.replaceSingleLine(tag.xmlTextNode, lines.length ? lines[0] : '');
        }
        else {
            this.replaceMultiLine(tag.xmlTextNode, lines);
        }
    }
    replaceSingleLine(textNode, text) {
        textNode.textContent = text;
        const wordTextNode = this.utilities.docxParser.containingTextNode(textNode);
        this.utilities.docxParser.setSpacePreserveAttribute(wordTextNode);
    }
    replaceMultiLine(textNode, lines) {
        const runNode = this.utilities.docxParser.containingRunNode(textNode);
        textNode.textContent = lines[0];
        for (let i = 1; i < lines.length; i++) {
            const lineBreak = this.getLineBreak();
            XmlNode.appendChild(runNode, lineBreak);
            const lineNode = this.createWordTextNode(lines[i]);
            XmlNode.appendChild(runNode, lineNode);
        }
    }
    getLineBreak() {
        return XmlNode.createGeneralNode('w:br');
    }
    createWordTextNode(text) {
        const wordTextNode = XmlNode.createGeneralNode(DocxParser.TEXT_NODE);
        wordTextNode.attributes = {};
        this.utilities.docxParser.setSpacePreserveAttribute(wordTextNode);
        wordTextNode.childNodes = [
            XmlNode.createTextNode(text)
        ];
        return wordTextNode;
    }
}
//# sourceMappingURL=textPlugin.js.map