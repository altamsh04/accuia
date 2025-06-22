"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, Sparkles } from "lucide-react"

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: formData.get("firstName") as string,
            last_name: formData.get("lastName") as string,
            full_name: `${formData.get("firstName")} ${formData.get("lastName")}`,
          },
        },
      })

      if (error) throw error
      setSuccess(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#141B22] to-[#0B0F14] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#141B22]/80 border-[#0AF395]/20 backdrop-blur-xl shadow-2xl">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0AF395] to-[#0AF395]/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-[#0B2420]" />
            </div>
            <h2 className="text-xl font-semibold text-[#FCFEFF] mb-3">Account created successfully!</h2>
            <p className="text-sm text-[#FCFEFF]/60 mb-8 leading-relaxed">
              Your account has been created and you can now start exploring intelligent data access.
            </p>
            <Button
              asChild
              className="w-full bg-[#0AF395] text-[#0B2420] hover:bg-[#0AF395]/80 hover:text-[#0B2420] h-11 transition-all duration-200"
            >
              <Link href="/login">Continue to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#141B22] to-[#0B0F14] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-[#0B2420]/50 text-[#0AF395] border-[#0AF395]/20 text-xs px-3 py-1 mb-4 hover:bg-[#0AF395]/15 hover:border-[#0AF395]/60 hover:text-[#0AF395] transition-all duration-200">
            <Sparkles className="w-3 h-3 mr-1" />
            Start Your Journey
          </Badge>
        </div>

        {/* Signup Card */}
        <Card className="bg-[#141B22]/80 border-[#0AF395]/20 backdrop-blur-xl shadow-2xl hover:border-[#0AF395]/40 transition-all duration-300">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-xl font-semibold text-center text-[#FCFEFF] tracking-tight">
              Create your account
            </CardTitle>
            <CardDescription className="text-center text-sm text-[#FCFEFF]/60">
              Join thousands of teams using intelligent data access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailSignUp} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-[#FCFEFF]/80">
                    First name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#FCFEFF]/40" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      required
                      disabled={loading}
                      className="pl-10 bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 focus:border-[#0AF395]/50 focus:ring-[#0AF395]/20 text-sm h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-[#FCFEFF]/80">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                    disabled={loading}
                    className="bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 focus:border-[#0AF395]/50 focus:ring-[#0AF395]/20 text-sm h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#FCFEFF]/80">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#FCFEFF]/40" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    required
                    disabled={loading}
                    className="pl-10 bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 focus:border-[#0AF395]/50 focus:ring-[#0AF395]/20 text-sm h-11"
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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="At least 6 characters"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#FCFEFF]/80">
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#FCFEFF]/40" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                    className="pl-10 pr-10 bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 focus:border-[#0AF395]/50 focus:ring-[#0AF395]/20 text-sm h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FCFEFF]/40 hover:text-[#FCFEFF]/60 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  required
                  disabled={loading}
                  className="border-[#0AF395]/30 data-[state=checked]:bg-[#0AF395] data-[state=checked]:border-[#0AF395] mt-1"
                />
                <Label htmlFor="terms" className="text-xs text-[#FCFEFF]/70 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#0AF395] hover:text-[#0AF395]/80 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#0AF395] hover:text-[#0AF395]/80 transition-colors">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0AF395] text-[#0B2420] hover:bg-[#0AF395]/80 hover:text-[#0B2420] font-medium text-sm h-11 transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-[#0B2420]/30 border-t-[#0B2420] rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#0AF395]/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#141B22] px-3 text-[#FCFEFF]/40 tracking-wider">Already have an account?</span>
              </div>
            </div>

            <div className="text-center">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full border-[#0AF395]/30 text-[#0AF395] hover:bg-[#0AF395]/15 hover:border-[#0AF395]/60 hover:text-[#0AF395] text-sm h-11 transition-all duration-200"
                >
                  Sign in instead
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-[#FCFEFF]/40">Join 500+ teams already using intelligent data access</p>
        </div>
      </div>
    </div>
  )
}
