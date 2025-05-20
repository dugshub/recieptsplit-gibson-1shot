# GibsonAI API Integration Guide

This document provides detailed instructions for integrating the GibsonAI API with the SplitReceipt application. Follow these steps to properly connect your frontend to the GibsonAI backend.

## API Integration Approach

To ensure proper connectivity while maintaining a clean project structure, we'll use a **temporary directory approach** for the GibsonAI setup script, then extract only the essential connectivity files.

## Step 1: Create Temporary Directory for GibsonAI Setup

```bash
# Create a temporary directory for the GibsonAI setup
mkdir -p temp_gibson_setup
cd temp_gibson_setup

# Run the GibsonAI setup script
bash <(curl -s https://raw.githubusercontent.com/GibsonAI/next-app/main/setup.sh)
```

When prompted:
- Project name: `temp_app`
- API Key: Enter your GibsonAI API key
- OpenAPI spec URL: Enter your OpenAPI spec URL

## Step 2: Extract Essential Files

After the setup completes, copy only the essential files to your main project:

```bash
# Copy the API client and environment setup
cp -r temp_gibson_setup/lib/gibson-client.ts ../lib/
cp -r temp_gibson_setup/app/auth ../app/
cp temp_gibson_setup/.env.local ../
```

## Step 3: Create Auth Service

Create a dedicated authentication service in your main project to handle user sessions:

```typescript
// lib/auth-service.ts

import { client } from './gibson-client';

// Auth types
interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
  };
  token: string;
}

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

// Auth API functions
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
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

export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
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

export const getCurrentUser = async () => {
  try {
    return await client.users.me();
  } catch (error) {
    console.error('Error fetching current user:', error);
    clearToken();
    throw error;
  }
};
```

## Step 4: Create API Request Wrapper

Create a wrapper for API requests to handle authentication and error handling:

```typescript
// lib/api-service.ts

import { getToken } from './auth-service';

// Error handling types
interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// Configuration for API requests
export const createApiRequest = async <T>(
  requestFn: () => Promise<T>,
  errorMessage = 'An error occurred'
): Promise<T> => {
  try {
    // Attempt the API request
    return await requestFn();
  } catch (error: any) {
    // Format the error
    const apiError: ApiError = {
      message: errorMessage,
      status: error.response?.status,
      details: error.response?.data || error.message,
    };
    
    // Handle authentication errors
    if (apiError.status === 401) {
      // Handle unauthorized errors
      console.error('Authentication error:', apiError);
      // Optional: Redirect to login
    }
    
    // Rethrow with formatted error
    throw apiError;
  }
};
```

## Step 5: Create Feature-Specific API Services

Create service files for each major feature:

```typescript
// lib/trip-service.ts

import { client } from './gibson-client';
import { createApiRequest } from './api-service';

// Trip creation type
interface TripCreate {
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
}

// Trip service functions
export const getTrips = () => {
  return createApiRequest(
    () => client.trips.getAll(),
    'Failed to fetch trips'
  );
};

export const getTripById = (tripId: number) => {
  return createApiRequest(
    () => client.trips.getById({ id: tripId }),
    `Failed to fetch trip #${tripId}`
  );
};

export const createTrip = (tripData: TripCreate) => {
  return createApiRequest(
    () => client.trips.create(tripData),
    'Failed to create trip'
  );
};

export const updateTrip = (tripId: number, tripData: Partial<TripCreate>) => {
  return createApiRequest(
    () => client.trips.update({ id: tripId, ...tripData }),
    `Failed to update trip #${tripId}`
  );
};

export const deleteTrip = (tripId: number) => {
  return createApiRequest(
    () => client.trips.delete({ id: tripId }),
    `Failed to delete trip #${tripId}`
  );
};

export const getTripMembers = (tripId: number) => {
  return createApiRequest(
    () => client.tripMembers.getByTripId({ tripId }),
    `Failed to fetch members for trip #${tripId}`
  );
};

export const addTripMember = (tripId: number, userId: number, role = 'member') => {
  return createApiRequest(
    () => client.tripMembers.create({ tripId, userId, role }),
    `Failed to add member to trip #${tripId}`
  );
};
```

Similarly, create services for receipts, line items, and splits.

## Step 6: Create React Hooks for Data Fetching

```typescript
// lib/hooks/useTrips.ts

import { useState, useEffect } from 'react';
import { getTrips } from '../trip-service';

export const useTrips = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        const data = await getTrips();
        setTrips(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return { trips, isLoading, error };
};
```

## Step 7: Add Authentication Provider

Create an authentication context to manage user state throughout the app:

```typescript
// lib/auth-context.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated } from './auth-service';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  revalidate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  revalidate: async () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    if (!isAuthenticated()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        revalidate: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

## Step 8: Add Authentication Wrapper for Pages

Create an HOC to protect authenticated routes:

```typescript
// lib/with-auth.tsx

import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      router.push('/auth/login');
      return null;
    }

    return <Component {...props} />;
  };
};
```

## Handling API Errors

When working with the GibsonAI API, implement consistent error handling patterns:

1. **Use try/catch blocks** for all API calls
2. **Display user-friendly error messages**
3. **Provide recovery options** where possible
4. **Log detailed errors** for debugging

Example error handling in a component:

```jsx
const TripsPage = () => {
  const { trips, isLoading, error } = useTrips();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-500 mb-2">Failed to load trips</h3>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Render trips...
};
```

## Working with Authentication

The GibsonAI backend uses JWT authentication. Your implementation should:

1. **Store tokens securely** (localStorage is used for simplicity here)
2. **Include tokens in requests** (handled by the generated client)
3. **Handle token expiration gracefully**
4. **Redirect unauthenticated users** to the login page

## Connectivity Troubleshooting

If you encounter issues connecting to the GibsonAI backend:

1. **Verify API key and URL** in .env.local
2. **Check for schema errors** by examining API responses
3. **Wait after deployment** - sometimes the API needs time to fully initialize
4. **Use browser devtools** to inspect network requests

## Next Steps

Once API integration is complete:
1. Test authentication flow
2. Implement data fetching in your components
3. Add error handling and loading states
4. Create forms for creating and updating data

These patterns establish a solid foundation for integrating with the GibsonAI backend while maintaining a clean architecture and proper error handling.