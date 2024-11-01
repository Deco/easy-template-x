import { IMap } from '../types.js';
import { XmlTextNode } from '../xml/index.js';
export declare enum TagDisposition {
    Open = "Open",
    Close = "Close",
    SelfClosed = "SelfClosed"
}
export interface Tag {
    name: string;
    options?: IMap<any>;
    rawText: string;
    disposition: TagDisposition;
    xmlTextNode: XmlTextNode;
}
