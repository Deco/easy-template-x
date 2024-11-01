import { ScopeData, Tag, TemplateContext } from '../../compilation/index.js';
import { PluginUtilities, TemplatePlugin } from '../templatePlugin.js';
export declare const LOOP_CONTENT_TYPE = "loop";
export declare class LoopPlugin extends TemplatePlugin {
    readonly contentType = "loop";
    private readonly loopStrategies;
    setUtilities(utilities: PluginUtilities): void;
    containerTagReplacements(tags: Tag[], data: ScopeData, context: TemplateContext): Promise<void>;
    private repeat;
    private compile;
    private updatePathBefore;
    private updatePathAfter;
}
