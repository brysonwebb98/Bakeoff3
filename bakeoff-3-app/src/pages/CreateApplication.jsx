
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function CreateApplication() {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    loanRequest: '',
    purpose: '',
    monthlyIncome: '',
    monthlyDebt: '',
    creditScore: ''
  })

  const [message, setMessage] = useState('')

  // Update the form when a user types
  function handleChange(e) {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Calculate debt-to-income ratio
  const dti = Number(formData.monthlyIncome) > 0
    ? (Number(formData.monthlyDebt) / Number(formData.monthlyIncome)) * 100
    : 0

    
    async function handleSubmit(e) {
    e.preventDefault()

    if (
        Number(formData.loanRequest) <= 0 ||
        Number(formData.monthlyIncome) <= 0 ||
        Number(formData.monthlyDebt) < 0 ||
        Number(formData.creditScore) < 300 ||
        Number(formData.creditScore) > 850
    ) {
        setMessage('Please enter valid loan and financial information.')
        return
    }

    setLoading(true)
    setMessage('')

    // Get logged-in user
    const { data: { user }, error: userError } =
        await supabase.auth.getUser()

    if (userError || !user) {
        setMessage('Please log in first.')
        setLoading(false)
        return
    }

    // Save application to Supabase
    const { error } = await supabase
        .from('applications')
        .insert({
        user_id: user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        loan_request: Number(formData.loanRequest),
        purpose: formData.purpose,
        monthly_income: Number(formData.monthlyIncome),
        monthly_debt: Number(formData.monthlyDebt),
        credit_score: Number(formData.creditScore),
        status: 'submitted'
        })

    setLoading(false)

    if (error) {
        setMessage('Error saving application: ' + error.message)
        console.error(error)
        return
    }

    // Redirect to Loan Officer Dashboard
    navigate('/dashboard/lo')
    }


  return (
    <main>
      <h1>Create Loan Application</h1>
      <p>Enter the borrower's information below.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="loanRequest">Loan Amount ($)</label>
          <input
            id="loanRequest"
            type="number"
            name="loanRequest"
            value={formData.loanRequest}
            onChange={handleChange}
            min="1"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="purpose">Loan Purpose</label>
          <select
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
          >
            <option value="">Select a purpose</option>
            <option value="Auto">Auto Loan</option>
            <option value="Personal">Personal Loan</option>
            <option value="Home Improvement">Home Improvement</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="monthlyIncome">Monthly Income ($)</label>
          <input
            id="monthlyIncome"
            type="number"
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="monthlyDebt">Monthly Debt ($)</label>
          <input
            id="monthlyDebt"
            type="number"
            name="monthlyDebt"
            value={formData.monthlyDebt}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="creditScore">Credit Score</label>
          <input
            id="creditScore"
            type="number"
            name="creditScore"
            value={formData.creditScore}
            onChange={handleChange}
            min="300"
            max="850"
            required
          />
        </div>

        <h3>Debt-to-Income Ratio: {dti.toFixed(2)}%</h3>

        <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      {message && <p role="status">{message}</p>}
    </main>
  )
}

export default CreateApplication
