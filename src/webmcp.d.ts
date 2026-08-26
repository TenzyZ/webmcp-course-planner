export {}

declare global {
  interface Document {
    modelContext?: {
      registerTool(
        tool: {
          name: string
          description: string
          inputSchema: {
            type: 'object'
            properties: Record<
              string,
              { type: string; description?: string; items?: { type: string } }
            >
            required?: string[]
          }
          annotations: { readOnlyHint: boolean }
          execute(input: Record<string, unknown>): unknown
        },
        options: { signal: AbortSignal },
      ): Promise<void>
    }
  }
}
