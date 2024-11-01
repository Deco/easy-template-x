export class UnsupportedFileTypeError extends Error {
    fileType;
    constructor(fileType) {
        super(`Filetype "${fileType}" is not supported.`);
        this.fileType = fileType;
    }
}
//# sourceMappingURL=unsupportedFileTypeError.js.map