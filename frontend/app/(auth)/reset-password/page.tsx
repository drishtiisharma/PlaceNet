'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Password updated successfully. Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
    setIsLoading(false)
  }

  return (
    <div className="w-full sm:mx-auto sm:max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="w-full border-gray-200/60 shadow-xl shadow-gray-200/20 backdrop-blur-sm bg-white/95 py-6 px-2">
        <CardHeader className="space-y-3">
          <CardTitle className="text-4xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-lg text-center">
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-6 mt-4">
            <div className="space-y-3">
              <Label htmlFor="password" className="text-lg">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="text-lg py-6 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-base text-red-500">{error}</p>}
            {message && <p className="text-base text-green-500">{message}</p>}
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-6 mt-4" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
