import { XmlNode } from '../xml/index.js';
import { Docx } from './docx.js';
export class DocxParser {
    xmlParser;
    static PARAGRAPH_NODE = 'w:p';
    static PARAGRAPH_PROPERTIES_NODE = 'w:pPr';
    static RUN_NODE = 'w:r';
    static RUN_PROPERTIES_NODE = 'w:rPr';
    static TEXT_NODE = 'w:t';
    static TABLE_ROW_NODE = 'w:tr';
    static TABLE_CELL_NODE = 'w:tc';
    static NUMBER_PROPERTIES_NODE = 'w:numPr';
    constructor(xmlParser) {
        this.xmlParser = xmlParser;
    }
    load(zip) {
        return Docx.open(zip, this.xmlParser);
    }
    splitTextNode(textNode, splitIndex, addBefore) {
        let firstXmlTextNode;
        let secondXmlTextNode;
        const wordTextNode = this.containingTextNode(textNode);
        const newWordTextNode = XmlNode.cloneNode(wordTextNode, true);
        this.setSpacePreserveAttribute(wordTextNode);
        this.setSpacePreserveAttribute(newWordTextNode);
        if (addBefore) {
            XmlNode.insertBefore(newWordTextNode, wordTextNode);
            firstXmlTextNode = XmlNode.lastTextChild(newWordTextNode);
            secondXmlTextNode = textNode;
        }
        else {
            const curIndex = wordTextNode.parentNode.childNodes.indexOf(wordTextNode);
            XmlNode.insertChild(wordTextNode.parentNode, newWordTextNode, curIndex + 1);
            firstXmlTextNode = textNode;
            secondXmlTextNode = XmlNode.lastTextChild(newWordTextNode);
        }
        const firstText = firstXmlTextNode.textContent;
        const secondText = secondXmlTextNode.textContent;
        firstXmlTextNode.textContent = firstText.substring(0, splitIndex);
        secondXmlTextNode.textContent = secondText.substring(splitIndex);
        return (addBefore ? firstXmlTextNode : secondXmlTextNode);
    }
    splitParagraphByTextNode(paragraph, textNode, removeTextNode) {
        const containingParagraph = this.containingParagraphNode(textNode);
        if (containingParagraph != paragraph)
            throw new Error(`Node '${nameof(textNode)}' is not a descendant of '${nameof(paragraph)}'.`);
        const runNode = this.containingRunNode(textNode);
        const wordTextNode = this.containingTextNode(textNode);
        const leftRun = XmlNode.cloneNode(runNode, false);
        const rightRun = runNode;
        XmlNode.insertBefore(leftRun, rightRun);
        const runProps = rightRun.childNodes.find(node => node.nodeName === DocxParser.RUN_PROPERTIES_NODE);
        if (runProps) {
            const leftRunProps = XmlNode.cloneNode(runProps, true);
            XmlNode.appendChild(leftRun, leftRunProps);
        }
        const firstRunChildIndex = (runProps ? 1 : 0);
        let curChild = rightRun.childNodes[firstRunChildIndex];
        while (curChild != wordTextNode) {
            XmlNode.remove(curChild);
            XmlNode.appendChild(leftRun, curChild);
            curChild = rightRun.childNodes[firstRunChildIndex];
        }
        if (removeTextNode) {
            XmlNode.removeChild(rightRun, firstRunChildIndex);
        }
        const leftPara = XmlNode.cloneNode(containingParagraph, false);
        const rightPara = containingParagraph;
        XmlNode.insertBefore(leftPara, rightPara);
        const paragraphProps = rightPara.childNodes.find(node => node.nodeName === DocxParser.PARAGRAPH_PROPERTIES_NODE);
        if (paragraphProps) {
            const leftParagraphProps = XmlNode.cloneNode(paragraphProps, true);
            XmlNode.appendChild(leftPara, leftParagraphProps);
        }
        const firstParaChildIndex = (paragraphProps ? 1 : 0);
        curChild = rightPara.childNodes[firstParaChildIndex];
        while (curChild != rightRun) {
            XmlNode.remove(curChild);
            XmlNode.appendChild(leftPara, curChild);
            curChild = rightPara.childNodes[firstParaChildIndex];
        }
        if (this.isEmptyRun(leftRun))
            XmlNode.remove(leftRun);
        if (this.isEmptyRun(rightRun))
            XmlNode.remove(rightRun);
        return [leftPara, rightPara];
    }
    joinTextNodesRange(from, to) {
        const firstRunNode = this.containingRunNode(from);
        const secondRunNode = this.containingRunNode(to);
        const paragraphNode = firstRunNode.parentNode;
        if (secondRunNode.parentNode !== paragraphNode)
            throw new Error('Can not join text nodes from separate paragraphs.');
        const firstWordTextNode = this.containingTextNode(from);
        const secondWordTextNode = this.containingTextNode(to);
        const totalText = [];
        let curRunNode = firstRunNode;
        while (curRunNode) {
            let curWordTextNode;
            if (curRunNode === firstRunNode) {
                curWordTextNode = firstWordTextNode;
            }
            else {
                curWordTextNode = this.firstTextNodeChild(curRunNode);
            }
            while (curWordTextNode) {
                if (curWordTextNode.nodeName !== DocxParser.TEXT_NODE) {
                    curWordTextNode = curWordTextNode.nextSibling;
                    continue;
                }
                const curXmlTextNode = XmlNode.lastTextChild(curWordTextNode);
                totalText.push(curXmlTextNode.textContent);
                const textToRemove = curWordTextNode;
                if (curWordTextNode === secondWordTextNode) {
                    curWordTextNode = null;
                }
                else {
                    curWordTextNode = curWordTextNode.nextSibling;
                }
                if (textToRemove !== firstWordTextNode) {
                    XmlNode.remove(textToRemove);
                }
            }
            const runToRemove = curRunNode;
            if (curRunNode === secondRunNode) {
                curRunNode = null;
            }
            else {
                curRunNode = curRunNode.nextSibling;
            }
            if (!runToRemove.childNodes || !runToRemove.childNodes.length) {
                XmlNode.remove(runToRemove);
            }
        }
        const firstXmlTextNode = XmlNode.lastTextChild(firstWordTextNode);
        firstXmlTextNode.textContent = totalText.join('');
    }
    joinParagraphs(first, second) {
        if (first === second)
            return;
        let childIndex = 0;
        while (second.childNodes && childIndex < second.childNodes.length) {
            const curChild = second.childNodes[childIndex];
            if (curChild.nodeName === DocxParser.RUN_NODE) {
                XmlNode.removeChild(second, childIndex);
                XmlNode.appendChild(first, curChild);
            }
            else {
                childIndex++;
            }
        }
    }
    setSpacePreserveAttribute(node) {
        if (!node.attributes) {
            node.attributes = {};
        }
        if (!node.attributes['xml:space']) {
            node.attributes['xml:space'] = 'preserve';
        }
    }
    isTextNode(node) {
        return node.nodeName === DocxParser.TEXT_NODE;
    }
    isRunNode(node) {
        return node.nodeName === DocxParser.RUN_NODE;
    }
    isRunPropertiesNode(node) {
        return node.nodeName === DocxParser.RUN_PROPERTIES_NODE;
    }
    isTableCellNode(node) {
        return node.nodeName === DocxParser.TABLE_CELL_NODE;
    }
    isParagraphNode(node) {
        return node.nodeName === DocxParser.PARAGRAPH_NODE;
    }
    isListParagraph(paragraphNode) {
        const paragraphProperties = this.paragraphPropertiesNode(paragraphNode);
        const listNumberProperties = XmlNode.findChildByName(paragraphProperties, DocxParser.NUMBER_PROPERTIES_NODE);
        return !!listNumberProperties;
    }
    paragraphPropertiesNode(paragraphNode) {
        if (!this.isParagraphNode(paragraphNode))
            throw new Error(`Expected paragraph node but received a '${paragraphNode.nodeName}' node.`);
        return XmlNode.findChildByName(paragraphNode, DocxParser.PARAGRAPH_PROPERTIES_NODE);
    }
    firstTextNodeChild(node) {
        if (!node)
            return null;
        if (node.nodeName !== DocxParser.RUN_NODE)
            return null;
        if (!node.childNodes)
            return null;
        for (const child of node.childNodes) {
            if (child.nodeName === DocxParser.TEXT_NODE)
                return child;
        }
        return null;
    }
    containingTextNode(node) {
        if (!node)
            return null;
        if (!XmlNode.isTextNode(node))
            throw new Error(`'Invalid argument ${nameof(node)}. Expected a XmlTextNode.`);
        return XmlNode.findParentByName(node, DocxParser.TEXT_NODE);
    }
    containingRunNode(node) {
        return XmlNode.findParentByName(node, DocxParser.RUN_NODE);
    }
    containingParagraphNode(node) {
        return XmlNode.findParentByName(node, DocxParser.PARAGRAPH_NODE);
    }
    containingTableRowNode(node) {
        return XmlNode.findParentByName(node, DocxParser.TABLE_ROW_NODE);
    }
    isEmptyTextNode(node) {
        if (!this.isTextNode(node))
            throw new Error(`Text node expected but '${node.nodeName}' received.`);
        if (!node.childNodes?.length)
            return true;
        const xmlTextNode = node.childNodes[0];
        if (!XmlNode.isTextNode(xmlTextNode))
            throw new Error("Invalid XML structure. 'w:t' node should contain a single text node only.");
        if (!xmlTextNode.textContent)
            return true;
        return false;
    }
    isEmptyRun(node) {
        if (!this.isRunNode(node))
            throw new Error(`Run node expected but '${node.nodeName}' received.`);
        for (const child of (node.childNodes ?? [])) {
            if (this.isRunPropertiesNode(child))
                continue;
            if (this.isTextNode(child) && this.isEmptyTextNode(child))
                continue;
            return false;
        }
        return true;
    }
}
//# sourceMappingURL=docxParser.js.map