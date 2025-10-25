"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Heart,
  Crown,
  Trash2,
  Edit3,
  Check,
  X,
  Calendar,
  Gift,
  Utensils,
  Car,
  Home,
  Baby,
  Plus,
  FileText,
  BarChart3
} from "lucide-react";

interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  side: "Bride" | "Groom" | "Both";
  rsvp: "Pending" | "Accepted" | "Declined";
  dietaryRestrictions?: string;
  plusOne?: boolean;
  plusOneName?: string;
  tableNumber?: number;
  address?: string;
  notes?: string;
  category: "Family" | "Friends" | "Colleagues" | "Other";
  invitationSent: boolean;
  rsvpDate?: string;
}

interface GuestFormData {
  name: string;
  email: string;
  phone: string;
  side: Guest["side"];
  category: Guest["category"];
  dietaryRestrictions: string;
  plusOne: boolean;
  plusOneName: string;
  address: string;
  notes: string;
}

const STORAGE_KEY = "ws_guests_v2";

const initialFormData: GuestFormData = {
  name: "",
  email: "",
  phone: "",
  side: "Both",
  category: "Friends",
  dietaryRestrictions: "",
  plusOne: false,
  plusOneName: "",
  address: "",
  notes: ""
};

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [formData, setFormData] = useState<GuestFormData>(initialFormData);
  const [editingGuest, setEditingGuest] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSide, setFilterSide] = useState<"All" | Guest["side"]>("All");
  const [filterRSVP, setFilterRSVP] = useState<"All" | Guest["rsvp"]>("All");
  const [filterCategory, setFilterCategory] = useState<"All" | Guest["category"]>("All");
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const savedGuests = JSON.parse(raw);
        setGuests(savedGuests);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    } catch {}
  }, [guests]);

  const stats = useMemo(() => {
    const total = guests.length;
    const accepted = guests.filter(g => g.rsvp === "Accepted").length;
    const declined = guests.filter(g => g.rsvp === "Declined").length;
    const pending = total - accepted - declined;
    const invitationsSent = guests.filter(g => g.invitationSent).length;
    const plusOnes = guests.filter(g => g.plusOne).length;
    const brideGuests = guests.filter(g => g.side === "Bride").length;
    const groomGuests = guests.filter(g => g.side === "Groom").length;
    const bothGuests = guests.filter(g => g.side === "Both").length;
    
    return {
      total,
      accepted,
      declined,
      pending,
      invitationsSent,
      plusOnes,
      brideGuests,
      groomGuests,
      bothGuests,
      expectedAttendees: accepted + (guests.filter(g => g.rsvp === "Accepted" && g.plusOne).length)
    };
  }, [guests]);

  const filteredGuests = useMemo(() => {
    return guests.filter(guest => {
      const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guest.phone?.includes(searchTerm);
      const matchesSide = filterSide === "All" || guest.side === filterSide;
      const matchesRSVP = filterRSVP === "All" || guest.rsvp === filterRSVP;
      const matchesCategory = filterCategory === "All" || guest.category === filterCategory;
      
      return matchesSearch && matchesSide && matchesRSVP && matchesCategory;
    });
  }, [guests, searchTerm, filterSide, filterRSVP, filterCategory]);

  const updateFormData = (field: keyof GuestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addGuest = () => {
    if (!formData.name.trim()) return;
    
    const newGuest: Guest = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      side: formData.side,
      rsvp: "Pending",
      category: formData.category,
      dietaryRestrictions: formData.dietaryRestrictions.trim() || undefined,
      plusOne: formData.plusOne,
      plusOneName: formData.plusOne ? formData.plusOneName.trim() || undefined : undefined,
      address: formData.address.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      invitationSent: false
    };
    
    setGuests(prev => [...prev, newGuest]);
    setFormData(initialFormData);
    setShowAddForm(false);
  };

  const updateGuest = (id: string, updates: Partial<Guest>) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGuest = (id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id));
    setSelectedGuests(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Users, text: "Planning Tool" }}
        title="Guest List"
        titleGradient="Manager"
        description="Organize guests, track RSVPs, and manage seating arrangements."
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
              <div className="text-sm text-muted-foreground">Accepted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Button 
            className="bg-gradient-to-r from-primary via-rose-500 to-secondary text-white"
            onClick={addGuest}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add Guest
          </Button>
        </div>
      </EnhancedPageHero>

      <PageContainer className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Guests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Declined</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.expectedAttendees}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Expected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.plusOnes}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Plus Ones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{stats.brideGuests}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Bride Side</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.groomGuests}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Groom Side</div>
            </div>
          </div>

        {/* Guest List */}
          {filteredGuests.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {guests.length === 0 ? "No guests added yet" : "No guests match your filters"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {guests.length === 0 
                    ? "Start building your guest list by adding your first guest" 
                    : "Try adjusting your search or filter criteria"}
                </p>
                {guests.length === 0 && (
                  <Button onClick={addGuest} className="bg-red-600 hover:bg-red-700 text-white">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add Your First Guest
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredGuests.map((guest) => (
                <Card key={guest.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-playfair text-xl font-bold text-gray-900 dark:text-white">
                            {guest.name}
                          </h3>
                          
                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              guest.side === 'Bride' ? 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200' :
                              guest.side === 'Groom' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                              'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                            }`}>
                              {guest.side}
                            </div>
                            
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              guest.rsvp === 'Accepted' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                              guest.rsvp === 'Declined' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                              'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            }`}>
                              {guest.rsvp}
                            </div>
                            
                            <div className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              {guest.category}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          {guest.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{guest.email}</span>
                            </div>
                          )}
                          {guest.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{guest.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuest(guest.id, { rsvp: "Accepted" })}
                          className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuest(guest.id, { rsvp: "Declined" })}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteGuest(guest.id)}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
      </PageContainer>
    </main>
  );
}
