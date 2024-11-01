export class Path {
    static getFilename(path) {
        const lastSlashIndex = path.lastIndexOf('/');
        return path.substr(lastSlashIndex + 1);
    }
    static getDirectory(path) {
        const lastSlashIndex = path.lastIndexOf('/');
        return path.substring(0, lastSlashIndex);
    }
    static combine(...parts) {
        return parts.filter(part => part?.trim()).join('/');
    }
}
//# sourceMappingURL=path.js.map