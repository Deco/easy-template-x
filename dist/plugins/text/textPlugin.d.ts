import { ScopeData, Tag } from '../../compilation/index.js';
import { TemplatePlugin } from '../templatePlugin.js';
export declare const TEXT_CONTENT_TYPE = "text";
export declare class TextPlugin extends TemplatePlugin {
    readonly contentType = "text";
    simpleTagReplacements(tag: Tag, data: ScopeData): void;
    private replaceSingleLine;
    private replaceMultiLine;
    private getLineBreak;
    private createWordTextNode;
}
