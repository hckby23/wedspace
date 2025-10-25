
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SocialMediaLinks from '@/components/shared/SocialMediaLinks';
import MediaUploader from '@/components/shared/MediaUploader';

// Mock data
const exampleVenue = {
  id: '1',
  name: 'The Grand New Delhi',
  location: 'Nelson Mandela Road, Vasant Kunj, New Delhi',
  description: 'The Grand New Delhi is a 5-star luxury hotel offering opulent wedding venues with state-of-the-art facilities and impeccable service.',
  fullDescription: 'Set amidst lush greenery, The Grand New Delhi offers the perfect setting for your dream wedding. Our team of dedicated professionals ensures that every aspect of your special day is meticulously planned and executed to perfection.',
  venueType: 'Hotel',
  contactName: 'Booking Manager',
  email: 'events@thegrandnewdelhi.com',
  phone: '+91-11-2677-1234',
  website: 'www.thegrandnewdelhi.com',
  address: 'Nelson Mandela Road',
  city: 'New Delhi',
  state: 'Delhi',
  zip: '110070',
  priceRange: '₹2,00,000 - ₹5,00,000',
  capacity: {
    min: 100,
    max: 1000
  },
  amenities: [
    'Banquet Halls',
    'Lawns/Poolside',
    'Bridal Suite',
    'In-house Catering',
    'Alcohol License',
    'DJ/Music',
    'Parking',
    'Accommodation',
    'Air Conditioning'
  ],
  socialMedia: {
    facebook: 'https://facebook.com/thegrandnewdelhi',
    instagram: 'https://instagram.com/thegrandnewdelhi',
    twitter: '',
    linkedin: 'https://linkedin.com/company/thegrandnewdelhi',
  },
  media: [
    { type: 'image' as const, url: 'https://images.unsplash.com/photo-1519741497674-611481863552' },
    { type: 'image' as const, url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3' },
  ],
  inquiries: [
    {
      id: '1',
      clientName: 'Priya & Rahul',
      date: '2023-05-18',
      message: 'We are interested in booking your venue for our wedding on December 15, 2023. We are expecting about 250 guests. Could you please share your availability and packages for this date?',
      status: 'new',
    },
    {
      id: '2',
      clientName: 'Ananya & Vikram',
      date: '2023-05-12',
      message: 'We would like to arrange a venue tour for your property. We are planning a wedding for approximately 400 guests in January 2024. Are you available for a site visit this weekend?',
      status: 'replied',
    },
  ],
  bookings: [
    {
      id: '1',
      clientName: 'Tanya & Varun',
      eventDate: '2023-11-25',
      eventType: 'Wedding Reception',
      guestCount: 350,
      amount: '₹3,50,000',
      status: 'confirmed',
    },
    {
      id: '2',
      clientName: 'Sonia & Nikhil',
      eventDate: '2023-12-10',
      eventType: 'Wedding & Reception',
      guestCount: 500,
      amount: '₹4,25,000',
      status: 'pending',
    },
  ],
};

const VenueDashboard: React.FC = () => {
  const [venueData, setVenueData] = useState(exampleVenue);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(exampleVenue);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(exampleVenue.amenities);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCapacityChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      capacity: { ...prev.capacity, [type]: numValue }
    }));
  };

  const handleAmenityToggle = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities(prev => [...prev, amenity]);
    } else {
      setSelectedAmenities(prev => prev.filter(a => a !== amenity));
    }
  };

  const handleSocialMediaSave = (links: any) => {
    setFormData(prev => ({ ...prev, socialMedia: links }));
    toast.success('Social media links updated successfully!');
  };

  const handleProfileSave = () => {
    const updatedVenue = {
      ...formData,
      amenities: selectedAmenities
    };
    setVenueData(updatedVenue);
    setEditMode(false);
    toast.success('Profile updated successfully!');
  };

  const handleMediaUpload = (files: File[]) => {
    console.log('Files uploaded:', files);
    toast.success(`${files.length} files uploaded successfully!`);
  };

  const handleMediaDelete = (index: number) => {
    const newMedia = [...venueData.media];
    newMedia.splice(index, 1);
    setVenueData(prev => ({ ...prev, media: newMedia }));
    toast.success('Media deleted successfully!');
  };

  const handleInquiryReply = (id: string) => {
    toast.success('Reply sent successfully!');
  };

  const handleBookingUpdate = (id: string, status: string) => {
    const newBookings = venueData.bookings.map(booking => 
      booking.id === id ? { ...booking, status } : booking
    );
    setVenueData(prev => ({ ...prev, bookings: newBookings }));
    toast.success('Booking status updated successfully!');
  };

  const availableAmenities = [
    'Banquet Halls',
    'Lawns/Poolside',
    'Bridal Suite',
    'In-house Catering',
    'Alcohol License',
    'DJ/Music',
    'Parking',
    'Accommodation',
    'Air Conditioning',
    'Spa Services',
    'Swimming Pool',
    'Wedding Planning Services',
    'Customized Décor',
    'Valet Parking',
    'Outdoor Spaces',
    'Rooftop Venue',
    'Heritage Property',
    'Beachfront',
    'Hillview',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container-custom">
          <h1 className="font-playfair text-3xl font-bold mb-6">Venue Dashboard</h1>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Venue Profile</CardTitle>
                    <CardDescription>Manage your venue information</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setEditMode(!editMode)}
                    variant={editMode ? "outline" : "default"}
                  >
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </CardHeader>
                <CardContent>
                  {editMode ? (
                    // Edit mode form
                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleProfileSave(); }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Venue Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="venueType">Venue Type</Label>
                          <Select 
                            value={formData.venueType}
                            onValueChange={(value) => handleSelectChange('venueType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a venue type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Hotel">Hotel</SelectItem>
                              <SelectItem value="Resort">Resort</SelectItem>
                              <SelectItem value="Banquet Hall">Banquet Hall</SelectItem>
                              <SelectItem value="Garden">Garden/Lawn</SelectItem>
                              <SelectItem value="Heritage">Heritage Property</SelectItem>
                              <SelectItem value="Beach">Beach Resort</SelectItem>
                              <SelectItem value="Farmhouse">Farmhouse</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Short Description</Label>
                        <Textarea 
                          id="description" 
                          name="description" 
                          value={formData.description} 
                          onChange={handleInputChange}
                          rows={2}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fullDescription">Full Description</Label>
                        <Textarea 
                          id="fullDescription" 
                          name="fullDescription" 
                          value={formData.fullDescription} 
                          onChange={handleInputChange}
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="contactName">Contact Person</Label>
                          <Input 
                            id="contactName" 
                            name="contactName" 
                            value={formData.contactName} 
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email"
                            value={formData.email} 
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input 
                            id="website" 
                            name="website" 
                            value={formData.website} 
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          name="address" 
                          value={formData.address} 
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            name="city" 
                            value={formData.city} 
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state" 
                            name="state" 
                            value={formData.state} 
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input 
                            id="zip" 
                            name="zip" 
                            value={formData.zip} 
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="priceRange">Price Range</Label>
                        <Input 
                          id="priceRange" 
                          name="priceRange" 
                          value={formData.priceRange} 
                          onChange={handleInputChange}
                          placeholder="e.g., ₹2,00,000 - ₹5,00,000"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label>Capacity</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                          <div className="space-y-2">
                            <Label htmlFor="minCapacity">Minimum</Label>
                            <Input 
                              id="minCapacity" 
                              type="number"
                              value={formData.capacity.min} 
                              onChange={(e) => handleCapacityChange('min', e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="maxCapacity">Maximum</Label>
                            <Input 
                              id="maxCapacity" 
                              type="number"
                              value={formData.capacity.max} 
                              onChange={(e) => handleCapacityChange('max', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Label>Amenities</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {availableAmenities.map((amenity) => (
                            <div className="flex items-center space-x-2" key={amenity}>
                              <Checkbox 
                                id={`amenity-${amenity}`} 
                                checked={selectedAmenities.includes(amenity)}
                                onCheckedChange={(checked) => 
                                  handleAmenityToggle(amenity, checked as boolean)
                                }
                              />
                              <Label 
                                htmlFor={`amenity-${amenity}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {amenity}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <Button type="submit" className="bg-wed hover:bg-wed/90">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  ) : (
                    // View mode
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Venue Name</h3>
                          <p className="mt-1">{venueData.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Venue Type</h3>
                          <p className="mt-1">{venueData.venueType}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                        <p className="mt-1">{venueData.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Description</h3>
                        <p className="mt-1 whitespace-pre-line">{venueData.fullDescription}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
                          <p className="mt-1">{venueData.contactName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="mt-1">{venueData.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                          <p className="mt-1">{venueData.phone}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Website</h3>
                          <p className="mt-1">{venueData.website}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Address</h3>
                        <p className="mt-1">
                          {venueData.address}, {venueData.city}, {venueData.state} {venueData.zip}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Price Range</h3>
                        <p className="mt-1">{venueData.priceRange}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
                        <p className="mt-1">{venueData.capacity.min} - {venueData.capacity.max} guests</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Amenities</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {venueData.amenities.map((amenity, index) => (
                            <span 
                              key={index} 
                              className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                  <CardDescription>Connect your social media accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <SocialMediaLinks
                    facebook={venueData.socialMedia.facebook}
                    instagram={venueData.socialMedia.instagram}
                    twitter={venueData.socialMedia.twitter}
                    linkedin={venueData.socialMedia.linkedin}
                    onSave={handleSocialMediaSave}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Media Tab */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Photos & Videos</CardTitle>
                  <CardDescription>Upload and manage images of your venue</CardDescription>
                </CardHeader>
                <CardContent>
                  <MediaUploader 
                    existingMedia={venueData.media}
                    onUpload={handleMediaUpload}
                    onDelete={handleMediaDelete}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Inquiries Tab */}
            <TabsContent value="inquiries">
              <Card>
                <CardHeader>
                  <CardTitle>Client Inquiries</CardTitle>
                  <CardDescription>Manage inquiries from potential clients</CardDescription>
                </CardHeader>
                <CardContent>
                  {venueData.inquiries.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No inquiries yet</p>
                  ) : (
                    <div className="space-y-6">
                      {venueData.inquiries.map((inquiry) => (
                        <div key={inquiry.id} className="border rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{inquiry.clientName}</h4>
                              <p className="text-sm text-gray-500">{inquiry.date}</p>
                            </div>
                            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {inquiry.status === 'new' ? 'New' : 'Replied'}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">{inquiry.message}</p>
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleInquiryReply(inquiry.id)}
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Bookings</CardTitle>
                  <CardDescription>Manage your upcoming and past bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {venueData.bookings.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No bookings yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left">Client</th>
                            <th className="px-4 py-2 text-left">Event Date</th>
                            <th className="px-4 py-2 text-left">Event Type</th>
                            <th className="px-4 py-2 text-left">Guests</th>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {venueData.bookings.map((booking) => (
                            <tr key={booking.id} className="border-b">
                              <td className="px-4 py-3">{booking.clientName}</td>
                              <td className="px-4 py-3">{booking.eventDate}</td>
                              <td className="px-4 py-3">{booking.eventType}</td>
                              <td className="px-4 py-3">{booking.guestCount}</td>
                              <td className="px-4 py-3">{booking.amount}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  booking.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : booking.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBookingUpdate(booking.id, 'confirmed')}
                                    disabled={booking.status === 'confirmed'}
                                  >
                                    Confirm
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VenueDashboard;
