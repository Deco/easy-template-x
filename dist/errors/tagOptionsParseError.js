export class TagOptionsParseError extends Error {
    tagRawText;
    parseError;
    constructor(tagRawText, parseError) {
        super(`Failed to parse tag options of '${tagRawText}': ${parseError.message}.`);
        this.tagRawText = tagRawText;
        this.parseError = parseError;
    }
}
//# sourceMappingURL=tagOptionsParseError.js.map