export type ConnectedAccount = {
    account_id: string
    name: string
    mask: string | null
    balances: {current: number | null }
}

export default function ConnectedAccounts({ accounts }: { accounts: ConnectedAccount[] }){
    return(
        <div className="max-w-5xl w-full min-w-0">
            {accounts.map((acct)=> (
                <div
                    key={acct.account_id}
                    className="flex items-center justify-between py-2 md:py-3 border-b border-neutral-700"
                >
                    <div className="min-w-0">
                        <p className="text-zinc-100 font-medium truncate">{acct.name}</p>
                        <p className="text-zinc-500">····{acct.mask}</p>
                    </div>
                    <p className="shrink-0 text-zinc-100 tabular-nums">${acct.balances.current}</p>
                </div>
            )) }
        </div>
    )
}
