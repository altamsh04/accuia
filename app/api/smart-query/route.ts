import { type NextRequest, NextResponse } from "next/server"

const AI_BACKEND = process.env.NEXT_PUBLIC_AI_BACKEND

/**
 * POST /api/smart-query
 * Proxies the request to the AI backend's smart_query endpoint
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("body", body)
    console.log("AI_BACKEND", AI_BACKEND)
    
    // Extract project_id from referer URL if available
    let project_id = body.project_id
    const referer = req.headers.get("referer")
    if (!project_id && referer) {
      // Try to extract /dashboard/projects/{project_id}/chat
      const match = referer.match(/\/dashboard\/projects\/([a-f0-9\-]+)\/chat/)
      if (match) {
        project_id = match[1]
      }
    }
    if (project_id) {
      body.project_id = project_id
    }

    console.log("Proxying request to smart_query endpoint:", {
      url: `${AI_BACKEND}/smart_query`,
      hasUserId: !!body.user_id,
      hasQuery: !!body.query,
      hasRole: !!body.role,
      hasProjectId: !!body.project_id,
    })

    const response = await fetch(`${AI_BACKEND}/smart_query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(body),
      // 60 second timeout for smart query processing
      signal: AbortSignal.timeout(60000),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Smart query error:", response.status, errorText)
      return NextResponse.json(
        { error: `Smart query failed: ${errorText || response.statusText}` },
        { status: response.status },
      )
    }

    const result = await response.json()
    console.log("Smart query completed:", {
      success: result.success,
      hasResults: !!result.result,
      resultCount: Array.isArray(result.result) ? result.result.length : 0,
      hasMessage: !!result.message,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Smart query proxy error:", error)

    if (error.name === "TimeoutError") {
      return NextResponse.json({ error: "Smart query timeout - processing took too long" }, { status: 504 })
    }

    return NextResponse.json({ error: `Smart query failed: ${error.message}` }, { status: 500 })
  }
} 