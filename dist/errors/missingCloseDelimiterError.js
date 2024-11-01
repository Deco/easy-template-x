export class MissingCloseDelimiterError extends Error {
    openDelimiterText;
    constructor(openDelimiterText) {
        super(`Close delimiter is missing from '${openDelimiterText}'.`);
        this.openDelimiterText = openDelimiterText;
    }
}
//# sourceMappingURL=missingCloseDelimiterError.js.map