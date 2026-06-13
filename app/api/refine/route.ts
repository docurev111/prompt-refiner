import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { RefineRequest, RefineResponse } from '@/lib/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_INSTRUCTION = `You are an expert software architect and senior developer helping vibe coders turn rough ideas into structured project specs.

The user gives you a rough idea for a software project along with its type and complexity target.

You MUST respond with ONLY a valid JSON object. No markdown. No backticks. No explanation. No text before or after. Just raw JSON.

The JSON must follow this exact structure:

{
  "refined_prompt": "A detailed, structured prompt the developer can paste directly into Cursor Agent Mode or Claude Code to start building. Write 4-6 sentences. Cover: what the project is, who it is for, core behavior and user flow, important technical constraints, and the expected output or deliverable. Be specific about UI behavior, data flow, key edge cases, and how errors should be handled.",
  "tech_stack": [
    { "layer": "Frontend", "tech": "technology name", "reason": "one sentence why this is the right fit for this specific project" },
    { "layer": "Backend", "tech": "technology name", "reason": "one sentence why" },
    { "layer": "Database", "tech": "technology name", "reason": "one sentence why" },
    { "layer": "Auth", "tech": "technology name", "reason": "one sentence why" },
    { "layer": "Hosting", "tech": "technology name", "reason": "one sentence why" }
  ],
  "features": [
    { "name": "Feature name", "priority": "must-have", "description": "one clear sentence describing the feature and what it does for the user" },
    { "name": "Feature name", "priority": "must-have", "description": "..." },
    { "name": "Feature name", "priority": "must-have", "description": "..." },
    { "name": "Feature name", "priority": "should-have", "description": "..." },
    { "name": "Feature name", "priority": "should-have", "description": "..." },
    { "name": "Feature name", "priority": "nice-to-have", "description": "..." },
    { "name": "Feature name", "priority": "nice-to-have", "description": "..." }
  ],
  "architecture": [
    { "component": "Component name", "responsibility": "one sentence describing what this component owns and is responsible for" },
    { "component": "Component name", "responsibility": "..." },
    { "component": "Component name", "responsibility": "..." },
    { "component": "Component name", "responsibility": "..." }
  ],
  "cursor_tip": "One specific, actionable Cursor Pro tip for building this exact project — mention .cursorrules setup, which files to generate first in Agent Mode, or which MCP integration would help. Make it concrete and project-specific."
}

Rules:
- Omit tech_stack layers that genuinely do not apply (e.g. no Auth layer for a single-user CLI tool).
- Always include at least: Frontend (or CLI), Backend/API, and Database (or 'none needed — explain why').
- Tailor every single field to the specific idea the user described. No generic boilerplate.
- Output only valid JSON. Nothing else.`

export async function POST(req: NextRequest) {
  try {
    const body: RefineRequest = await req.json()

    if (!body.raw_prompt || body.raw_prompt.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please enter a project idea (at least 5 characters).' },
        { status: 400 }
      )
    }

    if (body.raw_prompt.trim().length > 500) {
      return NextResponse.json(
        { error: 'Project idea must be under 500 characters.' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction: SYSTEM_INSTRUCTION,
    })

    const userMessage = `Project type: ${body.project_type}
Complexity target: ${body.complexity}
Rough idea: "${body.raw_prompt.trim()}"`

    const result = await model.generateContent(userMessage)
    const rawText = result.response.text()

    const cleaned = rawText.replace(/```json|```/g, '').trim()

    const parsed: RefineResponse = JSON.parse(cleaned)

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('[/api/refine] error:', error)

    if (error instanceof Error) {
      if (error.message.includes('429')) {
        const isQuotaExhausted =
          error.message.includes('limit: 0') ||
          error.message.includes('Quota exceeded')

        return NextResponse.json(
          {
            error: isQuotaExhausted
              ? 'This Gemini model has no free quota left. The app was updated to use a newer model — refresh and try again.'
              : 'Rate limit hit. Wait a few seconds and try again.',
          },
          { status: 429 }
        )
      }

      if (error.message.includes('503') || error.message.includes('high demand')) {
        return NextResponse.json(
          { error: 'Gemini is busy right now. Wait a few seconds and try again.' },
          { status: 503 }
        )
      }

      if (error.message.includes('API key') || error.message.includes('401')) {
        return NextResponse.json(
          { error: 'Invalid Gemini API key. Check .env.local and restart the dev server.' },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
