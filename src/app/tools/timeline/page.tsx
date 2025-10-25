"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import EnhancedPageHero from "@/components/layout/EnhancedPageHero";
import PageContainer from "@/components/layout/PageContainer";
import { 
  Plus, Trash2, Edit3, Clock, Calendar, MapPin, Users, 
  ChevronUp, ChevronDown, Download, Settings, FileText,
  AlertTriangle, CheckCircle, Camera, Music, Utensils
} from "lucide-react";

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  location?: string;
  duration?: number;
  category: 'ceremony' | 'reception' | 'photo' | 'prep' | 'transport' | 'other';
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  notes?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "ws_timeline_v2";

const EVENT_CATEGORIES = [
  { name: 'ceremony', label: 'Ceremony', icon: '💒', color: 'bg-red-100 text-red-800' },
  { name: 'reception', label: 'Reception', icon: '🎉', color: 'bg-blue-100 text-blue-800' },
  { name: 'photo', label: 'Photography', icon: '📸', color: 'bg-purple-100 text-purple-800' },
  { name: 'prep', label: 'Preparation', icon: '💄', color: 'bg-pink-100 text-pink-800' },
  { name: 'transport', label: 'Transport', icon: '🚗', color: 'bg-green-100 text-green-800' },
  { name: 'other', label: 'Other', icon: '📋', color: 'bg-gray-100 text-gray-800' }
];

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState<TimelineEvent['category']>('other');
  const [priority, setPriority] = useState<TimelineEvent['priority']>('medium');
  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [weddingDate, setWeddingDate] = useState<string>('');

  useEffect(() => {
    try {
      const eventsData = localStorage.getItem(STORAGE_KEY);
      const dateData = localStorage.getItem('ws_wedding_date');
      if (eventsData) setEvents(JSON.parse(eventsData));
      if (dateData) setWeddingDate(JSON.parse(dateData));
    } catch (error) { console.error('Error loading timeline data:', error); }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      if (weddingDate) localStorage.setItem('ws_wedding_date', JSON.stringify(weddingDate));
    } catch (error) { console.error('Error saving timeline data:', error); }
  }, [events, weddingDate]);

  const stats = useMemo(() => {
    const total = events.length;
    const completed = events.filter(e => e.completed).length;
    const pending = total - completed;
    const byCategory = EVENT_CATEGORIES.map(cat => ({
      ...cat,
      count: events.filter(e => e.category === cat.name).length
    }));
    const totalDuration = events.reduce((sum, e) => sum + (e.duration || 0), 0);
    return { total, completed, pending, byCategory, totalDuration };
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => filterCategory === 'all' || event.category === filterCategory)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [events, filterCategory]);

  const addOrUpdateEvent = () => {
    if (!time || !title.trim()) {
      window.alert('Please enter time and title');
      return;
    }
    const now = new Date().toISOString();
    const eventData: TimelineEvent = {
      id: editingEvent?.id || crypto.randomUUID(),
      time, title: title.trim(), description: description.trim() || undefined,
      location: location.trim() || undefined, duration: duration ? Number(duration) : undefined,
      category, priority, assignedTo: assignedTo.trim() || undefined,
      notes: notes.trim() || undefined, completed: editingEvent?.completed || false,
      createdAt: editingEvent?.createdAt || now, updatedAt: now
    };
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? eventData : e));
    } else {
      setEvents(prev => [...prev, eventData]);
    }
    resetForm();
  };

  const resetForm = () => {
    setTime(""); setTitle(""); setDescription(""); setLocation(""); setDuration("");
    setCategory('other'); setPriority('medium'); setAssignedTo(""); setNotes(""); setEditingEvent(null);
  };

  const editEvent = (event: TimelineEvent) => {
    setEditingEvent(event); setTime(event.time); setTitle(event.title);
    setDescription(event.description || ""); setLocation(event.location || "");
    setDuration(event.duration?.toString() || ""); setCategory(event.category);
    setPriority(event.priority); setAssignedTo(event.assignedTo || ""); setNotes(event.notes || "");
  };

  const deleteEvent = (id: string) => {
    if (window.confirm('Delete this event?')) setEvents(prev => prev.filter(e => e.id !== id));
  };

  const toggleCompleted = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, completed: !e.completed, updatedAt: new Date().toISOString() } : e));
  };

  const moveEvent = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= filteredEvents.length) return;
    const newEvents = [...events];
    const eventA = filteredEvents[index];
    const eventB = filteredEvents[newIndex];
    const indexA = newEvents.findIndex(e => e.id === eventA.id);
    const indexB = newEvents.findIndex(e => e.id === eventB.id);
    [newEvents[indexA], newEvents[indexB]] = [newEvents[indexB], newEvents[indexA]];
    setEvents(newEvents);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportTimeline = () => {
    const data = { events, weddingDate, stats, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `wedspace-timeline-${new Date().toISOString().split('T')[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: Clock, text: "Planning Tool" }}
        title="Wedding Day"
        titleGradient="Timeline"
        description="Plan your perfect day with detailed scheduling and coordination."
      >
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={exportTimeline} className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button variant="outline" onClick={() => setWeddingDate(prev => {
            const newDate = prompt('Set wedding date (YYYY-MM-DD):', prev);
            return newDate || prev;
          })} className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {weddingDate || 'Set Date'}
          </Button>
        </div>
      </EnhancedPageHero>

      <PageContainer className="py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Total Events</span>
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
          </Card>
          <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </Card>
          <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </Card>
          <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">Duration</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.totalDuration}min</p>
          </Card>
        </div>

        <Card className="p-6 mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ceremony, Reception, etc." className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value as TimelineEvent['category'])} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                {EVENT_CATEGORIES.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as TimelineEvent['priority'])} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Venue, Room, etc." className="pl-8 h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input id="assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Person responsible" className="pl-8 h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Event details" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes" className="h-10" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={addOrUpdateEvent} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              {editingEvent ? 'Update Event' : 'Add Event'}
            </Button>
            {editingEvent && (
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            )}
          </div>
        </Card>

        <Card className="p-4 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex gap-2">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 rounded-md border border-input bg-background text-sm">
              <option value="all">All Categories</option>
              {EVENT_CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.icon} {cat.label}</option>
              ))}
            </select>
          </div>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Timeline Events ({filteredEvents.length})</h3>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No events found. Add your first timeline event above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEvents.map((event, index) => (
                  <div key={event.id} className={`p-4 border rounded-lg transition-colors ${
                    event.completed ? 'bg-green-50 border-green-200' : 'border-border hover:bg-muted/50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            <Clock className="w-3 h-3 mr-1" />
                            {event.time}
                          </Badge>
                          <h4 className={`font-medium ${
                            event.completed ? 'line-through text-muted-foreground' : ''
                          }`}>{event.title}</h4>
                          <Badge className={EVENT_CATEGORIES.find(c => c.name === event.category)?.color} variant="outline">
                            {EVENT_CATEGORIES.find(c => c.name === event.category)?.icon} {EVENT_CATEGORIES.find(c => c.name === event.category)?.label}
                          </Badge>
                          <Badge className={getPriorityColor(event.priority)} variant="outline">
                            {event.priority}
                          </Badge>
                          {event.duration && <Badge variant="outline">{event.duration}min</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {event.location && <span>📍 {event.location}</span>}
                          {event.assignedTo && <span>👤 {event.assignedTo}</span>}
                          {event.description && <span>📝 {event.description}</span>}
                        </div>
                        {event.notes && <p className="text-sm text-muted-foreground mt-1">💭 {event.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => toggleCompleted(event.id)} className={event.completed ? 'bg-green-50 border-green-200' : ''}>
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => moveEvent(index, -1)} disabled={index === 0}>
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => moveEvent(index, 1)} disabled={index === filteredEvents.length - 1}>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => editEvent(event)}>
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteEvent(event.id)} className="text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </PageContainer>
    </main>
  );
}
