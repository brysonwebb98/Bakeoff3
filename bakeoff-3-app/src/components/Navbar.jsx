
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function Navbar() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    // Check for an existing login
    async function getUser() {
      const { data: { session } } =
        await supabase.auth.getSession()

      setUser(session?.user || null)
      setLoading(false)
    }

    getUser()

    // Listen for login and logout changes
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      })

    return () => subscription.unsubscribe()
  }, [])

  // Log out
  async function handleLogout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error(error.message)
      return
    }

    navigate('/login')
  }

  // Determine dashboard based on user role
  const role = user?.user_metadata?.role

  const dashboardPath =
    role === 'credit_manager'
      ? '/dashboard/cm'
      : '/dashboard/lo'

  return (
    <nav>
      <h2>
        <Link to={user ? dashboardPath : '/'}>
          Signum
        </Link>
      </h2>

      {!loading && (
        <div>
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              {' | '}
              <Link to="/signup">Signup</Link>
            </>
          ) : (
            <>
              <Link to={dashboardPath}>Dashboard</Link>
              {' | '}
              <button onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
