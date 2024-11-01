import { MalformedFileError } from '../errors/index.js';
import { last } from '../utils/index.js';
import { XmlNode, XmlNodeType } from '../xml/index.js';
import { ContentPartType } from './contentPartType.js';
import { ContentTypesFile } from './contentTypesFile.js';
import { MediaFiles } from './mediaFiles.js';
import { Rels } from './rels.js';
import { XmlPart } from './xmlPart.js';
export class Docx {
    zip;
    xmlParser;
    static mainDocumentRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument';
    static async open(zip, xmlParser) {
        const mainDocumentPath = await Docx.getMainDocumentPath(zip, xmlParser);
        if (!mainDocumentPath)
            throw new MalformedFileError('docx');
        return new Docx(mainDocumentPath, zip, xmlParser);
    }
    static async getMainDocumentPath(zip, xmlParser) {
        const rootPart = '';
        const rootRels = new Rels(rootPart, zip, xmlParser);
        const relations = await rootRels.list();
        return relations.find(rel => rel.type == Docx.mainDocumentRelType)?.target;
    }
    mainDocument;
    mediaFiles;
    contentTypes;
    _parts = {};
    get rawZipFile() {
        return this.zip;
    }
    constructor(mainDocumentPath, zip, xmlParser) {
        this.zip = zip;
        this.xmlParser = xmlParser;
        this.mainDocument = new XmlPart(mainDocumentPath, zip, xmlParser);
        this.mediaFiles = new MediaFiles(zip);
        this.contentTypes = new ContentTypesFile(zip, xmlParser);
    }
    async getContentPart(type) {
        switch (type) {
            case ContentPartType.MainDocument:
                return this.mainDocument;
            default:
                return await this.getHeaderOrFooter(type);
        }
    }
    async justGetMeTheStuff() {
        const out = [this.mainDocument];
        const handleSection = async (sectPr) => {
            for (const sectPrChild of sectPr.childNodes) {
                if (sectPrChild.nodeName == 'w:footerReference' || sectPr.nodeName == 'w:headerReference') {
                    const relId = sectPrChild?.attributes?.['r:id'];
                    if (!relId)
                        continue;
                    const rels = await this.mainDocument.rels.list();
                    const relTarget = rels.find(r => r.id === relId).target;
                    if (!this._parts[relTarget]) {
                        const part = new XmlPart("word/" + relTarget, this.zip, this.xmlParser);
                        this._parts[relTarget] = part;
                    }
                    out.push(this._parts[relTarget]);
                }
            }
        };
        const docRoot = await this.mainDocument.xmlRoot();
        const body = docRoot.childNodes[0];
        for (const bodyChild of body.childNodes) {
            if (bodyChild.nodeName == 'w:sectPr') {
                await handleSection(bodyChild);
            }
            else if (bodyChild.nodeName == 'w:p') {
                const pPr = XmlNode.findChildByName(bodyChild, 'w:pPr');
                if (pPr) {
                    const sectPr = XmlNode.findChildByName(pPr, 'w:sectPr');
                    if (sectPr) {
                        await handleSection(sectPr);
                    }
                }
            }
        }
        return out;
    }
    async getContentParts() {
        const partTypes = [
            ContentPartType.MainDocument,
            ContentPartType.DefaultHeader,
            ContentPartType.FirstHeader,
            ContentPartType.EvenPagesHeader,
            ContentPartType.DefaultFooter,
            ContentPartType.FirstFooter,
            ContentPartType.EvenPagesFooter
        ];
        const parts = await Promise.all(partTypes.map(p => this.getContentPart(p)));
        return parts.filter(p => !!p);
    }
    async export(outputType) {
        await this.saveChanges();
        return await this.zip.export(outputType);
    }
    async getHeaderOrFooter(type) {
        const nodeName = this.headerFooterNodeName(type);
        const nodeTypeAttribute = this.headerFooterType(type);
        const docRoot = await this.mainDocument.xmlRoot();
        const body = docRoot.childNodes.find(node => node.nodeName == 'w:body');
        if (body == null)
            return null;
        const sectionProps = last(body.childNodes.filter(node => node.nodeType === XmlNodeType.General));
        if (sectionProps.nodeName != 'w:sectPr')
            return null;
        const reference = sectionProps.childNodes?.find(node => {
            return node.nodeType === XmlNodeType.General &&
                node.nodeName === nodeName &&
                node.attributes?.['w:type'] === nodeTypeAttribute;
        });
        const relId = reference?.attributes?.['r:id'];
        if (!relId)
            return null;
        const rels = await this.mainDocument.rels.list();
        const relTarget = rels.find(r => r.id === relId).target;
        if (!this._parts[relTarget]) {
            const part = new XmlPart("word/" + relTarget, this.zip, this.xmlParser);
            this._parts[relTarget] = part;
        }
        return this._parts[relTarget];
    }
    headerFooterNodeName(contentPartType) {
        switch (contentPartType) {
            case ContentPartType.DefaultHeader:
            case ContentPartType.FirstHeader:
            case ContentPartType.EvenPagesHeader:
                return 'w:headerReference';
            case ContentPartType.DefaultFooter:
            case ContentPartType.FirstFooter:
            case ContentPartType.EvenPagesFooter:
                return 'w:footerReference';
            default:
                throw new Error(`Invalid content part type: '${contentPartType}'.`);
        }
    }
    headerFooterType(contentPartType) {
        switch (contentPartType) {
            case ContentPartType.DefaultHeader:
            case ContentPartType.DefaultFooter:
                return 'default';
            case ContentPartType.FirstHeader:
            case ContentPartType.FirstFooter:
                return 'first';
            case ContentPartType.EvenPagesHeader:
            case ContentPartType.EvenPagesFooter:
                return 'even';
            default:
                throw new Error(`Invalid content part type: '${contentPartType}'.`);
        }
    }
    async saveChanges() {
        const parts = [
            this.mainDocument,
            ...Object.values(this._parts)
        ];
        for (const part of parts) {
            await part.saveChanges();
        }
        await this.contentTypes.save();
    }
}
//# sourceMappingURL=docx.js.map