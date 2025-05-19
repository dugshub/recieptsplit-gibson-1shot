# ShadCN UI Implementation Guide for SplitReceipt

This document provides detailed guidance on implementing the frontend of the SplitReceipt application using ShadCN UI components and best practices.

## ShadCN UI Overview

ShadCN UI is a collection of reusable, accessible components built on top of Tailwind CSS and Radix UI primitives. Unlike traditional component libraries, ShadCN UI components are copied directly into your project, giving you full control over the code and styling.

## Project Setup

### 1. Initialize the Project

```bash
# Create Vite project with React and TypeScript
npm create vite@latest splitreceipt-frontend -- --template react-ts

# Navigate to the project
cd splitreceipt-frontend

# Install dependencies
npm install
```

### 2. Install Tailwind CSS and Required Dependencies

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install ShadCN UI dependencies
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-avatar @radix-ui/react-dropdown-menu @radix-ui/react-popover @radix-ui/react-form

# Install other dependencies
npm install react-router-dom @tanstack/react-query axios zustand date-fns framer-motion
```

### 3. Configure Tailwind CSS

Create or update `tailwind.config.js`:

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

### 4. Set Up CSS Variables

Update `src/index.css`:

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
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

### 5. Create Utility Functions

Create `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Core ShadCN UI Components

### 1. Button Component

```typescript
// src/components/ui/button.tsx
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

### 2. Card Component

```typescript
// src/components/ui/card.tsx
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

### 3. Tabs Component

```typescript
// src/components/ui/tabs.tsx
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

## Feature Implementation Examples

### 1. Creating a Trip Card Component

```tsx
// src/components/trips/TripCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import type { Trip, TripMember } from "@/types";

interface TripCardProps {
  trip: Trip;
  members: TripMember[];
  onClick: () => void;
}

export function TripCard({ trip, members, onClick }: TripCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle>{trip.name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
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
            ${trip.total_amount || 0}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2. Trip Details Page with Tabs

```tsx
// src/pages/TripDetailsPage.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  getTripById, 
  getTripMembers, 
  getTripReceipts,
  getTripBalances 
} from "@/api/services";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReceiptsTab } from "@/components/trips/ReceiptsTab";
import { BalancesTab } from "@/components/trips/BalancesTab";
import { MembersTab } from "@/components/trips/MembersTab";

export function TripDetailsPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const id = parseInt(tripId || "0");
  
  const { data: trip, isLoading: isLoadingTrip } = useQuery({
    queryKey: ["trip", id],
    queryFn: () => getTripById(id),
    enabled: !!id,
  });
  
  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["tripMembers", id],
    queryFn: () => getTripMembers(id),
    enabled: !!id,
  });
  
  const { data: receipts, isLoading: isLoadingReceipts } = useQuery({
    queryKey: ["tripReceipts", id],
    queryFn: () => getTripReceipts(id),
    enabled: !!id,
  });
  
  const { data: balances, isLoading: isLoadingBalances } = useQuery({
    queryKey: ["tripBalances", id],
    queryFn: () => getTripBalances(id),
    enabled: !!id,
  });
  
  const isLoading = isLoadingTrip || isLoadingMembers || isLoadingReceipts || isLoadingBalances;
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full" />
      </div>
    );
  }
  
  if (!trip) {
    return <div>Trip not found</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{trip.name}</h1>
      
      <Tabs defaultValue="receipts" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="receipts" className="flex-1">Receipts</TabsTrigger>
          <TabsTrigger value="balances" className="flex-1">Balances</TabsTrigger>
          <TabsTrigger value="members" className="flex-1">Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="receipts">
          <ReceiptsTab 
            tripId={id} 
            receipts={receipts || []} 
          />
        </TabsContent>
        
        <TabsContent value="balances">
          <BalancesTab 
            tripId={id} 
            balances={balances || []} 
            members={members || []}
          />
        </TabsContent>
        
        <TabsContent value="members">
          <MembersTab 
            tripId={id} 
            members={members || []} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 3. Receipt Split Form

```tsx
// src/components/receipts/ReceiptSplitForm.tsx
import { useState } from "react";
import { 
  splitLineItem, 
  getLineItemSplits,
  getTripMembers 
} from "@/api/services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { LineItem, TripMember, Split } from "@/types";

interface ReceiptSplitFormProps {
  tripId: number;
  lineItem: LineItem;
}

export function ReceiptSplitForm({ tripId, lineItem }: ReceiptSplitFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [splits, setSplits] = useState<Record<number, number>>({});
  
  const { data: members = [] } = useQuery({
    queryKey: ["tripMembers", tripId],
    queryFn: () => getTripMembers(tripId),
  });
  
  const { data: existingSplits = [] } = useQuery({
    queryKey: ["lineItemSplits", lineItem.id],
    queryFn: () => getLineItemSplits(lineItem.id),
    onSuccess: (data) => {
      // Initialize with existing splits
      const initialSplits: Record<number, number> = {};
      data.forEach((split) => {
        initialSplits[split.user_id] = split.amount;
      });
      setSplits(initialSplits);
    },
  });
  
  const mutation = useMutation({
    mutationFn: async () => {
      const splitPromises = Object.entries(splits).map(([userId, amount]) => {
        return splitLineItem(lineItem.id, parseInt(userId), parseFloat(amount.toString()));
      });
      return Promise.all(splitPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lineItemSplits", lineItem.id] });
      queryClient.invalidateQueries({ queryKey: ["tripBalances", tripId] });
      toast({
        title: "Splits saved",
        description: "The item has been split successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving splits",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleAmountChange = (userId: number, amount: string) => {
    setSplits((prev) => ({
      ...prev,
      [userId]: parseFloat(amount) || 0,
    }));
  };
  
  const handleSave = () => {
    mutation.mutate();
  };
  
  const handleSplitEvenly = () => {
    const amount = lineItem.amount;
    const memberCount = members.length;
    const equalAmount = amount / memberCount;
    
    const newSplits: Record<number, number> = {};
    members.forEach((member) => {
      newSplits[member.user_id] = equalAmount;
    });
    
    setSplits(newSplits);
  };
  
  const totalSplit = Object.values(splits).reduce((sum, amount) => sum + amount, 0);
  const remaining = lineItem.amount - totalSplit;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Split "{lineItem.description}"</CardTitle>
        <div className="flex justify-between text-sm">
          <span>Total: ${lineItem.amount.toFixed(2)}</span>
          <span className={remaining !== 0 ? "text-destructive" : "text-secondary"}>
            Remaining: ${remaining.toFixed(2)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSplitEvenly}
            className="w-full"
          >
            Split Evenly
          </Button>
          
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.user_id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {member.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1">{member.username}</span>
                <div className="w-24">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={splits[member.user_id] || ""}
                    onChange={(e) => handleAmountChange(member.user_id, e.target.value)}
                    className="text-right"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={remaining !== 0 || mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save Splits"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Best Practices for ShadCN UI Implementation

### 1. Component Organization

- Group components by feature in dedicated directories
- Keep common UI components in `components/ui`
- Create higher-level components that compose UI primitives

### 2. Styling Patterns

- Always use the `cn()` utility for className composition
- Follow the variant pattern for component variations
- Use Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`) for responsive design

### 3. Form Handling

- Create reusable form components
- Implement proper validation and error states
- Use form libraries like React Hook Form for complex forms

### 4. State Management

- Use React Query for server state management
- Consider Zustand for client-side state that needs to be shared
- Keep component state local when possible

### 5. Animation Best Practices

- Use Framer Motion for complex animations
- Implement CSS transitions for simple hover/focus states
- Consider reduced motion preferences

## Common Pitfalls and Solutions

### 1. CSS Conflicts

**Problem**: Tailwind classes conflicting with other styles
**Solution**: Use the `cn()` utility and explicit class ordering

### 2. Component Props Typing

**Problem**: Difficulty with TypeScript types for component props
**Solution**: Use composition with React.forwardRef and proper interface inheritance

### 3. Responsive Design Issues

**Problem**: Layout breaking at specific breakpoints
**Solution**: Test each breakpoint and use Tailwind's responsive prefixes consistently

### 4. Performance Concerns

**Problem**: Component re-renders causing performance issues
**Solution**: Implement React.memo, useMemo, and useCallback where appropriate

## Conclusion

This guide provides a solid foundation for implementing the SplitReceipt frontend using ShadCN UI. By following these patterns and best practices, you can create a polished, accessible, and responsive application that integrates seamlessly with the GibsonAI backend.