
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Checkbox
} from "@/components/ui/checkbox";
import { CalendarIcon, CheckIcon, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';

const formSchema = z.object({
  venueName: z.string().min(2, "Venue name must be at least 2 characters"),
  venueType: z.string().min(1, "Please select a venue type"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zip: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  capacity: z.string().min(1, "Please enter venue capacity"),
  priceRange: z.string().min(1, "Please enter price range"),
  indoorOutdoor: z.string().min(1, "Please select venue setting"),
  availabilityStart: z.date({
    required_error: "Please select a start date",
  }),
  availabilityEnd: z.date({
    required_error: "Please select an end date",
  }).optional(),
  amenities: z.array(z.string()).optional(),
  cateringPolicy: z.string().min(1, "Please select a catering policy"),
  alcoholPolicy: z.string().min(1, "Please select an alcohol policy"),
  parkingInfo: z.string().min(1, "Please provide parking information"),
  accessories: z.array(z.string()).optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const VenueSignup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      venueName: "",
      venueType: "",
      description: "",
      contactName: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
      capacity: "",
      priceRange: "",
      indoorOutdoor: "",
      cateringPolicy: "",
      alcoholPolicy: "",
      parkingInfo: "",
      amenities: [],
      accessories: [],
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    }
  });

  function onSubmit(values: FormValues) {
    setSubmitting(true);
    console.log(values);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Venue registration successful! Welcome to wedspace!");
      navigate('/venue/dashboard');
    }, 1500);
  }

  const nextStep = () => {
    if (step === 1) {
      form.trigger(['venueName', 'venueType', 'description']);
      if (
        !form.formState.errors.venueName && 
        !form.formState.errors.venueType && 
        !form.formState.errors.description
      ) {
        setStep(2);
      }
    } else if (step === 2) {
      form.trigger(['contactName', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country']);
      if (
        !form.formState.errors.contactName && 
        !form.formState.errors.email && 
        !form.formState.errors.phone &&
        !form.formState.errors.address &&
        !form.formState.errors.city &&
        !form.formState.errors.state &&
        !form.formState.errors.zip &&
        !form.formState.errors.country
      ) {
        setStep(3);
      }
    } else if (step === 3) {
      form.trigger(['capacity', 'priceRange', 'indoorOutdoor', 'availabilityStart', 'cateringPolicy', 'alcoholPolicy', 'parkingInfo']);
      if (
        !form.formState.errors.capacity && 
        !form.formState.errors.priceRange && 
        !form.formState.errors.indoorOutdoor &&
        !form.formState.errors.availabilityStart &&
        !form.formState.errors.cateringPolicy &&
        !form.formState.errors.alcoholPolicy &&
        !form.formState.errors.parkingInfo
      ) {
        setStep(4);
      }
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Register Your Venue - wedspace | Wedding Planning Platform</title>
        <meta name="description" content="Register your wedding venue on wedspace to connect with engaged couples and grow your business." />
        <meta name="keywords" content="wedding venue registration, venue signup, wedding venue listing, venue marketing" />
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-space/10 to-wed/10 py-12">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">Register Your Venue on wedspace</h1>
              <p className="text-gray-600 max-w-2xl mb-8">
                Showcase your wedding venue to thousands of engaged couples planning their special day. 
                Complete your profile below to get started.
              </p>

              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between mb-8 border-b">
                  <div 
                    className={`pb-4 px-4 ${step === 1 ? 'border-b-2 border-wed font-medium text-wed' : 'text-gray-500'}`}
                  >
                    1. Venue Details
                  </div>
                  <div 
                    className={`pb-4 px-4 ${step === 2 ? 'border-b-2 border-wed font-medium text-wed' : 'text-gray-500'}`}
                  >
                    2. Contact Information
                  </div>
                  <div 
                    className={`pb-4 px-4 ${step === 3 ? 'border-b-2 border-wed font-medium text-wed' : 'text-gray-500'}`}
                  >
                    3. Features & Policies
                  </div>
                  <div 
                    className={`pb-4 px-4 ${step === 4 ? 'border-b-2 border-wed font-medium text-wed' : 'text-gray-500'}`}
                  >
                    4. Account Setup
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {step === 1 && (
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="venueName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Venue Name*</FormLabel>
                              <FormControl>
                                <Input placeholder="Your venue name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="venueType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Venue Type*</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select venue type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="hotel">Hotel/Resort</SelectItem>
                                  <SelectItem value="barn">Barn/Farm</SelectItem>
                                  <SelectItem value="garden">Garden/Park</SelectItem>
                                  <SelectItem value="estate">Estate/Mansion</SelectItem>
                                  <SelectItem value="beach">Beach/Waterfront</SelectItem>
                                  <SelectItem value="banquet">Banquet Hall</SelectItem>
                                  <SelectItem value="country_club">Country Club</SelectItem>
                                  <SelectItem value="restaurant">Restaurant</SelectItem>
                                  <SelectItem value="winery">Winery/Vineyard</SelectItem>
                                  <SelectItem value="historic">Historic Building</SelectItem>
                                  <SelectItem value="industrial">Industrial/Loft Space</SelectItem>
                                  <SelectItem value="religious">Religious Setting</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Venue Description*</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your venue and what makes it special (min. 20 characters)" 
                                  className="min-h-32"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button 
                            type="button"
                            onClick={nextStep}
                            className="bg-wed hover:bg-wed/90"
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Person*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address*</FormLabel>
                                <FormControl>
                                  <Input placeholder="venue@email.com" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number*</FormLabel>
                                <FormControl>
                                  <Input placeholder="(123) 456-7890" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Website (optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://www.yourvenue.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <FormLabel>Venue Location*</FormLabel>
                          <div className="rounded-md border p-4">
                            <div className="flex items-center gap-2 mb-4">
                              <MapPin className="h-5 w-5 text-gray-400" />
                              <span className="font-medium">Physical Address</span>
                            </div>
                            
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input placeholder="Street Address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="city"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input placeholder="City" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="state"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input placeholder="State/Province" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="zip"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input placeholder="ZIP/Postal Code" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="country"
                                  render={({ field }) => (
                                    <FormItem>
                                      <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select country" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="United States">United States</SelectItem>
                                          <SelectItem value="Canada">Canada</SelectItem>
                                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                          <SelectItem value="Australia">Australia</SelectItem>
                                          <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button 
                            type="button"
                            onClick={previousStep}
                            variant="outline"
                          >
                            Back
                          </Button>
                          <Button 
                            type="button"
                            onClick={nextStep}
                            className="bg-wed hover:bg-wed/90"
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="capacity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Maximum Capacity*</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 200 guests" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="priceRange"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price Range*</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select price range" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="$">$ (Budget-friendly)</SelectItem>
                                    <SelectItem value="$$">$$ (Moderate)</SelectItem>
                                    <SelectItem value="$$$">$$$ (Premium)</SelectItem>
                                    <SelectItem value="$$$$">$$$$ (Luxury)</SelectItem>
                                    <SelectItem value="$$$$$">$$$$$ (Ultra Luxury)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="indoorOutdoor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Venue Setting*</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select venue setting" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="indoor">Indoor Only</SelectItem>
                                  <SelectItem value="outdoor">Outdoor Only</SelectItem>
                                  <SelectItem value="both">Both Indoor & Outdoor</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="availabilityStart"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Availability Start Date*</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormDescription>
                                  When your venue is available for bookings
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="availabilityEnd"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Availability End Date (Optional)</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        form.getValues().availabilityStart && date < form.getValues().availabilityStart
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormDescription>
                                  Leave empty if your venue is available indefinitely
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="amenities"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>Amenities & Features (Select all that apply)</FormLabel>
                                <FormDescription>
                                  These amenities will be highlighted on your venue profile
                                </FormDescription>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {[
                                  "Free Parking",
                                  "WiFi",
                                  "ADA Accessible",
                                  "In-house Catering", 
                                  "Pet Friendly",
                                  "Accommodations",
                                  "Bridal Suite",
                                  "Indoor Ceremony",
                                  "Outdoor Ceremony",
                                  "Reception Area",
                                  "Kitchen Access",
                                  "Tables & Chairs",
                                  "Linens",
                                  "Sound System",
                                  "Lighting"
                                ].map((amenity) => (
                                  <FormField
                                    key={amenity}
                                    control={form.control}
                                    name="amenities"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={amenity}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(amenity)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...(field.value || []), amenity])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== amenity
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="text-sm font-normal">
                                            {amenity}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cateringPolicy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Catering Policy*</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select catering policy" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="in_house">In-house Catering Only</SelectItem>
                                  <SelectItem value="preferred">Preferred Caterer List</SelectItem>
                                  <SelectItem value="outside_allowed">Outside Caterers Allowed</SelectItem>
                                  <SelectItem value="no_catering">No Catering Services Available</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="alcoholPolicy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Alcohol Policy*</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select alcohol policy" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="in_house">In-house Bar Service Only</SelectItem>
                                  <SelectItem value="byob">BYOB Allowed</SelectItem>
                                  <SelectItem value="licensed">Licensed Bartender Required</SelectItem>
                                  <SelectItem value="no_alcohol">No Alcohol Allowed</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="parkingInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Parking Information*</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select parking information" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="free_onsite">Free Onsite Parking</SelectItem>
                                  <SelectItem value="paid_onsite">Paid Onsite Parking</SelectItem>
                                  <SelectItem value="street">Street Parking</SelectItem>
                                  <SelectItem value="valet">Valet Parking Available</SelectItem>
                                  <SelectItem value="limited">Limited Parking</SelectItem>
                                  <SelectItem value="none">No Parking Available</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-between">
                          <Button 
                            type="button"
                            onClick={previousStep}
                            variant="outline"
                          >
                            Back
                          </Button>
                          <Button 
                            type="button"
                            onClick={nextStep}
                            className="bg-wed hover:bg-wed/90"
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Create Password*</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormDescription>
                                Must be at least 8 characters
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password*</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="termsAccepted"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I agree to the <Link to="/terms" className="text-wed hover:underline">Terms of Service</Link> and{" "}
                                  <Link to="/privacy" className="text-wed hover:underline">Privacy Policy</Link>
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <div className="rounded-lg bg-gray-50 p-4 mt-4">
                          <div className="flex items-center gap-2">
                            <CheckIcon className="h-5 w-5 text-green-500" />
                            <p className="text-sm font-medium">Your venue listing includes:</p>
                          </div>
                          <div className="mt-2 pl-7 text-sm text-gray-500 space-y-1">
                            <p>• Featured placement in search results</p>
                            <p>• Detailed venue profile with photos and videos</p>
                            <p>• Direct messaging with couples</p>
                            <p>• Booking management tools</p>
                            <p>• Analytics and performance tracking</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button 
                            type="button"
                            onClick={previousStep}
                            variant="outline"
                          >
                            Back
                          </Button>
                          <Button 
                            type="submit"
                            className="bg-wed hover:bg-wed/90"
                            disabled={submitting}
                          >
                            {submitting ? "Creating Account..." : "Create Venue Account"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VenueSignup;
