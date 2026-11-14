
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function ReviewApplication() {
  const { id } = useParams()

  const [application, setApplication] = useState(null)
  const [role, setRole] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Retrieve user and application
  useEffect(() => {
    async function getApplication() {
      const { data: { user }, error: userError } =
        await supabase.auth.getUser()

      if (userError || !user) {
        setError('Please log in first.')
        setLoading(false)
        return
      }

      const userRole = user.user_metadata?.role || 'loan_officer'
      setRole(userRole)

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setApplication(data)
        setSelectedStatus(data.status)
      }

      setLoading(false)
    }

    getApplication()
  }, [id])

  // Update application status
  async function updateStatus() {
    setUpdating(true)
    setError('')
    setMessage('')

    const allowedStatuses = role === 'credit_manager'
      ? ['approved', 'denied']
      : ['pending', 'submitted']

    if (!allowedStatuses.includes(selectedStatus)) {
      setError('You cannot select this status.')
      setUpdating(false)
      return
    }

    const { data, error } = await supabase
      .from('applications')
      .update({ status: selectedStatus })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      setError(error.message)
    } else {
      setApplication(data)
      setMessage('Application status successfully updated!')
    }

    setUpdating(false)
  }

  if (loading) {
    return <main><p>Loading application...</p></main>
  }

  if (error && !application) {
    return (
      <main>
        <h1>Application Not Found</h1>
        <p>{error}</p>
        <Link to="/login">Back to Login</Link>
      </main>
    )
  }

  if (!application) return <main>Application not found.</main>

  const dti = Number(application.monthly_income) > 0
    ? (Number(application.monthly_debt) /
       Number(application.monthly_income)) * 100
    : 0

  const statusLabels = {
    draft: 'Draft',
    submitted: 'Submitted',
    referred: 'Credit Manager Review',
    approved: 'Approved',
    counter: 'Counteroffer',
    denied: 'Denied',
    pending: 'Pending'
  }

  const dashboardPath = role === 'credit_manager'
    ? '/dashboard/cm'
    : '/dashboard/lo'

  const statusOptions = role === 'credit_manager'
    ? ['approved', 'denied']
    : ['pending', 'submitted']

  // Include the existing status if it isn't in the role's options
  const dropdownOptions = statusOptions.includes(selectedStatus)
    ? statusOptions
    : [selectedStatus, ...statusOptions]

  return (
    <main>
      <Link to={dashboardPath}>← Back to Dashboard</Link>

      <h1>Loan Application Review</h1>

      <h2>Borrower Information</h2>

      <p>First Name: {application.first_name}</p>
      <p>Last Name: {application.last_name}</p>

      <h2>Loan Information</h2>

      <p>
        Loan Amount: $
        {Number(application.loan_request).toLocaleString()}
      </p>

      <p>Purpose: {application.purpose}</p>

      <p>
        Current Status: <strong>
          {statusLabels[application.status] || application.status}
        </strong>
      </p>

      <h2>Financial Information</h2>

      <p>
        Monthly Income: $
        {Number(application.monthly_income).toLocaleString()}
      </p>

      <p>
        Monthly Debt: $
        {Number(application.monthly_debt).toLocaleString()}
      </p>

      <p>Credit Score: {application.credit_score}</p>

      <p>Debt-to-Income Ratio: {dti.toFixed(2)}%</p>

      <hr />

      <h2>
        {role === 'credit_manager'
          ? 'Credit Manager Decision'
          : 'Update Application Status'}
      </h2>

      <label htmlFor="status">Application Status</label>

      <select
        id="status"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        disabled={updating}
      >
        {dropdownOptions.map((status) => (
          <option key={status} value={status}>
            {statusLabels[status] || status}
          </option>
        ))}
      </select>

      <br />

      <button
        onClick={updateStatus}
        disabled={updating || selectedStatus === application.status}
      >
        {updating ? 'Updating...' : 'Update Status'}
      </button>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}

    </main>
  )
}

export default ReviewApplication
