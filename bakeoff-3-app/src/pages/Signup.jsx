import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSignup(e) {
    e.preventDefault()

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Account created! Check your email if confirmation is required.')
    }
  }

  return (
    <main>
      <h1>Create an Account</h1>

      <form onSubmit={handleSignup}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>

      <p>{message}</p>
    </main>
  )
}

export default Signup