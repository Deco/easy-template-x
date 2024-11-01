import { ImagePlugin } from './image/index.js';
import { LinkPlugin } from './link/index.js';
import { LoopPlugin } from './loop/index.js';
import { RawXmlPlugin } from './rawXml/index.js';
import { TemplatePlugin } from './templatePlugin.js';
import { TextPlugin } from './text/index.js';

export function createDefaultPlugins(): TemplatePlugin[] {
    return [
        new LoopPlugin(),
        new RawXmlPlugin(),
        new ImagePlugin(),
        new LinkPlugin(),
        new TextPlugin()
    ];
}
