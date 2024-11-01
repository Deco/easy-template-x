export function inheritsFrom(derived, base) {
    return derived === base || derived.prototype instanceof base;
}
export function isPromiseLike(candidate) {
    return !!candidate && typeof candidate === 'object' && typeof candidate.then === 'function';
}
//# sourceMappingURL=types.js.map