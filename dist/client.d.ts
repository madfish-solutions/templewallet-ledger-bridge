/// <reference types="node" />
/// <reference types="ledgerhq__hw-transport" />
import Transport from "@ledgerhq/hw-transport";
export declare class LedgerThanosBridgeTransport extends Transport {
    private iframe;
    static isSupported(): Promise<boolean>;
    static list(): Promise<never[]>;
    static listen(): {
        unsubscribe: () => void;
    };
    static open(bridgeUrl: string): Promise<LedgerThanosBridgeTransport>;
    scrambleKey?: Buffer;
    constructor(iframe: HTMLIFrameElement);
    get origin(): string;
    exchange(apdu: Buffer): Promise<Buffer>;
    setScrambleKey(scrambleKey: string): void;
    close(): Promise<void>;
}
//# sourceMappingURL=client.d.ts.map