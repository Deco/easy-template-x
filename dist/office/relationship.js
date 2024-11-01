import { XmlNode } from '../xml/index.js';
export class Relationship {
    static fromXml(xml) {
        return new Relationship({
            id: xml.attributes?.['Id'],
            type: xml.attributes?.['Type'],
            target: xml.attributes?.['Target'],
            targetMode: xml.attributes?.['TargetMode'],
        });
    }
    id;
    type;
    target;
    targetMode;
    constructor(initial) {
        Object.assign(this, initial);
    }
    toXml() {
        const node = XmlNode.createGeneralNode('Relationship');
        node.attributes = {};
        for (const propKey of Object.keys(this)) {
            const value = this[propKey];
            if (value && typeof value === 'string') {
                const attrName = propKey[0].toUpperCase() + propKey.substr(1);
                node.attributes[attrName] = value;
            }
        }
        return node;
    }
}
//# sourceMappingURL=relationship.js.map