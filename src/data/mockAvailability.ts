// Mock availability data for testing calendar system

export interface MockAvailabilitySlot {
  id: string;
  venue_id?: string;
  vendor_id?: string;
  listing_id?: string;
  date: string;
  time_slot: string | null;
  status: 'available' | 'booked' | 'blocked' | 'pending';
  price_override: number | null;
  booking_id: string | null;
  min_guest_count: number | null;
  max_guest_count: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Generate availability for next 90 days
const generateAvailability = (
  entityId: string,
  entityType: 'venue' | 'vendor',
  basePrice: number
): MockAvailabilitySlot[] => {
  const slots: MockAvailabilitySlot[] = [];
  const today = new Date();
  
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Randomly make some dates booked/blocked
    const rand = Math.random();
    let status: 'available' | 'booked' | 'blocked' = 'available';
    
    if (rand < 0.15) status = 'booked';
    else if (rand < 0.20) status = 'blocked';
    
    // Weekend pricing (higher)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const priceOverride = isWeekend ? basePrice * 1.3 : null;
    
    slots.push({
      id: `${entityId}-${dateStr}`,
      venue_id: entityType === 'venue' ? entityId : undefined,
      vendor_id: entityType === 'vendor' ? entityId : undefined,
      listing_id: entityId,
      date: dateStr,
      time_slot: null,
      status,
      price_override: priceOverride,
      booking_id: status === 'booked' ? `booking-${i}` : null,
      min_guest_count: 50,
      max_guest_count: 500,
      notes: status === 'blocked' ? 'Maintenance' : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return slots;
};

// Mock availability for all venues and vendors
export const MOCK_AVAILABILITY: Record<string, MockAvailabilitySlot[]> = {
  // Venues
  '1': generateAvailability('1', 'venue', 150000),
  '2': generateAvailability('2', 'venue', 200000),
  '3': generateAvailability('3', 'venue', 120000),
  '4': generateAvailability('4', 'venue', 180000),
  '5': generateAvailability('5', 'venue', 250000),
  '6': generateAvailability('6', 'venue', 300000),
  
  // Vendors
  'v1': generateAvailability('v1', 'vendor', 75000),
  'v2': generateAvailability('v2', 'vendor', 85000),
  'v3': generateAvailability('v3', 'vendor', 60000),
  'v4': generateAvailability('v4', 'vendor', 90000),
  'v5': generateAvailability('v5', 'vendor', 100000),
};

// Get availability for a specific entity
export const getMockAvailability = (entityId: string): MockAvailabilitySlot[] => {
  return MOCK_AVAILABILITY[entityId] || [];
};

// Get available dates count
export const getAvailableDatesCount = (entityId: string): number => {
  const slots = getMockAvailability(entityId);
  return slots.filter(s => s.status === 'available').length;
};

// Get urgency info
export const getUrgencyInfo = (entityId: string) => {
  const slots = getMockAvailability(entityId);
  const availableCount = slots.filter(s => s.status === 'available').length;
  const totalCount = slots.length;
  const availabilityPercent = (availableCount / totalCount) * 100;
  
  let urgencyLevel: 'low' | 'medium' | 'high';
  let message: string;
  
  if (availabilityPercent > 50) {
    urgencyLevel = 'low';
    message = 'Good availability';
  } else if (availabilityPercent > 20) {
    urgencyLevel = 'medium';
    message = `Only ${availableCount} dates left!`;
  } else {
    urgencyLevel = 'high';
    message = `Limited availability - Only ${availableCount} slots remaining!`;
  }
  
  return {
    availableCount,
    totalCount,
    bookedCount: slots.filter(s => s.status === 'booked').length,
    urgencyLevel,
    message
  };
};
