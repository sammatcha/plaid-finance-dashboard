export type Transaction = {
  transaction_id: string
  merchant_name: string | null
  name: string
  amount: number
  date?: string
  personal_finance_category?: {
    primary: string | null
  } | null
  category?: string[] | null
}

function formatAmount(amount: number) {
  return `$${Math.abs(amount).toFixed(2)}`
}

function formatCategory(tx: Transaction) {
  const primary = tx.personal_finance_category?.primary
  if (primary) {
    return primary
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  return tx.category?.[0] ?? '—'
}

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const recent = transactions.slice(0, 5)

  return (
    <div className="mt-6 w-full max-w-5xl rounded-xl bg-neutral-900 text-white p-4 border border-neutral-700  ">
      <div className="flex items-center gap-2 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-4 h-4 text-neutral-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-sm font-medium">Recent transactions</p>
      </div>

      {recent.length === 0 ? (
        <p className="text-xs text-neutral-500">No transactions yet.</p>
      ) : (
        <div className="divide-y divide-neutral-700 ">
          {recent.map((tx) => (
            <div
              key={tx.transaction_id}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2.5 text-sm"
            >
              <p className="truncate">{tx.merchant_name ?? tx.name}</p>
              <p className="text-neutral-300 whitespace-nowrap">
                {formatCategory(tx)}
              </p>
              <p className="text-right whitespace-nowrap tabular-nums">
                {formatAmount(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
