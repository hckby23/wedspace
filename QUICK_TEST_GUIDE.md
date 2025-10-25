# Quick Test Guide - Venue & Vendor Pages

## 🚀 Start Testing in 3 Steps

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Test Vendor Pages
```
1. Go to: http://localhost:3000/vendors
2. Click the grid/list toggle (should work smoothly now)
3. Try filters: Category, City, Rating, Price
4. Click any vendor card
5. ✅ Should load detail page (no 404!)
6. Click "Availability" tab
7. ✅ See 30-day calendar with color-coded dates
```

### Step 3: Test Venue Pages
```
1. Go to: http://localhost:3000/venues
2. Click any venue card
3. Click "Availability" tab (new!)
4. ✅ See 30-day calendar
5. Click dates to see details
6. ✅ Verify urgency indicators
```

---

## 🎯 What to Look For

### ✅ Working Features

**Vendor List Page** (`/vendors`)
- Grid/list toggle works smoothly
- Category filter buttons (Photography, Catering, etc.)
- City dropdown filter
- Rating filter
- Price range filter
- Search bar
- 12 vendors display

**Vendor Detail Page** (`/vendors/v1`)
- No 404 error!
- Image gallery
- Contact info
- Services grid
- **Availability tab with calendar**
- Urgency badges
- Booking buttons

**Venue Detail Page** (`/venues/1`)
- All existing tabs
- **New "Availability" tab**
- 30-day calendar
- Date selection
- Weekend pricing
- Booking CTA

---

## 🔍 Filter Testing

### Vendors
```
1. Select "Photography" category
   → Should show 3 photographers

2. Select "Mumbai" city
   → Should filter to Mumbai vendors

3. Set rating to "4.8+"
   → Should show only high-rated vendors

4. Search "makeup"
   → Should show makeup artists

5. Combine filters
   → Should work together
```

### Venues
```
1. Select city filter
   → Should filter venues

2. Set capacity range
   → Should filter by guest count

3. Set rating filter
   → Should show only high-rated

4. Search by name
   → Should find specific venue
```

---

## 📅 Calendar Testing

### On Any Detail Page

**Step 1**: Click "Availability" tab

**Step 2**: Observe calendar
- 🟢 Green dates = Available
- 🔴 Red dates = Booked
- ⚫ Gray dates = Blocked

**Step 3**: Click any date
- Should show date details
- Status badge
- Price (if weekend)
- Booking button (if available)

**Step 4**: Check urgency
- Top of calendar shows: "Only X dates left!"
- Color indicates urgency level

---

## 🐛 Known Working (Previously Broken)

### ✅ Fixed Issues
1. **Grid/List Toggle** - Now works smoothly
2. **Vendor 404** - Detail pages load correctly
3. **Limited Mock Data** - Now 12 vendors with diverse data
4. **No Calendar** - Fully integrated on both pages
5. **Filters Not Working** - All filters functional

---

## 📊 Expected Results

### Vendor Page
- **Total Vendors**: 12
- **Categories**: 6 (Photography, Decoration, Catering, Entertainment, Makeup, Videography)
- **Cities**: 6 (Delhi, Mumbai, Bangalore, Pune, Hyderabad, Chennai)

### Venue Page
- **Total Venues**: 6
- **Cities**: Delhi NCR, Noida, Greater Noida
- **All with calendar data**: Yes

### Calendar
- **Days Shown**: 30
- **Total Data**: 90 days per venue/vendor
- **Status Types**: Available, Booked, Blocked
- **Weekend Pricing**: 30% higher

---

## 🎨 UI Checks

### Light Mode
- ✅ Clean, professional design
- ✅ Red + Amber gradients
- ✅ Clear typography
- ✅ Smooth transitions

### Dark Mode
- ✅ Toggle in header
- ✅ All colors adapt
- ✅ Calendar readable
- ✅ Proper contrast

### Responsive
- ✅ Mobile: Single column
- ✅ Tablet: 2 columns
- ✅ Desktop: 3 columns
- ✅ Calendar adapts

---

## 🔗 Quick Links

### Vendor Pages
- List: `/vendors`
- Detail: `/vendors/v1`, `/vendors/v2`, etc.

### Venue Pages
- List: `/venues`
- Detail: `/venues/1`, `/venues/2`, etc.

### Demo Calendar
- `/demo/calendar` (comprehensive demo)

---

## 📝 Test Checklist

### Vendor Pages
- [ ] Navigate to `/vendors`
- [ ] Click grid/list toggle
- [ ] Apply category filter
- [ ] Apply city filter
- [ ] Search for vendor
- [ ] Click vendor card
- [ ] Verify detail page loads
- [ ] Click "Availability" tab
- [ ] Select calendar date
- [ ] Check urgency indicator

### Venue Pages
- [ ] Navigate to `/venues`
- [ ] Click venue card
- [ ] Click "Availability" tab
- [ ] View 30-day calendar
- [ ] Select date
- [ ] Check weekend pricing
- [ ] Verify booking CTA

### Filters
- [ ] Single filter works
- [ ] Multiple filters work
- [ ] Search works
- [ ] Clear filters works
- [ ] Results update instantly

---

## 🎉 Success Indicators

**Everything is working if you see:**
- ✅ No 404 errors on vendor pages
- ✅ Grid/list toggle switches smoothly
- ✅ Calendar shows on both venue and vendor detail pages
- ✅ Dates are color-coded correctly
- ✅ Filters update results instantly
- ✅ 12 vendors appear in list
- ✅ Urgency indicators show
- ✅ Dark mode works everywhere

---

## 🚨 If Something Doesn't Work

### Vendor 404?
- Check: `/src/app/vendors/[id]/page.tsx` exists
- Should be: Created and working

### Calendar Not Showing?
- Check: "Availability" tab exists
- Click: The tab to view calendar

### Filters Not Working?
- Check: Mock data loaded
- Verify: 12 vendors in `/src/data/mockVendors.ts`

### Grid/List Toggle Broken?
- Check: Buttons have proper styling
- Verify: Dark mode classes present

---

## ✅ All Systems Go!

**If you can:**
1. ✅ View vendor detail pages (no 404)
2. ✅ See calendar on both venue and vendor pages
3. ✅ Use filters successfully
4. ✅ Toggle grid/list view smoothly

**Then everything is working perfectly!**

---

**Happy Testing! 🎉**
