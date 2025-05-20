'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TripCard } from '@/components/trips/TripCard';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Trip, TripMember } from '@/lib/gibson-client';
import Link from 'next/link';
import { NewTripForm } from '@/components/trips/NewTripForm';

// Mock data for demo purposes
const mockTrips: Trip[] = [
  {
    id: 1,
    uuid: 'trip-uuid-1',
    name: 'Summer Vacation',
    description: 'Beach trip with friends',
    start_date: '2025-06-15',
    end_date: '2025-06-22',
    date_created: '2025-05-01T12:00:00Z',
    date_updated: null
  },
  {
    id: 2,
    uuid: 'trip-uuid-2',
    name: 'Weekend Getaway',
    description: 'Cabin in the mountains',
    start_date: '2025-07-10',
    end_date: '2025-07-12',
    date_created: '2025-05-05T14:30:00Z',
    date_updated: null
  }
];

const mockMembers: Record<number, TripMember[]> = {
  1: [
    {
      id: 1,
      uuid: 'member-uuid-1',
      trip_id: 1,
      user_id: 1,
      role: 'owner',
      date_created: '2025-05-01T12:00:00Z',
      date_updated: null,
      username: 'user1'
    },
    {
      id: 2,
      uuid: 'member-uuid-2',
      trip_id: 1,
      user_id: 2,
      role: 'member',
      date_created: '2025-05-01T12:05:00Z',
      date_updated: null,
      username: 'user2'
    },
    {
      id: 3,
      uuid: 'member-uuid-3',
      trip_id: 1,
      user_id: 3,
      role: 'member',
      date_created: '2025-05-01T12:10:00Z',
      date_updated: null,
      username: 'user3'
    }
  ],
  2: [
    {
      id: 4,
      uuid: 'member-uuid-4',
      trip_id: 2,
      user_id: 1,
      role: 'owner',
      date_created: '2025-05-05T14:30:00Z',
      date_updated: null,
      username: 'user1'
    },
    {
      id: 5,
      uuid: 'member-uuid-5',
      trip_id: 2,
      user_id: 2,
      role: 'member',
      date_created: '2025-05-05T14:35:00Z',
      date_updated: null,
      username: 'user2'
    }
  ]
};

const mockTotals: Record<number, number> = {
  1: 750.50,
  2: 325.75
};

export default function TripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [tripMembers, setTripMembers] = useState<Record<number, TripMember[]>>(mockMembers);
  const [tripTotals, setTripTotals] = useState<Record<number, number>>(mockTotals);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewTripForm, setShowNewTripForm] = useState(false);

  const handleTripCreated = (newTrip: Trip) => {
    // Add a new trip with a unique ID
    const updatedTrip = {
      ...newTrip,
      id: trips.length + 1,
      uuid: `trip-uuid-${trips.length + 1}`
    };
    
    setTrips([updatedTrip, ...trips]);
    
    // Add the current user as a member
    setTripMembers({
      ...tripMembers, 
      [updatedTrip.id]: [{ 
        id: Object.values(tripMembers).flat().length + 1, 
        uuid: `member-uuid-${Object.values(tripMembers).flat().length + 1}`, 
        trip_id: updatedTrip.id, 
        user_id: user!.id, 
        role: 'owner',
        date_created: new Date().toISOString(),
        date_updated: null,
        username: user!.username
      }]
    });
    
    // Initialize trip total to 0
    setTripTotals({...tripTotals, [updatedTrip.id]: 0});
    
    setShowNewTripForm(false);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Trips</h1>
          <Button 
            onClick={() => setShowNewTripForm(!showNewTripForm)}
            variant={showNewTripForm ? "outline" : "default"}
          >
            {showNewTripForm ? "Cancel" : "Create New Trip"}
          </Button>
        </div>

        {showNewTripForm && (
          <div className="mb-8">
            <NewTripForm onTripCreated={handleTripCreated} />
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">No trips yet</h3>
            <p className="text-muted-foreground mb-6">Create your first trip to get started</p>
            <Button onClick={() => setShowNewTripForm(true)}>Create Trip</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                members={tripMembers[trip.id] || []} 
                totalAmount={tripTotals[trip.id] || 0}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}