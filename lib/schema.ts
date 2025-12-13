import { z } from 'zod'

// Source schema for linking to documentation
const SourceSchema = z.object({
  url: z.string().url(),
  label: z.string()
})

// Error document schema as specified in master.md
export const ErrorSchema = z.object({
  tool: z.literal("kubernetes"),
  canonical_slug: z.string(),
  title: z.string(),
  aliases: z.array(z.string()),
  matchers: z.object({
    regex: z.array(z.string())
  }),
  category: z.enum(["registry", "auth", "network", "storage", "scheduling", "runtime", "config", "unknown", "scheduler", "cluster"]),
  summary: z.string(),
  root_causes: z.array(z.object({
    name: z.string(),
    why: z.string(),
    confidence: z.number().min(0).max(1),
    sources: z.array(SourceSchema)
  })),
  fix_steps: z.array(z.object({
    step: z.string(),
    commands: z.array(z.string()),
    sources: z.array(SourceSchema)
  })),
  clarifying_questions: z.array(z.string()),
  examples: z.array(z.object({
    name: z.string(),
    symptom: z.string(),
    fix: z.string(),
    sources: z.array(SourceSchema)
  })),
  created_at: z.string(),
  updated_at: z.string()
})

// Submission schema for tracking user inputs
export const SubmissionSchema = z.object({
  raw_text: z.string(),
  normalized_text: z.string(),
  matched_slug: z.string().nullable(),
  matched_confidence: z.number(),
  created_at: z.string()
})

export type KubernetesError = z.infer<typeof ErrorSchema>
export type Submission = z.infer<typeof SubmissionSchema>
export type Source = z.infer<typeof SourceSchema>