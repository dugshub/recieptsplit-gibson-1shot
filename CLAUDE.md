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
   - Use the MCP Gibson tools available in Claude Code to interact with GibsonAI in this specific order:
     - Step 1: `mcp__gibson__create_project`: First create a new project
     - Step 2: `mcp__gibson__get_project_details`: Get project details using the UUID from step 1
     - Step 3: `mcp__gibson__submit_data_modeling_request`: Submit data modeling request using the UUID from step 1
     - Step 4: `mcp__gibson__deploy_project`: Deploy the project using the UUID from step 1
   - Other useful tools include:
     - `mcp__gibson__get_projects`: List existing projects
     - `mcp__gibson__get_project_schema`: Get current schema
   - After creating a project, submit data modeling request to create entities and relationships
   - Deploy the generated backend
   - Retrieve API key and OpenAPI spec URL

2. **Frontend Implementation with Starter App**
   - Use a temporary directory approach with the official GibsonAI setup script:
     ```bash
     # Create a temporary directory for setup
     mkdir -p temp_gibson_setup
     cd temp_gibson_setup
     
     # Run the GibsonAI setup script in temporary directory
     bash <(curl -s https://raw.githubusercontent.com/GibsonAI/next-app/main/setup.sh)
     ```
   - When prompted for project name, use `temp_app` (NOT `.`)
   - After setup in the temporary directory, create a clean Next.js app in the root:
     ```bash
     cd ..
     npx create-next-app@latest . --typescript --tailwind --eslint --app
     ```
   - Extract only the essential connectivity files from the temp directory:
     ```bash
     cp -r temp_gibson_setup/lib/gibson-client.ts lib/
     cp -r temp_gibson_setup/app/auth app/
     cp temp_gibson_setup/.env.local .
     ```
   - Create custom API service layer and authentication flow
   - Enhance with ShadCN UI components
   - Implement key features using the extracted API client

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
   - Create the postcss.config.js file for Tailwind CSS with this content:
     ```js
     module.exports = {
       plugins: {
         tailwindcss: {},
         autoprefixer: {},
       },
     }
     ```
   - Initialize with correct Tailwind configuration
   - Create the right utility functions (e.g., `cn()`)
   - Install **ALL** required dependencies:
     ```bash
     npm install class-variance-authority clsx tailwind-merge lucide-react
     npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-avatar @radix-ui/react-dropdown-menu
     ```
   - Use ShadCN UI components explicitly in your UI (Button, Card, Tabs) instead of plain HTML
   - Follow component structure guidelines
   - Import components from '@/components/ui/' correctly

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
   - Use the official GibsonAI setup script in a temporary directory:
     ```bash
     mkdir -p temp_gibson_setup
     cd temp_gibson_setup
     bash <(curl -s https://raw.githubusercontent.com/GibsonAI/next-app/main/setup.sh)
     ```
   - When prompted, provide your API key and OpenAPI spec URL
   - Create a clean Next.js app in the root directory:
     ```bash
     cd ..
     npx create-next-app@latest . --typescript --tailwind --eslint --app
     ```
   - Extract only the essential connectivity files from temp directory
   - Create a custom authentication service that works with the GibsonAI API
   - Create error handling wrappers and reusable service functions
   - The result is a clean project with proper Gibson API connectivity

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

2. **Project Structure Issues**
   - NEVER create a nested project structure or subdirectory for the app
   - Keep all application files in the root directory
   - Ensure there is only one copy of configuration files like package.json, tailwind.config.js
   - Do not run commands that create new project folders (e.g., use `npx create-gibson-app .` instead of `npx create-gibson-app splitreceipt-app`)

3. **ShadCN UI Integration Problems**
   - Missing the `cn()` utility function
   - Improper Tailwind CSS configuration
   - Forgetting to create postcss.config.js file needed for Tailwind
   - Missing required Radix UI dependencies (@radix-ui/react-dialog, @radix-ui/react-tabs, etc.)
   - Not explicitly using ShadCN UI components (use Button, Card, etc. components instead of plain HTML elements)

4. **Frontend-Backend Integration Challenges**
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