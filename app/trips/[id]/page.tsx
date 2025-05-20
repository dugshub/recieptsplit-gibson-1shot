'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Trip, TripMember, Balance } from '@/lib/gibson-client';
import { ReceiptsTab } from '@/components/trips/ReceiptsTab';
import { MembersTab } from '@/components/trips/MembersTab';
import { BalancesTab } from '@/components/trips/BalancesTab';
import Link from 'next/link';

// Mock data for demo
const mockTrips: Record<number, Trip> = {
  1: {
    id: 1,
    uuid: 'trip-uuid-1',
    name: 'Summer Vacation',
    description: 'Beach trip with friends',
    start_date: '2025-06-15',
    end_date: '2025-06-22',
    date_created: '2025-05-01T12:00:00Z',
    date_updated: null
  },
  2: {
    id: 2,
    uuid: 'trip-uuid-2',
    name: 'Weekend Getaway',
    description: 'Cabin in the mountains',
    start_date: '2025-07-10',
    end_date: '2025-07-12',
    date_created: '2025-05-05T14:30:00Z',
    date_updated: null
  }
};

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

const mockBalances: Record<number, Balance[]> = {
  1: [
    {
      user_id: 1,
      username: 'user1',
      amount: 250.25
    },
    {
      user_id: 2,
      username: 'user2',
      amount: -125.50
    },
    {
      user_id: 3,
      username: 'user3',
      amount: -124.75
    }
  ],
  2: [
    {
      user_id: 1,
      username: 'user1',
      amount: 162.75
    },
    {
      user_id: 2,
      username: 'user2',
      amount: -162.75
    }
  ]
};

export default function TripDetailsPage() {
  const params = useParams();
  const tripId = parseInt(params.id as string);
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [members, setMembers] = useState<TripMember[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching data from the API
    const fetchTripDetails = async () => {
      try {
        setIsLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get mock data for this trip ID
        const tripData = mockTrips[tripId];
        if (!tripData) {
          throw new Error('Trip not found');
        }
        
        setTrip(tripData);
        setMembers(mockMembers[tripId] || []);
        setBalances(mockBalances[tripId] || []);
      } catch (err) {
        console.error('Error fetching trip details:', err);
        setError('Failed to load trip details');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !trip) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto py-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-semibold mb-4">
              {error || 'Trip not found'}
            </h2>
            <Link href="/trips">
              <Button>Back to Trips</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{trip.name}</h1>
              <p className="text-muted-foreground">
                {formatDate(trip.start_date)} - {trip.end_date ? formatDate(trip.end_date) : 'Ongoing'}
              </p>
              {trip.description && (
                <p className="mt-2 text-muted-foreground">{trip.description}</p>
              )}
            </div>
            <Link href="/trips">
              <Button variant="outline">Back to Trips</Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="receipts" className="w-full">
          <TabsList className="w-full mb-6 grid grid-cols-3">
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="balances">Balances</TabsTrigger>
          </TabsList>
          
          <TabsContent value="receipts">
            <ReceiptsTab tripId={tripId} />
          </TabsContent>
          
          <TabsContent value="members">
            <MembersTab tripId={tripId} members={members} />
          </TabsContent>
          
          <TabsContent value="balances">
            <BalancesTab 
              tripId={tripId} 
              balances={balances} 
              members={members}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}