import { ScopeData, TagParser, TemplateCompiler, TemplateContext } from '../compilation/index.js';
import { DocxParser } from '../office/index.js';
import { XmlParser } from '../xml/index.js';
export interface ExtensionUtilities {
    compiler: TemplateCompiler;
    tagParser: TagParser;
    docxParser: DocxParser;
    xmlParser: XmlParser;
}
export declare abstract class TemplateExtension {
    protected utilities: ExtensionUtilities;
    setUtilities(utilities: ExtensionUtilities): void;
    abstract execute(data: ScopeData, context: TemplateContext): void | Promise<void>;
}
