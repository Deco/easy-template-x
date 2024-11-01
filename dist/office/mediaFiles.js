import { MimeTypeHelper } from '../mimeType.js';
import { Binary, Path, sha1 } from '../utils/index.js';
export class MediaFiles {
    zip;
    static mediaDir = 'word/media';
    hashes;
    files = new Map();
    nextFileId = 0;
    constructor(zip) {
        this.zip = zip;
    }
    async add(mediaFile, mime) {
        if (this.files.has(mediaFile))
            return this.files.get(mediaFile);
        await this.hashMediaFiles();
        const base64 = await Binary.toBase64(mediaFile);
        const hash = sha1(base64);
        let path = Object.keys(this.hashes).find(p => this.hashes[p] === hash);
        if (path)
            return path;
        const extension = MimeTypeHelper.getDefaultExtension(mime);
        do {
            this.nextFileId++;
            path = `${MediaFiles.mediaDir}/media${this.nextFileId}.${extension}`;
        } while (this.hashes[path]);
        await this.zip.setFile(path, mediaFile);
        this.hashes[path] = hash;
        this.files.set(mediaFile, path);
        return path;
    }
    async count() {
        await this.hashMediaFiles();
        return Object.keys(this.hashes).length;
    }
    async hashMediaFiles() {
        if (this.hashes)
            return;
        this.hashes = {};
        for (const path of this.zip.listFiles()) {
            if (!path.startsWith(MediaFiles.mediaDir))
                continue;
            const filename = Path.getFilename(path);
            if (!filename)
                continue;
            const fileData = await this.zip.getFile(path).getContentBase64();
            const fileHash = sha1(fileData);
            this.hashes[filename] = fileHash;
        }
    }
}
//# sourceMappingURL=mediaFiles.js.map