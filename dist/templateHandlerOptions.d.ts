import { ScopeDataResolver } from './compilation/index.js';
import { Delimiters } from './delimiters.js';
import { ExtensionOptions } from './extensions/index.js';
import { TemplatePlugin } from './plugins/index.js';
export declare class TemplateHandlerOptions {
    plugins?: TemplatePlugin[];
    skipEmptyTags?: boolean;
    defaultContentType?: string;
    containerContentType?: string;
    delimiters?: Partial<Delimiters>;
    maxXmlDepth?: number;
    extensions?: ExtensionOptions;
    scopeDataResolver?: ScopeDataResolver;
    constructor(initial?: Partial<TemplateHandlerOptions>);
}
