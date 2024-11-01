import { JsZipHelper } from './jsZipHelper.js';
export class ZipObject {
    zipObject;
    get name() {
        return this.zipObject.name;
    }
    set name(value) {
        this.zipObject.name = value;
    }
    get isDirectory() {
        return this.zipObject.dir;
    }
    constructor(zipObject) {
        this.zipObject = zipObject;
    }
    getContentText() {
        return this.zipObject.async('text');
    }
    getContentBase64() {
        return this.zipObject.async('binarystring');
    }
    getContentBinary(outputType) {
        const zipOutputType = JsZipHelper.toJsZipOutputType(outputType);
        return this.zipObject.async(zipOutputType);
    }
}
//# sourceMappingURL=zipObject.js.map