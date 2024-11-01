import JSZip from 'jszip';
import { JsZipHelper } from './jsZipHelper.js';
import { ZipObject } from './zipObject.js';
export class Zip {
    zip;
    static async load(file) {
        const zip = await JSZip.loadAsync(file);
        return new Zip(zip);
    }
    constructor(zip) {
        this.zip = zip;
    }
    getFile(path) {
        const internalZipObject = this.zip.files[path];
        if (!internalZipObject)
            return null;
        return new ZipObject(internalZipObject);
    }
    setFile(path, content) {
        this.zip.file(path, content);
    }
    isFileExist(path) {
        return !!this.zip.files[path];
    }
    listFiles() {
        return Object.keys(this.zip.files);
    }
    async export(outputType) {
        const zipOutputType = JsZipHelper.toJsZipOutputType(outputType);
        const output = await this.zip.generateAsync({
            type: zipOutputType,
            compression: "DEFLATE",
            compressionOptions: {
                level: 6
            }
        });
        return output;
    }
}
//# sourceMappingURL=zip.js.map