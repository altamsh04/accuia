import { type NextRequest, NextResponse } from "next/server"

const AI_BACKEND = process.env.NEXT_PUBLIC_AI_BACKEND;

/**
 * POST /api/text-to-sql
 * Proxies the request to the AI backend's text_to_sql endpoint
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    console.log("Proxying request to text_to_sql endpoint:", {
      url: `${AI_BACKEND}/text_to_sql`,
      hasQuery: !!body.query,
      hasDbContext: !!body.db_context,
      hasGeminiKey: !!body.gemini_api_key,
      allowedColumns: body.db_context?.columns?.filter((col: any) => col.allow !== false).length || 0,
    })

    const response = await fetch(`${AI_BACKEND}/text_to_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(body),
      // 30 second timeout
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("AI Backend error:", response.status, errorText)
      return NextResponse.json(
        { error: `AI Backend error: ${errorText || response.statusText}` },
        { status: response.status },
      )
    }

    const result = await response.json()
    console.log("AI Backend response received successfully")

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Text-to-SQL proxy error:", error)

    if (error.name === "TimeoutError") {
      return NextResponse.json({ error: "Request timeout - AI backend took too long to respond" }, { status: 504 })
    }

    return NextResponse.json({ error: `Proxy request failed: ${error.message}` }, { status: 500 })
  }
}
