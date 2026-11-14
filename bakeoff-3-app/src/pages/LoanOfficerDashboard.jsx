
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function LoanOfficerDashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    
    async function getApplications() {
    // Get the logged-in user
    const { data: { user }, error: userError } =
        await supabase.auth.getUser()

    if (userError || !user) {
        setError('Please log in to view applications.')
        setLoading(false)
        return
    }

    // Get only this user's applications
    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
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
      <h1>Loan Officer Dashboard</h1>

      <p>Manage your loan applications.</p>

      <Link to="/applications/create">
        Create New Application
      </Link>

      <h2>Recent Applications</h2>

      {loading && <p>Loading applications...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && applications.length === 0 && (
        <p>No applications found.</p>
      )}

      {applications.map((application) => (
        <div key={application.id}>
          <h3>
            {application.first_name} {application.last_name}
          </h3>

          <p>
            Loan Amount: ${application.loan_request}
          </p>

          <p>Purpose: {application.purpose}</p>

          <p>Status: {application.status}</p>

          <Link to={`/underwriting/${application.id}`}>
            View Application
          </Link>

          <hr />
        </div>
      ))}
    </main>
  )
}

export default LoanOfficerDashboard
