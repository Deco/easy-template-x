import { Rels } from './rels.js';
export class XmlPart {
    path;
    zip;
    xmlParser;
    rels;
    root;
    constructor(path, zip, xmlParser) {
        this.path = path;
        this.zip = zip;
        this.xmlParser = xmlParser;
        this.rels = new Rels(this.path, zip, xmlParser);
    }
    async xmlRoot() {
        if (!this.root) {
            const xml = await this.zip.getFile(this.path).getContentText();
            this.root = this.xmlParser.parse(xml);
        }
        return this.root;
    }
    async getText() {
        const xmlDocument = await this.xmlRoot();
        const xml = this.xmlParser.serialize(xmlDocument);
        const domDocument = this.xmlParser.domParse(xml);
        return domDocument.documentElement.textContent;
    }
    async saveChanges() {
        if (this.root) {
            const xmlRoot = await this.xmlRoot();
            const xmlContent = this.xmlParser.serialize(xmlRoot);
            this.zip.setFile(this.path, xmlContent);
        }
        await this.rels.save();
    }
}
//# sourceMappingURL=xmlPart.js.map