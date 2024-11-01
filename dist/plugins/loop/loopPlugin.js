import { last } from '../../utils/index.js';
import { XmlNode } from '../../xml/index.js';
import { TemplatePlugin } from '../templatePlugin.js';
import { LoopListStrategy, LoopParagraphStrategy, LoopTableStrategy } from './strategy/index.js';
export const LOOP_CONTENT_TYPE = 'loop';
export class LoopPlugin extends TemplatePlugin {
    contentType = LOOP_CONTENT_TYPE;
    loopStrategies = [
        new LoopTableStrategy(),
        new LoopListStrategy(),
        new LoopParagraphStrategy()
    ];
    setUtilities(utilities) {
        this.utilities = utilities;
        this.loopStrategies.forEach(strategy => strategy.setUtilities(utilities));
    }
    async containerTagReplacements(tags, data, context) {
        let value = data.getScopeData();
        const isCondition = !Array.isArray(value);
        if (isCondition) {
            if (value) {
                value = [{}];
            }
            else {
                value = [];
            }
        }
        const openTag = tags[0];
        const closeTag = last(tags);
        const loopStrategy = this.loopStrategies.find(strategy => strategy.isApplicable(openTag, closeTag));
        if (!loopStrategy)
            throw new Error(`No loop strategy found for tag '${openTag.rawText}'.`);
        const { firstNode, nodesToRepeat, lastNode } = loopStrategy.splitBefore(openTag, closeTag);
        const repeatedNodes = this.repeat(nodesToRepeat, value.length);
        const compiledNodes = await this.compile(isCondition, repeatedNodes, data, context);
        loopStrategy.mergeBack(compiledNodes, firstNode, lastNode);
    }
    repeat(nodes, times) {
        if (!nodes.length || !times)
            return [];
        const allResults = [];
        for (let i = 0; i < times; i++) {
            const curResult = nodes.map(node => XmlNode.cloneNode(node, true));
            allResults.push(curResult);
        }
        return allResults;
    }
    async compile(isCondition, nodeGroups, data, context) {
        const compiledNodeGroups = [];
        for (let i = 0; i < nodeGroups.length; i++) {
            const curNodes = nodeGroups[i];
            const dummyRootNode = XmlNode.createGeneralNode('dummyRootNode');
            curNodes.forEach(node => XmlNode.appendChild(dummyRootNode, node));
            const conditionTag = this.updatePathBefore(isCondition, data, i);
            await this.utilities.compiler.compile(dummyRootNode, data, context);
            this.updatePathAfter(isCondition, data, conditionTag);
            const curResult = [];
            while (dummyRootNode.childNodes && dummyRootNode.childNodes.length) {
                const child = XmlNode.removeChild(dummyRootNode, 0);
                curResult.push(child);
            }
            compiledNodeGroups.push(curResult);
        }
        return compiledNodeGroups;
    }
    updatePathBefore(isCondition, data, groupIndex) {
        if (isCondition) {
            if (groupIndex > 0) {
                throw new Error(`Internal error: Unexpected group index ${groupIndex} for boolean condition at path "${data.pathString()}".`);
            }
            return data.pathPop();
        }
        data.pathPush(groupIndex);
        return null;
    }
    updatePathAfter(isCondition, data, conditionTag) {
        if (isCondition) {
            data.pathPush(conditionTag);
        }
        else {
            data.pathPop();
        }
    }
}
//# sourceMappingURL=loopPlugin.js.map