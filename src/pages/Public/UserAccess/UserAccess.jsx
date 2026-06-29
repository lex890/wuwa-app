import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './UserAccess.scss'
import { supabase } from '../../../api/supabase.js'
import LineWaves from '../../../components/LineWaves/LineWaves.jsx'
import StarIcon from '../../../assets/svg/star.png'
import { navigateWithTransition } from '../../../utils/viewTransition.js'

async function sendVerificationCode(email) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
    },
  })

  if (error) throw error
}

async function upsertUserProfile(user, username = '') {
  const { error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      uname: username.trim() || user.user_metadata?.uname || null,
      role: 'user',
      verified: Boolean(user.email_confirmed_at),
    }, { onConflict: 'id' })

  if (error) throw error
}

function UserAccess() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const storedVerificationEmail = localStorage.getItem('wuwa_verification_email') || ''
  const [form, setForm] = useState({
    email: storedVerificationEmail,
    username: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
  })
  const [verificationEmail, setVerificationEmail] = useState(storedVerificationEmail)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mode = pathname === '/signup'
    ? 'signup'
    : pathname === '/forgot-pass'
      ? 'forgot'
      : pathname === '/verify-email'
        ? 'verify'
      : 'login'
  const isSignup = mode === 'signup'
  const isForgot = mode === 'forgot'
  const isVerify = mode === 'verify'

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const resetStatus = () => {
    setStatus({ type: '', message: '' })
  }

  const handleModeChange = (nextMode) => {
    resetStatus()
    navigateWithTransition(navigate, nextMode === 'signup'
      ? '/signup'
      : nextMode === 'forgot'
        ? '/forgot-pass'
        : '/login',
      'fade')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    resetStatus()
    setIsSubmitting(true)

    try {
      const email = form.email.trim().toLowerCase()

      if (!email) {
        throw new Error('Enter your email address.')
      }

      if (isForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        })

        if (error) throw error

        setStatus({
          type: 'success',
          message: 'If an account exists, a password reset email was sent.',
        })
        return
      }

      if (!form.password) {
        throw new Error('Enter your password.')
      }

      if (isSignup) {
        if (form.password.length < 8) {
          throw new Error('Password must be at least 8 characters.')
        }

        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match.')
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password: form.password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
            data: {
              uname: form.username.trim() || null,
            },
          },
        })

        if (error) {
          if (error.message?.toLowerCase().includes('already registered')) {
            throw new Error('An account with this email already exists.')
          }

          throw error
        }

        if (data.session && data.user) {
          await upsertUserProfile(data.user, form.username)
        }

        localStorage.setItem('wuwa_verification_email', email)
        setVerificationEmail(email)
        setStatus({ type: 'success', message: 'Account created. Check your email and click the confirmation link.' })
        navigateWithTransition(navigate, '/verify-email', 'fade')
        setForm((current) => ({ ...current, password: '', confirmPassword: '', verificationCode: '' }))
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: form.password,
      })

      if (error) {
        if (error.message?.toLowerCase().includes('email not confirmed')) {
          await sendVerificationCode(email)
          localStorage.setItem('wuwa_verification_email', email)
          setVerificationEmail(email)
          setStatus({ type: 'error', message: 'Please verify your email first. A new code was sent.' })
          navigateWithTransition(navigate, '/verify-email', 'fade')
          return
        }

        throw error
      }

      if (!data.user.email_confirmed_at) {
        localStorage.setItem('wuwa_verification_email', email)
        setVerificationEmail(email)
        setStatus({ type: 'error', message: 'Please verify your email first.' })
        navigateWithTransition(navigate, '/verify-email', 'fade')
        return
      }

      await upsertUserProfile(data.user)

      localStorage.setItem('wuwa_user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        uname: data.user.user_metadata?.uname || null,
        role: 'user',
        verified: true,
        avatar: null,
      }))
      setStatus({ type: 'success', message: `Welcome${data.user.user_metadata?.uname ? `, ${data.user.user_metadata.uname}` : ''}.` })
      navigateWithTransition(navigate, '/profile', 'fade')
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="user-access">
      <div className="user-access-background" aria-hidden="true">
        <div className="line-waves-frame">
          <LineWaves
            speed={0.1}
            innerLineCount={32}
            outerLineCount={40}
            warpIntensity={1}
            rotation={-45}
            edgeFadeWidth={0.4}
            colorCycleSpeed={1}
            brightness={0.1}
            color1="#CDCBB0"
            color2="#AFAC83"
            color3="#CDCBB0"
            enableMouseInteraction
            mouseInfluence={2}
          />
        </div>
      </div>

      <section key={mode} className="access-card" aria-labelledby="access-title">
        <form onSubmit={handleSubmit}>
          <h1 id="access-title">
            {isForgot || isSignup || isVerify ? (
              isVerify ? 'Verify Email' : isForgot ? 'Reset Password' : 'Create Account'
            ) : (
              <button
                type="button"
                className="sonoro-brand"
                onClick={() => navigateWithTransition(navigate, '/home', 'fade')}
              >
                <img alt="" src={StarIcon} />
                <span>Sonoro</span>
              </button>
            )}
          </h1>

          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              readOnly={isVerify && Boolean(verificationEmail)}
              required
            />
          </label>

          {isSignup && (
            <label>
              <span>Username</span>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={updateField}
                autoComplete="username"
              />
            </label>
          )}

          {isVerify && status.message === '' && (
            <p className="access-status success" role="status">
              Check your email and click the confirmation link to finish signing up.
            </p>
          )}

          {!isForgot && !isVerify && (
            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={updateField}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                required
              />
            </label>
          )}

          {isSignup && (
            <label>
              <span>Confirm Password</span>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={updateField}
                autoComplete="new-password"
                required
              />
            </label>
          )}

          {status.message && (
            <p className={`access-status ${status.type}`} role="status">
              {status.message}
            </p>
          )}

          {!isVerify && (
            <button className="access-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : isForgot ? 'Find Account' : isSignup ? 'Create Account' : 'Login'}
            </button>
          )}

          {isVerify && (
            <button
              type="button"
              className="forgot-link"
              disabled={isSubmitting}
              onClick={async () => {
                resetStatus()
                setIsSubmitting(true)

                try {
                  const email = form.email.trim().toLowerCase()
                  if (!email) throw new Error('Enter your email address.')

                  await sendVerificationCode(email)
                  localStorage.setItem('wuwa_verification_email', email)
                  setVerificationEmail(email)
                  setStatus({ type: 'success', message: 'A new verification code was sent.' })
                } catch (error) {
                  setStatus({ type: 'error', message: error.message || 'Could not resend the code.' })
                } finally {
                  setIsSubmitting(false)
                }
              }}
            >
              Resend code
            </button>
          )}

          <button
            type="button"
            className="forgot-link"
            onClick={() => handleModeChange(isForgot || isVerify ? 'login' : 'forgot')}
          >
            {isForgot || isVerify ? 'Go to login' : 'Forgot password?'}
          </button>

          {!isForgot && !isVerify && (
            <button
              type="button"
              className="forgot-link"
              onClick={() => handleModeChange(isSignup ? 'login' : 'signup')}
            >
              {isSignup ? 'Already have an account?' : 'Create an account'}
            </button>
          )}
        </form>
      </section>
    </main>
  )
}

export default UserAccess
