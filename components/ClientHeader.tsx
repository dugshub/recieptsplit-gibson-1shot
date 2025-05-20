'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { useAuth } from '@/lib/auth-context';

export function ClientHeader() {
  const { user, logout } = useAuth();
  
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-primary">SplitReceipt</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link href="/trips" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                My Trips
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {user.username}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">
                  Login
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">
                  Register
                </Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}