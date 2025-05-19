# SplitReceipt Full-Stack App Implementation Prompt

## Overview
This is a comprehensive prompt that guides the implementation of SplitReceipt, a receipt splitting application. The implementation will use GibsonAI MCP for the backend and a React application with ShadCN UI components for the frontend.

## Implementation Steps

### 1. Backend Implementation with GibsonAI MCP

First, create a new GibsonAI project for the backend:

```
Create a receipt splitting app with the following entities and relationships:

1. Users - Store user accounts with authentication info
2. Trips - Group receipts by trip/event
3. TripMembers - Track which users belong to which trips
4. Receipts - Store receipt metadata and image references
5. LineItems - Individual items from receipts
6. Splits - Track how line items are split between users

Key relationships:
- Users can belong to multiple Trips (many-to-many through TripMembers)
- Trips contain multiple Receipts (one-to-many)
- Receipts contain multiple LineItems (one-to-many)
- LineItems can be split among multiple Users (many-to-many through Splits)

Important fields:
- Add a processing_status field to Receipts to track OCR status (enum: uploaded, processing, ready, error)
- Store image_path in Receipts for the uploaded receipt images
- Include timestamps on all entities
```

Implement JWT-based authentication with the following features:
- Secure user registration and login endpoints
- Password hashing using bcrypt
- Role-based permissions (admin, member)
- Resource-based access control for trips and receipts
- Input validation for all endpoints

Generate a complete REST API with these endpoints:
- Authentication: POST /api/auth/register, POST /api/auth/login
- User Management: GET/PATCH /api/users/me
- Trip Management: CRUD operations for trips, adding members
- Receipt Management: CRUD operations for receipts, upload/process images
- LineItem and Split Management: endpoints for creating and managing these
- Balance Calculation: GET /api/trips/{trip_id}/balances

Pre-populate with sample data for testing:
- Create sample users (user1, user2, user3)
- Create a sample trip with these users as members
- Add 3-5 receipts with various line items
- Create some initial splits for demonstration

### 2. Frontend Implementation

#### Project Setup

Initialize a new React project with Vite, TypeScript, and ShadCN UI:

```bash
# Create Vite project with React and TypeScript
npm create vite@latest splitreceipt-frontend -- --template react-ts

# Navigate to the project
cd splitreceipt-frontend

# Install dependencies
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install ShadCN UI dependencies
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-avatar @radix-ui/react-dropdown-menu

# Install other dependencies
npm install react-router-dom @tanstack/react-query axios zustand date-fns framer-motion
```

Set up Tailwind CSS configuration in tailwind.config.js:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
  plugins: [],
}
```

Create styles in src/index.css:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

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
  }
}
```

#### Creating ShadCN UI Components

Create the following ShadCN UI components:

1. Create a components/ui directory to store all shared UI components:

```bash
mkdir -p src/components/ui
```

2. Create the button component:

```typescript
// src/components/ui/button.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

3. Create other ShadCN UI components similarly for:
   - Card
   - Tabs
   - Dialog
   - Avatar
   - Form
   - DropdownMenu

#### API Integration Setup

Create API integration with the Gibson backend:

```typescript
// src/api/client.ts
import axios from 'axios';

export const API_URL = 'https://api.gibsonai.com/v1/-/query';
export const API_KEY = 'YOUR_GIBSON_API_KEY'; // Replace with your Gibson API key

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Gibson-API-Key': API_KEY,
  },
});

// Generic function to execute SQL queries
export const executeQuery = async <T>(sql: string): Promise<T> => {
  try {
    const response = await apiClient.post('', { query: sql });
    return response.data as T;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

#### AuthContext for Authentication

Create the authentication context:

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '../types';
import { loginUser, getCurrentUser } from '../api/services';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in by looking for user ID in localStorage
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserId) {
      // Fetch the user data
      getCurrentUser(storedUserId)
        .then(userData => {
          setUser(userData);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('userId');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      const userData = await loginUser(username, password);
      setUser(userData);
      // Store user ID in localStorage
      localStorage.setItem('userId', userData.id.toString());
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### Core Pages Implementation

Implement the core pages as per the design requirements:

1. **Login Page**
2. **Trips List Page**
3. **Trip Details Page with tabs**:
   - Receipts Tab
   - Balances Tab
   - Activity Tab
4. **Receipt Entry Form**
5. **Receipt Details with Split Options**

Example of the Trips List Page:

```tsx
// src/pages/TripsPage.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';

import { getTrips } from '../api/services';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CreateTripModal } from '../components/trips/CreateTripModal';
import type { Trip } from '../types';

export function TripsPage() {
  const navigate = useNavigate();
  const { data: trips, isLoading, refetch } = useQuery({
    queryKey: ['trips'],
    queryFn: () => getTrips(),
  });
  
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleTripClick = (tripId: number) => {
    navigate(`/trips/${tripId}`);
  };

  const handleTripCreated = () => {
    setShowCreateModal(false);
    refetch();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <PlusIcon className="mr-2 h-4 w-4" /> New Trip
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full" />
        </div>
      ) : trips?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">No trips yet</h3>
          <p className="text-muted-foreground mb-6">Create your first trip to get started</p>
          <Button onClick={() => setShowCreateModal(true)}>
            <PlusIcon className="mr-2 h-4 w-4" /> Create Trip
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips?.map((trip: Trip) => (
            <Card 
              key={trip.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleTripClick(trip.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle>{trip.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {/* Placeholder for user avatars */}
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">
                      U1
                    </div>
                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-medium">
                      U2
                    </div>
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium">
                      +1
                    </div>
                  </div>
                  
                  <div className="bg-muted px-3 py-1 rounded-full text-sm font-medium">
                    $350
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <CreateTripModal 
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTripCreated={handleTripCreated}
      />
    </div>
  );
}
```

#### App Router Setup

Set up the router in App.tsx:

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { TripsPage } from './pages/TripsPage';
import { TripDetailsPage } from './pages/TripDetailsPage';
import { ReceiptDetailsPage } from './pages/ReceiptDetailsPage';

// Create React Query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/trips" element={
              <ProtectedRoute>
                <TripsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/trips/:tripId" element={
              <ProtectedRoute>
                <TripDetailsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/receipts/:receiptId" element={
              <ProtectedRoute>
                <ReceiptDetailsPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/trips" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
```

## Important Implementation Notes

1. **TypeScript Type Definitions**
   - Create proper TypeScript interfaces for all data models
   - Use type imports with `import type` syntax
   - Maintain declaration files in a central location

2. **ShadCN Component Structure**
   - Follow ShadCN component patterns consistently
   - Create UI components in the components/ui directory
   - Use composition patterns for complex components

3. **CSS and Styling**
   - Configure Tailwind CSS properly with ShadCN
   - Use CSS variables for theme colors
   - Implement responsive design for mobile-first approach

4. **API Integration**
   - Implement proper error handling in API calls
   - Use React Query for data fetching and caching
   - Create typed API functions for each endpoint

5. **Authentication**
   - Use JWT token storage in localStorage
   - Create a protected route component for authentication
   - Handle auth state with context API

6. **Module Resolution**
   - Configure proper module resolution in tsconfig.json
   - Use path aliases for cleaner imports

## Design Requirements

The frontend should follow these design guidelines:

- **Color Scheme**:
  - Primary: Blue (#2563eb)
  - Secondary: Green (#10b981)
  - Error: Red (#dc2626)
  - Background: Light gray (#f8fafc)

- **Typography**:
  - Headline: Inter Bold 20pt
  - Body: Inter Medium 16pt
  - Labels: Inter Regular 14pt

- **Spacing**:
  - 8px baseline grid
  - 16px card padding

- **Elevations**:
  - Subtle shadows for cards
  - Depth via opacity layers

The application should be fully responsive and mobile-first in design.

## Implementation Sequence

1. Set up the GibsonAI MCP backend
2. Initialize the frontend project with proper configuration
3. Create shared UI components with ShadCN
4. Implement API integration services
5. Develop authentication context and login screen
6. Build the trips list page
7. Implement trip details with tabs
8. Create receipt entry form
9. Develop receipt details with split options
10. Add animations and transitions
11. Implement responsive design adjustments
12. Test the application thoroughly

Following this implementation approach will result in a complete, polished receipt splitting application with a production-ready backend generated by GibsonAI MCP and a beautiful frontend built with ShadCN UI components.