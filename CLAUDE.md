# SplitReceipt: 1-Shot Challenge Guide

This document provides comprehensive guidance for implementing the SplitReceipt application in a single prompt interaction as part of the GibsonAI OneShot Hackathon.

## Project Overview

SplitReceipt is a full-stack application that allows users to:
- Create trips/events
- Upload receipt images
- Extract and process line items
- Split expenses among trip members
- Calculate balances between users

## Technical Stack

### Backend
- **GibsonAI MCP** for data modeling and API generation
- JWT-based authentication
- SQL database with predefined schema

### Frontend Implementation

The 1-shot challenge WILL use the **GibsonAI Next.js Starter App** approach:
- GibsonAI Next.js starter app
- Type-safe API client generation
- ShadCN UI components
- TailwindCSS for styling

## MCP Server Setup Requirements

Before beginning the 1-shot challenge, ensure that:

1. **GibsonAI MCP Server** is configured and connected
   ```
   # Verify MCP connection
   mcp
   ```
   
2. **Credentials are available** for the GibsonAI API

## Implementation Strategy

The 1-shot approach MUST follow this sequence:

### Implementation with GibsonAI Next.js Starter App

1. **Backend Creation with GibsonAI**
   - Use the MCP Gibson tools available in Claude Code to interact with GibsonAI:
     - `mcp__gibson__create_project`: Create a new project
     - `mcp__gibson__get_projects`: List existing projects
     - `mcp__gibson__get_project_details`: Get project details
     - `mcp__gibson__submit_data_modeling_request`: Submit data modeling request
     - `mcp__gibson__deploy_project`: Deploy the project
   - Submit data modeling request to create entities and relationships
   - Deploy the generated backend
   - Retrieve API key and OpenAPI spec URL

2. **Frontend Implementation with Starter App**
   - Generate the Next.js starter app
   - Provide API key and OpenAPI spec URL during setup
   - Enhance with ShadCN UI components
   - Implement key features using the generated type-safe client

## Key Guidelines for the 1-Shot Challenge

### Backend Generation Best Practices

1. **Be explicit about relationships** in the data modeling request
   - Clearly define foreign keys and their constraints
   - Specify relationship cardinality (one-to-many, many-to-many)

2. **Include critical business logic requirements**
   - Authentication requirements
   - Access control
   - Validation rules

3. **Request sample data generation** for testing

4. **Data Modeling Request Format**
   The data modeling request to GibsonAI should follow this structured format:
   ```
   # Schema Design
   [Detailed description of entities and their relationships]

   # Authentication Requirements
   [Specifics about auth mechanism]

   # API Endpoints
   [Required endpoints with HTTP methods]

   # Sample Data
   [Instructions for generating test data]
   ```

### Frontend Implementation Focus Areas

1. **Configure ShadCN UI properly**
   - Initialize with correct Tailwind configuration
   - Create the right utility functions (e.g., `cn()`)
   - Follow component structure guidelines

2. **Implement responsive design** from the start
   - Mobile-first approach
   - Proper breakpoints

3. **Establish strong TypeScript patterns**
   - Define interfaces for all data models
   - Use proper type imports
   - Maintain consistent typing

4. **Create robust API integration**
   - Use the generated type-safe client from the Next.js starter app
   - Handle errors and loading states properly

## GibsonAI Next.js Starter App

The GibsonAI Next.js starter app provides several advantages for the 1-shot challenge:

1. **Type-Safe API Client**: Automatically generates a client that matches your backend schema.

2. **Ready-to-Use Structure**: Comes with pre-configured pages and components.

3. **Secure API Access**: Properly handles environment variables and API key security.

4. **Integration Process**:
   - After creating your GibsonAI backend, you'll receive an API key and OpenAPI spec URL
   - Use these to generate the starter app
   - The app will be pre-configured to connect to your backend

5. **Implementation Focus**:
   - Add ShadCN UI components for enhanced UI
   - Implement core business logic
   - Focus on UX rather than API plumbing

## Common Pitfalls to Avoid

1. **GibsonAI Backend Connection Issues**
   - Ensure proper API key integration
   - Use the correct query endpoint format
   - Handle SQL query escaping properly
   - Always use the appropriate MCP tools (`mcp__gibson__*`) to interact with GibsonAI
   - Remember that you need to create a project first before submitting data modeling requests

2. **ShadCN UI Integration Problems**
   - Missing the `cn()` utility function
   - Improper Tailwind CSS configuration
   - Forgetting to import required component dependencies

3. **Frontend-Backend Integration Challenges**
   - Mismatched data types between frontend and backend
   - Improper error handling
   - Missing authentication token management

## Previous Lessons Learned

From our previous attempt, we learned:

1. The backend connection with GibsonAI worked successfully, but:
   - Frontend components needed more robust styling
   - Authentication flow required more detailed implementation
   - API integration needed clearer error handling

2. Focus areas for improvement:
   - More detailed ShadCN UI component implementation
   - Better TypeScript integration
   - More robust state management
   - Clearer API service structure

3. **We MUST use the Next.js starter app** instead of a custom Vite implementation for:
   - Better type safety with the generated client
   - Reduced boilerplate code
   - More focus on feature implementation

## Hackathon Submission Requirements

Remember that the final submission will be judged on:
- Prompt Efficiency (35%)
- Functionality (25%)
- Design & UX (15%)
- Creativity (15%)
- Reproducibility (10%)

Ensure the 1-shot prompt addresses all these criteria by being concise yet comprehensive, focusing on core functionality, emphasizing good design practices, and ensuring the solution can be reliably reproduced.

## Reference Resources

- [ShadCN UI Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [GibsonAI Documentation](https://www.gibsonai.com/docs)