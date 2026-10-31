import { useState } from 'react'
import './AuthScreen.css'

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const isRegister = mode === 'register'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/auth/' + mode, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(isRegister ? { name, email, password } : { email, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Authentication failed.')
      onAuthenticated(data.user)
    } catch (requestError) {
      setError(requestError.message || 'Could not connect to the server.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <button className="auth-brand" type="button"><span className="brand-mark">f</span>flowspace</button>
        <div className="auth-visual-copy">
          <span className="auth-kicker">A CLEARER WAY TO WORK</span>
          <h1>Great work happens<br />when teams flow.</h1>
          <p>Bring your projects, people, and plans together in one calm workspace.</p>
          <div className="auth-preview">
            <span className="preview-dot violet" /><span className="preview-dot orange" /><span className="preview-dot blue" />
            <div className="preview-line wide" /><div className="preview-line short" />
            <div className="preview-progress"><i /></div><span className="preview-avatar">JD</span><span className="preview-avatar second">MK</span>
          </div>
        </div>
        <span className="auth-visual-foot">Less busywork. More momentum.</span>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><span className="brand-mark">f</span>flowspace</div>
          <p className="auth-kicker">{isRegister ? 'GET STARTED' : 'WELCOME BACK'}</p>
          <h2>{isRegister ? 'Create your account' : 'Sign in to Flowspace'}</h2>
          <p className="auth-intro">{isRegister ? 'Start bringing your team’s work together.' : 'Enter your details to access your workspace.'}</p>
          <form onSubmit={handleSubmit}>
            {isRegister && <label>Your name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Jordan Davis" required minLength={2} maxLength={100} /></label>}
            <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required maxLength={254} /></label>
            <label>Password<input type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" required minLength={8} maxLength={72} /></label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}<span>→</span></button>
          </form>
          <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to Flowspace?'} <button type="button" onClick={() => { setError(''); setMode(isRegister ? 'login' : 'register') }}>{isRegister ? 'Sign in' : 'Create an account'}</button></p>
          <p className="auth-terms">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
        </div>
      </section>
    </main>
  )
}

export default AuthScreen
