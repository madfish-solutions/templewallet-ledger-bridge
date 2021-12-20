import Transport from "@ledgerhq/hw-transport";
import { TransportError } from "@ledgerhq/errors";
import {
  BridgeExchangeRequest,
  BridgeMessageType,
  BridgeResponse,
  TransportType
} from "./types";

export class LedgerTempleBridgeTransport extends Transport {
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
      unsubscribe: () => {}
    };
  }

  static async open(bridgeUrl: string) {
    const iframe = document.createElement("iframe");
    iframe.src = bridgeUrl;
    iframe.allow = `hid 'src'`;
    document.head.appendChild(iframe);
    await new Promise(res =>
      iframe.addEventListener("load", res, { once: true })
    );
    return new LedgerTempleBridgeTransport(iframe);
  }

  scrambleKey?: Buffer;
  transportType: TransportType;

  constructor(private iframe: HTMLIFrameElement) {
    super();
    this.transportType = TransportType.U2F;
  }

  exchange(apdu: Buffer) {
    return new Promise<Buffer>(async (resolve, reject) => {
      const exchangeTimeout: number = (this as any).exchangeTimeout;
      const msg: BridgeExchangeRequest = {
        type: BridgeMessageType.ExchangeRequest,
        apdu: apdu.toString("hex"),
        scrambleKey: this.scrambleKey?.toString("ascii"),
        exchangeTimeout,
        transportType: this.transportType
      };

      this.iframe.contentWindow?.postMessage(msg, "*");

      const handleMessage = (evt: MessageEvent) => {
        if (evt.origin !== this.getOrigin()) {
          return;
        }

        const res: BridgeResponse = evt.data;
        switch (res?.type) {
          case BridgeMessageType.ExchangeResponse:
            resolve(Buffer.from(res.result, "hex"));
            break;

          case BridgeMessageType.ErrorResponse:
            reject(new TransportError(res.message));
            break;

          default:
            return;
        }

        window.removeEventListener("message", handleMessage);
      };

      window.addEventListener("message", handleMessage);
    });
  }

  updateTransportType(transportType: TransportType) {
    this.transportType = transportType;
  }

  setScrambleKey(scrambleKey: string) {
    this.scrambleKey = Buffer.from(scrambleKey, "ascii");
  }

  async close() {
    document.head.removeChild(this.iframe);
  }

  private getOrigin() {
    const tmp = this.iframe.src.split("/");
    tmp.splice(-1, 1);
    return tmp.join("/");
  }
}
