'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto min-h-screen flex flex-col justify-center items-center">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-primary">SplitReceipt</h1>
        <p className="text-xl text-muted-foreground">
          The easiest way to split expenses and track who owes what
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Create Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Organize your expenses by trips or events with friends, family, or colleagues.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Upload Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Easily record and categorize your expenses with detailed receipt tracking.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Split Fairly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Split costs evenly or by custom amounts and see who owes what at a glance.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}