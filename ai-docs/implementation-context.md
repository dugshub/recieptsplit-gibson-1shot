# Implementation Context for SplitReceipt App

This document provides context and reference information for implementing the SplitReceipt application using GibsonAI MCP for the backend and ShadCN UI for the frontend.

## GibsonAI MCP Overview

GibsonAI's Model Context Protocol (MCP) allows you to generate entire backend systems using natural language instructions. The protocol interprets complex requirements and produces production-ready backends.

### How GibsonAI MCP Works

1. **Project Creation**: GibsonAI creates a new project with the specified database schema and relationships.
2. **Schema Generation**: It generates tables, fields, and relationships based on the natural language description.
3. **API Endpoint Generation**: It creates RESTful API endpoints for CRUD operations on each entity.
4. **Authentication Implementation**: It configures JWT-based authentication with role-based access control.
5. **Data Population**: It can pre-populate the database with sample data for testing.

### Accessing the GibsonAI MCP Backend

The GibsonAI MCP backend is accessed through a single SQL query endpoint:

```
https://api.gibsonai.com/v1/-/query
```

All requests to this endpoint require an API key in the headers:

```
X-Gibson-API-Key: YOUR_API_KEY
```

The payload for the endpoint is a JSON object with a SQL query:

```json
{
  "query": "SELECT * FROM users WHERE id = 1"
}
```

## ShadCN UI Overview

ShadCN UI is a collection of reusable components built on top of Tailwind CSS and Radix UI primitives. It provides accessible, customizable components that can be copied into your project.

### Key Benefits of ShadCN UI

1. **Copy-paste components**: ShadCN components can be directly copied into your project.
2. **Full control**: You own the code, so you can customize the components as needed.
3. **Accessibility**: Components are built on Radix UI primitives, ensuring accessibility.
4. **Customizable**: Easily override styles with Tailwind CSS classes.

### Common Component Usage

Here's an example of how to use ShadCN UI components:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

## Implementation Tips

### Tailwind CSS + ShadCN Configuration

When setting up Tailwind CSS with ShadCN UI, use the following pattern:

1. Configure Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Update tailwind.config.js:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // ShadCN theme extensions
    },
  },
  plugins: [],
}
```

3. Configure CSS variables in index.css:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* Other CSS variables */
  }
}
```

### TypeScript Configuration

Use the following settings for proper TypeScript configuration with ShadCN UI:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Path Utilities

Create a utils.ts file for the ShadCN path utilities:

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Common Pitfalls and Solutions

### Tailwind CSS Issues

**Issue**: Custom colors not working with Tailwind CSS
**Solution**: Use CSS variables and HSL values:
```css
:root {
  --primary: 221.2 83.2% 53.3%;
}
```

**Issue**: Module exports error in postcss.config.js
**Solution**: Use CommonJS syntax in postcss.config.cjs:
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### TypeScript Module Resolution

**Issue**: TypeScript module resolution errors
**Solution**: 
- Use explicit type imports: `import type { User } from '../types'`
- Configure moduleResolution in tsconfig.json: `"moduleResolution": "node"`

### ShadCN Component Integration

**Issue**: Missing the cn utility function
**Solution**: Create the utils.ts file with the cn function

**Issue**: Component styling conflicts
**Solution**: Use the cn utility for proper className merging:
```tsx
<Button className={cn("custom-class", buttonVariants({ variant, size }))}>Click me</Button>
```

## Further Resources

- [ShadCN UI Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)