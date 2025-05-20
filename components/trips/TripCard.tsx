import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Trip, TripMember } from "@/lib/gibson-client";

interface TripCardProps {
  trip: Trip;
  members: TripMember[];
  totalAmount: number;
}

export function TripCard({ trip, members, totalAmount }: TripCardProps) {
  return (
    <Link href={`/trips/${trip.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle>{trip.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatDate(trip.start_date)} - {trip.end_date ? formatDate(trip.end_date) : "Ongoing"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex -space-x-2">
              {members.slice(0, 3).map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                  <AvatarFallback>
                    {member.username?.slice(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              ))}
              
              {members.length > 3 && (
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarFallback>
                    +{members.length - 3}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            
            <div className="bg-muted px-3 py-1 rounded-full text-sm font-medium">
              {formatCurrency(totalAmount)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}