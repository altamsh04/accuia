"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Database, Brain, Loader2, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { encrypt } from "@/lib/encryption"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

const GEMINI_MODELS = [
  { value: "gemini-2.0-flash-exp", label: "Gemini 2.0 Flash Experimental" },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
  { value: "gemini-1.5-flash-8b", label: "Gemini 1.5 Flash 8B" },
]

interface AddProjectDialogProps {
  onProjectAdded?: () => void
}

export function AddProjectDialog({ onProjectAdded }: AddProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"form" | "creating" | "success">("form")
  const router = useRouter()

  const resetForm = () => {
    setStep("form")
    setError(null)
    setLoading(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      setOpen(newOpen)
      if (!newOpen) {
        resetForm()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const projectData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      dbUser: formData.get("dbUser") as string,
      dbPassword: formData.get("dbPassword") as string,
      dbHost: formData.get("dbHost") as string,
      dbPort: formData.get("dbPort") as string,
      dbName: formData.get("dbName") as string,
      tableName: formData.get("tableName") as string,
      geminiApiKey: formData.get("geminiApiKey") as string,
      geminiModel: formData.get("geminiModel") as string,
    }

    // Validate required fields
    const requiredFields = [
      "name",
      "dbUser",
      "dbPassword",
      "dbHost",
      "dbPort",
      "dbName",
      "tableName",
      "geminiApiKey",
      "geminiModel",
    ]

    for (const field of requiredFields) {
      if (!projectData[field as keyof typeof projectData]) {
        setError(`Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()} field`)
        return
      }
    }

    try {
      setLoading(true)
      setError(null)
      setStep("creating")

      // Get current user (using cached session)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error("User not authenticated. Please sign in again.")
      }

      // Step 1: Test database connection and fetch context
      console.log("Fetching database context...")
      const dbContextResponse = await fetch("/api/db-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: projectData.dbUser,
          password: projectData.dbPassword,
          host: projectData.dbHost,
          port: projectData.dbPort, // keep as string
          dbname: projectData.dbName,
          table: projectData.tableName,
        }),
      })

      if (!dbContextResponse.ok) {
        const errorText = await dbContextResponse.text()
        throw new Error(`Database connection failed: ${errorText || dbContextResponse.statusText}`)
      }

      const dbContext = await dbContextResponse.json()
      console.log("Database context fetched successfully")

      // Step 2: Add default 'allow: true' to all columns
      if (dbContext.columns && Array.isArray(dbContext.columns)) {
        dbContext.columns = dbContext.columns.map((column) => ({
          ...column,
          allow: column.allow !== undefined ? column.allow : true, // Default to true
        }))
      }

      // Step 2: Encrypt sensitive data
      console.log("Encrypting sensitive data...")
      const encryptedData = {
        encrypted_db_user: encrypt(projectData.dbUser),
        encrypted_db_password: encrypt(projectData.dbPassword),
        encrypted_db_host: encrypt(projectData.dbHost),
        encrypted_db_port: encrypt(projectData.dbPort),
        encrypted_db_name: encrypt(projectData.dbName),
        encrypted_table_name: encrypt(projectData.tableName),
        encrypted_gemini_api_key: encrypt(projectData.geminiApiKey),
      }

      // Step 3: Insert project into database
      console.log("Creating project in database...")
      const { data: project, error: insertError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: projectData.name,
          description: projectData.description || null,
          ...encryptedData,
          gemini_model: projectData.geminiModel,
          db_context: dbContext,
        })
        .select()
        .single()

      if (insertError) {
        console.error("Database insert error:", insertError)
        throw new Error(`Failed to save project: ${insertError.message}`)
      }

      console.log("Project created successfully:", project.id)
      setStep("success")

      // Wait a moment before closing and navigating
      setTimeout(() => {
        setOpen(false)
        onProjectAdded?.()
        router.push(`/dashboard/projects/${project.id}/chat`)
      }, 1500)
    } catch (error: any) {
      console.error("Error creating project:", error)
      setError(error.message || "Failed to create project")
      setStep("form")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Card className="bg-transparent border-2 border-dashed border-[#0AF395]/30 hover:border-[#0AF395]/50 transition-all duration-300 cursor-pointer group hover:scale-105">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
            <div className="w-12 h-12 bg-[#0AF395]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0AF395]/30 transition-colors">
              <Plus className="w-6 h-6 text-[#0AF395]" />
            </div>
            <h3 className="text-lg font-semibold text-[#FCFEFF] mb-2">Add New Project</h3>
            <p className="text-sm text-[#FCFEFF]/60">Connect your database and start chatting with your data</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-[#141B22] border-[#0AF395]/20 text-[#FCFEFF] max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === "creating"
              ? "Creating Project..."
              : step === "success"
                ? "Project Created!"
                : "Create New Project"}
          </DialogTitle>
          <DialogDescription className="text-[#FCFEFF]/60">
            {step === "creating"
              ? "Please wait while we set up your project"
              : step === "success"
                ? "Your project has been created successfully"
                : "Connect your PostgreSQL database and configure AI settings"}
          </DialogDescription>
        </DialogHeader>

        {step === "creating" && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-[#0AF395] animate-spin mb-4" />
            <p className="text-sm text-[#FCFEFF]/60">Setting up your intelligent database connection...</p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-[#0AF395]/20 rounded-full flex items-center justify-center mb-4">
              <Database className="w-8 h-8 text-[#0AF395]" />
            </div>
            <p className="text-sm text-[#FCFEFF]/60">Redirecting to your project chat...</p>
          </div>
        )}

        {step === "form" && (
          <>
            {error && (
              <Alert className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-[#0AF395] flex items-center">
                  <Database className="w-4 h-4 mr-2" />
                  Project Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-[#FCFEFF]/80">
                      Project Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="My E-commerce Database"
                      required
                      disabled={loading}
                      className="bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 focus:border-[#0AF395]/50 focus:ring-[#0AF395]/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-[#FCFEFF]/80">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Brief description of your project..."
                      disabled={loading}
                      className="bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40"
                    />
                  </div>
                </div>
              </div>

              {/* Database Configuration */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-[#0AF395] flex items-center">
                  <Database className="w-4 h-4 mr-2" />
                  PostgreSQL Database Configuration
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dbHost" className="text-sm font-medium text-[#FCFEFF]/80">
                      Host *
                    </Label>
                    <Input
                      id="dbHost"
                      name="dbHost"
                      placeholder="db.example.supabase.co"
                      required
                      disabled={loading}
                      className="bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 focus:border-[#0AF395]/50 focus:ring-[#0AF395]/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dbPort" className="text-sm font-medium text-[#FCFEFF]/80">
                      Port *
                    </Label>
                    <Input
                      id="dbPort"
                      name="dbPort"
                      placeholder="5432"
                      required
                      disabled={loading}
                      className="bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 focus:border-[#0AF395]/50 focus:ring-[#0AF395]/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dbName" className="text-sm font-medium text-[#FCFEFF]/80">
                      Database Name *
                    </Label>
                    <Input
                      id="dbName"
                      name="dbName"
                      placeholder="postgres"
                      required
                      disabled={loading}
                      className="bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 focus:border-[#0AF395]/50 focus:ring-[#0AF395]/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tableName" className="text-sm font-medium text-[#FCFEFF]/80">
                      Table Name *
                    </Label>
                    <Input
                      id="tableName"
                      name="tableName"
                      placeholder="products"
                      required
                      disabled={loading}
                      className="bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 focus:border-[#0AF395]/50 focus:ring-[#0AF395]/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dbUser" className="text-sm font-medium text-[#FCFEFF]/80">
                      Username *
                    </Label>
                    <Input
                      id="dbUser"
                      name="dbUser"
                      placeholder="postgres"
                      required
                      disabled={loading}
                      className="bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 focus:border-[#0AF395]/50 focus:ring-[#0AF395]/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dbPassword" className="text-sm font-medium text-[#FCFEFF]/80">
                      Password *
                    </Label>
                    <Input
                      id="dbPassword"
                      name="dbPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      className="bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 focus:border-[#0AF395]/50 focus:ring-[#0AF395]/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* AI Configuration */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-[#0AF395] flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Configuration
                </h3>
                <div>
                  <Label htmlFor="geminiApiKey" className="text-sm font-medium text-[#FCFEFF]/80">
                    Gemini API Key *
                  </Label>
                  <Input
                    id="geminiApiKey"
                    name="geminiApiKey"
                    type="password"
                    placeholder="AIza..."
                    required
                    disabled={loading}
                    className="bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 focus:border-[#0AF395]/50 focus:ring-[#0AF395]/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="geminiModel" className="text-sm font-medium text-[#FCFEFF]/80">
                    Gemini Model *
                  </Label>
                  <Select name="geminiModel" required disabled={loading}>
                    <SelectTrigger className="bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF]">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#141B22] border-[#0AF395]/20">
                      {GEMINI_MODELS.map((model) => (
                        <SelectItem
                          key={model.value}
                          value={model.value}
                          className="text-[#FCFEFF] focus:bg-[#0AF395]/20"
                        >
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="border-[#0AF395]/30 text-[#0AF395] hover:bg-[#0AF395]/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0AF395] text-[#0B2420] hover:bg-[#0AF395]/90 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
