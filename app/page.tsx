'use client'

import { useState } from 'react'
import PromptForm from '@/components/PromptForm'
import ResultCard from '@/components/ResultCard'
import { RefineResponse } from '@/lib/types'

export default function Home() {
  const [result, setResult] = useState<RefineResponse | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 pb-24">

        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-border rounded-full px-3 py-1 mb-4">
            <span>✦</span>
            <span>AI-Powered · Free · No signup</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Vibe Prompt Refiner
          </h1>
          <p className="mt-2 text-muted-foreground max-w-md">
            Type a rough idea. Get a Cursor-ready prompt, recommended stack, prioritized features, and architecture — instantly.
          </p>
        </div>

        <PromptForm
          onResult={(r) => {
            setResult(r)
            setTimeout(() => {
              document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
          }}
          onLoading={setLoading}
          loading={loading}
        />

        <div id="results">
          {result && !loading && <ResultCard result={result} />}
        </div>

      </div>
    </main>
  )
}
