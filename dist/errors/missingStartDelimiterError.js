export class MissingStartDelimiterError extends Error {
    closeDelimiterText;
    constructor(closeDelimiterText) {
        super(`Open delimiter is missing from '${closeDelimiterText}'.`);
        this.closeDelimiterText = closeDelimiterText;
    }
}
//# sourceMappingURL=missingStartDelimiterError.js.map