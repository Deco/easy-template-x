import { Path } from '../utils/index.js';
import { XmlNode } from '../xml/index.js';
import { Relationship } from './relationship.js';
export class Rels {
    zip;
    xmlParser;
    rels;
    relTargets;
    nextRelId = 0;
    partDir;
    relsFilePath;
    constructor(partPath, zip, xmlParser) {
        this.zip = zip;
        this.xmlParser = xmlParser;
        this.partDir = partPath && Path.getDirectory(partPath);
        const partFilename = partPath && Path.getFilename(partPath);
        this.relsFilePath = Path.combine(this.partDir, '_rels', `${partFilename ?? ''}.rels`);
    }
    async add(relTarget, relType, relTargetMode) {
        if (this.partDir && relTarget.startsWith(this.partDir)) {
            relTarget = relTarget.substr(this.partDir.length + 1);
        }
        await this.parseRelsFile();
        const relTargetKey = this.getRelTargetKey(relType, relTarget);
        let relId = this.relTargets[relTargetKey];
        if (relId)
            return relId;
        relId = this.getNextRelId();
        const rel = new Relationship({
            id: relId,
            type: relType,
            target: relTarget,
            targetMode: relTargetMode
        });
        this.rels[relId] = rel;
        this.relTargets[relTargetKey] = relId;
        return relId;
    }
    async list() {
        await this.parseRelsFile();
        return Object.values(this.rels);
    }
    async save() {
        if (!this.rels)
            return;
        const root = this.createRootNode();
        root.childNodes = Object.values(this.rels).map(rel => rel.toXml());
        const xmlContent = this.xmlParser.serialize(root);
        this.zip.setFile(this.relsFilePath, xmlContent);
    }
    getNextRelId() {
        let relId;
        do {
            this.nextRelId++;
            relId = 'rId' + this.nextRelId;
        } while (this.rels[relId]);
        return relId;
    }
    async parseRelsFile() {
        if (this.rels)
            return;
        let root;
        const relsFile = this.zip.getFile(this.relsFilePath);
        if (relsFile) {
            const xml = await relsFile.getContentText();
            root = this.xmlParser.parse(xml);
        }
        else {
            root = this.createRootNode();
        }
        this.rels = {};
        this.relTargets = {};
        for (const relNode of root.childNodes) {
            const attributes = relNode.attributes;
            if (!attributes)
                continue;
            const idAttr = attributes['Id'];
            if (!idAttr)
                continue;
            const rel = Relationship.fromXml(relNode);
            this.rels[idAttr] = rel;
            const typeAttr = attributes['Type'];
            const targetAttr = attributes['Target'];
            if (typeAttr && targetAttr) {
                const relTargetKey = this.getRelTargetKey(typeAttr, targetAttr);
                this.relTargets[relTargetKey] = idAttr;
            }
        }
    }
    getRelTargetKey(type, target) {
        return `${type} - ${target}`;
    }
    createRootNode() {
        const root = XmlNode.createGeneralNode('Relationships');
        root.attributes = {
            'xmlns': 'http://schemas.openxmlformats.org/package/2006/relationships'
        };
        root.childNodes = [];
        return root;
    }
}
//# sourceMappingURL=rels.js.map