'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">ShadCN UI Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is a test of ShadCN UI styling.</p>
          </CardContent>
          <CardFooter>
            <Button>Primary Button</Button>
            <Button variant="outline" className="ml-2">Outline Button</Button>
          </CardFooter>
        </Card>

        <div className="p-6 border rounded-lg bg-card text-card-foreground">
          <h3 className="text-xl font-semibold mb-2">Manual Styling</h3>
          <p className="text-muted-foreground">Using Tailwind classes directly</p>
          <div className="mt-4">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">Primary Button</button>
            <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md ml-2">
              Outline Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}