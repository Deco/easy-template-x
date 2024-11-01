import { Tag } from '../../../compilation/index.js';
import { XmlNode } from '../../../xml/index.js';
import { PluginUtilities } from '../../templatePlugin.js';
import { ILoopStrategy, SplitBeforeResult } from './iLoopStrategy.js';
export declare class LoopTableStrategy implements ILoopStrategy {
    private utilities;
    setUtilities(utilities: PluginUtilities): void;
    isApplicable(openTag: Tag, closeTag: Tag): boolean;
    splitBefore(openTag: Tag, closeTag: Tag): SplitBeforeResult;
    mergeBack(rowGroups: XmlNode[][], firstRow: XmlNode, lastRow: XmlNode): void;
}
