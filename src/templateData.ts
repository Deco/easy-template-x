import { PluginContent } from './plugins/index.js';

export type PrimitiveTemplateContent = string | number | boolean;

export type TemplateContent = PrimitiveTemplateContent | PluginContent;

export interface TemplateData {
    [tagName: string]: TemplateContent | TemplateData | TemplateData[];
}
