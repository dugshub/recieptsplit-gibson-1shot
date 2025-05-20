'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { lineItemService, LineItem } from '@/lib/gibson-client';

interface NewLineItemFormProps {
  receiptId: number;
  onLineItemCreated: (lineItem: LineItem) => void;
  remainingAmount: number;
}

export function NewLineItemForm({ receiptId, onLineItemCreated, remainingAmount }: NewLineItemFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(remainingAmount > 0 ? remainingAmount.toString() : '');
  const [quantity, setQuantity] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) {
      setError('Description and amount are required');
      return;
    }

    const numAmount = parseFloat(amount);
    const numQuantity = parseInt(quantity);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be a positive number');
      return;
    }
    
    if (isNaN(numQuantity) || numQuantity <= 0) {
      setError('Quantity must be a positive number');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const newLineItem = await lineItemService.createLineItem(
        receiptId,
        description,
        numAmount,
        numQuantity
      );
      
      onLineItemCreated(newLineItem);
    } catch (error) {
      console.error('Failed to create line item:', error);
      setError('Failed to add line item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Line Item</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              placeholder="Item description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                id="quantity" 
                type="number"
                min="1"
                placeholder="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Line Item'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}