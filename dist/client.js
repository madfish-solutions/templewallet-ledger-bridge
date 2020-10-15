"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerThanosBridgeTransport = void 0;
const hw_transport_1 = __importDefault(require("@ledgerhq/hw-transport"));
const types_1 = require("./types");
class LedgerThanosBridgeTransport extends hw_transport_1.default {
    constructor(iframe, bridgeUrl) {
        super();
        this.iframe = iframe;
        this.bridgeUrl = bridgeUrl;
    }
    static async isSupported() {
        return true;
    }
    static async list() {
        return [];
    }
    static listen() {
        return {
            unsubscribe: () => { },
        };
    }
    static async open() {
        const bridgeUrl = "https://thanoswallet.com/ledger-bridge";
        const iframe = document.createElement("iframe");
        iframe.src = bridgeUrl;
        document.head.appendChild(iframe);
        return new LedgerThanosBridgeTransport(iframe, bridgeUrl);
    }
    exchange(apdu) {
        return new Promise((resolve, reject) => {
            const msg = {
                type: types_1.BridgeMessageType.ExchangeRequest,
                apdu: apdu.toString(),
                scrambleKey: this.scrambleKey?.toString(),
                exchangeTimeout: this.exchangeTimeout,
            };
            this.iframe.contentWindow?.postMessage(msg, "*");
            const handleMessage = (evt) => {
                if (evt.origin !== this.getOrigin()) {
                    return;
                }
                const res = evt.data;
                switch (res?.type) {
                    case types_1.BridgeMessageType.ExchangeResponse:
                        resolve(Buffer.from(res.result));
                        break;
                    case types_1.BridgeMessageType.ErrorResponse:
                        reject(res.message);
                        break;
                }
                window.removeEventListener("message", handleMessage);
            };
            window.addEventListener("message", handleMessage);
        });
    }
    setScrambleKey(scrambleKey) {
        this.scrambleKey = Buffer.from(scrambleKey, "ascii");
    }
    setUnwrap(unwrap) {
        this.unwrap = unwrap;
    }
    async close() {
        document.head.removeChild(this.iframe);
    }
    getOrigin() {
        const tmp = this.bridgeUrl.split("/");
        tmp.splice(-1, 1);
        return tmp.join("/");
    }
}
exports.LedgerThanosBridgeTransport = LedgerThanosBridgeTransport;
//# sourceMappingURL=client.js.map