'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect } from "react";
import wallet from "@/wallet";

export function WalletAppComponent() {
  const [balance, setBalance] = useState(0) // Initial balance of 1000
  const [isSendOpen, setIsSendOpen] = useState(false)
  const [isReceiveOpen, setIsReceiveOpen] = useState(false)
  const [invoice, setInvoice] = useState("")
  const [amount, setAmount] = useState("")
  const [generatedInvoice, setGeneratedInvoice] = useState("")

  const FEDERATION_INVITE = 'fed11qgqzggnhwden5te0v9cxjtn9vd3jue3wvfkxjmnyva6kzunyd9skutnwv46z7qqpyzhv5mxgpl79xz7j649sj6qldmde5s2uxchy4uh7840qgymsqmazzp6sn43'; // ecash club

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
  }

  const handleReceive = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountSats = parseInt(amount);

    const invoice = await wallet.lightning.createInvoice(
      amountSats * 1000,
      "Fedimint Web SDK!!!"
    );
    setGeneratedInvoice(invoice.invoice);
    setAmount("");
  
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">My Wallet</h1>
      <div className="text-center mb-6">
        <p className="text-lg font-semibold">Balance</p>
        <p className="text-3xl font-bold">{balance} sats</p>
      </div>
      <div className="flex justify-center space-x-4">
        <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Send</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Money</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <Label htmlFor="invoice">Invoice Amount</Label>
                <Input
                  id="invoice"
                  value={invoice}
                  onChange={(e) => setInvoice(e.target.value)}
                  placeholder="Enter amount to send"
                  required
                />
              </div>
              <Button type="submit">Send</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isReceiveOpen} onOpenChange={setIsReceiveOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Receive</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Receive Money</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleReceive} className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount to receive"
                  required
                />
              </div>
              <Button type="submit">Receive</Button>
            </form>
            { generatedInvoice && <p>Invoice: {generatedInvoice}</p> }
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}