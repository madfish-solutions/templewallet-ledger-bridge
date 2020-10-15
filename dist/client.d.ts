/// <reference types="node" />
/// <reference types="ledgerhq__hw-transport" />
import Transport from "@ledgerhq/hw-transport";
export declare class LedgerThanosBridgeTransport extends Transport {
    private iframe;
    private bridgeUrl;
    static isSupported(): Promise<boolean>;
    static list(): Promise<never[]>;
    static listen(): {
        unsubscribe: () => void;
    };
    static open(bridgeUrl: string): Promise<LedgerThanosBridgeTransport>;
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