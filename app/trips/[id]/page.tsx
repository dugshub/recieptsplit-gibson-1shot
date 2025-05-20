'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { tripService, Trip, TripMember, Receipt, Balance } from '@/lib/gibson-client';
import { ReceiptsTab } from '@/components/trips/ReceiptsTab';
import { MembersTab } from '@/components/trips/MembersTab';
import { BalancesTab } from '@/components/trips/BalancesTab';
import Link from 'next/link';

export default function TripDetailsPage() {
  const params = useParams();
  const tripId = parseInt(params.id as string);
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [members, setMembers] = useState<TripMember[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setIsLoading(true);
        
        // Fetch trip details
        const tripData = await tripService.getTripById(tripId);
        setTrip(tripData);
        
        // Fetch members
        const membersData = await tripService.getTripMembers(tripId);
        setMembers(membersData);
        
        // Fetch balances
        const balancesData = await tripService.getTripBalances(tripId);
        setBalances(balancesData);
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