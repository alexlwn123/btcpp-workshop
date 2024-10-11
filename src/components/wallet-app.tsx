import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpRight, ArrowDownLeft, X } from "lucide-react";
import wallet from "@/wallet";

const FEDERATION_INVITE =
  "fed11qgqzggnhwden5te0v9cxjtn9vd3jue3wvfkxjmnyva6kzunyd9skutnwv46z7qqpyzhv5mxgpl79xz7j649sj6qldmde5s2uxchy4uh7840qgymsqmazzp6sn43"; // ecash club

export function WalletApp() {
  const [balance, setBalance] = useState(0); // Initial balance set to 1000
  const [showSendForm, setShowSendForm] = useState(false);
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [invoice, setInvoice] = useState("");
  const [generatedInvoice, setGeneratedInvoice] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const handleSetup = async () => {
      await wallet.waitForOpen();
      wallet.balance.subscribeBalance((bal) => {
        // Msats to sats
        setBalance(bal * 0.001);
      });
    };

    handleSetup();
  }, []);

  useEffect(() => {
    const openWallet = async () => {
      const isOpen = await wallet.open();

      if (!isOpen) {
        wallet.joinFederation(FEDERATION_INVITE);
      }
    };

    if (!wallet.isOpen()) openWallet();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await wallet.lightning.payInvoice(invoice);
    console.error("PAY RESULT", result)
  };

  const handleReceive = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountSats = parseInt(amount);

    const invoice = await wallet.lightning.createInvoice(
      amountSats * 1000,
      "Fedimint Web SDK!!!"
    );
    setGeneratedInvoice(invoice.invoice);
    setAmount("");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          My Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-4xl font-bold">{balance} sats</p>
        </div>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => setShowSendForm(true)}>
            <ArrowUpRight className="mr-2 h-4 w-4" /> Send
          </Button>
          <Button onClick={() => setShowReceiveForm(true)}>
            <ArrowDownLeft className="mr-2 h-4 w-4" /> Receive
          </Button>
        </div>
      </CardContent>
      {showSendForm && (
        <CardFooter>
          <form onSubmit={handleSend} className="w-full">
            <div className="space-y-2">
              <Label htmlFor="invoice">Invoice</Label>
              <Input
                id="invoice"
                placeholder="Enter invoice"
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-4">
              <Button type="submit">Send</Button>
              <Button variant="outline" onClick={() => setShowSendForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardFooter>
      )}
      {showReceiveForm && (
        <CardFooter>
          <form onSubmit={handleReceive} className="w-full">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount (sats)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {generatedInvoice && (
                <p className="text-sm text-muted-foreground truncate">
                  Generated Invoice: {'\n'}{generatedInvoice}
                </p>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <Button type="submit">Receive</Button>
              <Button
                variant="outline"
                onClick={() => setShowReceiveForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardFooter>
      )}
    </Card>
  );
}
