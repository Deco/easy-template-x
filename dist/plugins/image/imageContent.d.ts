import { MimeType } from '../../mimeType.js';
import { Binary } from '../../utils/index.js';
import { PluginContent } from '../pluginContent.js';
export type ImageFormat = MimeType.Jpeg | MimeType.Png | MimeType.Gif | MimeType.Bmp | MimeType.Svg;
export interface ImageContent extends PluginContent {
    _type: 'image';
    source: Binary;
    format: ImageFormat;
    width: number;
    height: number;
    altText?: string;
    transparencyPercent?: number;
}
