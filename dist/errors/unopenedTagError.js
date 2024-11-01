export class UnopenedTagError extends Error {
    tagName;
    constructor(tagName) {
        super(`Tag '${tagName}' is closed but was never opened.`);
        this.tagName = tagName;
    }
}
//# sourceMappingURL=unopenedTagError.js.map