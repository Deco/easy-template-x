import { MimeTypeHelper } from '../mimeType.js';
import { XmlNode } from '../xml/index.js';
export class ContentTypesFile {
    zip;
    xmlParser;
    static contentTypesFilePath = '[Content_Types].xml';
    addedNew = false;
    root;
    contentTypes;
    constructor(zip, xmlParser) {
        this.zip = zip;
        this.xmlParser = xmlParser;
    }
    async ensureContentType(mime) {
        await this.parseContentTypesFile();
        if (this.contentTypes[mime])
            return;
        const extension = MimeTypeHelper.getDefaultExtension(mime);
        const typeNode = XmlNode.createGeneralNode('Default');
        typeNode.attributes = {
            "Extension": extension,
            "ContentType": mime
        };
        this.root.childNodes.push(typeNode);
        this.addedNew = true;
        this.contentTypes[mime] = true;
    }
    async count() {
        await this.parseContentTypesFile();
        return this.root.childNodes.filter(node => !XmlNode.isTextNode(node)).length;
    }
    async save() {
        if (!this.addedNew)
            return;
        const xmlContent = this.xmlParser.serialize(this.root);
        this.zip.setFile(ContentTypesFile.contentTypesFilePath, xmlContent);
    }
    async parseContentTypesFile() {
        if (this.root)
            return;
        const contentTypesXml = await this.zip.getFile(ContentTypesFile.contentTypesFilePath).getContentText();
        this.root = this.xmlParser.parse(contentTypesXml);
        this.contentTypes = {};
        for (const node of this.root.childNodes) {
            if (node.nodeName !== 'Default')
                continue;
            const genNode = node;
            const contentTypeAttribute = genNode.attributes['ContentType'];
            if (!contentTypeAttribute)
                continue;
            this.contentTypes[contentTypeAttribute] = true;
        }
    }
}
//# sourceMappingURL=contentTypesFile.js.map