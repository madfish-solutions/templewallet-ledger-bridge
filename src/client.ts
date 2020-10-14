import Transport from "@ledgerhq/hw-transport";
import {
  BridgeExchangeRequest,
  BridgeMessageType,
  BridgeResponse,
} from "./types";

export class TransportThanosBridge extends Transport {
  static async open(bridgeUrl: string) {
    const iframe = document.createElement("iframe");
    iframe.src = bridgeUrl;
    document.head.appendChild(iframe);
    return new TransportThanosBridge(iframe, bridgeUrl);
  }

  scrambleKey?: Buffer;
  unwrap?: boolean;

  constructor(private iframe: HTMLIFrameElement, private bridgeUrl: string) {
    super();
  }

  exchange(apdu: Buffer) {
    return new Promise<Buffer>((resolve, reject) => {
      const msg: BridgeExchangeRequest = {
        type: BridgeMessageType.ExchangeRequest,
        apdu: apdu.toString(),
        scrambleKey: this.scrambleKey?.toString(),
        exchangeTimeout: (this as any).exchangeTimeout,
      };
      this.iframe.contentWindow?.postMessage(msg, "*");

      const handleMessage = (evt: MessageEvent) => {
        if (evt.origin !== this.getOrigin()) {
          return;
        }

        const res: BridgeResponse = evt.data;
        switch (res?.type) {
          case BridgeMessageType.ExchangeResponse:
            resolve(Buffer.from(res.result));
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

  setUnwrap(unwrap: boolean) {
    this.unwrap = unwrap;
  }

  async close() {
    document.head.removeChild(this.iframe);
  }

  private getOrigin() {
    const tmp = this.bridgeUrl.split("/");
    tmp.splice(-1, 1);
    return tmp.join("/");
  }
}
