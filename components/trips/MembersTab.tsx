'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TripMember, tripService, userService } from '@/lib/gibson-client';
import { useAuth } from '@/lib/auth-context';

interface MembersTabProps {
  tripId: number;
  members: TripMember[];
}

export function MembersTab({ tripId, members }: MembersTabProps) {
  const { user } = useAuth();
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<Array<{ id: number, username: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if current user is the owner
  const isOwner = members.some(
    member => member.user_id === user?.id && member.role === 'owner'
  );

  const handleSearch = async () => {
    if (!searchUsername.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await userService.searchUsers(searchUsername);
      
      // Filter out users who are already members
      const filteredResults = results.filter(
        u => !members.some(m => m.user_id === u.id)
      );
      
      setSearchResults(filteredResults.map(u => ({ id: u.id, username: u.username })));
      
      if (filteredResults.length === 0) {
        setError('No matching users found or users are already members');
      }
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Failed to search for users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) {
      setError('Please select a user to add');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await tripService.addTripMember(tripId, selectedUserId, 'member');
      setSuccess('Member added successfully');
      setShowAddMemberForm(false);
      
      // Reload the page to update members list
      window.location.reload();
    } catch (err) {
      console.error('Error adding member:', err);
      setError('Failed to add member');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Trip Members</h2>
        {isOwner && (
          <Button 
            onClick={() => setShowAddMemberForm(!showAddMemberForm)}
            variant={showAddMemberForm ? "outline" : "default"}
          >
            {showAddMemberForm ? "Cancel" : "Add Member"}
          </Button>
        )}
      </div>

      {success && (
        <Alert variant="success" className="mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {showAddMemberForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="searchUsername" className="sr-only">
                    Search by username
                  </Label>
                  <Input
                    id="searchUsername"
                    placeholder="Search by username"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isLoading || !searchUsername.trim()}
                >
                  Search
                </Button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <div className="border rounded-md divide-y">
                    {searchResults.map((result) => (
                      <div 
                        key={result.id} 
                        className={`flex items-center p-3 cursor-pointer ${
                          selectedUserId === result.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => setSelectedUserId(result.id)}
                      >
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarFallback>
                            {result.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{result.username}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddMember}
                      disabled={isLoading || !selectedUserId}
                    >
                      {isLoading ? 'Adding...' : 'Add to Trip'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {members.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border text-center">
            <h3 className="text-lg font-medium mb-2">No members yet</h3>
            <p className="text-muted-foreground mb-4">
              Add members to split expenses with them
            </p>
            {isOwner && (
              <Button onClick={() => setShowAddMemberForm(true)}>
                Add Member
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border divide-y">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback>
                      {member.username?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.role === 'owner' ? 'Trip Owner' : 'Member'}
                    </p>
                  </div>
                </div>
                
                {member.user_id === user?.id && (
                  <span className="text-sm bg-muted px-3 py-1 rounded-full">
                    You
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}