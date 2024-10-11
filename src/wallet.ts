import { FedimintWallet } from "@fedimint/core-web";

const wallet = new FedimintWallet();

// @ts-expect-error globalThis is not typed
globalThis.wallet = wallet;

wallet.setLogLevel("debug");

export default wallet;
