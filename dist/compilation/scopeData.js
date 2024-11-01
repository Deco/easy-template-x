import getProp from 'lodash.get';
import { isNumber, last } from '../utils/index.js';
export class ScopeData {
    static defaultResolver(args) {
        let result;
        const lastKey = last(args.strPath);
        const curPath = args.strPath.slice();
        while (result === undefined && curPath.length) {
            curPath.pop();
            result = getProp(args.data, curPath.concat(lastKey));
        }
        return result;
    }
    scopeDataResolver;
    allData;
    path = [];
    strPath = [];
    constructor(data) {
        this.allData = data;
    }
    pathPush(pathPart) {
        this.path.push(pathPart);
        const strItem = isNumber(pathPart) ? pathPart.toString() : pathPart.name;
        this.strPath.push(strItem);
    }
    pathPop() {
        this.strPath.pop();
        return this.path.pop();
    }
    pathString() {
        return this.strPath.join(".");
    }
    getScopeData() {
        const args = {
            path: this.path,
            strPath: this.strPath,
            data: this.allData
        };
        if (this.scopeDataResolver) {
            return this.scopeDataResolver(args);
        }
        return ScopeData.defaultResolver(args);
    }
}
//# sourceMappingURL=scopeData.js.map