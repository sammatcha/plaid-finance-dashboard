import { useEffect, useState } from 'react'
import LinkAccountButton from '../components/LinkAccountButton'
import ConnectedAccounts, { type ConnectedAccount } from '../components/ConnectedAccounts'
import TransactionList from '../components/TransactionList'
import SpendingSummary from '../components/SpendingSummary'
import TransactionCount from '../components/TransactionCount'
import AvgTransaction from '../components/AvgTransaction'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

function HomePage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([])
  const [status, setStatus] = useState<'loading' | 'empty' | 'connected'>('loading')

  function loadAccounts() {
    setStatus('loading')
    fetch(`${API_URL}/plaid/get-accounts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data[0]) {
          setAccounts([data[0]])
          setStatus('connected')
        } else {
          setAccounts([])
          setStatus('empty')
        }
      })
      .catch((err) => {
        console.error('Failed to fetch accounts', err)
        setAccounts([])
        setStatus('empty')
      })
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className='text-2xl md:text-3xl'>Finance Dashboard</h1>
        {status === 'empty' && <LinkAccountButton onLinked={loadAccounts} />}
      </div>

      {status === 'loading' && (
        <p className="text-zinc-400 text-sm font-medium mb-2">Loading accounts...</p>
      )}

      {status === 'empty' && (
        <p className="text-zinc-400 text-sm font-medium mb-2">No account connected</p>
      )}

      {status === 'connected' && (
        <>
          <p className="text-zinc-400 text-sm font-medium mb-2">Connected account: </p>
          <ConnectedAccounts accounts={accounts} />
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
        </>
      )}
    </div>
  )
}

export default HomePage
