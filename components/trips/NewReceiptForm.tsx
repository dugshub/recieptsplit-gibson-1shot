'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { receiptService, Receipt } from '@/lib/gibson-client';
import { useAuth } from '@/lib/auth-context';

interface NewReceiptFormProps {
  tripId: number;
  onReceiptCreated: (receipt: Receipt) => void;
}

export function NewReceiptForm({ tripId, onReceiptCreated }: NewReceiptFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalAmount, setTotalAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to add a receipt');
      return;
    }
    
    if (!title || !date || !totalAmount) {
      setError('Title, date, and total amount are required');
      return;
    }

    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Total amount must be a positive number');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const newReceipt = await receiptService.createReceipt(
        tripId,
        user.id,
        title,
        date,
        amount,
        merchant || null
      );
      
      onReceiptCreated(newReceipt);
    } catch (error) {
      console.error('Failed to create receipt:', error);
      setError('Failed to add receipt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Receipt</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="Dinner at Restaurant"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input 
                id="totalAmount" 
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="merchant">Merchant (Optional)</Label>
            <Input 
              id="merchant" 
              placeholder="Restaurant or store name"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Receipt'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}