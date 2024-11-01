import { UnclosedTagError, UnknownContentTypeError, UnopenedTagError } from '../errors/index.js';
import { PluginContent } from '../plugins/index.js';
import { isPromiseLike, stringValue, toDictionary } from '../utils/index.js';
import { TagDisposition } from './tag.js';
export class TemplateCompiler {
    delimiterSearcher;
    tagParser;
    options;
    pluginsLookup;
    constructor(delimiterSearcher, tagParser, plugins, options) {
        this.delimiterSearcher = delimiterSearcher;
        this.tagParser = tagParser;
        this.options = options;
        this.pluginsLookup = toDictionary(plugins, p => p.contentType);
    }
    async compile(node, data, context) {
        const tags = this.parseTags(node);
        await this.doTagReplacements(tags, data, context);
    }
    parseTags(node) {
        const delimiters = this.delimiterSearcher.findDelimiters(node);
        const tags = this.tagParser.parse(delimiters);
        return tags;
    }
    async doTagReplacements(tags, data, context) {
        for (let tagIndex = 0; tagIndex < tags.length; tagIndex++) {
            const tag = tags[tagIndex];
            data.pathPush(tag);
            const contentType = this.detectContentType(tag, data);
            const plugin = this.pluginsLookup[contentType];
            if (!plugin) {
                throw new UnknownContentTypeError(contentType, tag.rawText, data.pathString());
            }
            if (tag.disposition === TagDisposition.SelfClosed) {
                await this.simpleTagReplacements(plugin, tag, data, context);
            }
            else if (tag.disposition === TagDisposition.Open) {
                const closingTagIndex = this.findCloseTagIndex(tagIndex, tag, tags);
                const scopeTags = tags.slice(tagIndex, closingTagIndex + 1);
                tagIndex = closingTagIndex;
                const job = plugin.containerTagReplacements(scopeTags, data, context);
                if (isPromiseLike(job)) {
                    await job;
                }
            }
            data.pathPop();
        }
    }
    detectContentType(tag, data) {
        const scopeData = data.getScopeData();
        if (PluginContent.isPluginContent(scopeData))
            return scopeData._type;
        if (tag.disposition === TagDisposition.Open || tag.disposition === TagDisposition.Close)
            return this.options.containerContentType;
        return this.options.defaultContentType;
    }
    async simpleTagReplacements(plugin, tag, data, context) {
        if (this.options.skipEmptyTags && stringValue(data.getScopeData()) === '') {
            return;
        }
        const job = plugin.simpleTagReplacements(tag, data, context);
        if (isPromiseLike(job)) {
            await job;
        }
    }
    findCloseTagIndex(fromIndex, openTag, tags) {
        let openTags = 0;
        let i = fromIndex;
        for (; i < tags.length; i++) {
            const tag = tags[i];
            if (tag.disposition === TagDisposition.Open) {
                openTags++;
                continue;
            }
            if (tag.disposition == TagDisposition.Close) {
                openTags--;
                if (openTags === 0) {
                    return i;
                }
                if (openTags < 0) {
                    throw new UnopenedTagError(tag.name);
                }
                continue;
            }
        }
        if (i === tags.length) {
            throw new UnclosedTagError(openTag.name);
        }
        return i;
    }
}
//# sourceMappingURL=templateCompiler.js.map