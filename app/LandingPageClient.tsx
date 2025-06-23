"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Database,
  MessageCircle,
  Zap,
  Shield,
  Search,
  Brain,
  Users,
  TrendingUp,
  CheckCircle,
  Play,
  Star,
  ArrowRight,
  Sparkles,
  Bot,
  Code,
  Globe,
  Lock,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND || "https://accuia.vercel.app"

export default function LandingPageClient() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isGlassMenuOpen, setIsGlassMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsGlassMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#FCFEFF] overflow-x-hidden">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Accuia",
            description:
              "AI-powered database intelligence platform that transforms complex data into simple conversations",
            url: frontendUrl,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: "Free trial available",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "127",
            },
            featureList: [
              "Natural Language Database Queries",
              "PostgreSQL Integration",
              "AI-Powered Search",
              "Real-time Query Generation",
              "Enterprise Security",
            ],
          }),
        }}
      />
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? "bg-transparent backdrop-blur-none"
            : "bg-[#0B0F14]/95 backdrop-blur-xl border-b border-[#0B2420]/30"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          {/* Full Navbar (visible when not scrolled) */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              isScrolled ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
            }`}
          >
            <div className="flex justify-between items-center py-3">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-gradient-to-br from-[#0AF395] to-[#0AF395]/80 rounded-md flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#0B2420]" />
                </div>
                <span className="text-lg font-semibold tracking-tight">Accuia</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-sm text-[#FCFEFF]/70 hover:text-[#0AF395] transition-colors duration-200"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-sm text-[#FCFEFF]/70 hover:text-[#0AF395] transition-colors duration-200"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection("use-cases")}
                  className="text-sm text-[#FCFEFF]/70 hover:text-[#0AF395] transition-colors duration-200"
                >
                  Use Cases
                </button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-[#0AF395]/30 text-[#0B2420] hover:bg-[#0AF395]/15 hover:border-[#0AF395]/60 hover:text-[#0AF395] text-xs transition-all duration-200"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  size="sm"
                  variant="ghost"
                  className="text-[#FCFEFF] hover:bg-[#0AF395]/10"
                >
                  {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Collapsed Glass Navbar (visible when scrolled) */}
          <div
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              isScrolled ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <div className="flex justify-between items-center py-2">
              {/* Left Glass Circle */}
              <div className="w-12 h-12 bg-[#141B22]/40 backdrop-blur-xl border border-[#0AF395]/20 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-gradient-to-br from-[#0AF395] to-[#0AF395]/80 rounded-md flex items-center justify-center">
                  <Bot className="w-3 h-3 text-[#0B2420]" />
                </div>
              </div>

              {/* Center Glass Bar with Direct Navigation */}
              <div className="flex-1 mx-4">
                <div className="h-10 bg-[#141B22]/40 backdrop-blur-xl border border-[#0AF395]/20 rounded-full flex items-center justify-center px-6 shadow-lg">
                  <div className="hidden md:flex items-center space-x-6">
                    <button
                      onClick={() => scrollToSection("features")}
                      className="text-xs text-[#FCFEFF]/70 hover:text-[#0AF395] transition-colors duration-200"
                    >
                      Features
                    </button>
                    <button
                      onClick={() => scrollToSection("how-it-works")}
                      className="text-xs text-[#FCFEFF]/70 hover:text-[#0AF395] transition-colors duration-200"
                    >
                      How It Works
                    </button>
                    <button
                      onClick={() => scrollToSection("use-cases")}
                      className="text-xs text-[#FCFEFF]/70 hover:text-[#0AF395] transition-colors duration-200"
                    >
                      Use Cases
                    </button>
                  </div>

                  {/* Mobile Menu Button for Glass Navbar */}
                  <div className="md:hidden relative">
                    <button
                      onClick={() => setIsGlassMenuOpen(!isGlassMenuOpen)}
                      className="flex items-center space-x-1 text-xs text-[#FCFEFF]/60 hover:text-[#0AF395] transition-colors"
                    >
                      <span>Menu</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${isGlassMenuOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Mobile Dropdown Menu */}
                    {isGlassMenuOpen && (
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-48 bg-[#141B22]/90 backdrop-blur-xl border border-[#0AF395]/20 rounded-xl shadow-2xl p-3 z-10">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => scrollToSection("features")}
                            className="text-left p-2 text-xs text-[#FCFEFF]/70 hover:text-[#0AF395] hover:bg-[#0AF395]/10 rounded-lg transition-all duration-200"
                          >
                            <div className="flex items-center space-x-2">
                              <Search className="w-3 h-3" />
                              <span>Features</span>
                            </div>
                          </button>
                          <button
                            onClick={() => scrollToSection("how-it-works")}
                            className="text-left p-2 text-xs text-[#FCFEFF]/70 hover:text-[#0AF395] hover:bg-[#0AF395]/10 rounded-lg transition-all duration-200"
                          >
                            <div className="flex items-center space-x-2">
                              <Zap className="w-3 h-3" />
                              <span>How It Works</span>
                            </div>
                          </button>
                          <button
                            onClick={() => scrollToSection("use-cases")}
                            className="text-left p-2 text-xs text-[#FCFEFF]/70 hover:text-[#0AF395] hover:bg-[#0AF395]/10 rounded-lg transition-all duration-200"
                          >
                            <div className="flex items-center space-x-2">
                              <Globe className="w-3 h-3" />
                              <span>Use Cases</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Glass Circle */}
              <div className="w-12 h-12 bg-[#141B22]/40 backdrop-blur-xl border border-[#0AF395]/20 rounded-full flex items-center justify-center shadow-lg">
                <Link href="/login">
                  <div className="w-6 h-6 bg-[#0AF395]/20 rounded-full flex items-center justify-center hover:bg-[#0AF395]/30 transition-colors">
                    <ArrowRight className="w-3 h-3 text-[#0AF395]" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && !isScrolled && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-[#141B22]/95 backdrop-blur-xl border border-[#0AF395]/20 rounded-lg mt-2 p-4 shadow-2xl">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => {
                    scrollToSection("features")
                    setIsMobileMenuOpen(false)
                  }}
                  className="text-sm text-[#FCFEFF]/70 hover:text-[#0AF395] transition-colors duration-200 py-2 text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    scrollToSection("how-it-works")
                    setIsMobileMenuOpen(false)
                  }}
                  className="text-sm text-[#FCFEFF]/70 hover:text-[#0AF395] transition-colors duration-200 py-2 text-left"
                >
                  How It Works
                </button>
                <button
                  onClick={() => {
                    scrollToSection("use-cases")
                    setIsMobileMenuOpen(false)
                  }}
                  className="text-sm text-[#0B2420]/70 hover:text-[#0AF395] transition-colors duration-200 py-2 text-left"
                >
                  Use Cases
                </button>
                <Button asChild size="sm" className="bg-[#0AF395] text-[#0B2420] hover:bg-[#0AF395]/90 text-xs mt-2">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center flex flex-col justify-center">
          <Badge className="mb-4 sm:mb-6 bg-[#0B2420]/50 text-[#0AF395] border-[#0AF395]/20 text-xs px-3 py-1 mx-auto">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Database Intelligence
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
            Chat with Your Database.
            <br />
            <span className="bg-gradient-to-r from-[#0AF395] to-[#0AF395]/80 bg-clip-text text-transparent">
              Discover Products Instantly.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#FCFEFF]/70 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Transform complex data into simple conversations. Search, explore, and interact with your product catalog
            using natural language — no SQL required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8 sm:mb-12 px-4">
            <Link href="/login">
              <Button
                size="sm"
                className="w-full sm:w-auto bg-[#0AF395] text-[#0B2420] hover:bg-[#0AF395]/80 hover:text-[#0B2420] px-6 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <Search className="w-4 h-4 mr-2" />
                Try Smart Search
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                variant="outline"
                className="group w-full sm:w-auto border-[#0AF395]/30 text-[#0B2420] bg-white/90 
                        hover:bg-[#0AF395]/10 hover:border-[#0AF395]/70 hover:text-[#0AF395] 
                        px-6 py-2 text-sm transition-all duration-200"
              >
                <Database className="w-4 h-4 mr-2 text-[#0B2420] group-hover:text-[#0AF395]" />
                Connect Database
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-[#FCFEFF]/50">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-[#0AF395]" />
              <span>No SQL Required</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-[#0AF395]" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-[#0AF395]" />
              <span>Enterprise Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#141B22]/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#0B2420]/50 text-[#0AF395] border-[#0AF395]/20 text-xs">
              <Play className="w-3 h-3 mr-1" />
              Watch A Demo
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              See It In <span className="text-[#0AF395]">Action</span>
            </h2>
            <p className="text-sm text-[#FCFEFF]/70 max-w-2xl mx-auto">
              Watch how Accuia transforms complex database queries into simple conversations
            </p>
          </div>

          <div className="space-y-20">
            {/* Demo 1 - Video Left */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative order-1 md:order-1">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl"
                >
                  <source
                    src="https://res.cloudinary.com/dhbuw3k2w/video/upload/v1750682859/accuia/assets/t9ysvviozh0qkepeuflq.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="order-2 md:order-2">
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#FCFEFF] leading-tight">
                  Natural <span className="text-[#0AF395]">Conversation</span> Interface
                </h3>
                <p className="text-base text-[#FCFEFF]/70 mb-8 leading-relaxed">
                  Engage in natural conversations with your data through our intuitive chat interface. Ask follow-up
                  questions, refine your searches, and explore insights seamlessly. The system remembers context and
                  learns from your preferences to provide increasingly personalized results.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#0AF395] flex-shrink-0" />
                    <span className="text-sm text-[#FCFEFF]/80">Multi-turn conversation support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#0AF395] flex-shrink-0" />
                    <span className="text-sm text-[#FCFEFF]/80">Context retention across queries</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#0AF395] flex-shrink-0" />
                    <span className="text-sm text-[#FCFEFF]/80">Personalized recommendations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo 2 - Video Right */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-1 md:order-1">
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#FCFEFF] leading-tight">
                  Instant Database <span className="text-[#0AF395]">Integration</span>
                </h3>
                <p className="text-base text-[#FCFEFF]/70 mb-8 leading-relaxed">
                  Connect your PostgreSQL database in seconds with our intelligent setup process. Automatic schema
                  detection and data sampling means no complex configuration or data migration. Your existing data
                  becomes instantly accessible through natural language queries.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#0AF395] flex-shrink-0" />
                    <span className="text-sm text-[#FCFEFF]/80">Automatic schema discovery</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#0AF395] flex-shrink-0" />
                    <span className="text-sm text-[#FCFEFF]/80">Secure connection protocols</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#0AF395] flex-shrink-0" />
                    <span className="text-sm text-[#FCFEFF]/80">Zero data migration required</span>
                  </div>
                </div>
              </div>
              <div className="relative order-2 md:order-2">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl"
                >
                  <source
                    src="https://res.cloudinary.com/dhbuw3k2w/video/upload/v1750682859/accuia/assets/t9ysvviozh0qkepeuflq.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Demo 3 - Video Left */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative order-1 md:order-1">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl"
                >
                  <source
                    src="https://res.cloudinary.com/dhbuw3k2w/video/upload/v1750682859/accuia/assets/t9ysvviozh0qkepeuflq.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="order-2 md:order-2">
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#FCFEFF] leading-tight">
                  Experience <span className="text-[#0AF395]">Intelligent</span> Data Access
                </h3>
                <p className="text-base text-[#FCFEFF]/70 mb-8 leading-relaxed">
                  Simply ask questions in plain English and watch as Accuia instantly understands your intent,
                  translates it into optimized SQL queries, and delivers precise results from your database. No
                  technical knowledge required - just natural conversation with your data.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#0AF395] flex-shrink-0" />
                    <span className="text-sm text-[#FCFEFF]/80">Context-aware query understanding</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#0AF395] flex-shrink-0" />
                    <span className="text-sm text-[#FCFEFF]/80">Real-time SQL generation and execution</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#0AF395] flex-shrink-0" />
                    <span className="text-sm text-[#FCFEFF]/80">Intelligent result formatting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#0B2420]/50 text-[#0AF395] border-[#0AF395]/20 text-xs">Core Features</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Intelligent Data Access for <span className="text-[#0AF395]">Modern Teams</span>
            </h2>
            <p className="text-sm text-[#FCFEFF]/70 max-w-2xl mx-auto">
              Powered by advanced AI to transform how you interact with your database
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="bg-[#141B22]/50 border-[#0AF395]/10 hover:border-[#0AF395]/30 transition-all duration-200 backdrop-blur-sm hover:scale-105">
              <CardContent className="p-5">
                <div className="w-8 h-8 bg-[#0AF395]/20 rounded-lg flex items-center justify-center mb-3">
                  <Search className="w-4 h-4 text-[#0AF395]" />
                </div>
                <h3 className="text-sm font-semibold mb-2 text-[#FCFEFF]">Smart Search</h3>
                <p className="text-xs text-[#FCFEFF]/60 mb-3 leading-relaxed">
                  Natural language queries with context-aware results and fuzzy matching.
                </p>
                <div className="space-y-1 text-xs text-[#0AF395]/80">
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-[#0AF395] rounded-full"></div>
                    <span>Natural language processing</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-[#0AF395] rounded-full"></div>
                    <span>Context-aware results</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#141B22]/50 border-[#0AF395]/10 hover:border-[#0AF395]/30 transition-all duration-200 backdrop-blur-sm hover:scale-105">
              <CardContent className="p-5">
                <div className="w-8 h-8 bg-[#0AF395]/20 rounded-lg flex items-center justify-center mb-3">
                  <MessageCircle className="w-4 h-4 text-[#0AF395]" />
                </div>
                <h3 className="text-sm font-semibold mb-2 text-[#FCFEFF]">Conversational AI</h3>
                <p className="text-xs text-[#FCFEFF]/60 mb-3 leading-relaxed">
                  Chat interface with memory and personalized recommendations.
                </p>
                <div className="space-y-1 text-xs text-[#0AF395]/80">
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-[#0AF395] rounded-full"></div>
                    <span>Context retention</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-[#0AF395] rounded-full"></div>
                    <span>Smart suggestions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#141B22]/50 border-[#0AF395]/10 hover:border-[#0AF395]/30 transition-all duration-200 backdrop-blur-sm hover:scale-105">
              <CardContent className="p-5">
                <div className="w-8 h-8 bg-[#0AF395]/20 rounded-lg flex items-center justify-center mb-3">
                  <Database className="w-4 h-4 text-[#0AF395]" />
                </div>
                <h3 className="text-sm font-semibold mb-2 text-[#FCFEFF]">Auto-Connect</h3>
                <p className="text-xs text-[#FCFEFF]/60 mb-3 leading-relaxed">
                  Instant PostgreSQL integration with automatic schema detection.
                </p>
                <div className="space-y-1 text-xs text-[#0AF395]/80">
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-[#0AF395] rounded-full"></div>
                    <span>Schema auto-detection</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-[#0AF395] rounded-full"></div>
                    <span>Secure connections</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#141B22]/50 border-[#0AF395]/10 hover:border-[#0AF395]/30 transition-all duration-200 backdrop-blur-sm hover:scale-105">
              <CardContent className="p-5">
                <div className="w-8 h-8 bg-[#0AF395]/20 rounded-lg flex items-center justify-center mb-3">
                  <Brain className="w-4 h-4 text-[#0AF395]" />
                </div>
                <h3 className="text-sm font-semibold mb-2 text-[#FCFEFF]">AI-Powered</h3>
                <p className="text-xs text-[#FCFEFF]/60 mb-3 leading-relaxed">
                  Google Gemini integration for accurate, auditable query generation.
                </p>
                <div className="space-y-1 text-xs text-[#0AF395]/80">
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-[#0AF395] rounded-full"></div>
                    <span>Gemini-powered</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-[#0AF395] rounded-full"></div>
                    <span>Auditable queries</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 px-4 sm:px-6 bg-[#141B22]/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#0B2420]/50 text-[#0AF395] border-[#0AF395]/20 text-xs">Simple Process</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              From Connection to <span className="text-[#0AF395]">Conversation</span>
            </h2>
            <p className="text-sm text-[#FCFEFF]/70 max-w-2xl mx-auto">
              Get up and running in minutes with our streamlined setup process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0AF395] to-[#0AF395]/80 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <span className="text-lg font-bold text-[#0B2420]">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#FCFEFF]">Connect Database</h3>
              <p className="text-sm text-[#FCFEFF]/60 leading-relaxed">
                Secure PostgreSQL connection with automatic schema detection and data sampling.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0AF395] to-[#0AF395]/80 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <span className="text-lg font-bold text-[#0B2420]">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#FCFEFF]">Ask Naturally</h3>
              <p className="text-sm text-[#FCFEFF]/60 leading-relaxed">
                AI translates your questions into optimized SQL queries with real-time execution.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0AF395] to-[#0AF395]/80 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <span className="text-lg font-bold text-[#0B2420]">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#FCFEFF]">Get Insights</h3>
              <p className="text-sm text-[#FCFEFF]/60 leading-relaxed">
                Beautiful, actionable results with full context and conversation history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#0B2420]/50 text-[#0AF395] border-[#0AF395]/20 text-xs">Use Cases</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Built for <span className="text-[#0AF395]">Every Team</span>
            </h2>
            <p className="text-sm text-[#FCFEFF]/70 max-w-2xl mx-auto">
              From customer-facing search to internal analytics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-[#141B22]/50 border-[#0AF395]/10 hover:border-[#0AF395]/30 transition-all duration-200 group hover:scale-105">
              <CardContent className="p-5 text-center">
                <div className="w-10 h-10 bg-[#0AF395]/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#0AF395]/30 transition-colors">
                  <Globe className="w-5 h-5 text-[#0AF395]" />
                </div>
                <h3 className="text-sm font-semibold mb-2 text-[#FCFEFF]">Ecommerce</h3>
                <p className="text-xs text-[#FCFEFF]/60 leading-relaxed">
                  Intelligent product discovery for customers and inventory insights for teams.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#141B22]/50 border-[#0AF395]/10 hover:border-[#0AF395]/30 transition-all duration-200 group hover:scale-105">
              <CardContent className="p-5 text-center">
                <div className="w-10 h-10 bg-[#0AF395]/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#0AF395]/30 transition-colors">
                  <Users className="w-5 h-5 text-[#0AF395]" />
                </div>
                <h3 className="text-sm font-semibold mb-2 text-[#FCFEFF]">Internal Tools</h3>
                <p className="text-xs text-[#FCFEFF]/60 leading-relaxed">
                  Empower staff with natural language queries for operations and support.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#141B22]/50 border-[#0AF395]/10 hover:border-[#0AF395]/30 transition-all duration-200 group hover:scale-105">
              <CardContent className="p-5 text-center">
                <div className="w-10 h-10 bg-[#0AF395]/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#0AF395]/30 transition-colors">
                  <TrendingUp className="w-5 h-5 text-[#0AF395]" />
                </div>
                <h3 className="text-sm font-semibold mb-2 text-[#FCFEFF]">Analytics</h3>
                <p className="text-xs text-[#FCFEFF]/60 leading-relaxed">
                  Transform data into insights without complex dashboards or reports.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#141B22]/50 border-[#0AF395]/10 hover:border-[#0AF395]/30 transition-all duration-200 group hover:scale-105">
              <CardContent className="p-5 text-center">
                <div className="w-10 h-10 bg-[#0AF395]/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#0AF395]/30 transition-colors">
                  <Code className="w-5 h-5 text-[#0AF395]" />
                </div>
                <h3 className="text-sm font-semibold mb-2 text-[#FCFEFF]">Developer APIs</h3>
                <p className="text-xs text-[#FCFEFF]/60 leading-relaxed">
                  Integrate intelligent search into your applications with our API.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#141B22]/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-[#0B2420]/50 text-[#0AF395] border-[#0AF395]/20 text-xs">Why Accuia</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                The <span className="text-[#0AF395]">Smart Choice</span> for Data Access
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-[#0AF395] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold mb-1 text-[#FCFEFF]">Zero Learning Curve</h3>
                    <p className="text-xs text-[#FCFEFF]/60">
                      Natural language interface requires no technical training
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-[#0AF395] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold mb-1 text-[#FCFEFF]">Existing Data Compatible</h3>
                    <p className="text-xs text-[#FCFEFF]/60">Works with your current PostgreSQL setup instantly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-[#0AF395] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold mb-1 text-[#FCFEFF]">Enterprise Security</h3>
                    <p className="text-xs text-[#FCFEFF]/60">Bank-grade encryption with audit trails and compliance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-[#0AF395] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold mb-1 text-[#FCFEFF]">Developer-First API</h3>
                    <p className="text-xs text-[#FCFEFF]/60">RESTful APIs with comprehensive documentation and SDKs</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="bg-[#141B22]/50 border-[#0AF395]/10 hover:scale-105 transition-all duration-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-[#FCFEFF]">Competitive Edge</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-[#0AF395]/10">
                    <span className="text-xs text-[#FCFEFF]/80">Natural Language Processing</span>
                    <CheckCircle className="w-4 h-4 text-[#0AF395]" />
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#0AF395]/10">
                    <span className="text-xs text-[#FCFEFF]/80">Real-time Query Generation</span>
                    <CheckCircle className="w-4 h-4 text-[#0AF395]" />
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#0AF395]/10">
                    <span className="text-xs text-[#FCFEFF]/80">Ecommerce Schema Intelligence</span>
                    <CheckCircle className="w-4 h-4 text-[#0AF395]" />
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#0AF395]/10">
                    <span className="text-xs text-[#FCFEFF]/80">Conversational Memory</span>
                    <CheckCircle className="w-4 h-4 text-[#0AF395]" />
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-[#FCFEFF]/80">Enterprise Integration</span>
                    <CheckCircle className="w-4 h-4 text-[#0AF395]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#0B2420]/50 text-[#0AF395] border-[#0AF395]/20 text-xs">Customer Stories</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Trusted by <span className="text-[#0AF395]">Forward-Thinking</span> Teams
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-[#141B22]/50 border-[#0AF395]/10 hover:scale-105 transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-[#0AF395] fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm text-[#FCFEFF]/90 mb-4 leading-relaxed">
                  "Accuia transformed our product discovery. Customers find exactly what they want in seconds, and our
                  conversion rates increased by 40%."
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0AF395] to-[#0AF395]/80 rounded-full flex items-center justify-center">
                    <span className="text-xs text-[#0B2420] font-semibold">JS</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#FCFEFF]">John Smith</div>
                    <div className="text-xs text-[#FCFEFF]/50">CTO, DTC Apparel Brand</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#141B22]/50 border-[#0AF395]/10 hover:scale-105 transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-[#0AF395] fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm text-[#FCFEFF]/90 mb-4 leading-relaxed">
                  "Our operations team can now query inventory, sales, and customer data in plain English. It's like
                  having a data analyst available 24/7."
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0AF395] to-[#0AF395]/80 rounded-full flex items-center justify-center">
                    <span className="text-xs text-[#0B2420] font-semibold">MJ</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#FCFEFF]">Maria Johnson</div>
                    <div className="text-xs text-[#FCFEFF]/50">Operations Manager</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#141B22]/50 to-[#0B0F14]">
        <div className="max-w-3xl mx-auto text-center">
          <Badge className="mb-6 bg-[#0B2420]/50 text-[#0AF395] border-[#0AF395]/20 text-xs hover:bg-[#0AF395]/15 hover:border-[#0AF395]/60 hover:text-[#0AF395] transition-all duration-200">
            <Sparkles className="w-3 h-3 mr-1" />
            Ready to Get Started?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transform Your <span className="text-[#0AF395]">Data Experience</span>
          </h2>
          <p className="text-sm text-[#FCFEFF]/70 mb-8 max-w-xl mx-auto">
            Join hundreds of teams already using Accuia to unlock the power of conversational data access
          </p>
          <div className="flex justify-center items-center mb-8">
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-[#0AF395] text-[#0B2420] hover:bg-[#0AF395]/80 hover:text-[#0B2420] px-8 py-3 text-sm font-medium hover:scale-105 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Free Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-6 text-xs text-[#FCFEFF]/50">
            <div className="flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>5-min Setup</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#0B2420]/20 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-[#0AF395] to-[#0AF395]/80 rounded-md flex items-center justify-center">
                <Bot className="w-3 h-3 text-[#0B2420]" />
              </div>
              <span className="text-lg font-semibold">Accuia</span>
            </div>
            <div className="flex items-center space-x-6 text-xs text-[#FCFEFF]/50">
              <a href="#" className="hover:text-[#0AF395] transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-[#0AF395] transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-[#0AF395] transition-colors">
                API Docs
              </a>
              <a href="#" className="hover:text-[#0AF395] transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#0B2420]/20 text-center text-xs text-[#FCFEFF]/40">
            <p>&copy; {new Date().getFullYear()} Accuia. Powering the future of intelligent data interaction.</p>
            <p className="mt-2">
              Made with ❤️ and 🍵 By{" "}
              <a
                href="https://github.com/altamsh04"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0AF395] hover:text-[#0AF395]/80 transition-colors duration-200"
              >
                altamsh04
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
