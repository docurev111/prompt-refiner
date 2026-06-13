export interface TechStackItem {
  layer: string
  tech: string
  reason: string
}

export interface Feature {
  name: string
  priority: 'must-have' | 'should-have' | 'nice-to-have'
  description: string
}

export interface ArchitectureComponent {
  component: string
  responsibility: string
}

export interface RefineResponse {
  refined_prompt: string
  tech_stack: TechStackItem[]
  features: Feature[]
  architecture: ArchitectureComponent[]
  cursor_tip: string
}

export interface RefineRequest {
  raw_prompt: string
  project_type: string
  complexity: string
}

export interface ApiError {
  error: string
}
