import { DocxParser } from '../../office/index.js';
import { XmlNode } from '../../xml/index.js';
import { TemplatePlugin } from '../templatePlugin.js';
export class LinkPlugin extends TemplatePlugin {
    static linkRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink';
    contentType = 'link';
    async simpleTagReplacements(tag, data, context) {
        const wordTextNode = this.utilities.docxParser.containingTextNode(tag.xmlTextNode);
        const content = data.getScopeData();
        if (!content || !content.target) {
            XmlNode.remove(wordTextNode);
            return;
        }
        const relId = await context.currentPart.rels.add(content.target, LinkPlugin.linkRelType, 'External');
        const wordRunNode = this.utilities.docxParser.containingRunNode(wordTextNode);
        const linkMarkup = this.generateMarkup(content, relId, wordRunNode);
        this.insertHyperlinkNode(linkMarkup, wordRunNode, wordTextNode);
    }
    generateMarkup(content, relId, wordRunNode) {
        let tooltip = '';
        if (content.tooltip) {
            tooltip += `w:tooltip="${content.tooltip}" `;
        }
        const markupText = `
            <w:hyperlink r:id="${relId}" ${tooltip}w:history="1">
                <w:r>
                    <w:rPr>
                        <w:rStyle w:val="Hyperlink"/>
                    </w:rPr>
                    <w:t>${content.text || content.target}</w:t>
                </w:r>
            </w:hyperlink>
        `;
        const markupXml = this.utilities.xmlParser.parse(markupText);
        XmlNode.removeEmptyTextNodes(markupXml);
        const runProps = wordRunNode.childNodes.find(node => node.nodeName === DocxParser.RUN_PROPERTIES_NODE);
        if (runProps) {
            const linkRunProps = XmlNode.cloneNode(runProps, true);
            markupXml.childNodes[0].childNodes.unshift(linkRunProps);
        }
        return markupXml;
    }
    insertHyperlinkNode(linkMarkup, tagRunNode, tagTextNode) {
        let textNodesInRun = tagRunNode.childNodes.filter(node => node.nodeName === DocxParser.TEXT_NODE);
        if (textNodesInRun.length > 1) {
            const [runBeforeTag] = XmlNode.splitByChild(tagRunNode, tagTextNode, true);
            textNodesInRun = runBeforeTag.childNodes.filter(node => node.nodeName === DocxParser.TEXT_NODE);
            XmlNode.insertAfter(linkMarkup, runBeforeTag);
            if (textNodesInRun.length === 0) {
                XmlNode.remove(runBeforeTag);
            }
        }
        else {
            XmlNode.insertAfter(linkMarkup, tagRunNode);
            XmlNode.remove(tagRunNode);
        }
    }
}
//# sourceMappingURL=linkPlugin.js.map