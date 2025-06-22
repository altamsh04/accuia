"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#141B22] to-[#0B0F14] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-[#0B2420]/50 text-[#0AF395] border-[#0AF395]/20 text-xs px-3 py-1 mb-4">
            <Lock className="w-3 h-3 mr-1" />
            Secure Access
          </Badge>
        </div>

        {/* Login Card */}
        <Card className="bg-[#141B22]/80 border-[#0AF395]/20 backdrop-blur-xl shadow-2xl hover:border-[#0AF395]/40 transition-all duration-300">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-xl font-semibold text-center text-[#FCFEFF] tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-sm text-[#FCFEFF]/60">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailSignIn} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#FCFEFF]/80">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#FCFEFF]/40" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    disabled={loading}
                    className="pl-10 bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 focus:border-[#0AF395]/50 focus:ring-[#0AF395]/20 text-sm h-11 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#FCFEFF]/80">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#FCFEFF]/40" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    className="pl-10 pr-10 bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 focus:border-[#0AF395]/50 focus:ring-[#0AF395]/20 text-sm h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FCFEFF]/40 hover:text-[#FCFEFF]/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0AF395] text-[#0B2420] hover:bg-[#0AF395]/80 hover:text-[#0B2420] font-medium text-sm h-11 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-[#0B2420]/30 border-t-[#0B2420] rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#0AF395]/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#141B22] px-3 text-[#FCFEFF]/40 tracking-wider">New user?</span>
              </div>
            </div>

            <div className="text-center">
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="w-full border-[#0AF395]/30 text-[#0AF395] hover:bg-[#0AF395]/15 hover:border-[#0AF395]/60 hover:text-[#0AF395] text-sm h-11 transition-all duration-200"
                >
                  Create an account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-[#FCFEFF]/40">Protected by enterprise-grade security</p>
        </div>
      </div>
    </div>
  )
}
