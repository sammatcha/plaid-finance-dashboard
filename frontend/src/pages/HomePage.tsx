import { useEffect, useState } from 'react'
import LinkAccountButton from '../components/LinkAccountButton'
import ConnectedAccounts from '../components/ConnectedAccounts'
import TransactionList from '../components/TransactionList'
import SpendingSummary from '../components/SpendingSummary'
import TransactionCount from '../components/TransactionCount'
import AvgTransaction from '../components/AvgTransaction'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

function HomePage() {
  // const [status, setStatus] = useState<string>('loading...')

  // useEffect(() => {
  //   fetch(`${API_URL}/health`)
  //     .then((res) => res.json())
  //     .then((data) => setStatus(data.status))
  //     .catch(() => setStatus('error'))
  // }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className='text-2xl md:text-3xl'>Finance Dashboard</h1>
        <LinkAccountButton/>
      </div>

      <p className="text-zinc-400 text-sm font-medium mb-2">Connected account: </p>
      <ConnectedAccounts/>
      <div className='flex gap-8 flex-wrap max-w-5xl w-full items-center justify-center'>
        <SpendingSummary/>
        <TransactionCount/>
        <AvgTransaction/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className='md:col-span-2'>
             <TransactionList/>
        </div>
         
      </div>
      

      {/* <p>Backend health status: {status}</p> */}
    </div>
  )
}

export default HomePage
