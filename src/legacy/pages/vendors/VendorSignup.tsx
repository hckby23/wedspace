
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

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
import { CalendarIcon, CheckIcon } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessType: z.string().min(1, "Please select a business type"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zip: z.string().min(5, "ZIP code must be at least 5 characters"),
  serviceRegions: z.string().min(2, "Service regions must be at least 2 characters"),
  startingPrice: z.string().min(1, "Please enter a starting price"),
  availabilityStart: z.date({
    required_error: "Please select a start date",
  }),
  availabilityEnd: z.date({
    required_error: "Please select an end date",
  }).optional(),
  hasInsurance: z.string(),
  yearsInBusiness: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const VendorSignup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      description: "",
      contactName: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      serviceRegions: "",
      startingPrice: "",
      hasInsurance: "",
      yearsInBusiness: "",
      password: "",
      confirmPassword: "",
    }
  });

  function onSubmit(values: FormValues) {
    setSubmitting(true);
    console.log(values);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Registration successful! Welcome to wedspace!");
      // In a real app, you'd redirect to dashboard or login
    }, 1500);
  }

  const nextStep = () => {
    // Validate current step fields before proceeding
    if (step === 1) {
      form.trigger(['businessName', 'businessType', 'description']);
      if (
        !form.formState.errors.businessName && 
        !form.formState.errors.businessType && 
        !form.formState.errors.description
      ) {
        setStep(2);
      }
    } else if (step === 2) {
      form.trigger(['contactName', 'email', 'phone', 'address', 'city', 'state', 'zip']);
      if (
        !form.formState.errors.contactName && 
        !form.formState.errors.email && 
        !form.formState.errors.phone &&
        !form.formState.errors.address &&
        !form.formState.errors.city &&
        !form.formState.errors.state &&
        !form.formState.errors.zip
      ) {
        setStep(3);
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
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-space/10 to-wed/10 py-12">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">Join wedspace as a Vendor</h1>
              <p className="text-gray-600 max-w-2xl mb-8">
                Showcase your business to thousands of engaged couples planning their special day. 
                Complete your profile below to get started.
              </p>

              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between mb-8 border-b">
                  <div 
                    className={`pb-4 px-4 ${step === 1 ? 'border-b-2 border-wed font-medium text-wed' : 'text-gray-500'}`}
                  >
                    1. Business Details
                  </div>
                  <div 
                    className={`pb-4 px-4 ${step === 2 ? 'border-b-2 border-wed font-medium text-wed' : 'text-gray-500'}`}
                  >
                    2. Contact Information
                  </div>
                  <div 
                    className={`pb-4 px-4 ${step === 3 ? 'border-b-2 border-wed font-medium text-wed' : 'text-gray-500'}`}
                  >
                    3. Service Details
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
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name*</FormLabel>
                              <FormControl>
                                <Input placeholder="Your business name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Type*</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select business type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="venue">Wedding Venue</SelectItem>
                                  <SelectItem value="photographer">Photographer</SelectItem>
                                  <SelectItem value="videographer">Videographer</SelectItem>
                                  <SelectItem value="caterer">Caterer</SelectItem>
                                  <SelectItem value="florist">Florist</SelectItem>
                                  <SelectItem value="dj">DJ/Entertainment</SelectItem>
                                  <SelectItem value="bakery">Bakery</SelectItem>
                                  <SelectItem value="wedding_planner">Wedding Planner</SelectItem>
                                  <SelectItem value="dress_shop">Wedding Dress Shop</SelectItem>
                                  <SelectItem value="tuxedo_shop">Tuxedo/Suit Shop</SelectItem>
                                  <SelectItem value="transportation">Transportation</SelectItem>
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
                              <FormLabel>Business Description*</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your business and services (min. 20 characters)" 
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
                                <FormLabel>Contact Name*</FormLabel>
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
                                  <Input placeholder="your@email.com" type="email" {...field} />
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
                                  <Input placeholder="https://www.yourbusiness.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address*</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City*</FormLabel>
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
                                <FormLabel>State*</FormLabel>
                                <FormControl>
                                  <Input placeholder="State" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="zip"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP Code*</FormLabel>
                                <FormControl>
                                  <Input placeholder="ZIP" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
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
                        <FormField
                          control={form.control}
                          name="serviceRegions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Regions*</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Los Angeles County, Orange County" {...field} />
                              </FormControl>
                              <FormDescription>
                                List the regions/areas you serve, separated by commas
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="startingPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Starting Price*</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., $1000" {...field} />
                              </FormControl>
                              <FormDescription>
                                Your minimum package or starting price
                              </FormDescription>
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
                                      disabled={(date) =>
                                        date < new Date()
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormDescription>
                                  When you can start accepting bookings
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
                                        date < new Date() || (form.getValues().availabilityStart && date < form.getValues().availabilityStart)
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormDescription>
                                  Leave empty if you don't have an end date
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="hasInsurance"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Business Insurance</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Do you have business insurance?" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                    <SelectItem value="in_process">In process</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="yearsInBusiness"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years in Business</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select years in business" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="less_than_1">Less than 1 year</SelectItem>
                                    <SelectItem value="1_to_3">1-3 years</SelectItem>
                                    <SelectItem value="4_to_7">4-7 years</SelectItem>
                                    <SelectItem value="8_to_15">8-15 years</SelectItem>
                                    <SelectItem value="16_plus">16+ years</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
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
                            onClick={() => setStep(4)}
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

                        <div className="rounded-lg bg-gray-50 p-4 mt-4">
                          <div className="flex items-center gap-2">
                            <CheckIcon className="h-5 w-5 text-green-500" />
                            <p className="text-sm font-medium">By signing up, you agree to our:</p>
                          </div>
                          <div className="mt-2 pl-7 text-sm text-gray-500 space-y-1">
                            <p>• <Link to="/terms" className="text-wed hover:underline">Terms of Service</Link></p>
                            <p>• <Link to="/privacy" className="text-wed hover:underline">Privacy Policy</Link></p>
                            <p>• <Link to="/cookies" className="text-wed hover:underline">Cookie Policy</Link></p>
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
                            {submitting ? "Creating Account..." : "Create Vendor Account"}
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

export default VendorSignup;
