import { Delimiters } from './delimiters.js';
import { createDefaultPlugins, LOOP_CONTENT_TYPE, TEXT_CONTENT_TYPE } from './plugins/index.js';
export class TemplateHandlerOptions {
    plugins = createDefaultPlugins();
    skipEmptyTags = false;
    defaultContentType = TEXT_CONTENT_TYPE;
    containerContentType = LOOP_CONTENT_TYPE;
    delimiters = new Delimiters();
    maxXmlDepth = 20;
    extensions = {};
    scopeDataResolver;
    constructor(initial) {
        Object.assign(this, initial);
        if (initial) {
            this.delimiters = new Delimiters(initial.delimiters);
        }
        if (!this.plugins.length) {
            throw new Error('Plugins list can not be empty');
        }
    }
}
//# sourceMappingURL=templateHandlerOptions.js.map