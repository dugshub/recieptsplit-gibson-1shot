# GibsonAI MCP Integration Guide

This document provides detailed guidance on effectively integrating with GibsonAI MCP for the SplitReceipt application as part of the 1-shot challenge.

## Understanding GibsonAI MCP

GibsonAI's Model Context Protocol (MCP) is an AI-powered backend generation system that:
- Creates data models and schemas from natural language
- Generates RESTful API endpoints
- Implements authentication and authorization
- Sets up database connections
- Deploys production-ready backends

## Integration Process

### 1. Data Modeling Request

When submitting a data modeling request to GibsonAI MCP, structure your prompt with:

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

#### Example Data Modeling Request:

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

### 2. Connecting to GibsonAI Backend from Frontend

After GibsonAI creates your backend, you'll need to integrate it with your frontend. The primary method is through SQL queries to the GibsonAI API endpoint.

#### Key Integration Points:

1. **API Client Setup**:
```typescript
// src/api/client.ts
import axios from 'axios';

// Get these values from GibsonAI after project creation
export const API_URL = 'https://api.gibsonai.com/v1/-/query';
export const API_KEY = 'YOUR_GIBSON_API_KEY'; 

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

2. **Service Layer Implementation**:
```typescript
// src/api/services.ts
import { executeQuery } from './client';
import type { User, Trip, Receipt, LineItem, Split } from '../types';

// Authentication services
export const loginUser = async (username: string, password: string): Promise<User> => {
  const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
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

export const getTripById = async (tripId: number): Promise<Trip> => {
  const sql = `SELECT * FROM trips WHERE id = ${tripId}`;
  const result = await executeQuery<Trip[]>(sql);
  if (result.length === 0) {
    throw new Error('Trip not found');
  }
  return result[0];
};

// Add more service functions for CRUD operations on all entities
```

### 3. Security Considerations

When integrating with GibsonAI:

1. **SQL Injection Prevention**:
   - Use parameterized queries or proper escaping
   - Validate user input before constructing SQL queries

2. **API Key Security**:
   - Never expose API keys in client-side code
   - Consider using environment variables
   - For production, implement a backend proxy service

3. **Error Handling**:
   - Implement robust error handling
   - Provide user-friendly error messages
   - Log errors for debugging

### 4. Optimizing Performance

For better performance when working with GibsonAI:

1. **Minimize Query Count**:
   - Batch related operations
   - Use JOINs to fetch related data in one query

2. **Implement Client-Side Caching**:
   - Use React Query for caching query results
   - Implement proper invalidation strategies

3. **Pagination and Filtering**:
   - Implement LIMIT and OFFSET for large data sets
   - Add WHERE clauses for filtering

## Best Practices for GibsonAI Integration

1. **Type Safety**:
   - Define TypeScript interfaces matching backend schema
   - Use generic types with executeQuery

2. **Abstraction Layers**:
   - Create service functions for all API operations
   - Separate SQL query construction from business logic

3. **Error Boundary Strategies**:
   - Implement React error boundaries
   - Add loading states for all data fetching operations

4. **Testing Approach**:
   - Mock GibsonAI API responses for unit tests
   - Create test utilities for common API operations

## Example: Implementing Trip Balance Calculation

```typescript
// src/api/services.ts
export interface Balance {
  userId: number;
  userName: string;
  amount: number;
}

export const getTripBalances = async (tripId: number): Promise<Balance[]> => {
  const sql = `
    SELECT 
      u.id AS userId,
      u.username AS userName,
      SUM(
        CASE 
          WHEN r.user_id = u.id THEN r.total_amount 
          ELSE 0 
        END
      ) - SUM(
        CASE 
          WHEN s.user_id = u.id THEN s.amount 
          ELSE 0 
        END
      ) AS amount
    FROM 
      users u
    JOIN 
      trip_members tm ON u.id = tm.user_id
    LEFT JOIN 
      receipts r ON tm.trip_id = r.trip_id
    LEFT JOIN 
      line_items li ON r.id = li.receipt_id
    LEFT JOIN 
      splits s ON li.id = s.line_item_id
    WHERE 
      tm.trip_id = ${tripId}
    GROUP BY 
      u.id, u.username
  `;
  
  return executeQuery<Balance[]>(sql);
};
```

This guide should provide a solid foundation for integrating with GibsonAI MCP for the SplitReceipt application in your 1-shot challenge.