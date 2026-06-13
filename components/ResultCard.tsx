'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { RefineResponse } from '@/lib/types'
import TechStackList from './TechStackList'
import FeatureList from './FeatureList'
import ArchitectureList from './ArchitectureList'

interface ResultCardProps {
  result: RefineResponse
}

export default function ResultCard({ result }: ResultCardProps) {
  const [copied, setCopied] = useState(false)

  async function copyPrompt() {
    await navigator.clipboard.writeText(result.refined_prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4 mt-10">
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Result
        </span>
        <Separator className="flex-1" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Refined prompt</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyPrompt}
              className="h-7 px-2 text-xs"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {result.refined_prompt}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Tech stack</CardTitle>
        </CardHeader>
        <CardContent>
          <TechStackList items={result.tech_stack} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Features</CardTitle>
        </CardHeader>
        <CardContent>
          <FeatureList features={result.features} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <ArchitectureList items={result.architecture} />
        </CardContent>
      </Card>

      <Card className="border-l-[3px] border-l-violet-400 rounded-l-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Cursor Pro tip for this project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {result.cursor_tip}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
