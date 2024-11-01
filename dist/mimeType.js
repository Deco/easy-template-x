import { UnsupportedFileTypeError } from './errors/index.js';
export var MimeType;
(function (MimeType) {
    MimeType["Png"] = "image/png";
    MimeType["Jpeg"] = "image/jpeg";
    MimeType["Gif"] = "image/gif";
    MimeType["Bmp"] = "image/bmp";
    MimeType["Svg"] = "image/svg+xml";
})(MimeType || (MimeType = {}));
export class MimeTypeHelper {
    static getDefaultExtension(mime) {
        switch (mime) {
            case MimeType.Png:
                return 'png';
            case MimeType.Jpeg:
                return 'jpg';
            case MimeType.Gif:
                return 'gif';
            case MimeType.Bmp:
                return 'bmp';
            case MimeType.Svg:
                return 'svg';
            default:
                throw new UnsupportedFileTypeError(mime);
        }
    }
    static getOfficeRelType(mime) {
        switch (mime) {
            case MimeType.Png:
            case MimeType.Jpeg:
            case MimeType.Gif:
            case MimeType.Bmp:
            case MimeType.Svg:
                return "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image";
            default:
                throw new UnsupportedFileTypeError(mime);
        }
    }
}
//# sourceMappingURL=mimeType.js.map