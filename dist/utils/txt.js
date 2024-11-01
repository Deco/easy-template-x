const nonStandardDoubleQuotes = [
    '“',
    '”',
    '«',
    '»',
    '„',
    '“',
    '‟',
    '”',
    '❝',
    '❞',
    '〝',
    '〞',
    '〟',
    '＂',
];
const standardDoubleQuotes = '"';
const nonStandardDoubleQuotesRegex = new RegExp(nonStandardDoubleQuotes.join('|'), 'g');
export function stringValue(val) {
    if (val === null || val === undefined) {
        return '';
    }
    return val.toString();
}
export function normalizeDoubleQuotes(text) {
    return text.replace(nonStandardDoubleQuotesRegex, standardDoubleQuotes);
}
//# sourceMappingURL=txt.js.map