
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  
    async function handleLogin(e) {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    setLoading(false)

    if (error) {
        setMessage(error.message)
        return
    }

    // Get the user's role
    const role = data.user.user_metadata?.role

    // Redirect based on role
    if (role === 'credit_manager') {
        navigate('/dashboard/cm')
    } else {
        navigate('/dashboard/lo')
    }
    }


  return (
    <main>
      <h1>Login</h1>
      <p>Sign in to your Signum account.</p>

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      {message && <p role="alert">{message}</p>}

      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </main>
  )
}

export default Login
