import { ScopeData, Tag, TemplateContext } from '../../compilation/index.js';
import { TemplatePlugin } from '../templatePlugin.js';
export declare class ImagePlugin extends TemplatePlugin {
    readonly contentType = "image";
    simpleTagReplacements(tag: Tag, data: ScopeData, context: TemplateContext): Promise<void>;
    private createMarkup;
    private docProperties;
    private pictureMarkup;
    private transparencyMarkup;
    private pixelsToEmu;
}
