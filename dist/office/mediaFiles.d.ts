import { MimeType } from '../mimeType.js';
import { Binary } from '../utils/index.js';
import { Zip } from '../zip/index.js';
export declare class MediaFiles {
    private readonly zip;
    private static readonly mediaDir;
    private hashes;
    private readonly files;
    private nextFileId;
    constructor(zip: Zip);
    add(mediaFile: Binary, mime: MimeType): Promise<string>;
    count(): Promise<number>;
    private hashMediaFiles;
}
