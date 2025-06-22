import { type NextRequest, NextResponse } from "next/server"

const DB_CONTEXT_API =
  process.env.NEXT_PUBLIC_AI_BACKEND

/**
 * POST /api/db-context
 * Simply proxies the JSON body to `${DB_CONTEXT_API}/db_context`
 * and returns the JSON result or a 400/500 on failure.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const proxied = await fetch(`${DB_CONTEXT_API}/db_context`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // 15 s timeout so the client isn’t stuck forever
      cache: "no-store",
    })

    if (!proxied.ok) {
      const txt = await proxied.text()
      return NextResponse.json({ error: txt || proxied.statusText }, { status: 400 })
    }

    const json = await proxied.json()
    return NextResponse.json(json) // 200
  } catch (err: any) {
    console.error("Proxy error:", err)
    return NextResponse.json({ error: "Proxy request failed" }, { status: 500 })
  }
}
