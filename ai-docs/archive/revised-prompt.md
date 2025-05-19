# SplitReceipt: Full-Stack 1-Shot Implementation

## Project Overview

Create a comprehensive receipt splitting application that allows users to:
1. Create trips/events with multiple members
2. Upload and process receipts
3. Split expenses among trip members
4. Calculate balances between users

This implementation will use GibsonAI MCP for the backend and a React + ShadCN UI frontend.

## Implementation Steps

### 1. Backend Implementation with GibsonAI MCP

Create a new GibsonAI project with the following data modeling request:

```
Create a receipt splitting app with the following entities and relationships:

1. Users - Store user accounts with authentication info
   - id (primary key)
   - username (unique)
   - email (unique)
   - password_hash
   - created_at
   - updated_at

2. Trips - Group receipts by trip/event
   - id (primary key)
   - name
   - description
   - start_date
   - end_date
   - created_at
   - updated_at

3. TripMembers - Track which users belong to which trips
   - id (primary key)
   - trip_id (foreign key to Trips)
   - user_id (foreign key to Users)
   - role (enum: owner, member)
   - created_at
   - updated_at

4. Receipts - Store receipt metadata and image references
   - id (primary key)
   - trip_id (foreign key to Trips)
   - user_id (foreign key to Users, who uploaded it)
   - title
   - date
   - total_amount
   - merchant
   - image_path
   - processing_status (enum: uploaded, processing, ready, error)
   - created_at
   - updated_at

5. LineItems - Individual items from receipts
   - id (primary key)
   - receipt_id (foreign key to Receipts)
   - description
   - amount
   - quantity
   - created_at
   - updated_at

6. Splits - Track how line items are split between users
   - id (primary key)
   - line_item_id (foreign key to LineItems)
   - user_id (foreign key to Users)
   - amount
   - percentage
   - created_at
   - updated_at

Implement JWT-based authentication with the following features:
- Secure user registration and login endpoints
- Password hashing using bcrypt
- Role-based permissions (admin, member)
- Resource-based access control for trips and receipts

Generate a complete REST API with these endpoints:
- Authentication: POST /api/auth/register, POST /api/auth/login
- User Management: GET/PATCH /api/users/me
- Trip Management: CRUD operations for trips, adding members
- Receipt Management: CRUD operations for receipts
- LineItem and Split Management: endpoints for creating and managing these
- Balance Calculation: GET /api/trips/{trip_id}/balances

Pre-populate with sample data for testing:
- Create sample users (user1, user2, user3)
- Create a sample trip with these users as members
- Add 3-5 receipts with various line items
- Create some initial splits for demonstration
```

Once the backend is created, retrieve and store the API key and connection details for frontend integration.

### 2. Frontend Implementation

#### Project Setup

Initialize a new React project with the proper dependencies:

```bash
# Create Vite project with React and TypeScript
npm create vite@latest splitreceipt-frontend -- --template react-ts
cd splitreceipt-frontend
npm install

# Install dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-avatar @radix-ui/react-dropdown-menu @radix-ui/react-form @radix-ui/react-popover
npm install react-router-dom @tanstack/react-query axios zustand date-fns framer-motion
```

Configure Tailwind CSS with ShadCN UI variables by:
1. Setting up the tailwind.config.js file with the ShadCN color scheme
2. Creating the CSS variables in src/index.css
3. Implementing the utility functions in src/lib/utils.ts

#### Core Component Implementation

Create the following ShadCN UI components in src/components/ui:
- Button
- Card
- Tabs
- Dialog
- Avatar
- Form
- Input
- DropdownMenu

#### API Integration

Implement the API integration with GibsonAI:

```typescript
// src/api/client.ts
import axios from 'axios';

// Get these values from the GibsonAI project
export const API_URL = 'https://api.gibsonai.com/v1/-/query';
export const API_KEY = 'YOUR_GIBSON_API_KEY'; 

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Gibson-API-Key': API_KEY,
  },
});

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

Create typed services for API operations:

```typescript
// src/api/services.ts
import { executeQuery } from './client';
import type { User, Trip, Receipt, LineItem, Split, Balance } from '../types';

// User services
export const loginUser = async (username: string, password: string): Promise<User> => {
  const sql = `SELECT id, username, email FROM users WHERE username = '${username}' AND password_hash = '${password}'`;
  const result = await executeQuery<User[]>(sql);
  if (result.length === 0) {
    throw new Error('Invalid username or password');
  }
  return result[0];
};

// Trip services
export const getTrips = async (): Promise<Trip[]> => {
  const sql = `SELECT * FROM trips ORDER BY created_at DESC`;
  return executeQuery<Trip[]>(sql);
};

// Add more service functions for all entities
```

#### Authentication Context

Implement the authentication context:

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Authentication logic implementation
  // ...

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

Implement the following pages:

1. **Login Page** - Allows users to authenticate
2. **Trips List Page** - Displays all trips for the current user
3. **Trip Details Page** - Shows trip information with tabs for:
   - Receipts (list and add new)
   - Balances (who owes whom)
   - Members (manage trip members)
4. **Receipt Details Page** - Shows receipt details and allows splitting items
5. **Receipt Entry Form** - Allows adding new receipts with line items

#### Router Setup

Configure the router in App.tsx:

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { TripsPage } from './pages/TripsPage';
import { TripDetailsPage } from './pages/TripDetailsPage';
import { ReceiptDetailsPage } from './pages/ReceiptDetailsPage';

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

## Key Features Implementation

### 1. Trip Management

Implement the trips list component:

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
  // Implementation details
  // ...
}
```

### 2. Receipt Splitting

Implement the receipt splitting component:

```tsx
// src/components/receipts/LineItemSplit.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getLineItemSplits, splitLineItem, getTripMembers } from '../../api/services';
import type { LineItem, User } from '../../types';

interface LineItemSplitProps {
  lineItem: LineItem;
  tripId: number;
}

export function LineItemSplit({ lineItem, tripId }: LineItemSplitProps) {
  // Implementation details
  // ...
}
```

### 3. Balance Calculation

Implement the balance calculation component:

```tsx
// src/components/trips/BalancesTab.tsx
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { getTripBalances } from '../../api/services';
import type { Balance } from '../../types';

interface BalancesTabProps {
  tripId: number;
}

export function BalancesTab({ tripId }: BalancesTabProps) {
  // Implementation details
  // ...
}
```

## Design Requirements

Follow these design guidelines:

- **Color Scheme**:
  - Primary: Blue (#2563eb)
  - Secondary: Green (#10b981)
  - Error: Red (#dc2626)
  - Background: Light gray (#f8fafc)

- **Typography**:
  - Headline: Inter Bold 20pt
  - Body: Inter Medium 16pt
  - Labels: Inter Regular 14pt

- **Layout**:
  - Mobile-first responsive design
  - Proper spacing using 8px grid
  - Card-based UI components
  - Tab-based navigation for details pages

## Error Handling and Edge Cases

Implement robust error handling for:
1. API connection failures
2. Authentication errors
3. Data validation issues
4. Loading states for all async operations

## Testing

Verify the implementation by:
1. Creating a new trip
2. Adding members to the trip
3. Creating receipts with line items
4. Splitting expenses among members
5. Viewing the balance calculations

## Implementation Notes

1. Use type safety throughout the application
2. Follow ShadCN UI component patterns consistently
3. Implement proper loading states and error handling
4. Ensure responsive design for mobile devices
5. Optimize SQL queries for performance