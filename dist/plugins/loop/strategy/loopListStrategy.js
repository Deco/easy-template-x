import { XmlNode } from '../../../xml/index.js';
export class LoopListStrategy {
    utilities;
    setUtilities(utilities) {
        this.utilities = utilities;
    }
    isApplicable(openTag, closeTag) {
        const containingParagraph = this.utilities.docxParser.containingParagraphNode(openTag.xmlTextNode);
        return this.utilities.docxParser.isListParagraph(containingParagraph);
    }
    splitBefore(openTag, closeTag) {
        const firstParagraph = this.utilities.docxParser.containingParagraphNode(openTag.xmlTextNode);
        const lastParagraph = this.utilities.docxParser.containingParagraphNode(closeTag.xmlTextNode);
        const paragraphsToRepeat = XmlNode.siblingsInRange(firstParagraph, lastParagraph);
        XmlNode.remove(openTag.xmlTextNode);
        XmlNode.remove(closeTag.xmlTextNode);
        return {
            firstNode: firstParagraph,
            nodesToRepeat: paragraphsToRepeat,
            lastNode: lastParagraph
        };
    }
    mergeBack(paragraphGroups, firstParagraph, lastParagraphs) {
        for (const curParagraphsGroup of paragraphGroups) {
            for (const paragraph of curParagraphsGroup) {
                XmlNode.insertBefore(paragraph, lastParagraphs);
            }
        }
        XmlNode.remove(firstParagraph);
        if (firstParagraph !== lastParagraphs) {
            XmlNode.remove(lastParagraphs);
        }
    }
}
//# sourceMappingURL=loopListStrategy.js.map