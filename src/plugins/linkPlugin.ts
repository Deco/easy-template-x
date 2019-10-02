import { ScopeData, Tag, TemplateContext } from '../compilation';
import { DocxParser } from '../office';
import { XmlNode } from '../xml';
import { LinkContent } from './linkContent';
import { TemplatePlugin } from './templatePlugin';

export class LinkPlugin extends TemplatePlugin {

    private static readonly linkRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink';

    public readonly contentType = 'link';

    public async simpleTagReplacements(tag: Tag, data: ScopeData, context: TemplateContext): Promise<void> {

        const wordTextNode = this.utilities.docxParser.containingTextNode(tag.xmlTextNode);

        const content = data.getScopeData() as LinkContent;
        if (!content || !content.target) {
            XmlNode.remove(wordTextNode);
            return;
        }

        // add rel
        const linkAttributes = { TargetMode: 'External' };
        const relId = await context.docx.rels.add(content.target, LinkPlugin.linkRelType, linkAttributes);

        // generate markup
        const wordRunNode = this.utilities.docxParser.containingRunNode(wordTextNode);
        const linkMarkup = this.generateMarkup(content, relId, wordRunNode);

        // add to document
        this.insertHyperlinkNode(linkMarkup, wordRunNode);
        XmlNode.remove(wordTextNode);
    }

    private generateMarkup(content: LinkContent, relId: string, wordRunNode: XmlNode) {

        // http://officeopenxml.com/WPhyperlink.php

        const markupText = `
            <w:hyperlink r:id="${relId}" w:history="1">
                <w:r>
                    <w:t>${content.text || content.target}</w:t>
                </w:r>
            </w:hyperlink>
        `;
        const markupXml = this.utilities.xmlParser.parse(markupText);
        XmlNode.removeEmptyTextNodes(markupXml); // remove whitespace

        // copy props from original run node (preserve style)        
        const runProps = wordRunNode.childNodes.find(node => node.nodeName === DocxParser.RUN_PROPERTIES_NODE);
        if (runProps) {
            const linkRunProps = XmlNode.cloneNode(runProps, true);
            markupXml.childNodes[0].childNodes.unshift(linkRunProps);
        }

        return markupXml;
    }

    private insertHyperlinkNode(linkMarkup: XmlNode, wordRunNode: XmlNode) {
        
        const textNodesInRun = wordRunNode.childNodes.filter(node => node.nodeName === DocxParser.TEXT_NODE);
        if (textNodesInRun.length > 1) {
            // will this ever happen?
            throw new Error(
                'Attempt to insert link to run node with multiple text nodes - not implemented... ' + 
                'If you encounter this error please open an issue at https://github.com/alonrbar/easy-template-x/issues'
            );
        }

        XmlNode.insertAfter(linkMarkup, wordRunNode);
    }
}