/// <reference types="node" />
/// <reference types="ledgerhq__hw-transport" />
import Transport from "@ledgerhq/hw-transport";
export declare class TransportThanosBridge extends Transport {
    private iframe;
    private bridgeUrl;
    static open(bridgeUrl: string): Promise<TransportThanosBridge>;
    scrambleKey?: Buffer;
    unwrap?: boolean;
    constructor(iframe: HTMLIFrameElement, bridgeUrl: string);
    exchange(apdu: Buffer): Promise<Buffer>;
    setScrambleKey(scrambleKey: string): void;
    setUnwrap(unwrap: boolean): void;
    close(): Promise<void>;
    private getOrigin;
}
//# sourceMappingURL=client.d.ts.map