import { useEffect, useState } from 'react'
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
    return(
         <div className="flex-right ">
        <button onClick={() => open()}
        disabled={!ready}
        className="border rounded-lg px-4 py-2 text-sm font-medium cursor-pointer text-white hover:bg-blue-600 disabled:opacity-50">
            <p className="text-slate-50 font-medium text-base">Connect Account</p>
        </button>
    </div>
    )
   
}