export class Regex {
    static escape(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}
//# sourceMappingURL=regex.js.map