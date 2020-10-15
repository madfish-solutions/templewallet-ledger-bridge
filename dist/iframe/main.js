"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const actions_1 = require("./actions");
window.addEventListener("message", async (evt) => {
    try {
        const res = await handleRequest(evt.data);
        console.info("IFRAME PROCESSES", res);
        if (!res)
            throw new Error("Not Found");
        reply(res);
    }
    catch (err) {
        reply({
            type: types_1.BridgeMessageType.ErrorResponse,
            message: err?.message ?? "Unexpected error",
        });
    }
});
async function handleRequest(req) {
    switch (req?.type) {
        case types_1.BridgeMessageType.ExchangeRequest:
            const result = await actions_1.exchange(req.apdu, req.scrambleKey, req.exchangeTimeout);
            return {
                type: types_1.BridgeMessageType.ExchangeResponse,
                result,
            };
    }
}
function reply(msg) {
    window.parent.postMessage(msg, "*");
}
//# sourceMappingURL=main.js.map