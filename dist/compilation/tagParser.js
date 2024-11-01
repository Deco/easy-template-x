import * as JSON5 from 'json5';
import { MissingArgumentError, MissingCloseDelimiterError, MissingStartDelimiterError, TagOptionsParseError } from '../errors/index.js';
import { normalizeDoubleQuotes, Regex } from '../utils/index.js';
import { TagDisposition } from './tag.js';
export class TagParser {
    docParser;
    delimiters;
    tagRegex;
    constructor(docParser, delimiters) {
        this.docParser = docParser;
        this.delimiters = delimiters;
        if (!docParser)
            throw new MissingArgumentError(nameof(docParser));
        if (!delimiters)
            throw new MissingArgumentError(nameof(delimiters));
        const tagOptionsRegex = `${Regex.escape(delimiters.tagOptionsStart)}(?<tagOptions>.*?)${Regex.escape(delimiters.tagOptionsEnd)}`;
        this.tagRegex = new RegExp(`^${Regex.escape(delimiters.tagStart)}(?<tagName>.*?)(${tagOptionsRegex})?${Regex.escape(delimiters.tagEnd)}`, 'm');
    }
    parse(delimiters) {
        const tags = [];
        let openedTag;
        let openedDelimiter;
        for (let i = 0; i < delimiters.length; i++) {
            const delimiter = delimiters[i];
            if (!openedTag && !delimiter.isOpen) {
                const closeTagText = delimiter.xmlTextNode.textContent;
                throw new MissingStartDelimiterError(closeTagText);
            }
            if (openedTag && delimiter.isOpen) {
                const openTagText = openedDelimiter.xmlTextNode.textContent;
                throw new MissingCloseDelimiterError(openTagText);
            }
            if (!openedTag && delimiter.isOpen) {
                openedTag = {};
                openedDelimiter = delimiter;
            }
            if (openedTag && !delimiter.isOpen) {
                this.normalizeTagNodes(openedDelimiter, delimiter, i, delimiters);
                openedTag.xmlTextNode = openedDelimiter.xmlTextNode;
                this.processTag(openedTag);
                tags.push(openedTag);
                openedTag = null;
                openedDelimiter = null;
            }
        }
        return tags;
    }
    normalizeTagNodes(openDelimiter, closeDelimiter, closeDelimiterIndex, allDelimiters) {
        let startTextNode = openDelimiter.xmlTextNode;
        let endTextNode = closeDelimiter.xmlTextNode;
        const sameNode = (startTextNode === endTextNode);
        if (openDelimiter.index > 0) {
            this.docParser.splitTextNode(startTextNode, openDelimiter.index, true);
            if (sameNode) {
                closeDelimiter.index -= openDelimiter.index;
            }
        }
        if (closeDelimiter.index < endTextNode.textContent.length - 1) {
            endTextNode = this.docParser.splitTextNode(endTextNode, closeDelimiter.index + this.delimiters.tagEnd.length, true);
            if (sameNode) {
                startTextNode = endTextNode;
            }
        }
        if (!sameNode) {
            this.docParser.joinTextNodesRange(startTextNode, endTextNode);
            endTextNode = startTextNode;
        }
        for (let i = closeDelimiterIndex + 1; i < allDelimiters.length; i++) {
            let updated = false;
            const curDelimiter = allDelimiters[i];
            if (curDelimiter.xmlTextNode === openDelimiter.xmlTextNode) {
                curDelimiter.index -= openDelimiter.index;
                updated = true;
            }
            if (curDelimiter.xmlTextNode === closeDelimiter.xmlTextNode) {
                curDelimiter.index -= closeDelimiter.index + this.delimiters.tagEnd.length;
                updated = true;
            }
            if (!updated)
                break;
        }
        openDelimiter.xmlTextNode = startTextNode;
        closeDelimiter.xmlTextNode = endTextNode;
    }
    processTag(tag) {
        tag.rawText = tag.xmlTextNode.textContent;
        const tagParts = this.tagRegex.exec(tag.rawText);
        const tagName = (tagParts.groups?.["tagName"] || '').trim();
        if (!tagName?.length) {
            tag.disposition = TagDisposition.SelfClosed;
            return;
        }
        const tagOptionsText = (tagParts.groups?.["tagOptions"] || '').trim();
        if (tagOptionsText) {
            try {
                tag.options = JSON5.parse("{" + normalizeDoubleQuotes(tagOptionsText) + "}");
            }
            catch (e) {
                throw new TagOptionsParseError(tag.rawText, e);
            }
        }
        if (tagName.startsWith(this.delimiters.containerTagOpen)) {
            tag.disposition = TagDisposition.Open;
            tag.name = tagName.slice(this.delimiters.containerTagOpen.length).trim();
            return;
        }
        if (tagName.startsWith(this.delimiters.containerTagClose)) {
            tag.disposition = TagDisposition.Close;
            tag.name = tagName.slice(this.delimiters.containerTagClose.length).trim();
            return;
        }
        tag.disposition = TagDisposition.SelfClosed;
        tag.name = tagName;
    }
}
//# sourceMappingURL=tagParser.js.map