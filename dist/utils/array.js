export function pushMany(destArray, items) {
    Array.prototype.push.apply(destArray, items);
}
export function first(array) {
    if (!array.length)
        return undefined;
    return array[0];
}
export function last(array) {
    if (!array.length)
        return undefined;
    return array[array.length - 1];
}
export function toDictionary(array, keySelector, valueSelector) {
    if (!array.length)
        return {};
    const res = {};
    array.forEach((item, index) => {
        const key = keySelector(item, index);
        const value = (valueSelector ? valueSelector(item, index) : item);
        if (res[key])
            throw new Error(`Key '${key}' already exists in the dictionary.`);
        res[key] = value;
    });
    return res;
}
//# sourceMappingURL=array.js.map