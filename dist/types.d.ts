export declare type BridgeRequest = BridgeExchangeRequest;
export declare type BridgeResponse = BridgeExchangeResponse | BridgeErrorResponse;
export interface BridgeExchangeRequest extends BridgeMessageBase {
    type: BridgeMessageType.ExchangeRequest;
    apdu: string;
    scrambleKey?: string;
    exchangeTimeout?: number;
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
export declare enum BridgeMessageType {
    ExchangeRequest = "THANOS_LEDGER_BRIDGE_EXCHANGE_REQUEST",
    ExchangeResponse = "THANOS_LEDGER_BRIDGE_EXCHANGE_RESPONSE",
    ErrorResponse = "THANOS_LEDGER_ERROR_RESPONSE"
}
//# sourceMappingURL=types.d.ts.map