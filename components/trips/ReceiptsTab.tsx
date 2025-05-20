'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt } from '@/lib/gibson-client';
import { formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { NewReceiptForm } from './NewReceiptForm';

// Mock data for demo
const mockReceipts: Record<number, Receipt[]> = {
  1: [
    {
      id: 1,
      uuid: 'receipt-uuid-1',
      trip_id: 1,
      user_id: 1,
      title: 'Dinner at Ocean View',
      date: '2025-06-15',
      total_amount: 120.50,
      merchant: 'Ocean View Restaurant',
      image_path: null,
      processing_status: 'ready',
      date_created: '2025-06-15T19:30:00Z',
      date_updated: null,
      username: 'user1'
    },
    {
      id: 2,
      uuid: 'receipt-uuid-2',
      trip_id: 1,
      user_id: 2,
      title: 'Groceries',
      date: '2025-06-16',
      total_amount: 85.75,
      merchant: 'Beachside Market',
      image_path: null,
      processing_status: 'ready',
      date_created: '2025-06-16T10:15:00Z',
      date_updated: null,
      username: 'user2'
    },
    {
      id: 3,
      uuid: 'receipt-uuid-3',
      trip_id: 1,
      user_id: 1,
      title: 'Beach Equipment Rental',
      date: '2025-06-17',
      total_amount: 45.00,
      merchant: 'Beach Rentals',
      image_path: null,
      processing_status: 'ready',
      date_created: '2025-06-17T09:00:00Z',
      date_updated: null,
      username: 'user1'
    }
  ],
  2: [
    {
      id: 4,
      uuid: 'receipt-uuid-4',
      trip_id: 2,
      user_id: 1,
      title: 'Cabin Rental',
      date: '2025-07-10',
      total_amount: 250.00,
      merchant: 'Mountain Retreats',
      image_path: null,
      processing_status: 'ready',
      date_created: '2025-07-10T12:00:00Z',
      date_updated: null,
      username: 'user1'
    },
    {
      id: 5,
      uuid: 'receipt-uuid-5',
      trip_id: 2,
      user_id: 2,
      title: 'Hiking Supplies',
      date: '2025-07-11',
      total_amount: 75.75,
      merchant: 'Outdoor Gear Shop',
      image_path: null,
      processing_status: 'ready',
      date_created: '2025-07-11T10:30:00Z',
      date_updated: null,
      username: 'user2'
    }
  ]
};

interface ReceiptsTabProps {
  tripId: number;
}

export function ReceiptsTab({ tripId }: ReceiptsTabProps) {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewReceiptForm, setShowNewReceiptForm] = useState(false);
  
  useEffect(() => {
    // Simulate fetching receipts from the API
    const fetchReceipts = async () => {
      try {
        setIsLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Get mock data for this trip
        setReceipts(mockReceipts[tripId] || []);
      } catch (err) {
        console.error('Error fetching receipts:', err);
        setError('Failed to load receipts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReceipts();
  }, [tripId]);

  const handleReceiptCreated = (newReceipt: Receipt) => {
    // Add a unique ID to the new receipt
    const updatedReceipt = {
      ...newReceipt,
      id: receipts.length > 0 ? Math.max(...receipts.map(r => r.id)) + 1 : 1,
      uuid: `receipt-uuid-${Date.now()}`,
      username: 'user1', // Assuming current user
      processing_status: 'ready' as 'ready'
    };
    
    setReceipts([updatedReceipt, ...receipts]);
    setShowNewReceiptForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <h3 className="text-lg font-medium text-destructive mb-2">{error}</h3>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Receipts</h2>
        <Button 
          onClick={() => setShowNewReceiptForm(!showNewReceiptForm)}
          variant={showNewReceiptForm ? "outline" : "default"}
        >
          {showNewReceiptForm ? "Cancel" : "Add Receipt"}
        </Button>
      </div>

      {showNewReceiptForm && (
        <div className="mb-8">
          <NewReceiptForm tripId={tripId} onReceiptCreated={handleReceiptCreated} />
        </div>
      )}

      {receipts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border text-center">
          <h3 className="text-lg font-medium mb-2">No receipts yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first receipt to start tracking expenses
          </p>
          <Button onClick={() => setShowNewReceiptForm(true)}>
            Add Receipt
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {receipts.map((receipt) => (
            <Link href={`/trips/${tripId}/receipts/${receipt.id}`} key={receipt.id}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle>{receipt.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(receipt.date)} • {receipt.username}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      {receipt.merchant && (
                        <span className="text-sm text-muted-foreground">{receipt.merchant}</span>
                      )}
                    </div>
                    <div className="bg-primary px-3 py-1 rounded-full text-sm font-medium text-primary-foreground">
                      {formatCurrency(receipt.total_amount)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}