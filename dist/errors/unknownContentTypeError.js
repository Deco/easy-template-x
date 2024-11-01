export class UnknownContentTypeError extends Error {
    tagRawText;
    contentType;
    path;
    constructor(contentType, tagRawText, path) {
        super(`Content type '${contentType}' does not have a registered plugin to handle it.`);
        this.contentType = contentType;
        this.tagRawText = tagRawText;
        this.path = path;
    }
}
//# sourceMappingURL=unknownContentTypeError.js.map