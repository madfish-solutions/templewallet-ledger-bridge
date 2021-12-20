import Transport from "@ledgerhq/hw-transport";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import U2FTransport from "@ledgerhq/hw-transport-u2f";
import WebSocketTransport from "@ledgerhq/hw-transport-http/lib/WebSocketTransport";
import { TransportType } from "..";

// URL which triggers Ledger Live app to open and handle communication
const BRIDGE_URL = "ws://localhost:8435";

// Number of seconds to poll for Ledger Live and Ethereum app opening
const TRANSPORT_CHECK_DELAY = 1000;
const TRANSPORT_CHECK_LIMIT = 120;

export async function exchange(
  apdu: string,
  transportType: TransportType,
  scrambleKey?: string,
  exchangeTimeout?: number
) {
  const t = await getOrCreateTransport(transportType);
  if (exchangeTimeout) t.setExchangeTimeout(exchangeTimeout);
  if (scrambleKey) t.setScrambleKey(scrambleKey);
  const resultBuf = await t.exchange(Buffer.from(apdu, "hex"));
  return resultBuf.toString("hex");
}

let transport: Transport;
async function getOrCreateTransport(transportType: TransportType) {
  if (transport) {
    if (transportType === TransportType.LEDGERLIVE) {
      try {
        await WebSocketTransport.check(BRIDGE_URL);
        return transport;
      } catch (_err) {}
    } else {
      return transport;
    }
  }

  if (transportType === TransportType.LEDGERLIVE) {
    try {
      await WebSocketTransport.check(BRIDGE_URL);
    } catch (_err) {
      window.open("ledgerlive://bridge?appName=Tezos Wallet");
      await checkLedgerLiveTransport();
    }

    transport = await WebSocketTransport.open(BRIDGE_URL);
  } else if (transportType === TransportType.WEBHID) {
    transport = await TransportWebHID.create();
  } else {
    transport = await U2FTransport.create();
  }
  return transport;
}

async function checkLedgerLiveTransport(i = 0) {
  return WebSocketTransport.check(BRIDGE_URL).catch(async () => {
    await new Promise(r => setTimeout(r, TRANSPORT_CHECK_DELAY));
    if (i < TRANSPORT_CHECK_LIMIT) {
      return checkLedgerLiveTransport(i + 1);
    } else {
      throw new Error("Ledger transport check timeout");
    }
  });
}
