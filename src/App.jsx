import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Index from './pages/Index'

export default function App() {
  const [status, setStatus] = useState('Checking Supabase connection...')

  useEffect(() => {
    async function verifyConnection() {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        setStatus('Missing Supabase environment variables')
        return
      }

      const { data, error } = await supabase
        .from('shipments')
        .select('id')
        .limit(1)

      if (error) {
        setStatus(`Supabase check failed: ${error.message}`)
      } else {
        setStatus(`Supabase connected: ${data?.length ?? 0} shipment rows found`)
      }
    }

    verifyConnection()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-slate-950 text-white px-4 py-2 text-xs sm:text-sm">
        {status}
      </div>
      <Index />
    </div>
  )
}
