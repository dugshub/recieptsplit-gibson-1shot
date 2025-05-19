# GibsonAI Next.js Starter App Integration

This document provides a guide for leveraging the GibsonAI Next.js starter app for the SplitReceipt application in the 1-shot challenge.

## Overview

GibsonAI offers a Next.js starter app that provides a streamlined way to connect a React frontend to a GibsonAI backend. Instead of manually setting up the API integration, this starter app handles much of the boilerplate, making it an ideal choice for the 1-shot challenge.

## Key Benefits

1. **Type-Safe API Client**: The starter app generates a client that matches your Gibson backend's OpenAPI spec, providing auto-complete and type safety.

2. **Ready-to-Use Structure**: Comes with pre-configured pages and components for rapid development.

3. **Environment Variable Setup**: Properly configured for secure API access.

4. **Flexible Data Fetching**: Supports multiple methods of interacting with your backend.

## Setup Process

To incorporate the GibsonAI Next.js starter app in the 1-shot challenge:

1. Create your GibsonAI backend with the data modeling request.
2. Once the backend is created, note your API key and OpenAPI spec URL.
3. Use the Gibson starter app setup script to create your frontend.
4. Follow the prompts to name your project and provide your Gibson API key and OpenAPI spec URL.

```bash
# Example setup command (exact command should be provided in the Gibson documentation)
npx create-gibson-app my-receipt-app
```

During setup, you'll need to provide:
- Project name (e.g., "splitreceipt-app")
- Your Gibson API key (from your project settings)
- Your OpenAPI spec URL (from your Gibson API docs)

## Integration with ShadCN UI

Since we're using ShadCN UI components, we'll need to integrate them with the Gibson starter app:

1. Install ShadCN UI dependencies:

```bash
# Navigate to your project directory
cd splitreceipt-app

# Install ShadCN UI dependencies
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-avatar @radix-ui/react-dropdown-menu
```

2. Configure Tailwind CSS according to ShadCN UI requirements:

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. Update the Tailwind configuration following the ShadCN UI guidelines.

## Working with the Generated API Client

The Gibson starter app generates a type-safe API client based on your backend schema. Here's how to use it:

```typescript
// Example of using the generated API client
import { client } from '@/lib/gibson-client';

// Fetch user data with type safety
async function getUsers() {
  // The client will have methods that match your backend's schema
  const users = await client.users.getAll();
  return users;
}

// Create a new trip
async function createTrip(name: string, startDate: Date, endDate: Date) {
  const trip = await client.trips.create({
    name,
    start_date: startDate,
    end_date: endDate
  });
  return trip;
}
```

## Directory Structure

The starter app will create a directory structure similar to:

```
splitreceipt-app/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout
│   ├── trips/                # Trips routes
│   │   ├── page.tsx          # Trips list page
│   │   ├── [tripId]/         # Trip details routes
│   │       ├── page.tsx      # Trip details page
│   │       ├── receipts/     # Receipt routes
│   │           ├── page.tsx  # Receipts list page
│   │           ├── [receiptId]/ # Receipt details routes
│   │               ├── page.tsx # Receipt details page
├── components/               # UI components
│   ├── ui/                   # ShadCN UI components
│   ├── trips/                # Trip-related components
│   ├── receipts/             # Receipt-related components
├── lib/                      # Utility functions and client setup
│   ├── gibson-client.ts      # Generated Gibson API client
│   ├── utils.ts              # Utility functions (including ShadCN's cn function)
├── public/                   # Static assets
├── .env                      # Environment variables
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
```

## Implementation Approach for 1-Shot Challenge

For the 1-shot challenge, here's how to effectively use the Gibson starter app:

1. **Focus on Data Modeling First**: Create a comprehensive data model in GibsonAI that includes all necessary entities and relationships.

2. **Request the Starter App Generation**: Once the backend is created, request the generation of the Next.js starter app, providing the necessary API key and OpenAPI spec URL.

3. **Enhance with ShadCN UI**: Add ShadCN UI components to enhance the UI beyond the basic starter app interface.

4. **Implement Key Features**: Focus on implementing the core features:
   - Trip management
   - Receipt entry and display
   - Line item splitting
   - Balance calculation

5. **Add Authentication Flow**: Implement proper authentication using the JWT authentication provided by the GibsonAI backend.

## Example Implementation

Here's how a typical page implementation might look using the Gibson starter app with ShadCN UI:

```tsx
// app/trips/page.tsx
import { client } from '@/lib/gibson-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// Server component for fetching data
export default async function TripsPage() {
  // Fetch trips using the generated client
  const trips = await client.trips.getAll();

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
            <Link key={trip.id} href={`/trips/${trip.id}`}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle>{trip.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Trip details content */}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Benefits for the 1-Shot Challenge

Using the GibsonAI Next.js starter app for the 1-shot challenge offers several advantages:

1. **Reduced Boilerplate**: Much of the API integration code is generated automatically.

2. **Type Safety**: The generated client ensures type safety between frontend and backend.

3. **Focus on Features**: More time can be spent on implementing core features rather than setting up API connections.

4. **Better Error Handling**: The generated client likely includes proper error handling.

5. **Optimized for GibsonAI**: The starter app is specifically designed to work with GibsonAI backends.

## Conclusion

For the 1-shot challenge, using the GibsonAI Next.js starter app provides a significant advantage by handling much of the API integration boilerplate. By focusing on the data modeling, UI components, and core features, we can create a more complete and polished application in a single shot.