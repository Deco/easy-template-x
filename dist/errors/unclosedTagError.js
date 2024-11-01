export class UnclosedTagError extends Error {
    tagName;
    constructor(tagName) {
        super(`Tag '${tagName}' is never closed.`);
        this.tagName = tagName;
    }
}
//# sourceMappingURL=unclosedTagError.js.map