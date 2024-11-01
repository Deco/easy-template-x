import { PluginContent } from '../pluginContent.js';
export interface LinkContent extends PluginContent {
    _type: 'link';
    text?: string;
    target: string;
    tooltip?: string;
}
