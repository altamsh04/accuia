import { type NextRequest, NextResponse } from "next/server"

const AI_BACKEND =
  process.env.NEXT_PUBLIC_AI_BACKEND

/**
 * POST /api/query-execute
 * Proxies the request to the AI backend's query_execute endpoint
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    console.log("Proxying request to query_execute endpoint:", {
      url: `${AI_BACKEND}/query_execute`,
      hasCredentials: !!(body.user && body.password && body.host && body.port && body.dbname),
      hasSql: !!body.sql,
      sqlLength: body.sql?.length || 0,
    })

    const response = await fetch(`${AI_BACKEND}/query_execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(body),
      // 60 second timeout for query execution
      signal: AbortSignal.timeout(60000),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Query execution error:", response.status, errorText)
      return NextResponse.json(
        { error: `Query execution failed: ${errorText || response.statusText}` },
        { status: response.status },
      )
    }

    const result = await response.json()
    console.log("Query execution completed:", {
      success: result.success,
      rowCount: result.row_count || 0,
      hasData: !!result.data,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Query execution proxy error:", error)

    if (error.name === "TimeoutError") {
      return NextResponse.json({ error: "Query timeout - execution took too long" }, { status: 504 })
    }

    return NextResponse.json({ error: `Query execution failed: ${error.message}` }, { status: 500 })
  }
}
