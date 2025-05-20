'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { receiptService, Receipt, User } from '@/lib/gibson-client';
import { formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { NewReceiptForm } from './NewReceiptForm';

interface ReceiptsTabProps {
  tripId: number;
}

export function ReceiptsTab({ tripId }: ReceiptsTabProps) {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewReceiptForm, setShowNewReceiptForm] = useState(false);
  
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setIsLoading(true);
        const receiptsData = await receiptService.getReceipts(tripId);
        setReceipts(receiptsData);
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
    setReceipts([newReceipt, ...receipts]);
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