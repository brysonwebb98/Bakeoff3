
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function CreditManagerDashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function getApplications() {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('status', 'submitted')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setApplications(data)
      }

      setLoading(false)
    }

    getApplications()
  }, [])

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Applications awaiting your review.</p>

      {loading && <p>Loading applications...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && applications.length === 0 && (
        <p>No applications are currently awaiting review.</p>
      )}

      {applications.map((application) => (
        <div key={application.id}>
          <h2>
            {application.first_name} {application.last_name}
          </h2>

          <p>
            Loan Amount: $
            {Number(application.loan_request).toLocaleString()}
          </p>

          <p>Purpose: {application.purpose}</p>

          <p>Status: Credit Manager Review</p>

          <Link to={`/underwriting/${application.id}`}>
            Review Application
          </Link>

          <hr />
        </div>
      ))}
    </main>
  )
}

export default CreditManagerDashboard
