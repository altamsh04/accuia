"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Bot,
  LogOut,
  User,
  Mail,
  CalendarIcon,
  Shield,
  Settings,
  Database,
  Folder,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react"
import { AddProjectDialog } from "@/components/add-project-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)

      if (!user) {
        router.push("/login")
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
        router.push("/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase.auth])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, description, created_at, gemini_model")
        .order("created_at", { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoadingProjects(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProjects()
    }
  }, [user])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#141B22] to-[#0B0F14] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-[#0AF395]/30 border-t-[#0AF395] rounded-full animate-spin"></div>
          <span className="text-sm text-[#FCFEFF]/60">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const fullName =
    user.user_metadata?.full_name ||
    `${user.user_metadata?.first_name || ""} ${user.user_metadata?.last_name || ""}`.trim() ||
    user.email?.split("@")[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#141B22] to-[#0B0F14]">
      {/* Header */}
      <div className="border-b border-[#0AF395]/10 bg-[#141B22]/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-3 sm:gap-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0AF395] to-[#0AF395]/80 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#0B2420]" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[#FCFEFF] tracking-tight">Dashboard</h1>
                <p className="text-xs text-[#FCFEFF]/50">Welcome back, {user.user_metadata?.first_name || "User"}</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-[#0AF395]/30 text-[#0AF395] hover:bg-[#0B2420]/60 hover:border-[#0AF395]/70 hover:text-[#0AF395] text-xs transition-all duration-200 w-full sm:w-auto"
            >
              <LogOut className="w-3 h-3 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#FCFEFF]">Your Projects</h2>
              <p className="text-sm text-[#FCFEFF]/60">Manage your database connections and AI chat interfaces</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Add New Project Card */}
            <AddProjectDialog onProjectAdded={fetchProjects} />

            {/* Existing Projects */}
            {loadingProjects
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="bg-[#141B22]/50 border-[#0AF395]/20 backdrop-blur-sm animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-[#0AF395]/20 rounded mb-3"></div>
                      <div className="h-3 bg-[#0AF395]/10 rounded mb-2"></div>
                      <div className="h-3 bg-[#0AF395]/10 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
              : projects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-[#141B22]/50 border-[#0AF395]/20 backdrop-blur-sm hover:border-[#0AF395]/40 transition-all duration-300 group cursor-pointer hover:scale-105"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#0AF395]/20 rounded-lg flex items-center justify-center">
                            <Folder className="w-5 h-5 text-[#0AF395]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#FCFEFF] group-hover:text-[#0AF395] transition-colors">
                              {project.name}
                            </h3>
                            <p className="text-xs text-[#FCFEFF]/50">
                              {new Date(project.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-[#FCFEFF]/60 hover:text-[#0AF395] hover:bg-[#0AF395]/15 transition-all duration-200"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#141B22] border-[#0AF395]/20">
                            <DropdownMenuItem
                              className="text-[#FCFEFF] focus:bg-[#0AF395]/15 focus:text-[#0AF395] transition-all duration-200"
                              onClick={() => router.push(`/dashboard/projects/${project.id}/chat`)}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Open Chat
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 focus:bg-red-500/20 focus:text-red-300 transition-all duration-200">
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {project.description && (
                        <p className="text-sm text-[#FCFEFF]/70 mb-4 line-clamp-2">{project.description}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <Badge className="bg-[#0B2420]/50 text-[#0AF395] border-[#0AF395]/30 text-xs hover:bg-[#0AF395]/15 hover:border-[#0AF395]/60 hover:text-[#0AF395] transition-all duration-200">
                          {project.gemini_model}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#0AF395] hover:bg-[#0AF395]/15 hover:text-[#0AF395] text-xs h-7 transition-all duration-200"
                          onClick={() => router.push(`/dashboard/projects/${project.id}/chat`)}
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>

        {/* Original Profile Cards - moved below projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Profile Card */}
          <Card className="bg-[#141B22]/50 border-[#0AF395]/20 backdrop-blur-sm hover:border-[#0AF395]/40 transition-all duration-300 group cursor-pointer hover:scale-105">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-sm font-medium text-[#FCFEFF]">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-[#0AF395] text-[#0B2420] text-xs font-semibold">
                    {getInitials(fullName)}
                  </AvatarFallback>
                </Avatar>
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-[#0AF395]" />
                <div>
                  <p className="text-xs text-[#FCFEFF]/50">Full Name</p>
                  <p className="text-sm font-medium text-[#FCFEFF]">{fullName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#0AF395]" />
                <div>
                  <p className="text-xs text-[#FCFEFF]/50">Email</p>
                  <p className="text-sm font-medium text-[#FCFEFF]">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-4 h-4 text-[#0AF395]" />
                <div>
                  <p className="text-xs text-[#FCFEFF]/50">Member Since</p>
                  <p className="text-sm font-medium text-[#FCFEFF]">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="bg-[#141B22]/50 border-[#0AF395]/20 backdrop-blur-sm hover:border-[#0AF395]/40 transition-all duration-300 group cursor-pointer hover:scale-105">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-sm font-medium text-[#FCFEFF]">
                <Shield className="w-4 h-4 text-[#0AF395]" />
                <span>Account Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#FCFEFF]/60">Email Verification</span>
                {user.email_confirmed_at ? (
                  <Badge className="bg-[#0AF395]/20 text-[#0AF395] border-[#0AF395]/30 text-xs px-2 py-1">
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs px-2 py-1">
                    Pending
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#FCFEFF]/60">Account Type</span>
                <Badge className="bg-[#0B2420]/50 text-[#0AF395] border-[#0AF395]/30 text-xs px-2 py-1">
                  Free Plan
                </Badge>
              </div>
              <div>
                <p className="text-xs text-[#FCFEFF]/50 mb-1">Last Sign In</p>
                <p className="text-sm text-[#FCFEFF]">
                  {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "First time"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-[#141B22]/50 border-[#0AF395]/20 backdrop-blur-sm hover:border-[#0AF395]/40 transition-all duration-300 group cursor-pointer hover:scale-105">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-sm font-medium text-[#FCFEFF]">
                <Settings className="w-4 h-4 text-[#0AF395]" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-[#0AF395]/20 text-[#FCFEFF]/80 bg-[#141B22] hover:bg-[#0AF395]/15 hover:border-[#0AF395]/60 hover:text-[#0AF395] text-xs h-9 transition-all duration-200"
              >
                <User className="w-3 h-3 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-[#0AF395]/20 text-[#FCFEFF]/80 bg-[#141B22] hover:bg-[#0AF395]/15 hover:border-[#0AF395]/60 hover:text-[#0AF395] text-xs h-9 transition-all duration-200"
              >
                <Shield className="w-3 h-3 mr-2" />
                Security Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-[#0AF395]/20 text-[#FCFEFF]/80 bg-[#141B22] hover:bg-[#0AF395]/15 hover:border-[#0AF395]/60 hover:text-[#0AF395] text-xs h-9 transition-all duration-200"
              >
                <Database className="w-3 h-3 mr-2" />
                Connect Database
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Section */}
        <Card className="mt-6 bg-[#141B22] border-[#0AF395]/20 backdrop-blur-sm hover:border-[#0AF395]/40 transition-all duration-300 hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[#0AF395] rounded-xl flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-[#0B2420]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#FCFEFF] mb-2">Ready to get started?</h3>
                <p className="text-sm text-[#FCFEFF]/70 mb-4 leading-relaxed">
                  Connect your PostgreSQL database and start chatting with your data using natural language. It only
                  takes a few minutes to set up.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="sm"
                    className="bg-[#0AF395] text-[#0B2420] hover:bg-[#0AF395]/80 hover:text-[#0B2420] text-xs h-9 transition-all duration-200"
                  >
                    <Database className="w-3 h-3 mr-2" />
                    Connect Database
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#0AF395]/30 text-[#0B2420] hover:bg-[#0AF395]/15 hover:border-[#0AF395]/60 hover:text-[#0AF395] text-xs h-9 transition-all duration-200"
                  >
                    View Documentation
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
