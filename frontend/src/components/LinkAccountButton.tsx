import { useCallback, useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'

export default function LinkAccountButton(){
    const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
    const [ linkToken, setLinkToken] = useState<string | null>(null)

    useEffect(() => {
        fetch(`${API_URL}/plaid/create-link-token`)
        .then((res) => res.json())
        .then((data) => setLinkToken(data.link_token))
        .catch((err) => console.error('Failed to fetch link token', err))
    }, [])

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token) => {
            console.log('Link succeeded, public_token:', public_token)
            fetch(`${API_URL}/plaid/exchange-public-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({public_token}),
            })
            .then((res) => res.json())
            .then((data) => console.log('Exchange successful:', data))
            .catch((err)=> console.error('Failed to exchange public token', err))
        },
    })
    console.log('ready:', ready, 'linkToken:', linkToken)
    return(
         <div className="flex-right ">
        <button onClick={() => open()}
        disabled={!ready}
        className="border border-neutral-500 rounded-lg px-3 py-2 cursor-pointer">
            <p className="text-slate-50">Connect Account</p>
        </button>
    </div>
    )
   
}