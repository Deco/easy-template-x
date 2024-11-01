import { XmlGeneralNode, XmlNode, XmlParser, XmlTextNode } from '../xml/index.js';
import { Zip } from '../zip/index.js';
import { Docx } from './docx.js';
export declare class DocxParser {
    private readonly xmlParser;
    static readonly PARAGRAPH_NODE = "w:p";
    static readonly PARAGRAPH_PROPERTIES_NODE = "w:pPr";
    static readonly RUN_NODE = "w:r";
    static readonly RUN_PROPERTIES_NODE = "w:rPr";
    static readonly TEXT_NODE = "w:t";
    static readonly TABLE_ROW_NODE = "w:tr";
    static readonly TABLE_CELL_NODE = "w:tc";
    static readonly NUMBER_PROPERTIES_NODE = "w:numPr";
    constructor(xmlParser: XmlParser);
    load(zip: Zip): Promise<Docx>;
    splitTextNode(textNode: XmlTextNode, splitIndex: number, addBefore: boolean): XmlTextNode;
    splitParagraphByTextNode(paragraph: XmlNode, textNode: XmlTextNode, removeTextNode: boolean): [XmlNode, XmlNode];
    joinTextNodesRange(from: XmlTextNode, to: XmlTextNode): void;
    joinParagraphs(first: XmlNode, second: XmlNode): void;
    setSpacePreserveAttribute(node: XmlGeneralNode): void;
    isTextNode(node: XmlNode): boolean;
    isRunNode(node: XmlNode): boolean;
    isRunPropertiesNode(node: XmlNode): boolean;
    isTableCellNode(node: XmlNode): boolean;
    isParagraphNode(node: XmlNode): boolean;
    isListParagraph(paragraphNode: XmlNode): boolean;
    paragraphPropertiesNode(paragraphNode: XmlNode): XmlNode;
    firstTextNodeChild(node: XmlNode): XmlNode;
    containingTextNode(node: XmlTextNode): XmlGeneralNode;
    containingRunNode(node: XmlNode): XmlNode;
    containingParagraphNode(node: XmlNode): XmlNode;
    containingTableRowNode(node: XmlNode): XmlNode;
    isEmptyTextNode(node: XmlNode): boolean;
    isEmptyRun(node: XmlNode): boolean;
}
