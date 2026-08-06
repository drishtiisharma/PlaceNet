'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Shield, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from "@/components/ui/badge"
import TypewriterText from "@/components/animations/typewriter-text"

export function AuthView() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password rules validation
  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.")
        setIsLoading(false)
        return
      }
      if (!rules.length || !rules.upper || !rules.lower || !rules.number || !rules.special) {
        setError("Please satisfy all password requirements.")
        setIsLoading(false)
        return
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })
      if (signUpError) {
        setError(signUpError.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) {
        setError(signInError.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    }
    setIsLoading(false)
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-200/60 shadow-2xl shadow-gray-200/40 bg-white/95 backdrop-blur-sm sm:mx-auto">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start bg-gradient-to-b from-white via-white to-orange-50/30 p-12 lg:p-20 border-r border-gray-100 relative overflow-hidden">
        {/* Background Blur */}
        <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-100 blur-[120px] opacity-50 pointer-events-none" />

        <div className="relative z-10">
          <Badge
            variant="secondary"
            className="mb-6 rounded-full bg-orange-100 px-4 py-1 text-orange-600"
          >
            AI-Powered Placement & Recruitment
          </Badge>

          <h1 className="max-w-xl text-4xl font-bold tracking-tight lg:text-5xl text-black">
            <TypewriterText
              segments={[
                { text: "Find the right candidate." },
                {
                  text: "Faster. Smarter. Effortlessly.",
                  className: "mt-2 text-orange-500",
                  isBlock: true
                }
              ]}
            />
          </h1>
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12">
        {/* Segmented Toggle */}
        <div className="flex p-1 mb-8 bg-gray-100/80 rounded-lg w-full max-w-sm mx-auto">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Log In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Sign Up
          </button>
        </div>

        <div className="mb-8 text-center animate-in fade-in duration-300">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {isLogin ? 'Welcome to PlaceNet AI' : 'Create your PlaceNet AI account'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin
              ? 'Sign in to continue finding, ranking, and hiring the right candidates with AI.'
              : 'Join PlaceNet AI and start discovering, ranking, and hiring top talent with intelligent AI-powered recruitment.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300" key={isLogin ? 'login' : 'signup'}>
          {!isLogin && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white/50"
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/50"
              placeholder="johndoe@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {isLogin && (
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-orange-600 hover:text-orange-500 hover:underline underline-offset-4"
                >
                  Forgot your password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-5">
              {/* Password Rules */}
              <div className="text-sm space-y-1.5 p-3 rounded-md bg-gray-50/80 border border-gray-100">
                <div className="flex items-center gap-2">
                  {rules.length ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-gray-300" />}
                  <span className={rules.length ? "text-gray-700" : "text-gray-400"}>Minimum 8 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  {rules.upper ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-gray-300" />}
                  <span className={rules.upper ? "text-gray-700" : "text-gray-400"}>Uppercase letter</span>
                </div>
                <div className="flex items-center gap-2">
                  {rules.lower ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-gray-300" />}
                  <span className={rules.lower ? "text-gray-700" : "text-gray-400"}>Lowercase letter</span>
                </div>
                <div className="flex items-center gap-2">
                  {rules.number ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-gray-300" />}
                  <span className={rules.number ? "text-gray-700" : "text-gray-400"}>Number</span>
                </div>
                <div className="flex items-center gap-2">
                  {rules.special ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-gray-300" />}
                  <span className={rules.special ? "text-gray-700" : "text-gray-400"}>Special character</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={isLoading}>
            {isLoading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Log In' : 'Sign Up')}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">OR</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 border-gray-200"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {isLogin ? 'Log In with Google' : 'Sign Up with Google'}
          </Button>
        </form>
      </div>
    </div>
  )
}
