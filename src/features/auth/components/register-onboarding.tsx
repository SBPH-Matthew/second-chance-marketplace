'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Role = 'BUYER' | 'SELLER'
type AuthFlow = 'entry' | 'signin' | 'signup'

type RegisterOnboardingDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const buyerSellerGoals = [
  'Find great local deals',
  'Sell unused items faster',
  'Negotiate safely in chat',
  'Build a trusted seller profile',
  'Source collectible items',
  'Upgrade gadgets affordably',
  'Reach more nearby buyers',
  'Manage listings efficiently',
]

const steps = [
  {
    title: 'Tell us about yourself',
    description: 'A few quick questions to personalize your buyer and seller journey.',
    bg: 'bg-[#f5d5aa]',
  },
  {
    title: 'What do you want to achieve?',
    description: 'Select all that apply. This helps tailor listings, offers, and seller tools.',
    bg: 'bg-[#c7dcfb]',
  },
  {
    title: 'Link your accounts',
    description: 'Continue with Google/Facebook, or use personal email for manual registration.',
    bg: 'bg-[#f0c8e3]',
  },
] as const

export function RegisterOnboardingDialog({ open, onOpenChange }: RegisterOnboardingDialogProps) {
  const router = useRouter()
  const [authFlow, setAuthFlow] = useState<AuthFlow>('entry')

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<Role>('BUYER')
  const [goals, setGoals] = useState<string[]>([])
  const [email, setEmail] = useState('')

  const canGoNext = useMemo(() => {
    if (step === 0) {
      return (
        firstName.trim().length >= 2 &&
        lastName.trim().length >= 2 &&
        phone.trim().length >= 7 &&
        password.length >= 8 &&
        confirmPassword.length >= 8 &&
        password === confirmPassword
      )
    }

    if (step === 1) return goals.length > 0

    if (step === 2) return email.includes('@')

    return true
  }, [step, firstName, lastName, phone, password, confirmPassword, goals.length, email])

  function closeDialog() {
    onOpenChange(false)
    setAuthFlow('entry')
    setStep(0)
    setError('')
    setAlreadyRegistered(false)
    setLoginEmail('')
    setLoginPassword('')
    setLoginError('')
    setLoginLoading(false)
    setLoading(false)
  }

  function toggleGoal(goal: string) {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((item) => item !== goal) : [...prev, goal].slice(0, 8),
    )
  }

  async function submitLogin() {
    if (!loginEmail.includes('@') || loginPassword.length < 1) {
      setLoginError('Enter your email and password.')
      return
    }

    setLoginLoading(true)
    setLoginError('')

    const result = await signIn('credentials', {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
      callbackUrl: '/',
    })

    if (!result || result.error) {
      setLoginError('Unable to sign in. Please check your credentials.')
      setLoginLoading(false)
      return
    }

    closeDialog()
    router.push('/')
    router.refresh()
  }

  async function submitRegistration() {
    setLoading(true)
    setError('')
    setAlreadyRegistered(false)

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        password,
        confirmPassword,
        role,
        goals,
        email,
      }),
    })

    const payload = (await response.json()) as
      | { message?: string; code?: string; error?: string }
      | { error?: { fieldErrors?: Record<string, string[]> } }

    if (!response.ok) {
      if ('code' in payload && payload.code === 'ALREADY_REGISTERED') {
        setAlreadyRegistered(true)
        setError('This email is already registered. Please sign in instead.')
      } else if ('error' in payload && typeof payload.error === 'string') {
        setError(payload.error)
      } else {
        setError('Unable to complete registration. Please review your details.')
      }
      setLoading(false)
      return
    }

    closeDialog()
    router.push('/')
  }

  if (!open) return null

  if (authFlow === 'entry') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-black">Welcome to Second Chance</h1>
          <p className="mt-2 text-gray-600">Are you already registered?</p>
          <div className="mt-6 space-y-3">
            <Button className="w-full" onClick={() => setAuthFlow('signin')}>
              Yes, I already have an account
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setAuthFlow('signup')}>
              No, create my account
            </Button>
            <button onClick={closeDialog} className="w-full text-sm text-gray-600 underline">
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (authFlow === 'signin') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-2xl">
          <button className="text-sm text-gray-700" onClick={() => setAuthFlow('entry')}>
            &lt; Back
          </button>
          <h1 className="mt-4 text-3xl font-bold text-black">Sign in</h1>
          <p className="mt-2 text-gray-600">Continue buying, selling, and managing offers.</p>

          {loginError && (
            <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{loginError}</div>
          )}

          <div className="mt-4 space-y-3">
            <Input
              type="email"
              placeholder="you@example.com"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
            />
            <Button className="w-full" onClick={submitLogin} disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>

          <div className="my-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={() => signIn('google', { callbackUrl: '/' })}>
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full" onClick={() => signIn('facebook', { callbackUrl: '/' })}>
              Continue with Facebook
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-5xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
        <div className="grid min-h-[640px] md:grid-cols-[1fr,1.2fr]">
          <section className="flex flex-col p-8 md:p-10">
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                {step > 0 ? (
                  <button className="text-sm text-gray-700" onClick={() => setStep((value) => value - 1)}>
                    &lt; Back
                  </button>
                ) : (
                  <button className="text-sm text-gray-700" onClick={() => setAuthFlow('entry')}>
                    &lt; Back
                  </button>
                )}
                <button className="text-sm text-gray-600 underline" onClick={closeDialog}>
                  Close
                </button>
              </div>
              <h1 className="text-5xl font-extrabold leading-tight text-black">{steps[step].title}</h1>
              <p className="mt-4 text-2xl text-gray-600">{steps[step].description}</p>
            </div>

            {alreadyRegistered && (
              <div className="mb-5 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                This email is already registered. Use sign in instead.
              </div>
            )}

            {error && <div className="mb-5 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="mt-auto space-y-4">
              {step < 2 ? (
                <Button onClick={() => setStep((value) => value + 1)} disabled={!canGoNext} className="w-full">
                  Next
                </Button>
              ) : (
                <Button onClick={submitRegistration} disabled={loading || !canGoNext} className="w-full">
                  {loading ? 'Creating account...' : 'Create with personal email'}
                </Button>
              )}

              <div className="flex justify-center gap-2">
                {steps.map((_, index) => (
                  <span
                    key={`step-${index}`}
                    className={`h-2.5 w-2.5 rounded-full ${index <= step ? 'bg-black' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className={`${steps[step].bg} p-8 md:p-10`}>
            {step === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-black">First Name</label>
                    <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Alex" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-black">Last Name</label>
                    <Input value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Morgan" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-black">Phone Number</label>
                    <Input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="+63 912 345 6789"
                      type="tel"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-black">Password</label>
                    <Input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
                      type="password"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-black">Confirm Password</label>
                    <Input
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Re-enter password"
                      type="password"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black">I am primarily here to:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      className={`rounded-full px-4 py-2 text-sm font-medium ${role === 'BUYER' ? 'bg-black text-white' : 'bg-white/70 text-black'}`}
                      onClick={() => setRole('BUYER')}
                    >
                      Buy items
                    </button>
                    <button
                      className={`rounded-full px-4 py-2 text-sm font-medium ${role === 'SELLER' ? 'bg-black text-white' : 'bg-white/70 text-black'}`}
                      onClick={() => setRole('SELLER')}
                    >
                      Sell items
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {buyerSellerGoals.map((goal) => {
                  const active = goals.includes(goal)
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`rounded-full px-4 py-3 text-left text-sm transition ${active ? 'bg-white text-black shadow-sm' : 'bg-white/45 text-gray-800 hover:bg-white/65'}`}
                    >
                      {active ? '✓ ' : ''}
                      {goal}
                    </button>
                  )
                })}
              </div>
            )}

            {step === 2 && (
              <div className="flex h-full items-center">
                <div className="mx-auto w-full max-w-md space-y-5">
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full bg-white"
                      onClick={() => signIn('google', { callbackUrl: '/' })}
                    >
                      Continue with Google
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-white"
                      onClick={() => signIn('facebook', { callbackUrl: '/' })}
                    >
                      Continue with Facebook
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-black/25" />
                    <span className="text-xs font-medium uppercase tracking-wide text-black/60">
                      Prefer email? Use personal email
                    </span>
                    <div className="h-px flex-1 bg-black/25" />
                  </div>

                  <div className="rounded-lg bg-white/70 p-4">
                    <label className="mb-1 block text-sm font-medium text-black">Use personal email</label>
                    <Input
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        setAlreadyRegistered(false)
                      }}
                      placeholder="you@example.com"
                      type="email"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
