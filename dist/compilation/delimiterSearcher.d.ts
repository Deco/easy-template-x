import { DocxParser } from '../office/index.js';
import { XmlNode } from '../xml/index.js';
import { DelimiterMark } from './delimiterMark.js';
export declare class DelimiterSearcher {
    private readonly docxParser;
    maxXmlDepth: number;
    startDelimiter: string;
    endDelimiter: string;
    constructor(docxParser: DocxParser);
    findDelimiters(node: XmlNode): DelimiterMark[];
    private noMatch;
    private fullMatch;
    private shouldSearchNode;
    private findNextNode;
    private createDelimiterMark;
}
