import { MissingArgumentError } from '../errors/index.js';
import { Binary } from '../utils/index.js';
export class JsZipHelper {
    static toJsZipOutputType(binaryOrType) {
        if (!binaryOrType)
            throw new MissingArgumentError(nameof(binaryOrType));
        let binaryType;
        if (typeof binaryOrType === 'function') {
            binaryType = binaryOrType;
        }
        else {
            binaryType = binaryOrType.constructor;
        }
        if (Binary.isBlobConstructor(binaryType))
            return 'blob';
        if (Binary.isArrayBufferConstructor(binaryType))
            return 'arraybuffer';
        if (Binary.isBufferConstructor(binaryType))
            return 'nodebuffer';
        throw new Error(`Binary type '${binaryType.name}' is not supported.`);
    }
}
//# sourceMappingURL=jsZipHelper.js.map