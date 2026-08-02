import { useEffect, useState } from 'react'


function formatCategory(category:string) {
    return category
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

export default function BudgetChart() {
    const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
    const [budgetData, setBudgetData] = useState< { category: string; budget: number; actual: number }[] >([])

    useEffect(() => {
        fetch(`${API_URL}/budget`)
        .then((res) => res.json())
        .then((data) => {
            if (Array.isArray(data)) setBudgetData(data)
            else console.error('Unexpected /budget response', data)
        })
        .catch((err) => console.error(err))   
    }, [])

    return(
        <div className="w-full min-w-0 rounded-xl bg-neutral-900 text-white p-4 border border-neutral-700">
            {budgetData.map((row) => {
                const diff = row.actual - row.budget
                const pct = Math.min((row.actual / row.budget) * 100,100)
                return (
                    <div key={formatCategory(row.category)} className="mb-4 flex items-center gap-6 ">
                        <p className="w-40 gap-4 text-sm">{formatCategory(row.category)}</p>
                        <div className="h-2 min-w-0 flex-1 rounded-full bg-neutral-700">
                            <div
                                className={`h-2 rounded-full ${diff > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                                style={{ width: `${pct}%` }}
                                       />
                        </div>
                        <p
                            className={`w-16 shrink-0 text-right text-sm  ${
                                diff > 0 ? 'text-red-400' : 'text-green-400'
                            }`}
                        >
                            {diff > 0 ? '+' : ''}
                            {diff.toFixed(2)}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}