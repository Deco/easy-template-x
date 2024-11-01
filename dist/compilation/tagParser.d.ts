import { Delimiters } from '../delimiters.js';
import { DocxParser } from '../office/index.js';
import { DelimiterMark } from './delimiterMark.js';
import { Tag } from './tag.js';
export declare class TagParser {
    private readonly docParser;
    private readonly delimiters;
    private readonly tagRegex;
    constructor(docParser: DocxParser, delimiters: Delimiters);
    parse(delimiters: DelimiterMark[]): Tag[];
    private normalizeTagNodes;
    private processTag;
}
