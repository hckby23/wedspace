
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Clock, Plus, Edit, Trash2, Clock10, Info } from 'lucide-react';
import { toast } from 'sonner';

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  location?: string;
  participants?: string[];
  notes?: string;
}

const Timeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      time: '10:00 AM',
      title: 'Hair & Makeup',
      description: 'Bride and bridesmaids hair and makeup session',
      location: 'Bridal Suite',
      participants: ['Bride', 'Bridesmaids', 'Mother of the Bride'],
      notes: 'Hair stylist arrives at 9:30 AM to set up'
    },
    {
      id: '2',
      time: '12:30 PM',
      title: 'Photography - Getting Ready',
      description: 'Photographer captures final touches of preparation',
      location: 'Bridal Suite and Groom\'s Room',
      participants: ['Bride', 'Groom', 'Wedding Party', 'Photographer']
    },
    {
      id: '3',
      time: '2:00 PM',
      title: 'First Look',
      description: 'Private moment between bride and groom',
      location: 'Garden Gazebo',
      participants: ['Bride', 'Groom', 'Photographer']
    },
    {
      id: '4',
      time: '3:30 PM',
      title: 'Ceremony',
      description: 'Wedding ceremony',
      location: 'Garden Terrace',
      participants: ['All'],
      notes: 'Guests should be seated by 3:15 PM'
    },
    {
      id: '5',
      time: '4:00 PM',
      title: 'Cocktail Hour',
      description: 'Drinks and appetizers served while wedding party takes photos',
      location: 'Courtyard',
      participants: ['Guests', 'Catering Staff']
    },
    {
      id: '6',
      time: '5:00 PM',
      title: 'Reception Entrance',
      description: 'Grand entrance of the wedding party and newlyweds',
      location: 'Ballroom',
      participants: ['Wedding Party', 'Bride', 'Groom', 'Guests', 'DJ']
    },
    {
      id: '7',
      time: '5:15 PM',
      title: 'First Dance',
      description: 'Newlyweds\' first dance as married couple',
      location: 'Ballroom',
      participants: ['Bride', 'Groom', 'DJ']
    },
    {
      id: '8',
      time: '6:00 PM',
      title: 'Dinner Service',
      description: 'Formal dinner service begins',
      location: 'Ballroom',
      participants: ['All', 'Catering Staff']
    },
    {
      id: '9',
      time: '7:00 PM',
      title: 'Toasts & Speeches',
      description: 'Best man and maid of honor speeches',
      location: 'Ballroom',
      participants: ['Best Man', 'Maid of Honor', 'Parents', 'All']
    },
    {
      id: '10',
      time: '7:30 PM',
      title: 'Cake Cutting',
      description: 'Ceremonial cake cutting',
      location: 'Ballroom',
      participants: ['Bride', 'Groom', 'Photographer']
    },
    {
      id: '11',
      time: '8:00 PM',
      title: 'Open Dancing',
      description: 'Dance floor opens for all guests',
      location: 'Ballroom',
      participants: ['All', 'DJ']
    },
    {
      id: '12',
      time: '10:00 PM',
      title: 'Bouquet & Garter Toss',
      description: 'Traditional bouquet and garter toss',
      location: 'Ballroom',
      participants: ['Bride', 'Groom', 'Single Guests']
    },
    {
      id: '13',
      title: '11:00 PM',
      time: '11:00 PM',
      description: 'Grand Exit',
      location: 'Main Entrance',
      participants: ['Bride', 'Groom', 'All'],
      notes: 'Sparkler send-off'
    }
  ]);
  
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<TimelineEvent, 'id'>>({
    time: '',
    title: '',
    description: '',
    location: '',
    participants: [],
    notes: ''
  });
  
  const handleAddEvent = () => {
    const id = Date.now().toString();
    const eventToAdd: TimelineEvent = {
      id,
      ...newEvent
    };
    
    // Find the right position to insert the new event based on time
    const updatedEvents = [...events];
    const timeToCompare = convertTimeToMinutes(newEvent.time);
    let inserted = false;
    
    for (let i = 0; i < updatedEvents.length; i++) {
      const currentEventTime = convertTimeToMinutes(updatedEvents[i].time);
      
      if (timeToCompare < currentEventTime) {
        updatedEvents.splice(i, 0, eventToAdd);
        inserted = true;
        break;
      }
    }
    
    if (!inserted) {
      updatedEvents.push(eventToAdd);
    }
    
    setEvents(updatedEvents);
    setNewEvent({
      time: '',
      title: '',
      description: '',
      location: '',
      participants: [],
      notes: ''
    });
    
    setShowAddEventDialog(false);
    toast.success(`"${eventToAdd.title}" has been added to your timeline`);
  };
  
  // Helper function to convert time string to minutes for comparison
  const convertTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (hours === 12) {
      hours = 0;
    }
    
    if (modifier === 'PM') {
      hours += 12;
    }
    
    return hours * 60 + minutes;
  };
  
  const handleShareTimeline = () => {
    toast.success("Timeline link copied to clipboard");
  };
  
  const handlePrintTimeline = () => {
    toast.success("Timeline prepared for printing");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container-custom max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="font-playfair font-bold text-3xl md:text-4xl mb-2">
                Wedding Day Timeline
              </h1>
              <p className="text-gray-600">
                Plan the perfect flow for your special day.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleShareTimeline}>
                Share
              </Button>
              <Button variant="outline" onClick={handlePrintTimeline}>
                Print
              </Button>
              <Button 
                className="bg-wed hover:bg-wed/90"
                onClick={() => setShowAddEventDialog(true)}
              >
                <Plus className="mr-2" size={16} />
                Add Event
              </Button>
            </div>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform md:translate-x-[-0.5px]"></div>
            
            {/* Timeline events */}
            <div className="space-y-8">
              {events.map((event, index) => (
                <div key={event.id} className={`relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} md:flex`}>
                  {/* Time marker */}
                  <div className="absolute left-5 md:left-1/2 transform md:translate-x-[-50%] -translate-y-3 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-wed flex items-center justify-center z-10">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="md:w-1/2 ml-16 md:ml-0 md:px-6">
                    <Card className={`overflow-hidden shadow-md hover:shadow-lg transition-shadow ${index % 2 === 0 ? 'md:mr-6' : 'md:ml-6'}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-playfair font-semibold text-lg">{event.title}</h3>
                            <p className="text-wed font-medium">{event.time}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-gray-500 hover:text-gray-700 transition-colors">
                              <Edit size={16} />
                            </button>
                            <button className="text-gray-500 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        {event.description && (
                          <p className="text-gray-600 mt-2">{event.description}</p>
                        )}
                        
                        <div className="mt-3 space-y-1 text-sm">
                          {event.location && (
                            <p className="text-gray-500">
                              <span className="font-medium">Location:</span> {event.location}
                            </p>
                          )}
                          
                          {event.participants && event.participants.length > 0 && (
                            <p className="text-gray-500">
                              <span className="font-medium">Who:</span> {event.participants.join(', ')}
                            </p>
                          )}
                          
                          {event.notes && (
                            <div className="flex items-start gap-1 text-gray-500 bg-gray-50 p-2 rounded-md mt-2">
                              <Info size={14} className="mt-0.5 flex-shrink-0" />
                              <span>{event.notes}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              ))}
            </div>
            
            {/* End of timeline marker */}
            <div className="relative mt-8 pt-8 flex justify-center">
              <div className="absolute left-5 md:left-1/2 transform md:translate-x-[-50%] -translate-y-4 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center z-10">
                  <Clock10 className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-gray-500 ml-16 md:ml-0">End of Wedding Day</p>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <p className="text-gray-500 text-sm mb-4">Tip: Share this timeline with your wedding party and vendors</p>
            <Button className="bg-wed hover:bg-wed/90">
              Send Timeline to Wedding Party
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Add Event Dialog */}
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Timeline Event</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input 
                  id="time" 
                  placeholder="e.g. 3:00 PM"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  required 
                />
                <p className="text-xs text-gray-500">Format: 3:00 PM</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. First Dance"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description"
                placeholder="Brief description of the event"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location"
                placeholder="Where this event takes place"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="participants">
                Participants
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="ml-1 inline-block" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter names separated by commas</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input 
                id="participants"
                placeholder="e.g. Bride, Groom, Best Man"
                value={newEvent.participants?.join(', ') || ''}
                onChange={(e) => setNewEvent({
                  ...newEvent, 
                  participants: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes"
                placeholder="Any special instructions or reminders"
                value={newEvent.notes}
                onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddEventDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-wed hover:bg-wed/90"
              onClick={handleAddEvent}
              disabled={!newEvent.time || !newEvent.title}
            >
              Add to Timeline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Timeline;
