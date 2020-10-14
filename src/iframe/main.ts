import { BridgeRequest, BridgeResponse, BridgeMessageType } from "../types";
import { exchange } from "./actions";

window.addEventListener("message", async (evt) => {
  try {
    const res = await handleRequest(evt.data);
    if (!res) throw new Error("Not Found");
    reply(res);
  } catch (err) {
    reply({
      type: BridgeMessageType.ErrorResponse,
      message: err?.message ?? "Unexpected error",
    });
  }
});

async function handleRequest(
  req: BridgeRequest
): Promise<BridgeResponse | void> {
  switch (req?.type) {
    case BridgeMessageType.ExchangeRequest:
      const result = await exchange(
        req.apdu,
        req.scrambleKey,
        req.exchangeTimeout
      );
      return {
        type: BridgeMessageType.ExchangeResponse,
        result,
      };
  }
}

function reply(msg: BridgeResponse) {
  window.parent.postMessage(msg, "*");
}
