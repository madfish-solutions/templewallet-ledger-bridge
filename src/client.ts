import Transport from "@ledgerhq/hw-transport";
import {
  BridgeExchangeRequest,
  BridgeMessageType,
  BridgeResponse,
} from "./types";

export class LedgerThanosBridgeTransport extends Transport {
  static async isSupported() {
    return true;
  }

  // this transport is not discoverable
  static async list() {
    return [];
  }

  // this transport is not discoverable
  static listen() {
    return {
      unsubscribe: () => {},
    };
  }

  static async open(bridgeUrl: string) {
    const iframe = document.createElement("iframe");
    iframe.src = bridgeUrl;
    document.head.appendChild(iframe);
    await new Promise((res) => {
      const handleLoad = () => {
        res();
        iframe.removeEventListener("load", handleLoad);
      };
      iframe.addEventListener("load", handleLoad);
    });
    return new LedgerThanosBridgeTransport(iframe);
  }

  scrambleKey?: Buffer;

  constructor(private iframe: HTMLIFrameElement) {
    super();
  }

  get origin() {
    const tmp = this.iframe.src.split("/");
    tmp.splice(-1, 1);
    return tmp.join("/");
  }

  exchange(apdu: Buffer) {
    return new Promise<Buffer>(async (resolve, reject) => {
      const exchangeTimeout: number = (this as any).exchangeTimeout;
      const msg: BridgeExchangeRequest = {
        type: BridgeMessageType.ExchangeRequest,
        apdu: apdu.toString("hex"),
        scrambleKey: this.scrambleKey?.toString("ascii"),
        exchangeTimeout,
      };

      this.iframe.contentWindow?.postMessage(msg, "*");

      const handleMessage = (evt: MessageEvent) => {
        if (evt.origin !== this.origin) {
          return;
        }

        const res: BridgeResponse = evt.data;
        switch (res?.type) {
          case BridgeMessageType.ExchangeResponse:
            resolve(Buffer.from(res.result, "hex"));
            break;

          case BridgeMessageType.ErrorResponse:
            reject(res.message);
            break;
        }

        window.removeEventListener("message", handleMessage);
      };

      window.addEventListener("message", handleMessage);
    });
  }

  setScrambleKey(scrambleKey: string) {
    this.scrambleKey = Buffer.from(scrambleKey, "ascii");
  }

  async close() {
    document.head.removeChild(this.iframe);
  }
}
