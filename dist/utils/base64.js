export class Base64 {
    static encode(str) {
        if (typeof btoa !== 'undefined')
            return btoa(str);
        return new Buffer(str, 'binary').toString('base64');
    }
}
//# sourceMappingURL=base64.js.map