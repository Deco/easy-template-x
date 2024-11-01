import { PluginContent } from '../pluginContent.js';
export interface RawXmlContent extends PluginContent {
    _type: 'rawXml';
    xml: string;
    replaceParagraph?: boolean;
}
