import { MissingArgumentError } from '../errors/index.js';
import { first, last } from '../utils/index.js';
import { XmlDepthTracker, XmlNode } from '../xml/index.js';
class MatchState {
    delimiterIndex = 0;
    openNodes = [];
    firstMatchIndex = -1;
    reset() {
        this.delimiterIndex = 0;
        this.openNodes = [];
        this.firstMatchIndex = -1;
    }
}
export class DelimiterSearcher {
    docxParser;
    maxXmlDepth = 20;
    startDelimiter = "{";
    endDelimiter = "}";
    constructor(docxParser) {
        this.docxParser = docxParser;
        if (!docxParser)
            throw new MissingArgumentError(nameof(docxParser));
    }
    findDelimiters(node) {
        const delimiters = [];
        const match = new MatchState();
        const depth = new XmlDepthTracker(this.maxXmlDepth);
        let lookForOpenDelimiter = true;
        while (node) {
            if (this.docxParser.isParagraphNode(node)) {
                match.reset();
            }
            if (!this.shouldSearchNode(node)) {
                node = this.findNextNode(node, depth);
                continue;
            }
            match.openNodes.push(node);
            let textIndex = 0;
            while (textIndex < node.textContent.length) {
                const delimiterPattern = lookForOpenDelimiter ? this.startDelimiter : this.endDelimiter;
                const char = node.textContent[textIndex];
                if (char !== delimiterPattern[match.delimiterIndex]) {
                    [node, textIndex] = this.noMatch(node, textIndex, match);
                    textIndex++;
                    continue;
                }
                if (match.firstMatchIndex === -1) {
                    match.firstMatchIndex = textIndex;
                }
                if (match.delimiterIndex !== delimiterPattern.length - 1) {
                    match.delimiterIndex++;
                    textIndex++;
                    continue;
                }
                [node, textIndex, lookForOpenDelimiter] = this.fullMatch(node, textIndex, lookForOpenDelimiter, match, delimiters);
                textIndex++;
            }
            node = this.findNextNode(node, depth);
        }
        return delimiters;
    }
    noMatch(node, textIndex, match) {
        if (match.firstMatchIndex !== -1) {
            node = first(match.openNodes);
            textIndex = match.firstMatchIndex;
        }
        match.reset();
        if (textIndex < node.textContent.length - 1) {
            match.openNodes.push(node);
        }
        return [node, textIndex];
    }
    fullMatch(node, textIndex, lookForOpenDelimiter, match, delimiters) {
        if (match.openNodes.length > 1) {
            const firstNode = first(match.openNodes);
            const lastNode = last(match.openNodes);
            this.docxParser.joinTextNodesRange(firstNode, lastNode);
            textIndex += (firstNode.textContent.length - node.textContent.length);
            node = firstNode;
        }
        const delimiterMark = this.createDelimiterMark(match, lookForOpenDelimiter);
        delimiters.push(delimiterMark);
        lookForOpenDelimiter = !lookForOpenDelimiter;
        match.reset();
        if (textIndex < node.textContent.length - 1) {
            match.openNodes.push(node);
        }
        return [node, textIndex, lookForOpenDelimiter];
    }
    shouldSearchNode(node) {
        if (!XmlNode.isTextNode(node))
            return false;
        if (!node.textContent)
            return false;
        if (!node.parentNode)
            return false;
        if (!this.docxParser.isTextNode(node.parentNode))
            return false;
        return true;
    }
    findNextNode(node, depth) {
        if (node.childNodes && node.childNodes.length) {
            depth.increment();
            return node.childNodes[0];
        }
        if (node.nextSibling)
            return node.nextSibling;
        while (node.parentNode) {
            if (node.parentNode.nextSibling) {
                depth.decrement();
                return node.parentNode.nextSibling;
            }
            depth.decrement();
            node = node.parentNode;
        }
        return null;
    }
    createDelimiterMark(match, isOpenDelimiter) {
        return {
            index: match.firstMatchIndex,
            isOpen: isOpenDelimiter,
            xmlTextNode: match.openNodes[0]
        };
    }
}
//# sourceMappingURL=delimiterSearcher.js.map