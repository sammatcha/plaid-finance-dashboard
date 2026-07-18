import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

function HomePage() {
  const [status, setStatus] = useState<string>('loading...')

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div>
      <h1>Plaid Finance Dashboard</h1>
      <p>Backend health status: {status}</p>
    </div>
  )
}

export default HomePage
