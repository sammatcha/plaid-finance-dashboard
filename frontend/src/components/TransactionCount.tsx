import { type Transaction } from './TransactionList'

function getCurrentYearMonth() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function isMonthSpend(tx: Transaction, yearMonth: string) {
  return (
    tx.amount > 0 &&
    tx.date?.startsWith(yearMonth) &&
    tx.personal_finance_category?.primary !== 'TRANSFER_OUT' &&
    !tx.category?.includes('Transfer')
  )
}

export default function TransactionCount({ transactions }: { transactions: Transaction[] }) {
  const yearMonth = getCurrentYearMonth()
  const totalCount = transactions.filter((tx) => isMonthSpend(tx, yearMonth)).length

  return (
    <div className="w-full min-w-0 rounded-xl bg-neutral-900 border-neutral-700 border text-white p-4">
      <p className="text-sm md:text-base text-neutral-200 mb-2">Transactions</p>
      <p className="text-xl md:text-2xl font-semibold tracking-tight tabular-nums">{totalCount}</p>
    </div>
  )
}
