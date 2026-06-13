'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RefineRequest, RefineResponse } from '@/lib/types'

interface PromptFormProps {
  onResult: (result: RefineResponse) => void
  onLoading: (loading: boolean) => void
  loading: boolean
}

const PROJECT_TYPES = [
  'Web app',
  'Mobile app',
  'Chrome extension',
  'CLI tool',
  'API / backend service',
  'Desktop app',
  'Browser game',
]

const COMPLEXITY_LEVELS = [
  'MVP / prototype',
  'Production-ready',
  'Enterprise-grade',
]

export default function PromptForm({ onResult, onLoading, loading }: PromptFormProps) {
  const [rawPrompt, setRawPrompt] = useState('')
  const [projectType, setProjectType] = useState('Web app')
  const [complexity, setComplexity] = useState('MVP / prototype')
  const [error, setError] = useState('')

  const charCount = rawPrompt.length
  const isOverLimit = charCount > 500

  async function handleSubmit() {
    const trimmed = rawPrompt.trim()
    if (!trimmed || trimmed.length < 5 || isOverLimit) return

    setError('')
    onLoading(true)

    try {
      const body: RefineRequest = {
        raw_prompt: trimmed,
        project_type: projectType,
        complexity,
      }

      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      onResult(data as RefineResponse)
    } catch {
      setError('Network error — check your connection and try again.')
    } finally {
      onLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">
            Your rough idea
          </label>
          <span className={`text-xs ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
            {charCount}/500
          </span>
        </div>
        <Textarea
          placeholder={
            'e.g. make me a freelancer invoice generator\n' +
            'e.g. i want a todo app with AI priority sorting\n' +
            'e.g. build a dashboard for tracking my crypto portfolio'
          }
          value={rawPrompt}
          onChange={(e) => setRawPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[110px] resize-y text-base"
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">Tip: Press Cmd/Ctrl + Enter to refine</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            Project type
          </label>
          <Select
            value={projectType}
            onValueChange={(v) => setProjectType(v ?? 'Web app')}
            disabled={loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            Complexity
          </label>
          <Select
            value={complexity}
            onValueChange={(v) => setComplexity(v ?? 'MVP / prototype')}
            disabled={loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMPLEXITY_LEVELS.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">
          {error}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading || rawPrompt.trim().length < 5 || isOverLimit}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⟳</span> Thinking...
          </span>
        ) : (
          '✦ Refine my prompt'
        )}
      </Button>
    </div>
  )
}
