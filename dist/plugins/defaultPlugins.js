import { ImagePlugin } from './image/index.js';
import { LinkPlugin } from './link/index.js';
import { LoopPlugin } from './loop/index.js';
import { RawXmlPlugin } from './rawXml/index.js';
import { TextPlugin } from './text/index.js';
export function createDefaultPlugins() {
    return [
        new LoopPlugin(),
        new RawXmlPlugin(),
        new ImagePlugin(),
        new LinkPlugin(),
        new TextPlugin()
    ];
}
//# sourceMappingURL=defaultPlugins.js.map