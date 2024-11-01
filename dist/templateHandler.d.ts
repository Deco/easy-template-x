import { Tag } from './compilation/index.js';
import { ContentPartType } from './office/index.js';
import { TemplateData } from './templateData.js';
import { TemplateHandlerOptions } from './templateHandlerOptions.js';
import { Binary } from './utils/index.js';
import { XmlNode } from './xml/index.js';
export declare class TemplateHandler {
    readonly version: string;
    private readonly xmlParser;
    private readonly docxParser;
    private readonly compiler;
    private readonly options;
    constructor(options?: TemplateHandlerOptions);
    process<T extends Binary>(templateFile: T, data: TemplateData): Promise<T>;
    parseTags(templateFile: Binary, contentPart?: ContentPartType): Promise<Tag[]>;
    getText(docxFile: Binary, contentPart?: ContentPartType): Promise<string>;
    getXml(docxFile: Binary, contentPart?: ContentPartType): Promise<XmlNode>;
    private callExtensions;
    private loadDocx;
}
