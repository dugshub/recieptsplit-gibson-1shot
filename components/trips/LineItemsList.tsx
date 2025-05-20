'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineItem } from '@/lib/gibson-client';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface LineItemsListProps {
  lineItems: LineItem[];
  tripId: number;
}

export function LineItemsList({ lineItems, tripId }: LineItemsListProps) {
  return (
    <div className="space-y-4">
      {lineItems.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{item.description}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{item.quantity} × {formatCurrency(item.amount)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">
                {formatCurrency(item.amount * item.quantity)}
              </span>
              <Link href={`/trips/${tripId}/line-items/${item.id}/split`}>
                <Button variant="outline" size="sm">
                  Split
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}