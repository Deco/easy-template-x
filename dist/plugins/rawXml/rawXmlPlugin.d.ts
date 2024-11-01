import { ScopeData, Tag } from '../../compilation/index.js';
import { TemplatePlugin } from '../templatePlugin.js';
export declare class RawXmlPlugin extends TemplatePlugin {
    readonly contentType = "rawXml";
    simpleTagReplacements(tag: Tag, data: ScopeData): void;
}
