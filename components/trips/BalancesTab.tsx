'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TripMember, Balance } from '@/lib/gibson-client';
import { useAuth } from '@/lib/auth-context';
import { formatCurrency } from '@/lib/utils';

interface BalancesTabProps {
  tripId: number;
  balances: Balance[];
  members: TripMember[];
}

export function BalancesTab({ tripId, balances, members }: BalancesTabProps) {
  const { user } = useAuth();
  const [viewType, setViewType] = useState<'summary' | 'detailed'>('summary');
  
  // Calculate who owes whom
  const settlements = calculateSettlements(balances);
  
  // Find the current user's balance
  const currentUserBalance = balances.find(b => b.user_id === user?.id);
  
  // Find settlements where the current user is involved
  const userSettlements = settlements.filter(
    s => s.fromUserId === user?.id || s.toUserId === user?.id
  );

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Balances</h2>
        <div className="flex items-center bg-muted rounded-lg p-1">
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewType === 'summary' ? 'bg-white shadow' : ''
            }`}
            onClick={() => setViewType('summary')}
          >
            Summary
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              viewType === 'detailed' ? 'bg-white shadow' : ''
            }`}
            onClick={() => setViewType('detailed')}
          >
            Detailed
          </button>
        </div>
      </div>

      {currentUserBalance && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Your Balance</h3>
              <div className={`text-2xl font-bold ${
                currentUserBalance.amount > 0 
                  ? 'text-green-600' 
                  : currentUserBalance.amount < 0 
                    ? 'text-red-600' 
                    : ''
              }`}>
                {formatCurrency(currentUserBalance.amount)}
              </div>
              <p className="mt-2 text-muted-foreground">
                {currentUserBalance.amount > 0 
                  ? "You are owed money" 
                  : currentUserBalance.amount < 0 
                    ? "You owe money"
                    : "You're all settled up"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {viewType === 'summary' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Balances</CardTitle>
              <CardDescription>
                Positive amounts are owed to the person, negative amounts are what they owe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {balances.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No balances to show yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {balances.map((balance) => (
                    <div key={balance.user_id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarFallback>
                            {balance.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {balance.username}
                          {balance.user_id === user?.id && " (You)"}
                        </span>
                      </div>
                      <span className={`font-medium ${
                        balance.amount > 0 
                          ? 'text-green-600' 
                          : balance.amount < 0 
                            ? 'text-red-600' 
                            : ''
                      }`}>
                        {formatCurrency(balance.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to Settle Up</CardTitle>
              <CardDescription>
                The simplest way to settle all debts with minimum transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userSettlements.length > 0 && (
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-2">Your Settlements</h4>
                  {userSettlements.map((settlement, index) => (
                    <div key={index} className="flex items-center justify-between mb-2 last:mb-0">
                      {settlement.fromUserId === user?.id ? (
                        <>
                          <div className="flex items-center">
                            <span className="text-muted-foreground mr-2">You pay</span>
                            <span className="font-medium">{settlement.to}</span>
                          </div>
                          <span className="font-medium text-red-600">
                            {formatCurrency(settlement.amount)}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <span className="font-medium">{settlement.from}</span>
                            <span className="text-muted-foreground mx-2">pays you</span>
                          </div>
                          <span className="font-medium text-green-600">
                            {formatCurrency(settlement.amount)}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {settlements.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">All settled up!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {settlements.map((settlement, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium">{settlement.from}</span>
                        <span className="mx-2 text-muted-foreground">pays</span>
                        <span className="font-medium">{settlement.to}</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(settlement.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detailed Breakdown</CardTitle>
            <CardDescription>
              A detailed view of all expenses and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {members.map((member) => {
                const memberBalance = balances.find(b => b.user_id === member.user_id);
                
                return (
                  <div key={member.id} className="pb-4 border-b last:border-0">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback>
                          {member.username?.slice(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">
                          {member.username}
                          {member.user_id === user?.id && " (You)"}
                        </h4>
                        {memberBalance && (
                          <p className={`text-sm ${
                            memberBalance.amount > 0 
                              ? 'text-green-600' 
                              : memberBalance.amount < 0 
                                ? 'text-red-600' 
                                : 'text-muted-foreground'
                          }`}>
                            {memberBalance.amount > 0 
                              ? `Owed ${formatCurrency(memberBalance.amount)}` 
                              : memberBalance.amount < 0 
                                ? `Owes ${formatCurrency(Math.abs(memberBalance.amount))}` 
                                : 'All settled'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="pl-4 border-l-2 border-muted space-y-2">
                      {settlements
                        .filter(s => s.fromUserId === member.user_id || s.toUserId === member.user_id)
                        .map((settlement, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            {settlement.fromUserId === member.user_id ? (
                              <>
                                <span className="text-muted-foreground">
                                  Pays {settlement.to}
                                </span>
                                <span className="text-red-600">
                                  {formatCurrency(settlement.amount)}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-muted-foreground">
                                  Receives from {settlement.from}
                                </span>
                                <span className="text-green-600">
                                  {formatCurrency(settlement.amount)}
                                </span>
                              </>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
  fromUserId: number;
  toUserId: number;
}

function calculateSettlements(balances: Balance[]): Settlement[] {
  const debts: Settlement[] = [];
  
  // Split into people who need to pay (negative balance) and people who need to be paid (positive balance)
  const payers = [...balances.filter(b => b.amount < 0)]
    .sort((a, b) => a.amount - b.amount);  // Sort ascending so biggest debts first
  
  const receivers = [...balances.filter(b => b.amount > 0)]
    .sort((a, b) => b.amount - a.amount);  // Sort descending so biggest credits first
  
  // Early exit if nobody owes anything
  if (payers.length === 0 || receivers.length === 0) {
    return [];
  }
  
  let payerIndex = 0;
  let receiverIndex = 0;
  
  while (payerIndex < payers.length && receiverIndex < receivers.length) {
    const payer = payers[payerIndex];
    const receiver = receivers[receiverIndex];
    
    // The amount to transfer is the minimum of what the payer owes and what the receiver is owed
    const amount = Math.min(Math.abs(payer.amount), receiver.amount);
    
    // Create a transaction
    debts.push({
      from: payer.username,
      to: receiver.username,
      amount: amount,
      fromUserId: payer.user_id,
      toUserId: receiver.user_id
    });
    
    // Update balances
    payer.amount += amount;
    receiver.amount -= amount;
    
    // If a payer has paid off their debt, move to the next payer
    if (Math.abs(payer.amount) < 0.01) {
      payerIndex++;
    }
    
    // If a receiver has been fully paid, move to the next receiver
    if (receiver.amount < 0.01) {
      receiverIndex++;
    }
  }
  
  return debts;
}