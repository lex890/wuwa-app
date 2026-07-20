import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './UserAccess.scss'
import { supabase } from '../../../api/supabase.js'
import LineWaves from '../../../components/LineWaves/LineWaves.jsx'
import AnimatedLogo from '../../../components/AnimatedLogo/AnimatedLogo.jsx'
import { navigateWithTransition } from '../../../utils/viewTransition.js'

const confirmationRedirectTo = () => `${window.location.origin}/login`

async function resendSignupConfirmation(email) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: confirmationRedirectTo(),
    },
  })

  if (error) throw error
}

async function upsertUserProfile(user, username = '') {
  const cleanUsername = username.trim()
  const { data: existingProfile, error: readError } = await supabase
    .from('users')
    .select('uname,role')
    .eq('id', user.id)
    .maybeSingle()

  if (readError) throw readError

  const { error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      uname: cleanUsername || existingProfile?.uname || user.user_metadata?.uname || null,
      role: existingProfile?.role || 'user',
      verified: Boolean(user.email_confirmed_at),
    }, { onConflict: 'id' })

  if (error) throw error
}

async function getEmailForUsername(username) {
  const cleanUsername = username.trim()
  const { data, error } = await supabase.rpc('get_email_for_username', {
    username_input: cleanUsername,
  })

  if (error?.code === 'PGRST202') {
    throw new Error('Username login is not active yet. Run the get_email_for_username SQL in Supabase, then reload the schema cache.')
  }

  if (error) throw error

  if (!data) {
    throw new Error('No account was found with that username. Check that this app is connected to the same Supabase project where that uname exists.')
  }

  return data.trim().toLowerCase()
}

function UserAccess() {
  const { pathname, search, hash } = useLocation()
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
  const searchParams = new URLSearchParams(search)
  const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
  const isRecoveryLink = searchParams.get('type') === 'recovery' || hashParams.get('type') === 'recovery'

  const mode = pathname === '/signup'
    ? 'signup'
    : pathname === '/forgot-pass'
      ? 'forgot'
      : pathname === '/verify-email'
        ? 'verify'
        : pathname === '/reset-password' || isRecoveryLink
          ? 'reset'
          : 'login'
  const isSignup = mode === 'signup'
  const isForgot = mode === 'forgot'
  const isVerify = mode === 'verify'
  const isReset = mode === 'reset'

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const resetStatus = () => {
    setStatus({ type: '', message: '' })
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setStatus({ type: 'error', message: error.message || 'Could not read your login session.' })
        return
      }

      if (data.session?.user?.email_confirmed_at) {
        upsertUserProfile(data.session.user).catch((syncError) => {
          setStatus({ type: 'error', message: syncError.message || 'Could not sync your profile.' })
        })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigateWithTransition(navigate, '/reset-password', 'fade')
        return
      }

      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        upsertUserProfile(session.user).catch((error) => {
          setStatus({ type: 'error', message: error.message || 'Could not sync your profile.' })
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  const handleModeChange = (nextMode) => {
    resetStatus()
    navigateWithTransition(navigate, nextMode === 'signup'
      ? '/signup'
      : nextMode === 'forgot'
        ? '/forgot-pass'
        : nextMode === 'reset'
          ? '/reset-password'
        : '/login',
      'fade')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    resetStatus()
    setIsSubmitting(true)

    try {
      const email = form.email.trim().toLowerCase()
      const username = form.username.trim()

      if (!email && (isSignup || isForgot || isVerify)) {
        throw new Error('Enter your email address.')
      }

      if (!username && !isSignup && !isForgot && !isVerify && !isReset) {
        throw new Error('Enter your username.')
      }

      if (isForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) throw error

        setStatus({
          type: 'success',
          message: 'If an account exists, a password reset email was sent.',
        })
        return
      }

      if (!form.password) {
        throw new Error(isReset ? 'Enter your new password.' : 'Enter your password.')
      }

      if (isReset) {
        if (form.password.length < 8) {
          throw new Error('Password must be at least 8 characters.')
        }

        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match.')
        }

        const { error } = await supabase.auth.updateUser({
          password: form.password,
        })

        if (error) throw error

        await supabase.auth.signOut()
        setForm((current) => ({ ...current, password: '', confirmPassword: '' }))
        setStatus({ type: 'success', message: 'Password updated. You can now log in.' })
        navigateWithTransition(navigate, '/login', 'fade')
        return
      }

      if (isSignup) {
        if (!username) {
          throw new Error('Choose a username.')
        }

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
            emailRedirectTo: confirmationRedirectTo(),
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

        if (!data.user) {
          throw new Error('Supabase did not return a new account. Try again in a moment.')
        }

        if (Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          throw new Error('An account with this email already exists. Try logging in or use reset password.')
        }

        if (data.session && data.user) {
          await upsertUserProfile(data.user, form.username)
          localStorage.removeItem('wuwa_verification_email')
          setStatus({ type: 'success', message: 'Account created. You are already signed in.' })
          navigateWithTransition(navigate, '/profile', 'fade')
          setForm((current) => ({ ...current, password: '', confirmPassword: '', verificationCode: '' }))
          return
        }

        localStorage.setItem('wuwa_verification_email', email)
        setVerificationEmail(email)
        setStatus({ type: 'success', message: 'Account created. Check your email and click the confirmation link.' })
        navigateWithTransition(navigate, '/verify-email', 'fade')
        setForm((current) => ({ ...current, password: '', confirmPassword: '', verificationCode: '' }))
        return
      }

      const loginEmail = await getEmailForUsername(username)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: form.password,
      })

      if (error) {
        if (error.message?.toLowerCase().includes('email not confirmed')) {
          await resendSignupConfirmation(loginEmail)
          localStorage.setItem('wuwa_verification_email', loginEmail)
          setVerificationEmail(loginEmail)
          setStatus({ type: 'error', message: 'Please verify your email first. A new confirmation link was sent.' })
          navigateWithTransition(navigate, '/verify-email', 'fade')
          return
        }

        throw error
      }

      if (!data.user.email_confirmed_at) {
        localStorage.setItem('wuwa_verification_email', loginEmail)
        setVerificationEmail(loginEmail)
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
            {isForgot || isSignup || isVerify || isReset ? (
              isReset ? 'New Password' : isVerify ? 'Verify Email' : isForgot ? 'Reset Password' : 'Create Account'
            ) : (
              <button
                type="button"
                className="sonoro-brand"
                onClick={() => navigateWithTransition(navigate, '/home', 'fade')}
              >
                <AnimatedLogo className="sonoro-logo" />
                <span>Sonoro</span>
              </button>
            )}
          </h1>

          {!isReset && (
            <label>
              <span>{isSignup || isForgot || isVerify ? 'Email' : 'Username'}</span>
              {isSignup || isForgot || isVerify ? (
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  autoComplete="email"
                  readOnly={isVerify && Boolean(verificationEmail)}
                  required
                />
              ) : (
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={updateField}
                  autoComplete="username"
                  required
                />
              )}
            </label>
          )}

          {isSignup && (
            <label>
              <span>Username</span>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={updateField}
                autoComplete="username"
                required
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
              <span>{isReset ? 'New Password' : 'Password'}</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={updateField}
                autoComplete={isSignup || isReset ? 'new-password' : 'current-password'}
                required
              />
            </label>
          )}

          {(isSignup || isReset) && (
            <label>
              <span>{isReset ? 'Confirm New Password' : 'Confirm Password'}</span>
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
              {isSubmitting ? 'Please wait...' : isReset ? 'Update Password' : isForgot ? 'Find Account' : isSignup ? 'Create Account' : 'Login'}
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

                  await resendSignupConfirmation(email)
                  localStorage.setItem('wuwa_verification_email', email)
                  setVerificationEmail(email)
                  setStatus({ type: 'success', message: 'A new confirmation link was sent.' })
                } catch (error) {
                  setStatus({ type: 'error', message: error.message || 'Could not resend the confirmation link.' })
                } finally {
                  setIsSubmitting(false)
                }
              }}
            >
              Resend confirmation link
            </button>
          )}

          <button
            type="button"
            className="forgot-link"
            onClick={() => handleModeChange(isForgot || isVerify || isReset ? 'login' : 'forgot')}
          >
            {isForgot || isVerify || isReset ? 'Go to login' : 'Forgot password?'}
          </button>

          {!isForgot && !isVerify && !isReset && (
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
