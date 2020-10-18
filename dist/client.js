"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerThanosBridgeTransport = void 0;
const hw_transport_1 = __importDefault(require("@ledgerhq/hw-transport"));
const types_1 = require("./types");
class LedgerThanosBridgeTransport extends hw_transport_1.default {
    constructor(iframe) {
        super();
        this.iframe = iframe;
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
    static async open(bridgeUrl) {
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
    get origin() {
        const tmp = this.iframe.src.split("/");
        tmp.splice(-1, 1);
        return tmp.join("/");
    }
    exchange(apdu) {
        return new Promise(async (resolve, reject) => {
            const exchangeTimeout = this.exchangeTimeout;
            const msg = {
                type: types_1.BridgeMessageType.ExchangeRequest,
                apdu: apdu.toString("hex"),
                scrambleKey: this.scrambleKey?.toString("ascii"),
                exchangeTimeout,
            };
            this.iframe.contentWindow?.postMessage(msg, "*");
            const handleMessage = (evt) => {
                if (evt.origin !== this.origin) {
                    return;
                }
                const res = evt.data;
                switch (res?.type) {
                    case types_1.BridgeMessageType.ExchangeResponse:
                        resolve(Buffer.from(res.result, "hex"));
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
    async close() {
        document.head.removeChild(this.iframe);
    }
}
exports.LedgerThanosBridgeTransport = LedgerThanosBridgeTransport;
//# sourceMappingURL=client.js.map