import { XmlNode } from '../../../xml/index.js';
export class LoopParagraphStrategy {
    utilities;
    setUtilities(utilities) {
        this.utilities = utilities;
    }
    isApplicable(openTag, closeTag) {
        return true;
    }
    splitBefore(openTag, closeTag) {
        let firstParagraph = this.utilities.docxParser.containingParagraphNode(openTag.xmlTextNode);
        let lastParagraph = this.utilities.docxParser.containingParagraphNode(closeTag.xmlTextNode);
        const areSame = (firstParagraph === lastParagraph);
        let splitResult = this.utilities.docxParser.splitParagraphByTextNode(firstParagraph, openTag.xmlTextNode, true);
        firstParagraph = splitResult[0];
        let afterFirstParagraph = splitResult[1];
        if (areSame)
            lastParagraph = afterFirstParagraph;
        splitResult = this.utilities.docxParser.splitParagraphByTextNode(lastParagraph, closeTag.xmlTextNode, true);
        const beforeLastParagraph = splitResult[0];
        lastParagraph = splitResult[1];
        if (areSame)
            afterFirstParagraph = beforeLastParagraph;
        XmlNode.remove(afterFirstParagraph);
        if (!areSame)
            XmlNode.remove(beforeLastParagraph);
        let middleParagraphs;
        if (areSame) {
            middleParagraphs = [afterFirstParagraph];
        }
        else {
            const inBetween = XmlNode.removeSiblings(firstParagraph, lastParagraph);
            middleParagraphs = [afterFirstParagraph].concat(inBetween).concat(beforeLastParagraph);
        }
        return {
            firstNode: firstParagraph,
            nodesToRepeat: middleParagraphs,
            lastNode: lastParagraph
        };
    }
    mergeBack(middleParagraphs, firstParagraph, lastParagraph) {
        let mergeTo = firstParagraph;
        for (const curParagraphsGroup of middleParagraphs) {
            this.utilities.docxParser.joinParagraphs(mergeTo, curParagraphsGroup[0]);
            for (let i = 1; i < curParagraphsGroup.length; i++) {
                XmlNode.insertBefore(curParagraphsGroup[i], lastParagraph);
                mergeTo = curParagraphsGroup[i];
            }
        }
        this.utilities.docxParser.joinParagraphs(mergeTo, lastParagraph);
        XmlNode.remove(lastParagraph);
    }
}
//# sourceMappingURL=loopParagraphStrategy.js.map