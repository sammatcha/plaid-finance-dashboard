import { type Transaction } from './TransactionList'

function getCurrentYearMonth() {
  // Sandbox txs / seeded budgets are in July 2026
  return '2026-07'
}

function isMonthSpend(tx: Transaction, yearMonth: string) {
  return (
    tx.amount > 0 &&
    tx.date?.startsWith(yearMonth) &&
    tx.personal_finance_category?.primary !== 'TRANSFER_OUT' &&
    !tx.category?.includes('Transfer')
  )
}

export default function SpendingSummary({ transactions }: { transactions: Transaction[] }) {
  const yearMonth = getCurrentYearMonth()
  const totalSpent = transactions
    .filter((tx) => isMonthSpend(tx, yearMonth))
    .reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="w-full min-w-0 rounded-xl bg-neutral-900 border-neutral-700 border text-white p-4">
      <p className="text-sm md:text-base text-neutral-200 mb-2">Total spent (mtd)</p>
      <p className="text-xl md:text-2xl font-semibold tracking-tight tabular-nums">
        ${totalSpent.toFixed(2)}
      </p>
    </div>
  )
}
