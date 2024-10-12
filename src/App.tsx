import './App.css'
import wallet from './wallet'
import { WalletAppComponent } from '@/components/wallet-app'

function App() {
  console.log(wallet);


  return (
    <>
      <h1>Hello World</h1>
      <WalletAppComponent />
    </>
  )
}

export default App
