import U2FTransport from "@ledgerhq/hw-transport-u2f";

export async function exchange(
  apdu: string,
  scrambleKey?: string,
  exchangeTimeout?: number
) {
  const t = await getOrCreateTransport();
  if (exchangeTimeout) t.setExchangeTimeout(exchangeTimeout);
  if (scrambleKey) t.setScrambleKey(scrambleKey);
  const resultBuf = await t.exchange(Buffer.from(apdu, "hex"));
  return resultBuf.toString("hex");
}

let transport: U2FTransport;
async function getOrCreateTransport() {
  if (!transport) transport = await U2FTransport.create();
  return transport;
}
