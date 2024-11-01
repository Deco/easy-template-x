import { Base64 } from './base64.js';
import { inheritsFrom } from './types.js';
export const Binary = {
    isBlob(binary) {
        return this.isBlobConstructor(binary.constructor);
    },
    isArrayBuffer(binary) {
        return this.isArrayBufferConstructor(binary.constructor);
    },
    isBuffer(binary) {
        return this.isBufferConstructor(binary.constructor);
    },
    isBlobConstructor(binaryType) {
        return (typeof Blob !== 'undefined' && inheritsFrom(binaryType, Blob));
    },
    isArrayBufferConstructor(binaryType) {
        return (typeof ArrayBuffer !== 'undefined' && inheritsFrom(binaryType, ArrayBuffer));
    },
    isBufferConstructor(binaryType) {
        return (typeof Buffer !== 'undefined' && inheritsFrom(binaryType, Buffer));
    },
    toBase64(binary) {
        if (this.isBlob(binary)) {
            return new Promise(resolve => {
                const fileReader = new FileReader();
                fileReader.onload = function () {
                    const base64 = Base64.encode(this.result);
                    resolve(base64);
                };
                fileReader.readAsBinaryString(binary);
            });
        }
        if (this.isBuffer(binary)) {
            return Promise.resolve(binary.toString('base64'));
        }
        if (this.isArrayBuffer(binary)) {
            const binaryStr = new Uint8Array(binary).reduce((str, byte) => str + String.fromCharCode(byte), '');
            const base64 = Base64.encode(binaryStr);
            return Promise.resolve(base64);
        }
        throw new Error(`Binary type '${binary.constructor.name}' is not supported.`);
    }
};
//# sourceMappingURL=binary.js.map