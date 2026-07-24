import { useEffect, useState } from "react"

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

type Transaction = {
  date: string
  amount: number
  personal_finance_category?: { primary: string | null } | null
category?: string[] | null
}

function getCurrentYearMonth() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export default function SpendingSummary() {
  const [totalSpent, setTotalSpent] = useState<number | null>(null)

  useEffect(() => {
    const yearMonth = getCurrentYearMonth()

    fetch(`${API_URL}/plaid/transactions`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error('Unexpected transactions response:', data)
          setTotalSpent(0)
          return
        }

        const spent = data
          .filter(
            (tx: Transaction) =>
              tx.amount > 0 && tx.date?.startsWith(yearMonth) &&
            tx.personal_finance_category?.primary !== 'TRANSFER_OUT' &&
  !tx.category?.includes('Transfer')
          )
          .reduce((sum: number, tx: Transaction) => sum + tx.amount, 0)

        setTotalSpent(spent)
      })
      .catch((err) => {
        console.error('Failed to fetch spending summary', err)
        setTotalSpent(0)
      })
  }, [])

  return (
    <div className="mt-6 min-w-[10rem] flex-1 rounded-xl bg-neutral-900 border-neutral-700 border text-white p-4">
      <p className="text-base text-neutral-200 mb-2">Total spent (mtd)</p>
      <p className="text-2xl font-semibold tracking-tight">
        {totalSpent === null ? '—' : `$${totalSpent.toFixed(2)}`}
      </p>
    </div>
  )
}
