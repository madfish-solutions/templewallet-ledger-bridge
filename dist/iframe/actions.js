"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchange = void 0;
const hw_transport_u2f_1 = __importDefault(require("@ledgerhq/hw-transport-u2f"));
async function exchange(apdu, scrambleKey, exchangeTimeout) {
    const t = await getOrCreateTransport();
    if (exchangeTimeout)
        t.setExchangeTimeout(exchangeTimeout);
    if (scrambleKey)
        t.setScrambleKey(scrambleKey);
    const resultBuf = await t.exchange(Buffer.from(apdu, "hex"));
    return resultBuf.toString("hex");
}
exports.exchange = exchange;
let transport;
async function getOrCreateTransport() {
    if (!transport)
        transport = await hw_transport_u2f_1.default.create();
    return transport;
}
//# sourceMappingURL=actions.js.map