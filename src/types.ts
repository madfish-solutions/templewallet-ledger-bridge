export type BridgeRequest = BridgeExchangeRequest;

export type BridgeResponse = BridgeExchangeResponse | BridgeErrorResponse;

export interface BridgeExchangeRequest extends BridgeMessageBase {
  type: BridgeMessageType.ExchangeRequest;
  apdu: string;
  scrambleKey?: string;
  exchangeTimeout?: number;
  useLedgerLive?: boolean;
}

export interface BridgeExchangeResponse extends BridgeMessageBase {
  type: BridgeMessageType.ExchangeResponse;
  result: string;
}

export interface BridgeErrorResponse extends BridgeMessageBase {
  type: BridgeMessageType.ErrorResponse;
  message: string;
}

export interface BridgeMessageBase {
  type: BridgeMessageType;
}

export enum BridgeMessageType {
  ExchangeRequest = "TEMPLE_LEDGER_BRIDGE_EXCHANGE_REQUEST",
  ExchangeResponse = "TEMPLE_LEDGER_BRIDGE_EXCHANGE_RESPONSE",
  ErrorResponse = "TEMPLE_LEDGER_ERROR_RESPONSE",
}
