import { XmlNode } from '../../../xml/index.js';
import { LoopOver } from '../loopTagOptions.js';
export class LoopTableStrategy {
    utilities;
    setUtilities(utilities) {
        this.utilities = utilities;
    }
    isApplicable(openTag, closeTag) {
        const openParagraph = this.utilities.docxParser.containingParagraphNode(openTag.xmlTextNode);
        if (!openParagraph.parentNode)
            return false;
        if (!this.utilities.docxParser.isTableCellNode(openParagraph.parentNode))
            return false;
        const closeParagraph = this.utilities.docxParser.containingParagraphNode(closeTag.xmlTextNode);
        if (!closeParagraph.parentNode)
            return false;
        if (!this.utilities.docxParser.isTableCellNode(closeParagraph.parentNode))
            return false;
        const options = openTag.options;
        const forceRowLoop = options?.loopOver === LoopOver.Row;
        if (!forceRowLoop && openParagraph.parentNode === closeParagraph.parentNode)
            return false;
        return true;
    }
    splitBefore(openTag, closeTag) {
        const firstRow = this.utilities.docxParser.containingTableRowNode(openTag.xmlTextNode);
        const lastRow = this.utilities.docxParser.containingTableRowNode(closeTag.xmlTextNode);
        const rowsToRepeat = XmlNode.siblingsInRange(firstRow, lastRow);
        XmlNode.remove(openTag.xmlTextNode);
        XmlNode.remove(closeTag.xmlTextNode);
        return {
            firstNode: firstRow,
            nodesToRepeat: rowsToRepeat,
            lastNode: lastRow
        };
    }
    mergeBack(rowGroups, firstRow, lastRow) {
        for (const curRowsGroup of rowGroups) {
            for (const row of curRowsGroup) {
                XmlNode.insertBefore(row, lastRow);
            }
        }
        XmlNode.remove(firstRow);
        if (firstRow !== lastRow) {
            XmlNode.remove(lastRow);
        }
    }
}
//# sourceMappingURL=loopTableStrategy.js.map