'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TripCard } from '@/components/trips/TripCard';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { tripService, Trip, TripMember, receiptService, Receipt } from '@/lib/gibson-client';
import Link from 'next/link';
import { NewTripForm } from '@/components/trips/NewTripForm';

export default function TripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripMembers, setTripMembers] = useState<Record<number, TripMember[]>>({});
  const [tripTotals, setTripTotals] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showNewTripForm, setShowNewTripForm] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;
      
      try {
        const fetchedTrips = await tripService.getTrips(user.id);
        setTrips(fetchedTrips);
        
        // Fetch members and receipt totals for each trip
        const memberPromises = fetchedTrips.map(trip => tripService.getTripMembers(trip.id));
        const receiptPromises = fetchedTrips.map(trip => receiptService.getReceipts(trip.id));
        
        const membersResults = await Promise.all(memberPromises);
        const receiptsResults = await Promise.all(receiptPromises);
        
        // Create trip members map
        const membersMap: Record<number, TripMember[]> = {};
        membersResults.forEach((members, index) => {
          membersMap[fetchedTrips[index].id] = members;
        });
        setTripMembers(membersMap);
        
        // Calculate trip totals
        const totalsMap: Record<number, number> = {};
        receiptsResults.forEach((receipts, index) => {
          const tripId = fetchedTrips[index].id;
          totalsMap[tripId] = receipts.reduce((sum, receipt) => sum + receipt.total_amount, 0);
        });
        setTripTotals(totalsMap);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrips();
  }, [user]);

  const handleTripCreated = (newTrip: Trip) => {
    setTrips([newTrip, ...trips]);
    setTripMembers({
      ...tripMembers, 
      [newTrip.id]: [{ 
        id: 0, 
        uuid: '', 
        trip_id: newTrip.id, 
        user_id: user!.id, 
        role: 'owner',
        date_created: new Date().toISOString(),
        date_updated: null,
        username: user!.username
      }]
    });
    setTripTotals({...tripTotals, [newTrip.id]: 0});
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