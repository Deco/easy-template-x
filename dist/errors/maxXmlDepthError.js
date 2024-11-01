export class MaxXmlDepthError extends Error {
    maxDepth;
    constructor(maxDepth) {
        super(`XML maximum depth reached (max depth: ${maxDepth}).`);
        this.maxDepth = maxDepth;
    }
}
//# sourceMappingURL=maxXmlDepthError.js.map