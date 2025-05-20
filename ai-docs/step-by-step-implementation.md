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

### 2.1. Run the GibsonAI Next.js setup script

**EXTREMELY IMPORTANT:** Execute this command in the ROOT directory of the project, NOT in any subdirectory:

```bash
bash <(curl -s https://raw.githubusercontent.com/GibsonAI/next-app/main/setup.sh)
```

**YOU MUST RESPOND TO THE PROMPTS EXACTLY AS FOLLOWS:**

When you see: `Enter project name:`
Type exactly: `.` (just a period)

When you see: `Enter Gibson API key:`
Enter the API key you recorded from step 1.5

When you see: `Enter OpenAPI spec URL:`
Enter the OpenAPI spec URL you recorded from step 1.5

### 2.2. Handle potential OpenAPI schema error

If you see an error like `Can't parse empty schema`:

1. Wait 60 seconds for the schema to fully deploy
2. Create a .env.local file in the root directory with the following content:

```bash
GIBSON_API_URL=https://api.gibsonai.com/
GIBSON_API_KEY=[your API key from step 1.5]
GIBSON_API_SPEC=https://api.gibsonai.com/-/openapi/[your docs_slug from step 1.5]
```

3. Run the following command:

```bash
npm run typegen
```

If you continue to get errors, wait another 60 seconds and try again.

### 2.3. Install additional required dependencies

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-avatar @radix-ui/react-dropdown-menu
```

## STEP 3: UI ENHANCEMENT

### 3.1. Create postcss.config.js file

Create a file named `postcss.config.js` in the root directory with the following content:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 3.2. Create the utility function for ShadCN UI

Create or update the file `lib/utils.ts` with the following content:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 3.3. Create ShadCN UI components

Create the following essential UI components:

**1. Button Component - `components/ui/button.tsx`**

```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

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
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

**2. Card Component - `components/ui/card.tsx`**

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
```

**3. Tabs Component - `components/ui/tabs.tsx`**

```typescript
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
```

## STEP 4: FEATURE IMPLEMENTATION

### 4.1. Update the homepage

Update the `app/page.tsx` file to use the ShadCN UI components:

```tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto min-h-screen flex flex-col justify-center items-center">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">SplitReceipt</h1>
        <p className="text-xl text-muted-foreground">
          The easiest way to split expenses with friends, family, and colleagues.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Create Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Organize your expenses by trips or events with friends, family, or colleagues.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Upload Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Easily record and categorize your expenses with detailed receipt tracking.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Split Fairly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Split costs evenly or by custom amounts and see who owes what at a glance.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

### 4.2. Create a Trip Card component

Create a file called `components/trips/TripCard.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            {new Date(trip.start_date).toLocaleDateString()} - 
            {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : "Ongoing"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex -space-x-2">
              {members.slice(0, 3).map((member) => (
                <div key={member.id} className="h-8 w-8 rounded-full bg-primary text-primary-foreground border-2 border-white flex items-center justify-center text-xs font-bold">
                  {member.username.slice(0, 2).toUpperCase()}
                </div>
              ))}
              
              {members.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground border-2 border-white flex items-center justify-center text-xs font-bold">
                  +{members.length - 3}
                </div>
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

### 4.3. Create Trips Page

Create a file called `app/trips/page.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TripCard } from '@/components/trips/TripCard';
import { client } from '@/lib/gibson-client';

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      try {
        // This assumes the generated client has a trips.getAll method
        const tripsData = await client.trips.getAll();
        setTrips(tripsData);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrips();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Link href="/trips/new">
          <Button>Create New Trip</Button>
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">No trips yet</h3>
          <p className="text-muted-foreground mb-6">Create your first trip to get started</p>
          <Link href="/trips/new">
            <Button>Create Trip</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              members={trip.members || []} 
              totalAmount={trip.totalAmount || 0} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

## STEP 5: TESTING

### 5.1. Start the development server

```bash
npm run dev
```

### 5.2. Test the application

1. Open your browser to http://localhost:3000
2. Verify the home page loads correctly with styling
3. Test the login/register navigation
4. Navigate to /trips to test the trips page

## Next Steps

Once the basic structure is working, continue implementing:

1. Authentication flow
2. Trip details page with receipts tab
3. Receipt entry form
4. Line item splitting interface
5. Balance calculation

Refer to the reference documents for detailed implementation guidelines for these features.