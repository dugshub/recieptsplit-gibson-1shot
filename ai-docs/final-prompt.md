# SplitReceipt: Full-Stack 1-Shot Implementation

## Overview

Create a comprehensive receipt splitting application called SplitReceipt that allows users to:
1. Create trips/events with multiple members
2. Upload and process receipts
3. Split expenses among trip members
4. Calculate balances between users

This implementation will use:
- GibsonAI MCP for the backend
- GibsonAI Next.js starter app for the frontend (recommended)
- ShadCN UI components for enhanced UI

## Implementation Steps

### 1. Backend Implementation with GibsonAI MCP

Create a new GibsonAI project with the following data modeling request:

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

### 2. Frontend Implementation with GibsonAI Next.js Starter App

After creating the backend, you'll have an API key and OpenAPI spec URL. Use these to generate the Next.js starter app:

1. Request the creation of a Next.js app using the GibsonAI starter
2. Provide the API key and OpenAPI spec URL during setup
3. Enhance the generated app with ShadCN UI components

#### Adding ShadCN UI to the Next.js Starter App

Set up ShadCN UI components within the Next.js starter app:

1. Install ShadCN UI dependencies:
```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-avatar @radix-ui/react-dropdown-menu
```

2. Configure Tailwind CSS with ShadCN UI variables (update tailwind.config.js)

3. Create the `cn()` utility function in src/lib/utils.ts:
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

4. Implement key ShadCN UI components in the components/ui directory, including:
   - Button
   - Card
   - Tabs
   - Dialog
   - Avatar
   - Form
   - Input

#### Key Pages to Implement

Implement the following pages within the Next.js structure:

1. **Login/Registration Page**
   - Form for user login
   - Option to register a new account
   - Proper validation and error handling

2. **Trips List Page**
   - Display all trips for the current user
   - Card-based layout with trip details
   - Option to create a new trip
   - Show trip members avatars

3. **Trip Details Page**
   - Tabs for different sections:
     - Receipts tab: List of all receipts
     - Balances tab: Who owes whom
     - Members tab: Manage trip members
   - Header with trip name and date range

4. **Receipt Entry Form**
   - Form to add title, date, total, merchant
   - Option to add line items
   - Validation to ensure line items sum matches total

5. **Receipt Details Page**
   - Display receipt information
   - List all line items
   - Interface for splitting expenses among trip members

#### Balance Calculation Implementation

Implement a balance calculation algorithm that:
1. Calculates total spent per user
2. Calculates what each user should pay based on splits
3. Determines who owes whom and how much
4. Displays this information in an easy-to-understand UI

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

## Implementation Notes

1. **Type Safety**: Use TypeScript interfaces that match the GibsonAI schema
2. **Authentication**: Implement JWT token handling with secure storage
3. **Error Handling**: Provide proper error handling for API calls
4. **Loading States**: Add loading indicators for all async operations
5. **Responsive Design**: Ensure the UI works well on mobile and desktop

## Key Components Example

Here's an example of how to implement the Trip Card component with ShadCN UI:

```tsx
// components/trips/TripCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface TripCardProps {
  trip: {
    id: number;
    name: string;
    start_date: string;
    end_date?: string;
  };
  members: Array<{
    id: number;
    username: string;
  }>;
  totalAmount: number;
}

export function TripCard({ trip, members, totalAmount }: TripCardProps) {
  return (
    <Link href={`/trips/${trip.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle>{trip.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatDate(trip.start_date)} - {trip.end_date ? formatDate(trip.end_date) : "Ongoing"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex -space-x-2">
              {members.slice(0, 3).map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                  <AvatarFallback>
                    {member.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              
              {members.length > 3 && (
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarFallback>
                    +{members.length - 3}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            
            <div className="bg-muted px-3 py-1 rounded-full text-sm font-medium">
              ${totalAmount.toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
```

## Testing the Implementation

To verify the implementation:
1. Test user registration and login
2. Create a new trip with multiple members
3. Add receipts with line items
4. Split expenses among trip members
5. View balance calculations

## Wrapping Up

Ensure the implementation includes:
1. Comprehensive error handling
2. Proper loading states
3. Mobile-responsive design
4. Type safety throughout
5. Clean, maintainable code structure