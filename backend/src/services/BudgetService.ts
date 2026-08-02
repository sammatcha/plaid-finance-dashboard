import { db } from "../db";
import { fetchTransactions } from "./PlaidService";

export async function getBudget() {
    const rows = await db
    .selectFrom("budget")
    .selectAll()
    .where('month', '=', '2026-07-01')
    .execute()
    return rows;
}

export async function compareBudget() {
    const budgets = await getBudget()
    const actual = await fetchTransactions()
    const totals: Record<string, number> = {}

    for (const tx of actual) {
        const category = tx.personal_finance_category?.primary
        if (!category) continue
        if (!(tx.amount > 0)) continue
        if (!tx.date?.startsWith('2026-07')) continue
        if (category === 'TRANSFER_OUT') continue
        if (tx.category?.includes('Transfer')) continue

        totals[category] = (totals[category] ?? 0) + tx.amount
    }

    return budgets.map((budget) => {
        return{
            category: budget.category,
            budget: budget.amount,
            actual: totals[budget.category] ?? 0
        }
    })
}