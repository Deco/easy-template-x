import { XmlParser } from '../xml/index.js';
import { Zip } from '../zip/index.js';
import { Relationship, RelTargetMode } from './relationship.js';
export declare class Rels {
    private readonly zip;
    private readonly xmlParser;
    private rels;
    private relTargets;
    private nextRelId;
    private readonly partDir;
    private readonly relsFilePath;
    constructor(partPath: string, zip: Zip, xmlParser: XmlParser);
    add(relTarget: string, relType: string, relTargetMode?: RelTargetMode): Promise<string>;
    list(): Promise<Relationship[]>;
    save(): Promise<void>;
    private getNextRelId;
    private parseRelsFile;
    private getRelTargetKey;
    private createRootNode;
}
