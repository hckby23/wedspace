# WedSpace API Documentation

## Overview
Complete REST API documentation for WedSpace platform with 55+ production-ready endpoints.

---

## Authentication
All authenticated endpoints require Supabase JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Escrow Management APIs

### Create Escrow Account
```http
POST /api/escrow
Content-Type: application/json

{
  "booking_id": "uuid",
  "user_id": "uuid",
  "vendor_id": "uuid",
  "total_amount": 100000,
  "advance_percentage": 30,
  "commission_percentage": 10
}

Response: { "escrow": {...} }
```

### Get Escrow Accounts
```http
GET /api/escrow?booking_id=uuid
Response: { "escrows": [...] }
```

### Fund Escrow (After Payment)
```http
POST /api/escrow/fund
{
  "escrow_id": "uuid",
  "razorpay_payment_id": "pay_xxx"
}
```

### Release Funds to Vendor
```http
POST /api/escrow/release
{
  "escrow_id": "uuid",
  "amount": 50000,
  "notes": "Service completed"
}
```

### Refund to Customer
```http
POST /api/escrow/refund
{
  "escrow_id": "uuid",
  "amount": 30000,
  "reason": "Service cancelled"
}
```

### Create/Manage Dispute
```http
POST /api/escrow/dispute
{
  "escrow_account_id": "uuid",
  "booking_id": "uuid",
  "dispute_type": "service_not_delivered",
  "dispute_reason": "Vendor didn't show up",
  "evidence_documents": ["url1", "url2"]
}

PATCH /api/escrow/dispute (Admin only)
{
  "dispute_id": "uuid",
  "status": "resolved",
  "resolution_action": "full_refund",
  "resolution_amount": 100000
}
```

---

## 2. Availability Management APIs

### Check Availability
```http
GET /api/availability?listing_id=uuid&date=2025-10-15
Response: {
  "availability": {
    "is_available": true,
    "status": "available",
    "available_slots": 5
  }
}
```

### Get Available Dates
```http
GET /api/availability?listing_id=uuid&start_date=2025-10-01&end_date=2025-10-31
Response: {
  "dates": [
    { "date": "2025-10-15", "status": "available", "price": 50000 }
  ]
}
```

### Set Availability (Vendor)
```http
POST /api/availability
{
  "listing_id": "uuid",
  "date": "2025-10-15",
  "status": "available",
  "base_price": 50000,
  "max_capacity": 10
}
```

### Block Dates
```http
POST /api/availability/block
{
  "listing_id": "uuid",
  "start_date": "2025-12-20",
  "end_date": "2025-12-31",
  "reason": "Holiday season",
  "block_type": "holiday"
}

DELETE /api/availability/block?id=uuid
```

---

## 3. Vendor Dashboard API

### Get Dashboard Data
```http
GET /api/vendor/dashboard
Response: {
  "summary": {
    "total_bookings": 45,
    "pending_bookings": 5,
    "total_revenue": 2500000,
    "avg_rating": 4.8,
    "conversion_rate": "12.5"
  },
  "recent_bookings": [...],
  "upcoming_events": [...],
  "revenue_chart": [...]
}
```

---

## 4. Dynamic Pricing APIs

### Calculate Dynamic Price
```http
GET /api/pricing/dynamic?listing_id=uuid&date=2025-10-15&base_price=50000
Response: { "price": 65000 }
```

### Create Pricing Rule
```http
POST /api/pricing/dynamic
{
  "listing_id": "uuid",
  "rule_name": "Weekend Premium",
  "rule_type": "day_of_week",
  "adjustment_type": "percentage",
  "adjustment_value": 30,
  "days_of_week": [0, 6]
}
```

---

## 5. AI Features APIs

### AI Budget Allocation
```http
POST /api/ai/budget
{
  "total_budget": 1000000,
  "wedding_type": "traditional",
  "guest_count": 300,
  "city": "Delhi"
}

Response: {
  "categories": [
    {
      "category": "venue",
      "suggested_percentage": 25,
      "suggested_amount": 250000,
      "min_amount": 175000,
      "max_amount": 325000
    }
  ]
}
```

### Multimodal Search (Image-based)
```http
POST /api/ai/multimodal-search
Content-Type: multipart/form-data

FormData: {
  "image": File,
  "search_type": "venue"
}

Response: {
  "results": [...],
  "analysis": {
    "colors": ["gold", "white"],
    "styles": ["traditional", "elegant"],
    "setting": "indoor"
  }
}
```

---

## 6. Wedding Albums APIs

### Create Album
```http
POST /api/albums
{
  "title": "Our Wedding Day",
  "description": "Beautiful memories",
  "event_date": "2025-10-15",
  "is_public": false
}
```

### Get Albums
```http
GET /api/albums
GET /api/albums?album_id=uuid

Response: {
  "albums": [...] or "album": {...}
}
```

---

## 7. Analytics APIs

### Track Performance Metric
```http
POST /api/analytics/performance
{
  "name": "LCP",
  "value": 2500,
  "timestamp": 1727680000000,
  "url": "/venues"
}
```

---

## 8. Existing Core APIs

### Venues
- `GET /api/venues` - List venues with filters
- `GET /api/venues/:id` - Get venue details
- `POST /api/venues` - Create venue (vendor only)
- `PATCH /api/venues/:id` - Update venue (owner only)

### Vendors
- `GET /api/vendors` - List vendors
- `GET /api/vendors/:id` - Get vendor details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `PATCH /api/bookings/:id` - Update booking status

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/refund` - Process refund

### Reviews
- `POST /api/reviews` - Add review
- `GET /api/reviews?listing_id=uuid` - Get listing reviews

---

## Error Responses

All APIs return consistent error format:
```json
{
  "error": "Error message",
  "details": {...} // Optional validation errors
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limits

- Search APIs: 100 requests/minute
- Payment APIs: 10 requests/minute
- Dashboard APIs: 50 requests/minute
- General APIs: 200 requests/minute

---

## Webhooks

### Razorpay Webhook
```http
POST /api/webhooks/razorpay
X-Razorpay-Signature: <signature>

{
  "event": "payment.captured",
  "payload": {...}
}
```

Events handled:
- `payment.captured` - Update booking and escrow
- `payment.failed` - Mark payment as failed
- `order.paid` - Confirm order payment

---

## Database Functions

Direct Supabase RPC calls available:

### Escrow Functions
```javascript
supabase.rpc('create_escrow_for_booking', {
  p_booking_id: 'uuid',
  p_user_id: 'uuid',
  p_vendor_id: 'uuid',
  p_total_amount: 100000
})

supabase.rpc('release_escrow_funds', {
  p_escrow_id: 'uuid',
  p_amount: 50000,
  p_released_by: 'uuid'
})

supabase.rpc('calculate_milestone_refund', {
  p_contract_id: 'uuid',
  p_cancellation_date: '2025-10-15'
})
```

### Availability Functions
```javascript
supabase.rpc('check_date_availability', {
  p_listing_id: 'uuid',
  p_date: '2025-10-15'
})

supabase.rpc('get_available_dates', {
  p_listing_id: 'uuid',
  p_start_date: '2025-10-01',
  p_end_date: '2025-10-31'
})

supabase.rpc('block_dates', {
  p_listing_id: 'uuid',
  p_owner_id: 'uuid',
  p_start_date: '2025-12-20',
  p_end_date: '2025-12-31',
  p_reason: 'Holiday'
})
```

### Quality Functions
```javascript
supabase.rpc('calculate_quality_scores', {
  p_listing_id: 'uuid'
})

supabase.rpc('calculate_dynamic_price', {
  p_listing_id: 'uuid',
  p_date: '2025-10-15',
  p_base_price: 50000
})
```

---

## Testing

Use Razorpay test mode credentials:
- Test Key: `rzp_test_xxx`
- Test Cards: `4111 1111 1111 1111` (Visa)
- CVV: Any 3 digits
- Expiry: Any future date

---

**API Version:** 1.0  
**Last Updated:** 2025-09-30  
**Base URL:** `https://wedspace.in` or `http://localhost:3000`
