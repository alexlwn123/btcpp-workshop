// wallet.ts

import { FedimintWallet } from "@fedimint/core-web";

const wallet = new FedimintWallet();

//@ts-ignore
globalThis.wallet = wallet;

wallet.setLogLevel("debug");

export default wallet;
