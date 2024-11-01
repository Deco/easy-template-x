import { Tag } from '../../../compilation/index.js';
import { XmlNode } from '../../../xml/index.js';
import { PluginUtilities } from '../../templatePlugin.js';
import { ILoopStrategy, SplitBeforeResult } from './iLoopStrategy.js';
export declare class LoopListStrategy implements ILoopStrategy {
    private utilities;
    setUtilities(utilities: PluginUtilities): void;
    isApplicable(openTag: Tag, closeTag: Tag): boolean;
    splitBefore(openTag: Tag, closeTag: Tag): SplitBeforeResult;
    mergeBack(paragraphGroups: XmlNode[][], firstParagraph: XmlNode, lastParagraphs: XmlNode): void;
}
