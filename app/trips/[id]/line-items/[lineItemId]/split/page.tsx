'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { lineItemService, tripService, splitService, LineItem, TripMember, Split } from '@/lib/gibson-client';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function SplitLineItemPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = parseInt(params.id as string);
  const lineItemId = parseInt(params.lineItemId as string);
  
  const [lineItem, setLineItem] = useState<LineItem | null>(null);
  const [members, setMembers] = useState<TripMember[]>([]);
  const [splits, setSplits] = useState<Record<number, number>>({});
  const [existingSplits, setExistingSplits] = useState<Split[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch line item details
        const items = await lineItemService.getLineItems(0, lineItemId);
        if (items.length === 0) {
          throw new Error('Line item not found');
        }
        const fetchedLineItem = items[0];
        setLineItem(fetchedLineItem);
        
        // Fetch trip members
        const fetchedMembers = await tripService.getTripMembers(tripId);
        setMembers(fetchedMembers);
        
        // Fetch existing splits
        const fetchedSplits = await splitService.getSplits(lineItemId);
        setExistingSplits(fetchedSplits);
        
        // Initialize splits state from existing splits
        const initialSplits: Record<number, number> = {};
        fetchedSplits.forEach(split => {
          initialSplits[split.user_id] = split.amount;
        });
        setSplits(initialSplits);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [tripId, lineItemId]);

  const handleAmountChange = (userId: number, amount: string) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      setSplits({ ...splits, [userId]: 0 });
    } else {
      setSplits({ ...splits, [userId]: numAmount });
    }
  };

  const getTotalSplitAmount = () => {
    return Object.values(splits).reduce((sum, amount) => sum + amount, 0);
  };

  const getRemaining = () => {
    if (!lineItem) return 0;
    return lineItem.amount * lineItem.quantity - getTotalSplitAmount();
  };

  const handleSplitEvenly = () => {
    if (!lineItem || members.length === 0) return;
    
    const amount = lineItem.amount * lineItem.quantity;
    const equalAmount = parseFloat((amount / members.length).toFixed(2));
    
    // Handle rounding issues by assigning any remainder to the first member
    const remainder = amount - (equalAmount * members.length);
    
    const newSplits: Record<number, number> = {};
    members.forEach((member, index) => {
      if (index === 0) {
        newSplits[member.user_id] = parseFloat((equalAmount + remainder).toFixed(2));
      } else {
        newSplits[member.user_id] = equalAmount;
      }
    });
    
    setSplits(newSplits);
  };

  const handleSaveSplits = async () => {
    if (!lineItem) return;
    
    const totalSplit = getTotalSplitAmount();
    const totalAmount = lineItem.amount * lineItem.quantity;
    
    // Ensure the split amounts equal the total amount
    if (Math.abs(totalSplit - totalAmount) > 0.01) {
      setError(`Split amounts must equal the total amount of ${formatCurrency(totalAmount)}`);
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Delete existing splits first
      for (const split of existingSplits) {
        // Delete functionality would need to be implemented in the API
        // await splitService.deleteSplit(split.id);
      }
      
      // Create new splits
      const promises = Object.entries(splits)
        .filter(([_, amount]) => amount > 0)
        .map(([userId, amount]) => 
          splitService.createSplit(lineItemId, parseInt(userId), amount)
        );
      
      await Promise.all(promises);
      
      setSuccess('Splits saved successfully');
      
      // Navigate back to receipt after a short delay
      setTimeout(() => {
        router.back();
      }, 1500);
      
    } catch (err) {
      console.error('Error saving splits:', err);
      setError('Failed to save splits');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !lineItem) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto py-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-semibold mb-4">
              {error || 'Line item not found'}
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
              <h1 className="text-3xl font-bold">Split Expense</h1>
              <p className="text-muted-foreground">
                {lineItem?.description}
              </p>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>
              Split the cost of this item among trip members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between py-2 border-b">
              <span>Description:</span>
              <span className="font-medium">{lineItem?.description}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Amount:</span>
              <span className="font-medium">{formatCurrency(lineItem?.amount || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Quantity:</span>
              <span className="font-medium">{lineItem?.quantity}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Total:</span>
              <span className="font-medium">{formatCurrency((lineItem?.amount || 0) * (lineItem?.quantity || 0))}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Split Amounts</CardTitle>
              <Button variant="outline" onClick={handleSplitEvenly}>
                Split Evenly
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert variant="success" className="mb-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback>
                      {member.username?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 font-medium">{member.username}</span>
                  <div className="w-32">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={splits[member.user_id] || ''}
                      onChange={(e) => handleAmountChange(member.user_id, e.target.value)}
                      className="text-right"
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium">Remaining:</span>
                <span className={`font-medium ${Math.abs(getRemaining()) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(getRemaining())}
                </span>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveSplits}
                  disabled={isSaving || Math.abs(getRemaining()) > 0.01}
                >
                  {isSaving ? 'Saving...' : 'Save Splits'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}