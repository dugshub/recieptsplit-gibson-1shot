# SplitReceipt: Step-by-Step Implementation Guide

This document provides a precise, linear sequence of steps to implement the SplitReceipt application. Follow these instructions exactly in the given order.

## Implementation Overview

```
▢ STEP 1: BACKEND CREATION - Create GibsonAI backend
▢ STEP 2: FRONTEND SETUP - Set up Next.js app with GibsonAI script
▢ STEP 3: UI ENHANCEMENT - Add ShadCN UI components
▢ STEP 4: FEATURE IMPLEMENTATION - Build core features
▢ STEP 5: TESTING - Verify functionality
```

## STEP 1: BACKEND CREATION

### 1.1. Create a new GibsonAI project

```bash
# Execute the MCP Gibson create_project function
mcp__gibson__create_project
```

When prompted for project details, use:
- Project name: "SplitReceipt"

Expected output:
```
{
  "uuid": "[project-uuid]",
  "name": "SplitReceipt",
  ...
}
```

**IMPORTANT:** Save the `uuid` value shown in the response - you'll need it for subsequent steps.

### 1.2. Get project details

```bash
# Execute the MCP Gibson get_project_details function using the UUID from step 1.1
mcp__gibson__get_project_details
```

When prompted for project UUID, enter the UUID saved from step 1.1.

### 1.3. Submit data modeling request

```bash
# Execute the MCP Gibson submit_data_modeling_request function
mcp__gibson__submit_data_modeling_request
```

When prompted, provide:
- UUID: The project UUID from step 1.1
- Data modeling request: Exactly paste the following schema:

```
Create a receipt splitting app with the following entities and relationships:

1. Users - Store user accounts with authentication info
   - id (primary key, auto-increment)
   - username (varchar, unique)
   - email (varchar, unique)
   - password_hash (varchar)
   - created_at (timestamp)
   - updated_at (timestamp)

2. Trips - Group receipts by trip/event
   - id (primary key, auto-increment)
   - name (varchar)
   - description (text, nullable)
   - start_date (date)
   - end_date (date, nullable)
   - created_at (timestamp)
   - updated_at (timestamp)

3. TripMembers - Track which users belong to which trips
   - id (primary key, auto-increment)
   - trip_id (foreign key to Trips.id)
   - user_id (foreign key to Users.id)
   - role (enum: 'owner', 'member')
   - created_at (timestamp)
   - updated_at (timestamp)

4. Receipts - Store receipt metadata and image references
   - id (primary key, auto-increment)
   - trip_id (foreign key to Trips.id)
   - user_id (foreign key to Users.id)
   - title (varchar)
   - date (date)
   - total_amount (decimal(10,2))
   - merchant (varchar, nullable)
   - image_path (varchar, nullable)
   - processing_status (enum: 'uploaded', 'processing', 'ready', 'error')
   - created_at (timestamp)
   - updated_at (timestamp)

5. LineItems - Individual items from receipts
   - id (primary key, auto-increment)
   - receipt_id (foreign key to Receipts.id)
   - description (varchar)
   - amount (decimal(10,2))
   - quantity (int, default 1)
   - created_at (timestamp)
   - updated_at (timestamp)

6. Splits - Track how line items are split between users
   - id (primary key, auto-increment)
   - line_item_id (foreign key to LineItems.id)
   - user_id (foreign key to Users.id)
   - amount (decimal(10,2))
   - percentage (decimal(5,2), nullable)
   - created_at (timestamp)
   - updated_at (timestamp)

Key relationships:
- Users can belong to multiple Trips (many-to-many through TripMembers)
- Trips contain multiple Receipts (one-to-many)
- Receipts contain multiple LineItems (one-to-many)
- LineItems can be split among multiple Users (many-to-many through Splits)

Implement JWT-based authentication with the following features:
- Secure user registration and login endpoints
- Password hashing using bcrypt
- Role-based permissions (admin, member)
- Resource-based access control for trips and receipts

Pre-populate with sample data for testing:
- Create sample users (user1, user2, user3) with password "password123"
- Create a sample trip with these users as members
- Add 3-5 receipts with various line items
- Create some initial splits for demonstration
```

### 1.4. Deploy the GibsonAI project

```bash
# Execute the MCP Gibson deploy_project function
mcp__gibson__deploy_project
```

When prompted, provide:
- UUID: The project UUID from step 1.1

### 1.5. Get the deployment details

```bash
# Execute the MCP Gibson get_project_details function to get the API key
mcp__gibson__get_project_details
```

When prompted, provide:
- UUID: The project UUID from step 1.1

**IMPORTANT:** From the response, record the following information:
1. The development API key (will look like `gAAAAABo...`)
2. The OpenAPI spec URL (will look like `https://api.gibsonai.com/-/openapi/[docs_slug]`)

You will need these in the next step.

## STEP 2: FRONTEND SETUP

### 2.1. Create a Temporary Directory for GibsonAI Setup

To avoid potential git conflicts and nested project issues, we'll use a temporary directory for the GibsonAI setup:

```bash
# Create a temporary directory
mkdir -p temp_gibson_setup
cd temp_gibson_setup

# Run the GibsonAI setup script in the temporary directory
bash <(curl -s https://raw.githubusercontent.com/GibsonAI/next-app/main/setup.sh)
```

**WHEN PROMPTED, PROVIDE THESE RESPONSES:**

When you see: `Enter project name:`
Type: `temp_app`

When you see: `Enter Gibson API key:`
Enter the API key you recorded from step 1.5

When you see: `Enter OpenAPI spec URL:`
Enter the OpenAPI spec URL you recorded from step 1.5

### 2.2. Set Up Clean Next.js Project in Main Directory

Return to your main project directory and create a new Next.js application:

```bash
# Return to main project directory
cd ..

# Create a new Next.js app in the current directory
npx create-next-app@latest . --typescript --tailwind --eslint --app
```

**ANSWER "Yes" TO ALL SETUP QUESTIONS**

### 2.3. Copy Essential Files from Temporary Setup

Extract only the essential API and authentication files from the temporary setup:

```bash
# Create required directories if they don't exist
mkdir -p lib app/auth

# Copy API client files
cp -r temp_gibson_setup/lib/gibson-client.ts lib/
cp -r temp_gibson_setup/app/auth app/
cp temp_gibson_setup/.env.local .
```

### 2.4. Create Authentication Service

Create a service to handle authentication. Create a file at `lib/auth-service.ts`:

```typescript
// lib/auth-service.ts
import { client } from './gibson-client';

// Session management functions
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const clearToken = (): void => {
  localStorage.removeItem('auth_token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Auth API functions - implementation will depend on generated client
export const loginUser = async (credentials) => {
  try {
    const response = await client.auth.login(credentials);
    if (response.token) {
      setToken(response.token);
    }
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (credentials) => {
  try {
    const response = await client.auth.register(credentials);
    if (response.token) {
      setToken(response.token);
    }
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logoutUser = (): void => {
  clearToken();
  window.location.href = '/';
};
```

### 2.5. Install Required UI Dependencies

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-avatar @radix-ui/react-dropdown-menu
```

### 2.6. Create API Integration Services

Create a basic API service wrapper at `lib/api-service.ts`:

```typescript
// lib/api-service.ts
import { getToken } from './auth-service';

export const createApiRequest = async (requestFn, errorMessage = 'An error occurred') => {
  try {
    return await requestFn();
  } catch (error) {
    console.error(errorMessage, error);
    throw {
      message: errorMessage,
      details: error
    };
  }
};
```

## STEP 3: UI ENHANCEMENT

### 3.1. Configure Tailwind and PostCSS

Create a file named `postcss.config.js` in the root directory:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 3.2. Create the Utility Function for ShadCN UI

Create or update the file `lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 3.3. Set Up Key ShadCN UI Components

Create a directory for UI components:

```bash
mkdir -p components/ui
```

Refer to the ui-design-guidelines.md document for detailed styling patterns.

Install the ShadCN CLI for easier component setup:

```bash
npm install -D @shadcn/ui
```

Add essential components using the CLI:

```bash
# Add button component
npx shadcn-ui@latest add button

# Add card component
npx shadcn-ui@latest add card

# Add tabs component
npx shadcn-ui@latest add tabs

# Add other needed components
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
```

### 3.4. Set Up Color Scheme

Ensure your `tailwind.config.js` includes the following color variables:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### 3.5. Update Global CSS Variables

Update your `app/globals.css` file to include the color scheme variables:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
 
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 160 84% 39%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 160 84% 39%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

## STEP 4: FEATURE IMPLEMENTATION

### 4.1. Create Layout Structure

First, create a consistent layout structure:

1. Update `app/layout.tsx` to include authentication provider and navigation:

```tsx
// This is just a guideline structure - implement based on your needs
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Include navigation here if needed */}
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 4.2. Implement Authentication-Aware Home Page

Create a home page that adapts to authentication state:

1. Create `app/page.tsx` following the design guidelines:

```tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // If loading, show a spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }
  
  // If logged in, show dashboard or redirect to trips
  if (isAuthenticated) {
    return <AuthenticatedHome />;
  }
  
  // Otherwise show landing page for non-authenticated users
  return <LandingPage />;
}

// Landing page component for non-authenticated users
function LandingPage() {
  // Implement based on ui-design-guidelines.md
  return (
    <div className="container mx-auto min-h-screen flex flex-col justify-center items-center">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight">SplitReceipt</h1>
        <p className="text-xl text-muted-foreground">
          The easiest way to split expenses with friends, family, and colleagues.
        </p>
        
        {/* Add CTA buttons */}
        {/* Add feature cards */}
      </div>
    </div>
  );
}

// Home page for authenticated users
function AuthenticatedHome() {
  // Implement based on ui-design-guidelines.md
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Add recent trips section */}
      {/* Add quick actions */}
    </div>
  );
}
```

### 4.3. Create Trip Management Pages

Follow these guidelines to implement trip management:

1. Create directory structure:
```
app/
  trips/
    page.tsx       # Trip list page
    new/
      page.tsx     # New trip form
    [tripId]/
      page.tsx     # Trip details with tabs
      receipts/
        page.tsx   # Receipts list
      members/
        page.tsx   # Members management
```

2. Implement trips list with proper loading, empty, and error states:

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTrips } from '@/lib/hooks/useTrips';
import { withAuth } from '@/lib/with-auth';

// Implement trip list page following ui-design-guidelines.md
// Key features:
// - Show loading state
// - Show empty state with CTA
// - Show error state with retry
// - Display grid of trip cards
// - Include create trip button
// - Use responsive grid layout
```

3. Create TripCard component:

```tsx
// components/trips/TripCard.tsx
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// Implement based on ui-design-guidelines.md
// Key features:
// - Display trip name, date range
// - Show member avatars with overflow indicator
// - Display total amount badge
// - Use hover effects for interactive feedback
```

### 4.4. Create Authentication Flow

Implement authentication components:

1. Login/Registration components:

```tsx
// app/auth/login/page.tsx & app/auth/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '@/lib/auth-service';

// Implement following ui-design-guidelines.md
// Key features:
// - Form validation
// - Error handling
// - Success redirection
// - Loading states during submission
```

### 4.5. Create Receipt Management

Implement receipt features:

1. Receipt forms:

```tsx
// components/receipts/ReceiptForm.tsx
// components/receipts/LineItemForm.tsx

// Implement following ui-design-guidelines.md
// Key features:
// - Dynamic line item addition
// - Form validation
// - Total calculation
// - Save/cancel actions
```

2. Receipt list:

```tsx
// app/trips/[tripId]/receipts/page.tsx

// Implement following ui-design-guidelines.md
// Key features:
// - List receipts with key details
// - Add receipt button
// - Receipt card with preview information
```

3. Line item splitting interface:

```tsx
// components/receipts/SplitInterface.tsx

// Implement following ui-design-guidelines.md
// Key features:
// - Member selection
// - Amount input
// - Split evenly button
// - Remaining amount display
```
```

## STEP 5: TESTING

### 5.1. Testing API Integration

Before starting the development server, test your API integration:

```bash
# Test API key and OpenAPI spec URL
curl -H "X-Gibson-API-Key: YOUR_API_KEY" https://api.gibsonai.com/-/openapi/YOUR_DOCS_SLUG
```

If you receive valid response, your API is properly configured.

### 5.2. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

### 5.3. Testing Authentication Flow

1. Open your browser to http://localhost:3000
2. Click "Register" and create a test account
3. Verify you can log out and log back in
4. Check that protected routes redirect to login when not authenticated

### 5.4. Testing Trip Management

1. Create a new trip
2. Verify the trip appears in the trips list
3. Navigate to the trip details page
4. Try adding members to the trip
5. Verify you can navigate between tabs (receipts, members, balances)

### 5.5. Testing Receipt Management

1. Add a receipt to a trip
2. Add line items to the receipt
3. Test the splitting interface
4. Verify the balances update correctly

### 5.6. Cross-Browser and Responsive Testing

1. Test on multiple devices or using browser DevTools responsive mode
2. Verify the UI is properly responsive
3. Check that all interactive elements are properly sized for touch input

### 5.7. Error Handling Testing

1. Test behavior with API errors (you can temporarily modify API key to simulate)
2. Verify loading states appear appropriately
3. Check that error messages are user-friendly

## Debugging Tips

If you encounter issues:

1. **API Integration Problems**:
   - Check `.env.local` file for correct API credentials
   - Verify OpenAPI schema is correctly fetched
   - Check your browser console for network errors

2. **Styling Issues**:
   - Confirm CSS variables are properly defined in `globals.css`
   - Verify Tailwind is properly configured
   - Check for class name conflicts

3. **Authentication Problems**:
   - Check token storage in localStorage
   - Verify API calls include the authentication token
   - Confirm auth provider is correctly wrapping your application

4. **Data Display Issues**:
   - Verify data structure matches your component expectations
   - Check for null/undefined handling in components
   - Add console logs to debug data flow

5. **Navigation Issues**:
   - Make sure you're using Next.js navigation correctly (Link components, useRouter)
   - Check dynamic routes are properly structured
   - Verify auth redirect logic works correctly