import { XmlTextNode } from "../xml/index.js";
export interface DelimiterMark {
    xmlTextNode: XmlTextNode;
    index: number;
    isOpen: boolean;
}
