import { MissingArgumentError } from '../errors/index.js';
import { last } from '../utils/index.js';
export var XmlNodeType;
(function (XmlNodeType) {
    XmlNodeType["Text"] = "Text";
    XmlNodeType["General"] = "General";
    XmlNodeType["Comment"] = "Comment";
})(XmlNodeType || (XmlNodeType = {}));
export const TEXT_NODE_NAME = '#text';
export const COMMENT_NODE_NAME = '#comment';
export const XmlNode = {
    createTextNode(text) {
        return {
            nodeType: XmlNodeType.Text,
            nodeName: TEXT_NODE_NAME,
            textContent: text
        };
    },
    createGeneralNode(name) {
        return {
            nodeType: XmlNodeType.General,
            nodeName: name
        };
    },
    createCommentNode(text) {
        return {
            nodeType: XmlNodeType.Comment,
            nodeName: COMMENT_NODE_NAME,
            commentContent: text
        };
    },
    encodeValue(str) {
        if (str === null || str === undefined)
            throw new MissingArgumentError(nameof(str));
        if (typeof str !== 'string')
            throw new TypeError(`Expected a string, got '${str.constructor.name}'.`);
        return str.replace(/[<>&'"]/g, c => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
            return '';
        });
    },
    serialize(node) {
        if (this.isTextNode(node))
            return this.encodeValue(node.textContent || '');
        if (this.isCommentNode(node)) {
            return `<!-- ${this.encodeValue(node.commentContent || '')} -->`;
        }
        let attributes = '';
        if (node.attributes) {
            const attributeNames = Object.keys(node.attributes);
            if (attributeNames.length) {
                attributes = ' ' + attributeNames
                    .map(name => `${name}="${this.encodeValue(node.attributes[name] || '')}"`)
                    .join(' ');
            }
        }
        const hasChildren = (node.childNodes || []).length > 0;
        const suffix = hasChildren ? '' : '/';
        const openTag = `<${node.nodeName}${attributes}${suffix}>`;
        let xml;
        if (hasChildren) {
            const childrenXml = node.childNodes
                .map(child => this.serialize(child))
                .join('');
            const closeTag = `</${node.nodeName}>`;
            xml = openTag + childrenXml + closeTag;
        }
        else {
            xml = openTag;
        }
        return xml;
    },
    fromDomNode(domNode) {
        let xmlNode;
        switch (domNode.nodeType) {
            case domNode.TEXT_NODE: {
                xmlNode = this.createTextNode(domNode.textContent);
                break;
            }
            case domNode.COMMENT_NODE: {
                xmlNode = this.createCommentNode(domNode.textContent?.trim());
                break;
            }
            case domNode.ELEMENT_NODE: {
                const generalNode = xmlNode = this.createGeneralNode(domNode.nodeName);
                const attributes = domNode.attributes;
                if (attributes) {
                    generalNode.attributes = {};
                    for (let i = 0; i < attributes.length; i++) {
                        const curAttribute = attributes.item(i);
                        generalNode.attributes[curAttribute.name] = curAttribute.value;
                    }
                }
                break;
            }
            default: {
                xmlNode = this.createGeneralNode(domNode.nodeName);
                break;
            }
        }
        if (domNode.childNodes) {
            xmlNode.childNodes = [];
            let prevChild;
            for (let i = 0; i < domNode.childNodes.length; i++) {
                const domChild = domNode.childNodes.item(i);
                const curChild = this.fromDomNode(domChild);
                xmlNode.childNodes.push(curChild);
                curChild.parentNode = xmlNode;
                if (prevChild) {
                    prevChild.nextSibling = curChild;
                }
                prevChild = curChild;
            }
        }
        return xmlNode;
    },
    isTextNode(node) {
        if (node.nodeType === XmlNodeType.Text || node.nodeName === TEXT_NODE_NAME) {
            if (!(node.nodeType === XmlNodeType.Text && node.nodeName === TEXT_NODE_NAME)) {
                throw new Error(`Invalid text node. Type: '${node.nodeType}', Name: '${node.nodeName}'.`);
            }
            return true;
        }
        return false;
    },
    isCommentNode(node) {
        if (node.nodeType === XmlNodeType.Comment || node.nodeName === COMMENT_NODE_NAME) {
            if (!(node.nodeType === XmlNodeType.Comment && node.nodeName === COMMENT_NODE_NAME)) {
                throw new Error(`Invalid comment node. Type: '${node.nodeType}', Name: '${node.nodeName}'.`);
            }
            return true;
        }
        return false;
    },
    cloneNode(node, deep) {
        if (!node)
            throw new MissingArgumentError(nameof(node));
        if (!deep) {
            const clone = Object.assign({}, node);
            clone.parentNode = null;
            clone.childNodes = (node.childNodes ? [] : null);
            clone.nextSibling = null;
            return clone;
        }
        else {
            const clone = cloneNodeDeep(node);
            clone.parentNode = null;
            return clone;
        }
    },
    insertBefore(newNode, referenceNode) {
        if (!newNode)
            throw new MissingArgumentError(nameof(newNode));
        if (!referenceNode)
            throw new MissingArgumentError(nameof(referenceNode));
        if (!referenceNode.parentNode)
            throw new Error(`'${nameof(referenceNode)}' has no parent`);
        const childNodes = referenceNode.parentNode.childNodes;
        const beforeNodeIndex = childNodes.indexOf(referenceNode);
        XmlNode.insertChild(referenceNode.parentNode, newNode, beforeNodeIndex);
    },
    insertAfter(newNode, referenceNode) {
        if (!newNode)
            throw new MissingArgumentError(nameof(newNode));
        if (!referenceNode)
            throw new MissingArgumentError(nameof(referenceNode));
        if (!referenceNode.parentNode)
            throw new Error(`'${nameof(referenceNode)}' has no parent`);
        const childNodes = referenceNode.parentNode.childNodes;
        const referenceNodeIndex = childNodes.indexOf(referenceNode);
        XmlNode.insertChild(referenceNode.parentNode, newNode, referenceNodeIndex + 1);
    },
    insertChild(parent, child, childIndex) {
        if (!parent)
            throw new MissingArgumentError(nameof(parent));
        if (XmlNode.isTextNode(parent))
            throw new Error('Appending children to text nodes is forbidden');
        if (!child)
            throw new MissingArgumentError(nameof(child));
        if (!parent.childNodes)
            parent.childNodes = [];
        if (childIndex === parent.childNodes.length) {
            XmlNode.appendChild(parent, child);
            return;
        }
        if (childIndex > parent.childNodes.length)
            throw new RangeError(`Child index ${childIndex} is out of range. Parent has only ${parent.childNodes.length} child nodes.`);
        child.parentNode = parent;
        const childAfter = parent.childNodes[childIndex];
        child.nextSibling = childAfter;
        if (childIndex > 0) {
            const childBefore = parent.childNodes[childIndex - 1];
            childBefore.nextSibling = child;
        }
        parent.childNodes.splice(childIndex, 0, child);
    },
    appendChild(parent, child) {
        if (!parent)
            throw new MissingArgumentError(nameof(parent));
        if (XmlNode.isTextNode(parent))
            throw new Error('Appending children to text nodes is forbidden');
        if (!child)
            throw new MissingArgumentError(nameof(child));
        if (!parent.childNodes)
            parent.childNodes = [];
        if (parent.childNodes.length) {
            const currentLastChild = parent.childNodes[parent.childNodes.length - 1];
            currentLastChild.nextSibling = child;
        }
        child.nextSibling = null;
        child.parentNode = parent;
        parent.childNodes.push(child);
    },
    remove(node) {
        if (!node)
            throw new MissingArgumentError(nameof(node));
        if (!node.parentNode)
            throw new Error('Node has no parent');
        removeChild(node.parentNode, node);
    },
    removeChild,
    lastTextChild(node) {
        if (XmlNode.isTextNode(node)) {
            return node;
        }
        if (node.childNodes) {
            const allTextNodes = node.childNodes.filter(child => XmlNode.isTextNode(child));
            if (allTextNodes.length) {
                const lastTextNode = last(allTextNodes);
                if (!lastTextNode.textContent)
                    lastTextNode.textContent = '';
                return lastTextNode;
            }
        }
        const newTextNode = {
            nodeType: XmlNodeType.Text,
            nodeName: TEXT_NODE_NAME,
            textContent: ''
        };
        XmlNode.appendChild(node, newTextNode);
        return newTextNode;
    },
    removeSiblings(from, to) {
        if (from === to)
            return [];
        const removed = [];
        let lastRemoved;
        from = from.nextSibling;
        while (from !== to) {
            const removeMe = from;
            from = from.nextSibling;
            XmlNode.remove(removeMe);
            removed.push(removeMe);
            if (lastRemoved)
                lastRemoved.nextSibling = removeMe;
            lastRemoved = removeMe;
        }
        return removed;
    },
    splitByChild(parent, child, removeChild) {
        if (child.parentNode != parent)
            throw new Error(`Node '${nameof(child)}' is not a direct child of '${nameof(parent)}'.`);
        const left = XmlNode.cloneNode(parent, false);
        if (parent.parentNode) {
            XmlNode.insertBefore(left, parent);
        }
        const right = parent;
        let curChild = right.childNodes[0];
        while (curChild != child) {
            XmlNode.remove(curChild);
            XmlNode.appendChild(left, curChild);
            curChild = right.childNodes[0];
        }
        if (removeChild) {
            XmlNode.removeChild(right, 0);
        }
        return [left, right];
    },
    findParent(node, predicate) {
        while (node) {
            if (predicate(node))
                return node;
            node = node.parentNode;
        }
        return null;
    },
    findParentByName(node, nodeName) {
        return XmlNode.findParent(node, n => n.nodeName === nodeName);
    },
    findChildByName(node, childName) {
        if (!node)
            return null;
        return (node.childNodes || []).find(child => child.nodeName === childName);
    },
    siblingsInRange(firstNode, lastNode) {
        if (!firstNode)
            throw new MissingArgumentError(nameof(firstNode));
        if (!lastNode)
            throw new MissingArgumentError(nameof(lastNode));
        const range = [];
        let curNode = firstNode;
        while (curNode && curNode !== lastNode) {
            range.push(curNode);
            curNode = curNode.nextSibling;
        }
        if (!curNode)
            throw new Error('Nodes are not siblings.');
        range.push(lastNode);
        return range;
    },
    removeEmptyTextNodes(node) {
        recursiveRemoveEmptyTextNodes(node);
    },
};
function removeChild(parent, childOrIndex) {
    if (!parent)
        throw new MissingArgumentError(nameof(parent));
    if (childOrIndex === null || childOrIndex === undefined)
        throw new MissingArgumentError(nameof(childOrIndex));
    if (!parent.childNodes || !parent.childNodes.length)
        throw new Error('Parent node has node children');
    let childIndex;
    if (typeof childOrIndex === 'number') {
        childIndex = childOrIndex;
    }
    else {
        childIndex = parent.childNodes.indexOf(childOrIndex);
        if (childIndex === -1)
            throw new Error('Specified child node is not a child of the specified parent');
    }
    if (childIndex >= parent.childNodes.length)
        throw new RangeError(`Child index ${childIndex} is out of range. Parent has only ${parent.childNodes.length} child nodes.`);
    const child = parent.childNodes[childIndex];
    if (childIndex > 0) {
        const beforeChild = parent.childNodes[childIndex - 1];
        beforeChild.nextSibling = child.nextSibling;
    }
    child.parentNode = null;
    child.nextSibling = null;
    return parent.childNodes.splice(childIndex, 1)[0];
}
function cloneNodeDeep(original) {
    const clone = {};
    clone.nodeType = original.nodeType;
    clone.nodeName = original.nodeName;
    if (XmlNode.isTextNode(original)) {
        clone.textContent = original.textContent;
    }
    else {
        const attributes = original.attributes;
        if (attributes) {
            clone.attributes = Object.assign({}, attributes);
        }
    }
    if (original.childNodes) {
        clone.childNodes = [];
        let prevChildClone;
        for (const child of original.childNodes) {
            const childClone = cloneNodeDeep(child);
            clone.childNodes.push(childClone);
            childClone.parentNode = clone;
            if (prevChildClone) {
                prevChildClone.nextSibling = childClone;
            }
            prevChildClone = childClone;
        }
    }
    return clone;
}
function recursiveRemoveEmptyTextNodes(node) {
    if (!node.childNodes)
        return node;
    const oldChildren = node.childNodes;
    node.childNodes = [];
    for (const child of oldChildren) {
        if (XmlNode.isTextNode(child)) {
            if (child.textContent && child.textContent.match(/\S/)) {
                node.childNodes.push(child);
            }
            continue;
        }
        const strippedChild = recursiveRemoveEmptyTextNodes(child);
        node.childNodes.push(strippedChild);
    }
    return node;
}
//# sourceMappingURL=xmlNode.js.map