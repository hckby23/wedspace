
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserPlus, Users, Search, Menu, Filter, Plus, Edit, Trash2, User, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  group: string;
  rsvpStatus: 'Pending' | 'Attending' | 'Declined' | 'Maybe';
  mealPreference?: string;
  plusOne: boolean;
  plusOneName?: string;
  notes?: string;
}

const GuestList: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      group: 'Family',
      rsvpStatus: 'Attending',
      mealPreference: 'Chicken',
      plusOne: true,
      plusOneName: 'Sarah Smith',
      notes: 'Allergic to nuts'
    },
    {
      id: '2',
      firstName: 'Emma',
      lastName: 'Johnson',
      email: 'emma@example.com',
      phone: '(555) 987-6543',
      group: 'Friends',
      rsvpStatus: 'Attending',
      mealPreference: 'Vegetarian',
      plusOne: false,
      notes: ''
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Williams',
      email: 'michael@example.com',
      phone: '(555) 456-7890',
      group: 'Work',
      rsvpStatus: 'Pending',
      plusOne: true,
      notes: 'Will confirm by next week'
    },
    {
      id: '4',
      firstName: 'Sophia',
      lastName: 'Brown',
      email: 'sophia@example.com',
      phone: '(555) 234-5678',
      group: 'Family',
      rsvpStatus: 'Declined',
      plusOne: false,
      notes: 'Out of town on wedding date'
    },
    {
      id: '5',
      firstName: 'Robert',
      lastName: 'Jones',
      email: 'robert@example.com',
      phone: '(555) 876-5432',
      group: 'Friends',
      rsvpStatus: 'Maybe',
      plusOne: true,
      notes: 'Will try to attend'
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showAddGuestDialog, setShowAddGuestDialog] = useState(false);
  const [newGuest, setNewGuest] = useState<Omit<Guest, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    group: 'Friends',
    rsvpStatus: 'Pending',
    plusOne: false,
  });
  
  const filteredGuests = guests.filter(guest => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      guest.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      guest.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // RSVP status filter
    const matchesRsvp = !activeFilter || guest.rsvpStatus === activeFilter;
    
    return matchesSearch && matchesRsvp;
  });
  
  const attendingCount = guests.filter(guest => guest.rsvpStatus === 'Attending').length;
  const declinedCount = guests.filter(guest => guest.rsvpStatus === 'Declined').length;
  const pendingCount = guests.filter(guest => guest.rsvpStatus === 'Pending' || guest.rsvpStatus === 'Maybe').length;
  const plusOnesCount = guests.filter(guest => guest.plusOne && guest.rsvpStatus === 'Attending').length;
  
  const totalAttending = attendingCount + plusOnesCount;
  
  const handleAddGuest = () => {
    const id = Date.now().toString();
    const guestToAdd: Guest = {
      id,
      ...newGuest
    };
    
    setGuests([...guests, guestToAdd]);
    setNewGuest({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      group: 'Friends',
      rsvpStatus: 'Pending',
      plusOne: false,
    });
    
    setShowAddGuestDialog(false);
    toast.success(`${guestToAdd.firstName} ${guestToAdd.lastName} has been added to your guest list`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container-custom max-w-6xl">
          <div className="mb-8">
            <h1 className="font-playfair font-bold text-3xl md:text-4xl mb-4">
              Guest List Manager
            </h1>
            <p className="text-gray-600">
              Keep track of your wedding guests and their RSVPs.
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Guests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="text-wed mr-2" size={20} />
                  <div className="text-3xl font-bold">{guests.length}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Attending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <div className="text-3xl font-bold text-green-600">{totalAttending}</div>
                  <div className="text-sm text-gray-500 ml-2">
                    ({attendingCount} guests + {plusOnesCount} plus-ones)
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Declined</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{declinedCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Awaiting RSVP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">{pendingCount}</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Guest Management */}
          <Tabs defaultValue="all" className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <TabsList>
                <TabsTrigger value="all">All Guests</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="seating">Seating Plan</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="border-wed text-wed hover:bg-wed/5"
                  onClick={() => toast.success("Guest list template has been downloaded")}
                >
                  <Upload className="mr-2" size={16} />
                  Import
                </Button>
                <Button 
                  className="bg-wed hover:bg-wed/90"
                  onClick={() => setShowAddGuestDialog(true)}
                >
                  <UserPlus className="mr-2" size={16} />
                  Add Guest
                </Button>
              </div>
            </div>
            
            <TabsContent value="all">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search guests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant={activeFilter === 'Attending' ? 'default' : 'outline'} 
                      className={activeFilter === 'Attending' ? 'bg-green-600 hover:bg-green-700' : ''}
                      onClick={() => setActiveFilter(activeFilter === 'Attending' ? null : 'Attending')}
                    >
                      Attending
                    </Button>
                    <Button 
                      variant={activeFilter === 'Pending' ? 'default' : 'outline'}
                      className={activeFilter === 'Pending' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                      onClick={() => setActiveFilter(activeFilter === 'Pending' ? null : 'Pending')}
                    >
                      Pending
                    </Button>
                    <Button 
                      variant={activeFilter === 'Declined' ? 'default' : 'outline'}
                      className={activeFilter === 'Declined' ? 'bg-red-500 hover:bg-red-600' : ''}
                      onClick={() => setActiveFilter(activeFilter === 'Declined' ? null : 'Declined')}
                    >
                      Declined
                    </Button>
                  </div>
                </div>
                
                {/* Guest List Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Contact</th>
                        <th className="px-6 py-3">Group</th>
                        <th className="px-6 py-3">RSVP Status</th>
                        <th className="px-6 py-3">Plus One</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredGuests.length > 0 ? (
                        filteredGuests.map((guest) => (
                          <tr key={guest.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="font-medium">{guest.firstName} {guest.lastName}</div>
                              {guest.mealPreference && (
                                <div className="text-xs text-gray-500">Meal: {guest.mealPreference}</div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div>{guest.email}</div>
                              <div className="text-xs text-gray-500">{guest.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {guest.group}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${guest.rsvpStatus === 'Attending' ? 'bg-green-100 text-green-800' : ''}
                                ${guest.rsvpStatus === 'Declined' ? 'bg-red-100 text-red-800' : ''}
                                ${guest.rsvpStatus === 'Pending' ? 'bg-amber-100 text-amber-800' : ''}
                                ${guest.rsvpStatus === 'Maybe' ? 'bg-blue-100 text-blue-800' : ''}
                              `}>
                                {guest.rsvpStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {guest.plusOne ? (
                                <div>
                                  <div className="text-green-600">Yes</div>
                                  {guest.plusOneName && (
                                    <div className="text-xs text-gray-500">{guest.plusOneName}</div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-red-500">No</div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button className="text-gray-500 hover:text-gray-700">
                                  <Edit size={18} />
                                </button>
                                <button className="text-gray-500 hover:text-red-500">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            No guests found matching your search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="groups">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center py-12">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Group management</h3>
                  <p className="mt-1 text-gray-500">Organize your guests into groups for easier management.</p>
                  <div className="mt-6">
                    <Button className="bg-wed hover:bg-wed/90">
                      Create Group
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="seating">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Seating Plan</h3>
                  <p className="mt-1 text-gray-500">Create and manage your wedding seating arrangement.</p>
                  <div className="mt-6">
                    <Button className="bg-wed hover:bg-wed/90">
                      Create Seating Plan
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-center">
            <Button className="bg-wed hover:bg-wed/90">
              Export Guest List
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Add Guest Dialog */}
      <Dialog open={showAddGuestDialog} onOpenChange={setShowAddGuestDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Guest</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input 
                id="firstName" 
                value={newGuest.firstName}
                onChange={(e) => setNewGuest({...newGuest, firstName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input 
                id="lastName" 
                value={newGuest.lastName}
                onChange={(e) => setNewGuest({...newGuest, lastName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={newGuest.email}
                onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={newGuest.phone}
                onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group">Group</Label>
              <Select 
                value={newGuest.group}
                onValueChange={(value) => setNewGuest({...newGuest, group: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Family">Family</SelectItem>
                  <SelectItem value="Friends">Friends</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Partner's Family">Partner's Family</SelectItem>
                  <SelectItem value="Partner's Friends">Partner's Friends</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rsvpStatus">RSVP Status</Label>
              <Select 
                value={newGuest.rsvpStatus}
                onValueChange={(value: any) => setNewGuest({...newGuest, rsvpStatus: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Attending">Attending</SelectItem>
                  <SelectItem value="Declined">Declined</SelectItem>
                  <SelectItem value="Maybe">Maybe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 flex items-center space-x-2 pt-2">
              <Checkbox 
                id="plusOne" 
                checked={newGuest.plusOne}
                onCheckedChange={(checked) => 
                  setNewGuest({...newGuest, plusOne: checked === true})
                }
              />
              <label
                htmlFor="plusOne"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Allow Plus One
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddGuestDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-wed hover:bg-wed/90"
              onClick={handleAddGuest}
              disabled={!newGuest.firstName || !newGuest.lastName}
            >
              Add Guest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestList;
