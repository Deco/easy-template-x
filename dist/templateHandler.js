import { DelimiterSearcher, ScopeData, TagParser, TemplateCompiler } from './compilation/index.js';
import { MalformedFileError } from './errors/index.js';
import { ContentPartType, DocxParser } from './office/index.js';
import { TemplateHandlerOptions } from './templateHandlerOptions.js';
import { XmlParser } from './xml/index.js';
import { Zip } from './zip/index.js';
export class TemplateHandler {
    version = (typeof EASY_VERSION !== 'undefined' ? EASY_VERSION : 'null');
    xmlParser = new XmlParser();
    docxParser;
    compiler;
    options;
    constructor(options) {
        this.options = new TemplateHandlerOptions(options);
        this.docxParser = new DocxParser(this.xmlParser);
        const delimiterSearcher = new DelimiterSearcher(this.docxParser);
        delimiterSearcher.startDelimiter = this.options.delimiters.tagStart;
        delimiterSearcher.endDelimiter = this.options.delimiters.tagEnd;
        delimiterSearcher.maxXmlDepth = this.options.maxXmlDepth;
        const tagParser = new TagParser(this.docxParser, this.options.delimiters);
        this.compiler = new TemplateCompiler(delimiterSearcher, tagParser, this.options.plugins, {
            skipEmptyTags: this.options.skipEmptyTags,
            defaultContentType: this.options.defaultContentType,
            containerContentType: this.options.containerContentType
        });
        this.options.plugins.forEach(plugin => {
            plugin.setUtilities({
                xmlParser: this.xmlParser,
                docxParser: this.docxParser,
                compiler: this.compiler
            });
        });
        const extensionUtilities = {
            xmlParser: this.xmlParser,
            docxParser: this.docxParser,
            tagParser,
            compiler: this.compiler
        };
        this.options.extensions?.beforeCompilation?.forEach(extension => {
            extension.setUtilities(extensionUtilities);
        });
        this.options.extensions?.afterCompilation?.forEach(extension => {
            extension.setUtilities(extensionUtilities);
        });
    }
    async process(templateFile, data) {
        const docx = await this.loadDocx(templateFile);
        const scopeData = new ScopeData(data);
        scopeData.scopeDataResolver = this.options.scopeDataResolver;
        const context = {
            docx,
            currentPart: null
        };
        const wtf = await docx.justGetMeTheStuff();
        for (const part of wtf) {
            context.currentPart = part;
            await this.callExtensions(this.options.extensions?.beforeCompilation, scopeData, context);
            const xmlRoot = await part.xmlRoot();
            await this.compiler.compile(xmlRoot, scopeData, context);
            await this.callExtensions(this.options.extensions?.afterCompilation, scopeData, context);
        }
        return docx.export(templateFile.constructor);
    }
    async parseTags(templateFile, contentPart = ContentPartType.MainDocument) {
        const docx = await this.loadDocx(templateFile);
        const part = await docx.getContentPart(contentPart);
        const xmlRoot = await part.xmlRoot();
        return this.compiler.parseTags(xmlRoot);
    }
    async getText(docxFile, contentPart = ContentPartType.MainDocument) {
        const docx = await this.loadDocx(docxFile);
        const part = await docx.getContentPart(contentPart);
        const text = await part.getText();
        return text;
    }
    async getXml(docxFile, contentPart = ContentPartType.MainDocument) {
        const docx = await this.loadDocx(docxFile);
        const part = await docx.getContentPart(contentPart);
        const xmlRoot = await part.xmlRoot();
        return xmlRoot;
    }
    async callExtensions(extensions, scopeData, context) {
        if (!extensions)
            return;
        for (const extension of extensions) {
            await extension.execute(scopeData, context);
        }
    }
    async loadDocx(file) {
        let zip;
        try {
            zip = await Zip.load(file);
        }
        catch {
            throw new MalformedFileError('docx');
        }
        const docx = await this.docxParser.load(zip);
        return docx;
    }
}
//# sourceMappingURL=templateHandler.js.map