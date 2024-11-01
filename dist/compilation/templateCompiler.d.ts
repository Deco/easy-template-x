import { TemplatePlugin } from '../plugins/index.js';
import { XmlNode } from '../xml/index.js';
import { DelimiterSearcher } from './delimiterSearcher.js';
import { ScopeData } from './scopeData.js';
import { Tag } from './tag.js';
import { TagParser } from './tagParser.js';
import { TemplateContext } from './templateContext.js';
export interface TemplateCompilerOptions {
    defaultContentType: string;
    containerContentType: string;
    skipEmptyTags?: boolean;
}
export declare class TemplateCompiler {
    private readonly delimiterSearcher;
    private readonly tagParser;
    private readonly options;
    private readonly pluginsLookup;
    constructor(delimiterSearcher: DelimiterSearcher, tagParser: TagParser, plugins: TemplatePlugin[], options: TemplateCompilerOptions);
    compile(node: XmlNode, data: ScopeData, context: TemplateContext): Promise<void>;
    parseTags(node: XmlNode): Tag[];
    private doTagReplacements;
    private detectContentType;
    private simpleTagReplacements;
    private findCloseTagIndex;
}
