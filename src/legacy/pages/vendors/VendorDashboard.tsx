
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SocialMediaLinks from '@/components/shared/SocialMediaLinks';
import MediaUploader from '@/components/shared/MediaUploader';

// Mock data
const exampleVendor = {
  id: '1',
  businessName: 'Elegant Blooms',
  businessType: 'Florist',
  description: 'Elegant Blooms specializes in creating stunning floral arrangements for weddings and special events.',
  fullDescription: 'Our team of expert florists works closely with each couple to understand their vision and bring it to life through carefully curated flowers and greenery.',
  contactName: 'Priya Sharma',
  email: 'contact@elegantblooms.com',
  phone: '+91-11-4155-1234',
  website: 'www.elegantblooms.in',
  address: '123 Hauz Khas',
  city: 'New Delhi',
  state: 'Delhi',
  zip: '110016',
  serviceRegions: 'Delhi NCR, Gurgaon, Noida',
  startingPrice: '₹50,000',
  priceRange: '₹50,000 - ₹2,00,000',
  socialMedia: {
    facebook: 'https://facebook.com/elegantblooms',
    instagram: 'https://instagram.com/elegantblooms',
    twitter: '',
    linkedin: 'https://linkedin.com/company/elegantblooms',
  },
  media: [
    { type: 'image' as const, url: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200' },
    { type: 'image' as const, url: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7' },
  ],
  inquiries: [
    {
      id: '1',
      clientName: 'Rahul & Anjali',
      date: '2023-05-15',
      message: 'We are planning our wedding for December 2023 and would like to inquire about your floral arrangements for a 200-guest event.',
      status: 'new',
    },
    {
      id: '2',
      clientName: 'Karthik & Meera',
      date: '2023-05-10',
      message: 'Hi, we\'re interested in your services for our wedding in November. Can you please share your packages and availability?',
      status: 'replied',
    },
  ],
  bookings: [
    {
      id: '1',
      clientName: 'Vikram & Nisha',
      eventDate: '2023-11-25',
      package: 'Premium Package',
      amount: '₹85,000',
      status: 'confirmed',
    },
    {
      id: '2',
      clientName: 'Arjun & Deepa',
      eventDate: '2023-12-10',
      package: 'Deluxe Package',
      amount: '₹120,000',
      status: 'pending',
    },
  ],
};

const VendorDashboard: React.FC = () => {
  const [vendorData, setVendorData] = useState(exampleVendor);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(exampleVendor);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaSave = (links: any) => {
    setFormData(prev => ({ ...prev, socialMedia: links }));
    toast.success('Social media links updated successfully!');
  };

  const handleProfileSave = () => {
    setVendorData(formData);
    setEditMode(false);
    toast.success('Profile updated successfully!');
  };

  const handleMediaUpload = (files: File[]) => {
    console.log('Files uploaded:', files);
    toast.success(`${files.length} files uploaded successfully!`);
  };

  const handleMediaDelete = (index: number) => {
    const newMedia = [...vendorData.media];
    newMedia.splice(index, 1);
    setVendorData(prev => ({ ...prev, media: newMedia }));
    toast.success('Media deleted successfully!');
  };

  const handleInquiryReply = (id: string) => {
    toast.success('Reply sent successfully!');
  };

  const handleBookingUpdate = (id: string, status: string) => {
    const newBookings = vendorData.bookings.map(booking => 
      booking.id === id ? { ...booking, status } : booking
    );
    setVendorData(prev => ({ ...prev, bookings: newBookings }));
    toast.success('Booking status updated successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container-custom">
          <h1 className="font-playfair text-3xl font-bold mb-6">Vendor Dashboard</h1>
          
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
                    <CardTitle>Business Profile</CardTitle>
                    <CardDescription>Manage your business information</CardDescription>
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
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input 
                            id="businessName" 
                            name="businessName" 
                            value={formData.businessName} 
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessType">Business Type</Label>
                          <Select 
                            value={formData.businessType}
                            onValueChange={(value) => handleSelectChange('businessType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a business type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Florist">Florist</SelectItem>
                              <SelectItem value="Photographer">Photographer</SelectItem>
                              <SelectItem value="Catering">Catering</SelectItem>
                              <SelectItem value="Makeup Artist">Makeup Artist</SelectItem>
                              <SelectItem value="Wedding Planner">Wedding Planner</SelectItem>
                              <SelectItem value="DJ & Entertainment">DJ & Entertainment</SelectItem>
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
                        <Label htmlFor="serviceRegions">Service Regions</Label>
                        <Input 
                          id="serviceRegions" 
                          name="serviceRegions" 
                          value={formData.serviceRegions} 
                          onChange={handleInputChange}
                          placeholder="e.g., Delhi NCR, Gurgaon, Noida"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="startingPrice">Starting Price</Label>
                          <Input 
                            id="startingPrice" 
                            name="startingPrice" 
                            value={formData.startingPrice} 
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priceRange">Price Range</Label>
                          <Input 
                            id="priceRange" 
                            name="priceRange" 
                            value={formData.priceRange} 
                            onChange={handleInputChange}
                            required
                          />
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
                          <h3 className="text-sm font-medium text-gray-500">Business Name</h3>
                          <p className="mt-1">{vendorData.businessName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Business Type</h3>
                          <p className="mt-1">{vendorData.businessType}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                        <p className="mt-1">{vendorData.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Description</h3>
                        <p className="mt-1 whitespace-pre-line">{vendorData.fullDescription}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
                          <p className="mt-1">{vendorData.contactName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="mt-1">{vendorData.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                          <p className="mt-1">{vendorData.phone}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Website</h3>
                          <p className="mt-1">{vendorData.website}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Address</h3>
                        <p className="mt-1">
                          {vendorData.address}, {vendorData.city}, {vendorData.state} {vendorData.zip}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Service Regions</h3>
                        <p className="mt-1">{vendorData.serviceRegions}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Starting Price</h3>
                          <p className="mt-1">{vendorData.startingPrice}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Price Range</h3>
                          <p className="mt-1">{vendorData.priceRange}</p>
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
                    facebook={vendorData.socialMedia.facebook}
                    instagram={vendorData.socialMedia.instagram}
                    twitter={vendorData.socialMedia.twitter}
                    linkedin={vendorData.socialMedia.linkedin}
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
                  <CardDescription>Upload and manage your portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <MediaUploader 
                    existingMedia={vendorData.media}
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
                  {vendorData.inquiries.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No inquiries yet</p>
                  ) : (
                    <div className="space-y-6">
                      {vendorData.inquiries.map((inquiry) => (
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
                  {vendorData.bookings.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No bookings yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left">Client</th>
                            <th className="px-4 py-2 text-left">Event Date</th>
                            <th className="px-4 py-2 text-left">Package</th>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendorData.bookings.map((booking) => (
                            <tr key={booking.id} className="border-b">
                              <td className="px-4 py-3">{booking.clientName}</td>
                              <td className="px-4 py-3">{booking.eventDate}</td>
                              <td className="px-4 py-3">{booking.package}</td>
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

export default VendorDashboard;
