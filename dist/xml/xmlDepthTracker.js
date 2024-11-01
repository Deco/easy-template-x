import { MaxXmlDepthError } from '../errors/index.js';
export class XmlDepthTracker {
    maxDepth;
    depth = 0;
    constructor(maxDepth) {
        this.maxDepth = maxDepth;
    }
    increment() {
        this.depth++;
        if (this.depth > this.maxDepth) {
            throw new MaxXmlDepthError(this.maxDepth);
        }
    }
    decrement() {
        this.depth--;
    }
}
//# sourceMappingURL=xmlDepthTracker.js.map