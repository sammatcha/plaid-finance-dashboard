export type ConnectedAccount = {
    account_id: string
    name: string
    mask: string | null
    balances: {current: number | null }
}

export default function ConnectedAccounts({ accounts }: { accounts: ConnectedAccount[] }){
    return(
        <div className="max-w-5xl">
            {accounts.map((acct)=> (
                <div
                    key={acct.account_id}
                    className="flex items-center justify-between py-3 border-b border-neutral-700"
                >
                    <div className="flex-col">
                        <p className="text-zinc-100 font-medium">{acct.name}</p>
                        <p className="text-zinc-500">····{acct.mask}</p>
                    </div>
                    <p className="text-zinc-100">${acct.balances.current}</p>
                    
                </div>
            )) }
        </div>
    )
}
