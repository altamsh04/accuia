"use client"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem as SelectItemComponent,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"

import React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { decrypt } from "@/lib/encryption"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Database,
  Brain,
  MessageSquare,
  Loader2,
  Table,
  Eye,
  Hash,
  Type,
  Key,
  CheckCircle,
  XCircle,
  Lock,
  AlertCircle,
} from "lucide-react"

// Add these imports at the top
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Column {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
  character_maximum_length: number | null
  allow?: boolean // Add this property
}

interface DbContext {
  table_name: string
  columns: Column[]
  sample_data: Record<string, any>[]
}

// Add these interfaces after the existing interfaces
interface ChatMessage {
  id: string
  type: "user" | "assistant" | "results"
  content: string
  timestamp: Date
  queryResults?: any
}

interface CardSection {
  id: string
  name: string
  type: "title" | "subtitle" | "description" | "image" | "badge" | "metadata"
  column?: string
  enabled: boolean
  position: number
}

interface CardDesign {
  sections: CardSection[]
  layout: "compact" | "detailed" | "grid"
}

interface Project {
  id: string
  name: string
  description: string
  encrypted_db_user: string
  encrypted_db_password: string
  encrypted_db_host: string
  encrypted_db_port: string
  encrypted_db_name: string
  encrypted_table_name: string
  encrypted_gemini_api_key: string
  gemini_model: string
  db_context: DbContext
  card_design?: CardDesign
  created_at: string
}

// Add CardDesigner component before the ChatInterface component:
function CardDesigner({ project, onSave }: { project: Project; onSave: (design: CardDesign) => void }) {
  const [cardDesign, setCardDesign] = useState<CardDesign>(() => {
    // Load existing design or create default
    if (project.card_design) {
      return project.card_design
    }

    // Create default design based on available columns
    const availableColumns = project.db_context.columns.filter((col) => col.allow !== false)
    const defaultSections: CardSection[] = [
      { id: "title", name: "Title", type: "title", enabled: true, position: 0 },
      { id: "subtitle", name: "Subtitle", type: "subtitle", enabled: false, position: 1 },
      { id: "image", name: "Image", type: "image", enabled: true, position: 2 },
      { id: "description", name: "Description", type: "description", enabled: true, position: 3 },
      { id: "badge", name: "Badge", type: "badge", enabled: false, position: 4 },
      { id: "metadata", name: "Metadata", type: "metadata", enabled: true, position: 5 },
    ]

    // Auto-assign columns to sections
    const imageFields = ["image", "img", "picture", "photo", "thumbnail", "avatar", "cover"]
    const titleFields = ["name", "title", "product_name", "item_name"]
    const descriptionFields = ["description", "details", "summary", "content"]
    const priceFields = ["price", "cost", "amount"]

    defaultSections.forEach((section) => {
      if (section.type === "image") {
        section.column = availableColumns.find((col) =>
          imageFields.some((field) => col.column_name.toLowerCase().includes(field)),
        )?.column_name
      } else if (section.type === "title") {
        section.column =
          availableColumns.find((col) => titleFields.some((field) => col.column_name.toLowerCase().includes(field)))
            ?.column_name || availableColumns[0]?.column_name
      } else if (section.type === "description") {
        section.column = availableColumns.find((col) =>
          descriptionFields.some((field) => col.column_name.toLowerCase().includes(field)),
        )?.column_name
      } else if (section.type === "badge") {
        section.column = availableColumns.find((col) =>
          priceFields.some((field) => col.column_name.toLowerCase().includes(field)),
        )?.column_name
      }
    })

    return { sections: defaultSections, layout: "detailed" }
  })

  const availableColumns = project.db_context.columns.filter((col) => col.allow !== false)
  const sampleData = project.db_context.sample_data[0] || {}

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    setCardDesign((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (section.id === sectionId ? { ...section, enabled } : section)),
    }))
  }

  const handleColumnAssignment = (sectionId: string, columnName: string | undefined) => {
    setCardDesign((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, column: columnName } : section,
      ),
    }))
  }

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(cardDesign)
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving card design:", error)
    } finally {
      setIsSaving(false);
    }
  }

  const renderPreviewCard = () => {
    const enabledSections = cardDesign.sections
      .filter((section) => section.enabled && section.column)
      .sort((a, b) => a.position - b.position)

    return (
      <Card className="bg-[#0B0F14]/30 border-[#0AF395]/20 max-w-sm">
        <CardContent className="p-4">
          {enabledSections.map((section) => {
            const value = sampleData[section.column!]

            switch (section.type) {
              case "title":
                return (
                  <h3 key={section.id} className="text-lg font-semibold text-[#FCFEFF] mb-2">
                    {value || "Sample Title"}
                  </h3>
                )
              case "subtitle":
                return (
                  <p key={section.id} className="text-sm text-[#FCFEFF]/70 mb-2">
                    {value || "Sample Subtitle"}
                  </p>
                )
              case "image":
                return value ? (
                  <img
                    key={section.id}
                    src={value || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                ) : (
                  <div
                    key={section.id}
                    className="w-full h-32 bg-[#0AF395]/10 rounded-lg mb-3 flex items-center justify-center"
                  >
                    <span className="text-xs text-[#FCFEFF]/50">No Image</span>
                  </div>
                )
              case "description":
                return (
                  <p key={section.id} className="text-sm text-[#FCFEFF]/80 mb-3">
                    {typeof value === "string" && value.length > 100
                      ? `${value.substring(0, 100)}...`
                      : value || "Sample description text"}
                  </p>
                )
              case "badge":
                return (
                  <Badge key={section.id} className="bg-[#0AF395]/20 text-[#0AF395] mb-2">
                    {value || "Sample Badge"}
                  </Badge>
                )
              case "metadata":
                return (
                  <div key={section.id} className="text-xs text-[#FCFEFF]/50">
                    {section.column}: {value || "Sample Value"}
                  </div>
                )
              default:
                return null
            }
          })}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-[#FCFEFF]">Card Design Customization</h3>
        <Button
          onClick={handleSave}
          className="bg-[#0AF395] text-[#0B2420] hover:bg-[#0AF395]/90 transition-all duration-200 hover:scale-105"
          disabled={isSaving}
        >
          {isSaving ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
          ) : saved ? (
            "Saved"
          ) : (
            "Save Design"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-[#0AF395]">Card Sections</h4>

          {cardDesign.sections.map((section) => (
            <Card
              key={section.id}
              className="bg-[#141B22]/50 border-[#0AF395]/20 hover:border-[#0AF395]/40 transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={section.enabled}
                      onCheckedChange={(enabled) => handleSectionToggle(section.id, enabled)}
                      className="data-[state=checked]:bg-[#0AF395] data-[state=unchecked]:bg-[#FCFEFF]/20 transition-all duration-200"
                    />
                    <span className="text-sm font-medium text-[#FCFEFF]">{section.name}</span>
                  </div>
                  <Badge className="bg-[#0AF395]/20 text-[#0AF395] text-xs">{section.type}</Badge>
                </div>

                {section.enabled && (
                  <div>
                    <Label className="text-xs text-[#FCFEFF]/70 mb-2 block">Assign Column</Label>
                    <Select
                      /* use "none" when no column assigned */
                      value={section.column ?? "none"}
                      onValueChange={(value) =>
                        handleColumnAssignment(section.id, value === "none" ? undefined : value)
                      }
                    >
                      <SelectTrigger className="bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF]">
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#141B22] border-[#0AF395]/20">
                        {/* sentinel "none" – not an empty string */}
                        <SelectItemComponent value="none" className="text-[#FCFEFF]/50">
                          None
                        </SelectItemComponent>
                        {availableColumns.map((column) => (
                          <SelectItemComponent
                            key={column.column_name}
                            value={column.column_name}
                            className="text-[#FCFEFF] focus:bg-[#0AF395]/20"
                          >
                            {column.column_name} ({column.data_type})
                          </SelectItemComponent>
                        ))}
                      </SelectContent>
                    </Select>

                    {section.column && sampleData[section.column] && (
                      <div className="mt-2 p-2 bg-[#0AF395]/5 rounded text-xs">
                        <span className="text-[#FCFEFF]/50">Preview: </span>
                        <span className="text-[#FCFEFF] font-mono">
                          {typeof sampleData[section.column] === "string" && sampleData[section.column].length > 50
                            ? `${sampleData[section.column].substring(0, 50)}...`
                            : String(sampleData[section.column])}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-[#0AF395]">Live Preview</h4>
          <div className="flex justify-center">{renderPreviewCard()}</div>
          <div className="text-xs text-[#FCFEFF]/50 text-center">Preview uses sample data from your database</div>
        </div>
      </div>
    </div>
  )
}

// Add the ResultCard component
function ResultCard({
  data,
  index,
  cardDesign,
}: {
  data: Record<string, any>
  index: number
  cardDesign?: CardDesign
}) {
  // Use custom design if available, otherwise fall back to default behavior
  if (cardDesign) {
    const enabledSections = cardDesign.sections
      .filter((section) => section.enabled && section.column && data.hasOwnProperty(section.column))
      .sort((a, b) => a.position - b.position)

    return (
      <Card className="bg-[#0B0F14]/30 border-[#0AF395]/20 hover:border-[#0AF395]/40 transition-all duration-200">
        <CardContent className="p-4">
          {enabledSections.map((section) => {
            const value = data[section.column!]

            switch (section.type) {
              case "title":
                return (
                  <h3 key={section.id} className="text-lg font-semibold text-[#FCFEFF] mb-2">
                    {value}
                  </h3>
                )
              case "subtitle":
                return (
                  <p key={section.id} className="text-sm text-[#FCFEFF]/70 mb-2">
                    {value}
                  </p>
                )
              case "image":
                return value ? (
                  <img
                    key={section.id}
                    src={value || "/placeholder.svg"}
                    alt={`Result ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg mb-3 border border-[#0AF395]/10"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                ) : null
              case "description":
                return (
                  <p key={section.id} className="text-sm text-[#FCFEFF]/80 mb-3">
                    {typeof value === "string" && value.length > 150 ? `${value.substring(0, 150)}...` : value}
                  </p>
                )
              case "badge":
                return (
                  <Badge key={section.id} className="bg-[#0AF395]/20 text-[#0AF395] mb-2">
                    {value}
                  </Badge>
                )
              case "metadata":
                return (
                  <div key={section.id} className="text-xs text-[#FCFEFF]/50 mb-1">
                    <span className="font-mono text-[#0AF395]">{section.column}:</span> {value}
                  </div>
                )
              default:
                return null
            }
          })}
        </CardContent>
      </Card>
    )
  }

  // Default behavior (existing code)
  const imageFields = ["image", "img", "picture", "photo", "thumbnail", "avatar", "cover"]
  const imageField = Object.keys(data).find((key) =>
    imageFields.some((field) => key.toLowerCase().includes(field.toLowerCase())),
  )
  const imageUrl = imageField ? data[imageField] : null
  const otherData = Object.entries(data).filter(([key]) => key !== imageField)

  return (
    <Card className="bg-[#0B0F14]/30 border-[#0AF395]/20 hover:border-[#0AF395]/40 transition-all duration-200">
      <CardContent className="p-4">
        {imageUrl && (
          <div className="mb-4">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={`Result ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-[#0AF395]/10"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          </div>
        )}

        <div className="space-y-3">
          {otherData.map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#0AF395] capitalize">{key.replace(/_/g, " ")}</span>
                <span className="text-xs text-[#FCFEFF]/40">{typeof value}</span>
              </div>
              <div className="text-sm text-[#FCFEFF] bg-[#0B0F14]/50 p-2 rounded border border-[#0AF395]/5">
                {value === null ? (
                  <span className="text-[#FCFEFF]/40 italic">null</span>
                ) : typeof value === "string" && value.length > 100 ? (
                  <div>
                    <span className="font-mono">{value.substring(0, 100)}...</span>
                    <span className="text-xs text-[#FCFEFF]/50 ml-2">({value.length} chars)</span>
                  </div>
                ) : (
                  <span className="font-mono">{String(value)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Add the ChatInterface component before the main component
function ChatInterface({ project }: { project: Project }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatStarted, setChatStarted] = useState(false)

  const handleStartChat = () => {
    setChatStarted(true)
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "assistant",
      content: `Hello! I'm ready to help you query your ${project.db_context.table_name} database. You can ask me questions about your data in natural language, and I'll provide intelligent responses with results.`,
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Get current user ID from Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error("User not authenticated. Please sign in again.")
      }

      // Use the new smart_query API
      const smartQueryBody = {
        user_id: user.id,
        query: userMessage.content,
        role: "user"
      }

      console.log("Sending request to smart_query:", smartQueryBody)

      const response = await fetch("/api/smart-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(smartQueryBody),
      })

      if (!response.ok) {
        const errorText = (await response.text()) || `HTTP ${response.status}: smart_query failed`
        let userFriendlyMessage = ""

        try {
          // Try to parse the error response
          const errorData = JSON.parse(errorText)
          const backendError = errorData.error || errorText

          // Check for specific error patterns and provide helpful suggestions
          if (backendError.includes("No project found")) {
            userFriendlyMessage =
              "❌ No project found for your account.\n\n💡 Please create a project first or check your project settings."
          } else if (backendError.includes("Failed to decrypt")) {
            userFriendlyMessage =
              "🔐 Encryption Error: There's an issue with your project's encrypted credentials.\n\n💡 Please check your project configuration and try again."
          } else if (backendError.includes("Failed to generate SQL")) {
            userFriendlyMessage =
              "🤖 AI Error: The AI couldn't process your request.\n\n💡 Try:\n• Rephrasing your question\n• Being more specific\n• Using simpler language"
          } else if (backendError.includes("Invalid, please try again")) {
            userFriendlyMessage =
              "❌ Query Validation Failed: The generated query was invalid.\n\n💡 Try:\n• Asking a different question\n• Being more specific about what you want\n• Using column names from your schema"
          } else if (backendError.includes("Failed to execute SQL")) {
            userFriendlyMessage =
              "💾 Database Error: The query couldn't be executed.\n\n💡 This might be due to:\n• Invalid column names\n• Database connection issues\n• Permission problems"
          } else if (backendError.includes("timeout") || backendError.includes("Timeout")) {
            userFriendlyMessage =
              "⏱️ Request Timeout: The processing took too long.\n\n💡 Try:\n• Asking a simpler question\n• Being more specific\n• Checking your internet connection"
          } else {
            userFriendlyMessage =
              "❌ Something went wrong with your query.\n\n💡 Try:\n• Rephrasing your question\n• Using simpler language\n• Being more specific about what data you want"
          }
        } catch (parseError) {
          // If we can't parse the error, provide a generic helpful message
          userFriendlyMessage =
            "❌ Something went wrong with your query.\n\n💡 Try:\n• Rephrasing your question in simpler terms\n• Being more specific about what you want to find\n• Using column names from your schema"
        }

        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: userFriendlyMessage,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMsg])
        setIsLoading(false)
        return
      }

      const result = await response.json()

      if (!result.success) {
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: result.message || "Query failed. Please try again.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMsg])
        setIsLoading(false)
        return
      }

      // Create assistant message with results and summary
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "results",
        content: result.message || "Query completed successfully!",
        queryResults: {
          success: result.success,
          data: result.result,
          row_count: Array.isArray(result.result) ? result.result.length : 0
        },
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error processing message:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Error: ${error instanceof Error ? error.message : "Failed to process your request"}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!chatStarted) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#0AF395]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-[#0AF395]" />
          </div>
          <h3 className="text-lg font-semibold text-[#FCFEFF] mb-2">Ready to Chat with Your Data</h3>
          <p className="text-sm text-[#FCFEFF]/60 max-w-md mb-6">
            Start a conversation with your {project.db_context.table_name} database. Ask questions in natural language
            and get intelligent responses with results.
          </p>
          <Button onClick={handleStartChat} className="bg-[#0AF395] text-[#0B2420] hover:bg-[#0AF395]/90">
            <MessageSquare className="w-4 h-4 mr-2" />
            Start Chat
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[80%] lg:max-w-[70%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-[#0AF395] text-[#0B2420]"
                      : message.type === "results"
                        ? "bg-[#0B0F14]/50 text-[#FCFEFF] border border-green-500/20 w-full max-w-none"
                        : "bg-[#0B0F14]/50 text-[#FCFEFF] border border-[#0AF395]/20"
                  }`}
                >
                  {/* Message content */}
                  <div className="text-sm whitespace-pre-wrap break-words mb-3">{message.content}</div>

                  {/* Query Results display */}
                  {message.type === "results" && message.queryResults && message.queryResults.success && message.queryResults.data && (
                    <div className="mt-3">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-sm font-semibold text-green-400">
                            Results ({message.queryResults.row_count} records)
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                          {message.queryResults.data.map((item: any, index: number) => (
                            <ResultCard key={index} data={item} index={index} cardDesign={project.card_design} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className={`text-xs mt-2 ${message.type === "user" ? "text-[#0B2420]/70" : "text-[#FCFEFF]/50"}`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#0B0F14]/50 text-[#FCFEFF] border border-[#0AF395]/20 rounded-lg p-3 max-w-[85%] sm:max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#0AF395] flex-shrink-0" />
                    <span className="text-sm">Processing your query...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Floating Input Area - Sticky at bottom */}
      <div className="border-t border-[#0AF395]/20 bg-[#141B22]/95 backdrop-blur-sm p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your data..."
              disabled={isLoading}
              className="w-full bg-[#0B0F14]/50 border-[#0AF395]/20 text-[#FCFEFF] placeholder:text-[#FCFEFF]/40 resize-none min-h-[44px] sm:min-h-[48px]"
              rows={2}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-[#0AF395] text-[#0B2420] hover:bg-[#0AF395]/90 h-[44px] sm:h-[48px] px-4 sm:px-6 flex-shrink-0 self-end sm:self-auto"
          >
            <Send className="w-4 h-4" />
            <span className="ml-2 hidden sm:inline">Send</span>
          </Button>
        </div>
        <div className="text-xs text-[#FCFEFF]/50 mt-2">
          <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
          <span className="sm:hidden">Tap Send to submit your question</span>
        </div>
      </div>
    </div>
  )
}

export default function ProjectChatPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          router.push("/login")
          return
        }

        if (!params.id || typeof params.id !== 'string') {
          throw new Error("Invalid project ID")
        }

        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single()

        if (error) throw error
        if (!data) throw new Error("Project not found")

        setProject(data as unknown as Project)
      } catch (error: any) {
        console.error("Error fetching project:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id, router, supabase])

  const getDataTypeIcon = (dataType: string) => {
    if (dataType.includes("integer") || dataType.includes("numeric")) {
      return <Hash className="w-3 h-3 text-blue-400" />
    }
    if (dataType.includes("character") || dataType.includes("text")) {
      return <Type className="w-3 h-3 text-green-400" />
    }
    return <Database className="w-3 h-3 text-gray-400" />
  }

  const getDataTypeColor = (dataType: string) => {
    if (dataType.includes("integer") || dataType.includes("numeric")) {
      return "text-blue-400"
    }
    if (dataType.includes("character") || dataType.includes("text")) {
      return "text-green-400"
    }
    return "text-gray-400"
  }

  const handleColumnToggle = async (columnName: string, newValue: boolean) => {
    if (!project?.db_context) return

    // Check if disabling this column would result in less than 3 enabled columns
    if (!newValue) {
      const currentEnabledCount = project.db_context.columns.filter((col) => col.allow !== false).length
      if (currentEnabledCount <= 3) {
        // Don't allow disabling if it would result in less than 3 enabled columns
        return
      }
    }

    try {
      // Update the local state first for immediate UI feedback
      const updatedColumns = project.db_context.columns.map((col) =>
        col.column_name === columnName ? { ...col, allow: newValue } : col,
      )

      const updatedDbContext = {
        ...project.db_context,
        columns: updatedColumns,
      }

      // Update the project state
      setProject((prev) => (prev ? { ...prev, db_context: updatedDbContext } : null))

      // Update the database
      const { error } = await supabase.from("projects").update({ db_context: updatedDbContext }).eq("id", project.id)

      if (error) {
        console.error("Error updating column settings:", error)
        // Revert the local state if database update fails
        setProject((prev) => (prev ? { ...prev, db_context: project.db_context } : null))
      }
    } catch (error) {
      console.error("Error toggling column:", error)
    }
  }

  const handleSaveCardDesign = async (design: CardDesign) => {
    if (!project) return;
    try {
      const { error } = await supabase.from("projects").update({ card_design: design }).eq("id", project.id)
      if (error) throw error
      setProject((prev) => (prev ? { ...prev, card_design: design } : null))
      toast({
        title: "Card design saved!",
        description: (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
            <CheckCircle className="w-5 h-5" />
            <span>Your card design has been successfully saved and updated.</span>
          </div>
        ),
        className: "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700"
      })
    } catch (error) {
      console.error("Error saving card design:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#141B22] to-[#0B0F14] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 text-[#0AF395] animate-spin" />
          <span className="text-sm text-[#FCFEFF]/60">Loading project...</span>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#141B22] to-[#0B0F14] flex items-center justify-center">
        <Card className="bg-[#141B22]/50 border-red-500/20 max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-red-400 mb-2">Error</h2>
            <p className="text-sm text-[#FCFEFF]/60 mb-4">{error || "Project not found"}</p>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="border-[#0AF395]/30 text-[#0AF395]"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Decrypt database credentials for display
  const dbConfig = {
    host: decrypt(project.encrypted_db_host),
    port: decrypt(project.encrypted_db_port),
    dbname: decrypt(project.encrypted_db_name),
    table: decrypt(project.encrypted_table_name),
  }

  const enabledColumnsCount = project.db_context?.columns.filter((col) => col.allow !== false).length || 0
  const isChatLocked = enabledColumnsCount < 3

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F14] via-[#141B22] to-[#0B0F14]">
      {/* Header */}
      <div className="border-b border-[#0AF395]/10 bg-[#141B22]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-3 sm:gap-0">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="text-[#FCFEFF]/60 hover:text-[#FCFEFF] hover:bg-[#0AF395]/10 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-[#FCFEFF]">{project.name}</h1>
                <p className="text-xs text-[#FCFEFF]/50">Created {new Date(project.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <Badge className="bg-[#0B2420]/50 text-[#0AF395] border-[#0AF395]/30 self-start sm:self-auto">
              {project.gemini_model}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Project Info Sidebar */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            {/* Database Connection Info */}
            <Card className="bg-[#141B22]/50 border-[#0AF395]/20 hover:border-[#0AF395]/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-sm font-medium text-[#FCFEFF]">
                  <Database className="w-4 h-4 mr-2 text-[#0AF395]" />
                  Database Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-[#FCFEFF]/50">Host</p>
                  <p className="text-sm text-[#FCFEFF] font-mono break-all">{dbConfig.host}</p>
                </div>
                <div>
                  <p className="text-xs text-[#FCFEFF]/50">Database</p>
                  <p className="text-sm text-[#FCFEFF] font-mono">{dbConfig.dbname}</p>
                </div>
                <div>
                  <p className="text-xs text-[#FCFEFF]/50">Table</p>
                  <p className="text-sm text-[#FCFEFF] font-mono">{dbConfig.table}</p>
                </div>
                <div>
                  <p className="text-xs text-[#FCFEFF]/50">Port</p>
                  <p className="text-sm text-[#FCFEFF] font-mono">{dbConfig.port}</p>
                </div>
              </CardContent>
            </Card>

            {/* Schema Overview */}
            {project.db_context && (
              <Card className="bg-[#141B22]/50 border-[#0AF395]/20 hover:border-[#0AF395]/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-sm font-medium text-[#FCFEFF]">
                    <Brain className="w-4 h-4 mr-2 text-[#0AF395]" />
                    Schema Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#FCFEFF]/50">Table Name</span>
                    <Badge className="bg-[#0AF395]/20 text-[#0AF395] border-[#0AF395]/30 text-xs">
                      {project.db_context.table_name}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#FCFEFF]/50">Columns</span>
                    <span className="text-sm font-semibold text-[#FCFEFF]">
                      {project.db_context.columns?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#FCFEFF]/50">Sample Records</span>
                    <span className="text-sm font-semibold text-[#FCFEFF]">
                      {project.db_context.sample_data?.length || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-3">
            <Tabs defaultValue="schema" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-[#141B22]/50 border-[#0AF395]/20 h-auto">
                <TabsTrigger
                  value="schema"
                  className="data-[state=active]:bg-[#0AF395]/20 data-[state=active]:text-[#0AF395] text-xs sm:text-sm p-2 sm:p-3"
                >
                  <Table className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Schema Details</span>
                  <span className="sm:hidden">Schema</span>
                </TabsTrigger>
                <TabsTrigger
                  value="card-design"
                  className="data-[state=active]:bg-[#0AF395]/20 data-[state=active]:text-[#0AF395] text-xs sm:text-sm p-2 sm:p-3"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Card Design</span>
                  <span className="sm:hidden">Cards</span>
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  disabled={isChatLocked}
                  className="data-[state=active]:bg-[#0AF395]/20 data-[state=active]:text-[#0AF395] disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm p-2 sm:p-3"
                >
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Chat Interface</span>
                  <span className="sm:hidden">Chat</span>
                  {isChatLocked && <Lock className="w-2 h-2 sm:w-3 sm:h-3 ml-1" />}
                </TabsTrigger>
              </TabsList>

              {/* Schema Details Tab */}
              <TabsContent value="schema" className="mt-6">
                {project.db_context ? (
                  <div className="space-y-6">
                    {/* Columns Schema */}
                    <Card className="bg-[#141B22]/50 border-[#0AF395]/20 hover:border-[#0AF395]/40 transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg font-medium text-[#FCFEFF]">
                          <Table className="w-5 h-5 mr-2 text-[#0AF395]" />
                          Table Schema: {project.db_context.table_name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          {/* Schema Summary */}
                          <div className="mb-4 p-3 bg-[#0AF395]/5 rounded-lg border border-[#0AF395]/10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="text-center">
                                  <p className="text-lg font-semibold text-[#0AF395]">
                                    {project.db_context.columns.filter((col) => col.allow !== false).length}
                                  </p>
                                  <p className="text-xs text-[#FCFEFF]/60">Enabled</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-lg font-semibold text-red-400">
                                    {project.db_context.columns.filter((col) => col.allow === false).length}
                                  </p>
                                  <p className="text-xs text-[#FCFEFF]/60">Disabled</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-lg font-semibold text-[#FCFEFF]">
                                    {project.db_context.columns.length}
                                  </p>
                                  <p className="text-xs text-[#FCFEFF]/60">Total</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-[#FCFEFF]/60">Minimum 3 columns required</p>
                                <p className="text-xs text-[#FCFEFF]/40">for AI training</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {project.db_context.columns.map((column, index) => {
                              const isAllowed = column.allow !== false // Default to true if not specified
                              return (
                                <div
                                  key={index}
                                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                                    isAllowed
                                      ? "bg-[#0B0F14]/30 border-[#0AF395]/10 hover:border-[#0AF395]/20"
                                      : "bg-[#0B0F14]/10 border-[#FCFEFF]/5 opacity-60"
                                  }`}
                                >
                                  <div className="flex items-center space-x-3 flex-1">
                                    {getDataTypeIcon(column.data_type)}
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2">
                                        <span
                                          className={`font-mono text-sm font-semibold ${isAllowed ? "text-[#FCFEFF]" : "text-[#FCFEFF]/50"}`}
                                        >
                                          {column.column_name}
                                        </span>
                                        {column.column_name === "id" && (
                                          <Key className="w-3 h-3 text-yellow-400" />
                                        )}
                                        {!isAllowed && (
                                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs px-2 py-0.5">
                                            Disabled
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <span
                                          className={`text-xs font-mono ${isAllowed ? getDataTypeColor(column.data_type) : "text-[#FCFEFF]/30"}`}
                                        >
                                          {column.data_type}
                                          {column.character_maximum_length && `(${column.character_maximum_length})`}
                                        </span>
                                        <span className="text-xs text-[#FCFEFF]/40">•</span>
                                        {column.is_nullable === "YES" ? (
                                          <span
                                            className={`text-xs flex items-center ${isAllowed ? "text-orange-400" : "text-[#FCFEFF]/30"}`}
                                          >
                                            <XCircle className="w-3 h-3 mr-1" />
                                            Nullable
                                          </span>
                                        ) : (
                                          <span
                                            className={`text-xs flex items-center ${isAllowed ? "text-green-400" : "text-[#FCFEFF]/30"}`}
                                          >
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Required
                                          </span>
                                        )}
                                      </div>
                                      {column.column_default && (
                                        <div
                                          className={`text-xs mt-1 ${isAllowed ? "text-[#FCFEFF]/50" : "text-[#FCFEFF]/30"}`}
                                        >
                                          Default: <span className="font-mono">{column.column_default}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Toggle Switch */}
                                  <div className="flex items-center space-x-3 ml-4">
                                    <div className="text-right">
                                      <p
                                        className={`text-xs font-medium ${isAllowed ? "text-[#0AF395]" : "text-[#FCFEFF]/50"}`}
                                      >
                                        {isAllowed ? "Enabled" : "Disabled"}
                                      </p>
                                      <p className="text-xs text-[#FCFEFF]/40">AI Training</p>
                                    </div>
                                    <Switch
                                      checked={isAllowed}
                                      onCheckedChange={(checked) => handleColumnToggle(column.column_name, checked)}
                                      className="data-[state=checked]:bg-[#0AF395] data-[state=unchecked]:bg-[#FCFEFF]/20 transition-all duration-200"
                                    />
                                  </div>
                                </div>
                              )
                            })}
                            {project.db_context.columns.filter((col) => col.allow !== false).length <= 3 && (
                              <div className="text-xs text-yellow-400 mt-1 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Cannot disable - minimum 3 required
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    {/* Sample Data */}
                    <Card className="bg-[#141B22]/50 border-[#0AF395]/20 hover:border-[#0AF395]/40 transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg font-medium text-[#FCFEFF]">
                          <Eye className="w-5 h-5 mr-2 text-[#0AF395]" />
                          Sample Data ({project.db_context.sample_data.length} records) - AI Training Preview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[500px]">
                          <div className="space-y-4">
                            {project.db_context.sample_data.map((record, index) => {
                              // Filter record to only show allowed columns
                              const allowedColumns = project.db_context.columns
                                .filter((col) => col.allow !== false)
                                .map((col) => col.column_name)

                              const filteredRecord = Object.entries(record).filter(([key]) =>
                                allowedColumns.includes(key),
                              )

                              return (
                                <div key={index} className="p-4 bg-[#0B0F14]/30 rounded-lg border border-[#0AF395]/10">
                                  <div className="flex items-center justify-between mb-3">
                                    <Badge className="bg-[#0AF395]/20 text-[#0AF395] border-[#0AF395]/30 text-xs">
                                      Record #{index + 1}
                                    </Badge>
                                    <div className="text-xs text-[#FCFEFF]/50">
                                      Showing {filteredRecord.length} of {Object.keys(record).length} columns
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {filteredRecord.map(([key, value]) => (
                                      <div key={key} className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-xs font-mono text-[#0AF395]">{key}</span>
                                          <span className="text-xs text-[#FCFEFF]/40">
                                            (
                                            {project.db_context.columns.find((col) => col.column_name === key)
                                              ?.data_type || "unknown"}
                                            )
                                          </span>
                                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-1 py-0">
                                            Enabled
                                          </Badge>
                                        </div>
                                        <div className="text-sm text-[#FCFEFF] bg-[#0B0F14]/50 p-2 rounded border border-[#0AF395]/5">
                                          {typeof value === "string" && value.length > 100 ? (
                                            <div>
                                              <span className="font-mono">{value.substring(0, 100)}...</span>
                                              <span className="text-xs text-[#FCFEFF]/50 ml-2">
                                                ({value.length} chars)
                                              </span>
                                            </div>
                                          ) : (
                                            <span className="font-mono">
                                              {value === null ? (
                                                <span className="text-[#FCFEFF]/40 italic">null</span>
                                              ) : (
                                                String(value)
                                              )}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  {filteredRecord.length === 0 && (
                                    <div className="text-center py-4">
                                      <p className="text-sm text-[#FCFEFF]/50">No enabled columns to display</p>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="bg-[#141B22]/50 border-[#0AF395]/20 hover:border-[#0AF395]/40 transition-all duration-300">
                    <CardContent className="flex items-center justify-center h-[400px]">
                      <div className="text-center">
                        <Database className="w-12 h-12 text-[#FCFEFF]/30 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-[#FCFEFF] mb-2">No Schema Data</h3>
                        <p className="text-sm text-[#FCFEFF]/60">
                          Schema information is not available for this project.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Card Design Tab */}
              <TabsContent value="card-design" className="mt-6">
                <Card className="bg-[#141B22]/50 border-[#0AF395]/20 hover:border-[#0AF395]/40 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg font-medium text-[#FCFEFF]">
                      <Eye className="w-5 h-5 mr-2 text-[#0AF395]" />
                      Customize Result Cards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDesigner
                      project={project}
                      onSave={handleSaveCardDesign}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Chat Interface Tab */}
              <TabsContent value="chat" className="mt-6">
                <Card className="bg-[#141B22]/50 border-[#0AF395]/20 h-[calc(100vh-200px)] sm:h-[600px] flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <CardTitle className="flex items-center text-lg font-medium text-[#FCFEFF]">
                      <MessageSquare className="w-5 h-5 mr-2 text-[#0AF395]" />
                      AI Chat Interface
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                    <ChatInterface project={project} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
