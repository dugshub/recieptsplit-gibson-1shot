'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { receiptService, lineItemService, Receipt, LineItem } from '@/lib/gibson-client';
import { formatDate, formatCurrency } from '@/lib/utils';
import { NewLineItemForm } from '@/components/trips/NewLineItemForm';
import { LineItemsList } from '@/components/trips/LineItemsList';
import Link from 'next/link';

export default function ReceiptDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = parseInt(params.id as string);
  const receiptId = parseInt(params.receiptId as string);
  
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewLineItemForm, setShowNewLineItemForm] = useState(false);

  useEffect(() => {
    const fetchReceiptDetails = async () => {
      try {
        setIsLoading(true);
        
        // Fetch receipt details
        const receiptData = await receiptService.getReceiptById(receiptId);
        setReceipt(receiptData);
        
        // Fetch line items
        const lineItemsData = await lineItemService.getLineItems(receiptId);
        setLineItems(lineItemsData);
        
      } catch (err) {
        console.error('Error fetching receipt details:', err);
        setError('Failed to load receipt details');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (receiptId) {
      fetchReceiptDetails();
    }
  }, [receiptId]);

  const handleLineItemCreated = (newLineItem: LineItem) => {
    setLineItems([...lineItems, newLineItem]);
    setShowNewLineItemForm(false);
  };

  const calculateLineItemsTotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
  };

  const lineItemsTotal = calculateLineItemsTotal();
  const remainingAmount = receipt ? receipt.total_amount - lineItemsTotal : 0;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !receipt) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto py-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-semibold mb-4">
              {error || 'Receipt not found'}
            </h2>
            <Button onClick={() => router.back()}>Go Back</Button>
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
              <h1 className="text-3xl font-bold">{receipt.title}</h1>
              <p className="text-muted-foreground">
                {formatDate(receipt.date)} • Added by {receipt.username}
              </p>
              {receipt.merchant && (
                <p className="mt-1 text-muted-foreground">
                  Merchant: {receipt.merchant}
                </p>
              )}
            </div>
            <Link href={`/trips/${tripId}`}>
              <Button variant="outline">Back to Trip</Button>
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Receipt Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between py-2 border-b">
                <span>Total Amount:</span>
                <span className="font-medium">{formatCurrency(receipt.total_amount)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Line Items Total:</span>
                <span className="font-medium">{formatCurrency(lineItemsTotal)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Remaining:</span>
                <span className={`font-medium ${Math.abs(remainingAmount) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(remainingAmount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Line Items</h2>
            <Button
              onClick={() => setShowNewLineItemForm(!showNewLineItemForm)}
              variant={showNewLineItemForm ? "outline" : "default"}
            >
              {showNewLineItemForm ? "Cancel" : "Add Line Item"}
            </Button>
          </div>
        </div>

        {showNewLineItemForm && (
          <div className="mb-8">
            <NewLineItemForm 
              receiptId={receiptId} 
              onLineItemCreated={handleLineItemCreated}
              remainingAmount={remainingAmount}
            />
          </div>
        )}

        {lineItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border text-center">
            <h3 className="text-lg font-medium mb-2">No line items yet</h3>
            <p className="text-muted-foreground mb-4">
              Add line items to track what was purchased
            </p>
            <Button onClick={() => setShowNewLineItemForm(true)}>
              Add Line Item
            </Button>
          </div>
        ) : (
          <LineItemsList lineItems={lineItems} tripId={tripId} />
        )}
      </div>
    </ProtectedRoute>
  );
}