import { useEffect, useState } from 'react'
import LinkAccountButton from '../components/LinkAccountButton'
import ConnectedAccounts, { type ConnectedAccount } from '../components/ConnectedAccounts'
import TransactionList, { type Transaction } from '../components/TransactionList'
import SpendingSummary from '../components/SpendingSummary'
import TransactionCount from '../components/TransactionCount'
import AvgTransaction from '../components/AvgTransaction'
import BudgetChart from '../components/BudgetChart'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

function HomePage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [status, setStatus] = useState<'loading' | 'empty' | 'connected'>('loading')

  function loadDashboard() {
    setStatus('loading')

    Promise.all([
      fetch(`${API_URL}/plaid/get-accounts`).then((res) => res.json()),
       fetch(`${API_URL}/plaid/transactions`).then((res) => res.json())
    ])
      .then(([accountsData, transactionsData]) => {
        if (Array.isArray(accountsData) && accountsData[0]) {
          setAccounts([accountsData[0]])
          setTransactions(Array.isArray(transactionsData) ? transactionsData : [])
          setStatus('connected')
        } else {
          setAccounts([])
          setTransactions([])
          setStatus('empty')
        }
      })
      .catch((err) => {
        console.error('Failed to fetch accounts', err)
        setAccounts([])
        setTransactions([])
        setStatus('empty')
      })
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl">Finance Dashboard</h1>
        {status === 'empty' && <LinkAccountButton onLinked={loadDashboard} />}
      </div>

      {status === 'loading' && (
        <p className="text-zinc-400 text-sm font-medium mb-2">Loading accounts...</p>
      )}

      {status === 'empty' && (
        <p className="text-zinc-400 text-sm font-medium mb-2">No account connected</p>
      )}

      {status === 'connected' && (
        <>
          <p className="text-zinc-400 text-sm font-medium mb-1 md:mb-2">Connected account:</p>
          <ConnectedAccounts accounts={accounts} />
          <div className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 max-w-5xl w-full">
            <SpendingSummary transactions={transactions} />
            <TransactionCount transactions={transactions} />
            <AvgTransaction transactions={transactions} />
          </div>
          <div className="mt-4 md:mt-6 max-w-5xl w-full min-w-0">
            <BudgetChart/>
          </div>
          <div className="mt-4 md:mt-6 max-w-5xl w-full min-w-0">
            <TransactionList transactions={transactions} />
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage
