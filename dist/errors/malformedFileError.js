export class MalformedFileError extends Error {
    expectedFileType;
    constructor(expectedFileType) {
        super(`Malformed file detected. Make sure the file is a valid ${expectedFileType} file.`);
        this.expectedFileType = expectedFileType;
    }
}
//# sourceMappingURL=malformedFileError.js.map