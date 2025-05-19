# Trigger One-Shot Challenge

You are about to begin the GibsonAI OneShot Hackathon Challenge for the SplitReceipt application.

This command will load all necessary context and guide you through implementing a complete receipt splitting application
in a single shot, using GibsonAI for the backend and the GibsonAI Next.js starter app for the frontend.


# Read all of the following files 

- ai-docs/gibson-mcp-integration.md
- ai-docs/gibson-nextjs-integration.md
- ai-docs/shadcn-ui-implementation.md
- ai-docs/final-prompt.md


# SplitReceipt One-Shot Challenge

You are participating in the GibsonAI OneShot Hackathon Challenge, tasked with building a complete receipt splitting application in a single shot.

## Challenge Overview

Your goal is to implement SplitReceipt, a full-stack application that allows users to:
1. Create trips/events with multiple members
2. Upload and process receipts
3. Split expenses among trip members
4. Calculate balances between users

This implementation will use GibsonAI MCP for the backend and the GibsonAI Next.js starter app for the frontend.

## Implementation Strategy

NOTE: THE ENTIRE DETAILED IMPLEMETNATION IS AVAILABLE IN @ai-docs/final-prompt.md

To effectively handle this complex challenge, you should:

1. Break down the implementation into distinct phases:
   - Backend implementation with GibsonAI MCP
   - Frontend implementation with the GibsonAI Next.js starter app
   - UI enhancement with ShadCN UI components
   - Core feature implementation

2. For each major phase, delegate the detailed implementation to a separate Claude instance using the Task tool.
   - This ensures each part gets the focused attention it needs
   - It keeps your context clean for orchestrating the overall implementation
   - You can provide each delegate with specific requirements and context

3. Maintain a clear roadmap of what has been done and what remains to be completed.

4. After each major phase, summarize the progress and plan the next steps.

## Your Role as Orchestrator

As the primary Claude instance, your role is to:

1. Understand the complete implementation requirements
2. Create a detailed plan for implementation
3. Delegate specific implementation tasks to separate Claude instances
4. Integrate the results from each delegate instance
5. Ensure the complete implementation meets the requirements
6. Handle any issues or inconsistencies that arise

## Let's Begin

Start by analyzing the provided context and create a detailed implementation plan. Then proceed with delegating the first phase of implementation to a separate Claude instance.

You MUST use the mcp__gibson tools to interact with GibsonAI for creating the backend.

Begin now! Good luck with your implementation.