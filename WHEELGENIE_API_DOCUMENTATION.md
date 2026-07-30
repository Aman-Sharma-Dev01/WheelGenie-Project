# WheelGenie API Documentation

**Base URL:** `http://localhost:5000/api/v1`

**Auth Header:** `Authorization: Bearer <jwt_token>`

**Standard Response Format:**
```json
{
  "success": true/false,
  "statusCode": 200,
  "message": "...",
  "data": { ... },
  "pagination": { "page": 1, "limit": 20, "total": 100, "pages": 5 }
}
```

---

## 1. Authentication APIs (`/api/v1/auth`)

### 1.1 Register
**POST** `/api/v1/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "customer",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "profilePic": "https://example.com/pic.jpg"
}
```

### 1.2 Login
**POST** `/api/v1/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 1.3 Refresh Token
**POST** `/api/v1/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 1.4 Forgot Password
**POST** `/api/v1/auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

### 1.5 Reset Password
**POST** `/api/v1/auth/reset-password`

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

### 1.6 Send OTP
**POST** `/api/v1/auth/send-otp`

**Request Body:**
```json
{
  "phone": "9876543210",
  "type": "verify"
}
```
`type` values: `login`, `register`, `verify` (default: `verify`)

### 1.7 Verify OTP
**POST** `/api/v1/auth/verify-otp`

**Request Body:**
```json
{
  "phone": "9876543210",
  "otp": "123456",
  "type": "verify"
}
```

### 1.8 Logout
**POST** `/api/v1/auth/logout`

### 1.9 Google Login
**POST** `/api/v1/auth/google-login`

**Request Body:**
```json
{
  "token": "google_oauth_token_string"
}
```

### 1.10 Get Me
**GET** `/api/v1/auth/me`
- **Auth:** Required

### 1.11 Update Profile
**PUT** `/api/v1/auth/update-profile`
- **Auth:** Required

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "9876543211",
  "address": {
    "street": "456 New St",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001"
  },
  "profilePic": "https://example.com/new-pic.jpg"
}
```
*(All fields optional)*

### 1.12 Update Location
**PUT** `/api/v1/auth/update-location`
- **Auth:** Required

**Request Body:**
```json
{
  "coordinates": {
    "type": "Point",
    "coordinates": [72.8777, 19.0760]
  },
  "label": "Mumbai Office"
}
```

### 1.13 Delete Account
**DELETE** `/api/v1/auth/delete-account`
- **Auth:** Required

**Request Body:**
```json
{
  "password": "password123"
}
```

---

## 2. Marketplace APIs (`/api/v1/vehicles`)

### 2.1 Get All Listings
**GET** `/api/v1/vehicles`

**Query Parameters:**
```
brand=BMW
city=Mumbai
fuel=Petrol
minPrice=500000
maxPrice=2000000
minYear=2018
maxYear=2024
minKms=0
maxKms=50000
search=M3
sort=price | -price | latest | oldest | popularity | rating
page=1
limit=20
```

### 2.2 Get Listing Details
**GET** `/api/v1/vehicles/:id`

### 2.3 Create Vehicle Listing
**POST** `/api/v1/vehicles`
- **Auth:** Required

**Request Body:**
```json
{
  "brand": "BMW",
  "model": "3 Series",
  "variant": "320d Luxury Line",
  "fuel": "Diesel",
  "transmission": "Automatic",
  "kms": 25000,
  "year": 2020,
  "ownership": 1,
  "city": "Mumbai",
  "images": ["https://example.com/img1.jpg"],
  "price": 2800000,
  "description": "Well maintained BMW 3 Series with complete service history."
}
```

### 2.4 Update Vehicle Listing
**PATCH** `/api/v1/vehicles/:id`
- **Auth:** Required

**Request Body (all fields optional):**
```json
{
  "price": 2600000,
  "description": "Updated description.",
  "status": "active"
}
```
`status` values: `active`, `sold`, `paused`

### 2.5 Delete Vehicle Listing
**DELETE** `/api/v1/vehicles/:id`
- **Auth:** Required

---

## 3. Booking APIs (`/api/v1`)

### 3.1 Get All Mechanics
**GET** `/api/v1/mechanics`

**Query Parameters:**
```
city=Mumbai
skills=engine
page=1
limit=20
```

### 3.2 Get Mechanic By ID
**GET** `/api/v1/mechanics/:id`

### 3.3 Create Booking
**POST** `/api/v1/bookings`
- **Auth:** Required

**Request Body:**
```json
{
  "mechanicId": "664abc...",
  "vehicleId": "664def...",
  "service": "Full engine service and oil change",
  "date": "2025-06-15T10:00:00.000Z"
}
```

### 3.4 Get My Bookings
**GET** `/api/v1/bookings/my`
- **Auth:** Required

### 3.5 Get Booking By ID
**GET** `/api/v1/bookings/:id`
- **Auth:** Required

### 3.6 Update Booking Status
**PATCH** `/api/v1/bookings/:id/status`
- **Auth:** Required

**Request Body:**
```json
{
  "status": "Accepted"
}
```
`status` values: `Pending`, `Accepted`, `On The Way`, `In Progress`, `Completed`, `Cancelled`

---

## 4. AI APIs (`/api/v1/ai`)

### 4.1 Evaluate Vehicle
**POST** `/api/v1/ai/evaluate`
- **Auth:** Required

**Request Body:**
```json
{
  "brand": "BMW",
  "model": "3 Series",
  "variant": "320d Luxury Line",
  "year": 2020,
  "fuel": "Diesel",
  "kms": 25000,
  "ownership": 1,
  "accidentHistory": "None",
  "city": "Mumbai",
  "askingPrice": 2800000
}
```

### 4.2 Get My Evaluations
**GET** `/api/v1/ai/evaluations`
- **Auth:** Required

### 4.3 Get Evaluation By ID
**GET** `/api/v1/ai/evaluations/:id`
- **Auth:** Required

---

## 5. Valuation APIs (`/api/v1/valuation`)

### 5.1 Get Valuation
**POST** `/api/v1/valuation`
- **Auth:** Required

**Request Body:**
```json
{
  "brand": "BMW",
  "model": "3 Series",
  "variant": "320d Luxury Line",
  "year": 2020,
  "fuel": "Diesel",
  "kms": 25000,
  "ownership": 1,
  "city": "Mumbai"
}
```

---

## 6. Client Dashboard & Notifications (`/api/v1/client`)

### 6.1 Get Dashboard
**GET** `/api/v1/client/dashboard`
- **Auth:** Required

### 6.2 Get Notifications
**GET** `/api/v1/client/notifications`
- **Auth:** Required

**Query Parameters:**
```
page=1
limit=20
unreadOnly=true | false
```

### 6.3 Mark Notification Read
**PUT** `/api/v1/client/notification/read/:id`
- **Auth:** Required

### 6.4 Mark All Notifications Read
**PUT** `/api/v1/client/notification/read-all`
- **Auth:** Required

---

## 7. Sell Request APIs (`/api/v1/sell-requests`)

### 7.1 Create Sell Request
**POST** `/api/v1/sell-requests`
- **Auth:** Required

**Request Body:**
```json
{
  "brand": "BMW",
  "model": "3 Series",
  "variant": "320d Luxury Line",
  "fuel": "Diesel",
  "transmission": "Automatic",
  "kms": 25000,
  "year": 2020,
  "ownership": 1,
  "city": "Mumbai",
  "expectedPrice": 2800000,
  "description": "Well maintained car",
  "images": [
    { "url": "https://example.com/img1.jpg", "publicId": "abc123" }
  ]
}
```
*(expectedPrice, description, images are optional)*

### 7.2 Get My Sell Requests
**GET** `/api/v1/sell-requests/my`
- **Auth:** Required

**Query Parameters:**
```
page=1
limit=10
status=pending | inspection_scheduled | inspection_completed | approved | rejected | listed | cancelled
```

### 7.3 Get Sell Request By ID
**GET** `/api/v1/sell-requests/:id`
- **Auth:** Required

### 7.4 Update Sell Request
**PUT** `/api/v1/sell-requests/:id`
- **Auth:** Required

**Request Body (all fields optional):**
```json
{
  "expectedPrice": 2700000,
  "description": "Updated description"
}
```

### 7.5 Delete Sell Request
**DELETE** `/api/v1/sell-requests/:id`
- **Auth:** Required

### 7.6 Add Images
**POST** `/api/v1/sell-requests/:id/images`
- **Auth:** Required

**Request Body:**
```json
{
  "images": [
    { "url": "https://example.com/img.jpg", "publicId": "abc123" }
  ]
}
```

### 7.7 Delete Image
**DELETE** `/api/v1/sell-requests/:id/images/:imageId`
- **Auth:** Required

### 7.8 Add Documents
**POST** `/api/v1/sell-requests/:id/documents`
- **Auth:** Required

**Request Body:**
```json
{
  "documents": [
    {
      "name": "RC Certificate",
      "type": "RC",
      "url": "https://example.com/rc.pdf",
      "publicId": "doc123"
    }
  ]
}
```
`type` values: `RC`, `Insurance`, `PUC`, `ServiceHistory`, `Other`

### 7.9 Delete Document
**DELETE** `/api/v1/sell-requests/:id/documents/:documentId`
- **Auth:** Required

### 7.10 Cancel Sell Request
**POST** `/api/v1/sell-requests/:id/cancel`
- **Auth:** Required

---

## 8. Admin Sell Request APIs (`/api/v1/admin/sell-requests`)
- **Auth:** Required — **Roles:** `official`, `admin`

### 8.1 Get All Sell Requests
**GET** `/api/v1/admin/sell-requests`

**Query Parameters:**
```
page=1
limit=20
status=pending | inspection_scheduled | inspection_completed | approved | rejected | listed | cancelled
search=BMW
```

### 8.2 Get Sell Request By ID (Admin)
**GET** `/api/v1/admin/sell-requests/:id`

### 8.3 Update Sell Request (Admin)
**PUT** `/api/v1/admin/sell-requests/:id`

**Request Body (all fields optional):**
```json
{
  "officialNotes": "Customer requested re-evaluation",
  "inspectionNotes": "Inspection completed"
}
```

### 8.4 Update Sell Request Status
**PUT** `/api/v1/admin/sell-requests/:id/status`

**Request Body:**
```json
{
  "status": "inspection_scheduled",
  "officialNotes": "Schedule for June 20"
}
```
`status` values: `pending`, `inspection_scheduled`, `inspection_completed`, `approved`, `rejected`, `listed`, `cancelled`

### 8.5 Assign Official
**POST** `/api/v1/admin/sell-requests/:id/assign-official`

**Request Body:**
```json
{
  "officialId": "664abc..."
}
```

### 8.6 Request More Details
**POST** `/api/v1/admin/sell-requests/:id/request-more-details`

**Request Body:**
```json
{
  "message": "Please upload the insurance document"
}
```

### 8.7 Reject Sell Request
**POST** `/api/v1/admin/sell-requests/:id/reject`

**Request Body:**
```json
{
  "reason": "Vehicle does not meet our quality standards"
}
```

### 8.8 Approve Sell Request
**POST** `/api/v1/admin/sell-requests/:id/approve`

**Request Body:**
```json
{
  "listingPrice": 3000000,
  "description": "Premium BMW in excellent condition"
}
```
*(listingPrice and description are optional)*

---

## 9. Inspection APIs (`/api/v1/inspections`)
- **Auth:** Required — **Roles:** `official`, `admin`

### 9.1 Create Inspection
**POST** `/api/v1/inspections`

**Request Body:**
```json
{
  "sellRequestId": "664abc...",
  "scheduledDate": "2025-06-20T10:00:00.000Z",
  "inspectedBy": "664def..."
}
```

### 9.2 Get Inspection By ID
**GET** `/api/v1/inspections/:id`

### 9.3 Update Inspection
**PUT** `/api/v1/inspections/:id`

**Request Body (all fields optional):**
```json
{
  "status": "completed",
  "scheduledDate": "2025-06-20T10:00:00.000Z",
  "completedDate": "2025-06-20T11:30:00.000Z",
  "exterior": {
    "bodyCondition": "good",
    "paintCondition": "good",
    "rustDamage": "none",
    "dentsScratches": "minor",
    "glassCondition": "excellent",
    "lightsCondition": "good",
    "tyresCondition": "fair",
    "notes": "Minor scratches on rear bumper"
  },
  "interior": {
    "seatsCondition": "good",
    "dashboardCondition": "good",
    "electronicsWorking": true,
    "acHeatingWorking": true,
    "odometerReading": 25000,
    "notes": "Interior well maintained"
  },
  "mechanical": {
    "engineCondition": "good",
    "transmissionCondition": "good",
    "suspensionCondition": "fair",
    "brakesCondition": "good",
    "steeringCondition": "good",
    "exhaustCondition": "good",
    "fluidLevels": "good",
    "notes": "Suspension needs minor attention"
  },
  "testDrive": {
    "performed": true,
    "enginePerformance": "good",
    "transmissionPerformance": "good",
    "brakePerformance": "good",
    "steeringPerformance": "good",
    "noiseVibration": "minor",
    "notes": "Drive experience is good overall"
  },
  "documents": {
    "rcVerified": true,
    "insuranceVerified": true,
    "pucVerified": false,
    "serviceHistoryVerified": true,
    "ownershipVerified": true,
    "notes": "PUC needs renewal"
  },
  "overallRating": "good",
  "estimatedValue": 2750000,
  "recommendation": "accept_as_is",
  "repairEstimate": 15000,
  "officialNotes": "Good car, recommend listing"
}
```
`status` values: `scheduled`, `in_progress`, `completed`, `cancelled`
`overallRating` values: `excellent`, `good`, `fair`, `poor`
`recommendation` values: `accept_as_is`, `accept_with_repairs`, `reject`

### 9.4 Get Inspection By Sell Request
**GET** `/api/v1/inspections/sell-request/:id`

### 9.5 Upload Inspection Images
**POST** `/api/v1/inspections/:id/upload-images`

**Request Body:**
```json
{
  "images": [
    {
      "category": "exterior",
      "url": "https://example.com/img.jpg",
      "publicId": "img123"
    }
  ]
}
```
`category` values: `exterior`, `interior`, `mechanical`, `documents`, `damage`, `other`

### 9.6 Upload Inspection Report
**POST** `/api/v1/inspections/:id/upload-report`

**Request Body:**
```json
{
  "reportUrl": "https://example.com/report.pdf",
  "reportPublicId": "report123"
}
```

---

## 10. Meeting APIs — Client (`/api/v1/meetings`)

### 10.1 Get My Meetings
**GET** `/api/v1/meetings/my`
- **Auth:** Required

**Query Parameters:**
```
page=1
limit=10
status=scheduled | confirmed | in_progress | completed | cancelled | rejected | rescheduled
type=inspection | test_drive | handover | document_verification | other
```

### 10.2 Get Meeting By ID (Client)
**GET** `/api/v1/meetings/:id`
- **Auth:** Required

### 10.3 Confirm Meeting
**POST** `/api/v1/meetings/:id/confirm`
- **Auth:** Required

### 10.4 Request Reschedule
**POST** `/api/v1/meetings/:id/reschedule`
- **Auth:** Required

**Request Body:**
```json
{
  "preferredDate": "2025-06-22T14:00:00.000Z",
  "reason": "Conflict with another appointment"
}
```

### 10.5 Cancel Meeting
**POST** `/api/v1/meetings/:id/cancel`
- **Auth:** Required

**Request Body:**
```json
{
  "reason": "Not interested anymore"
}
```

### 10.6 Submit Feedback
**POST** `/api/v1/meetings/:id/feedback`
- **Auth:** Required

**Request Body:**
```json
{
  "feedback": "Great experience, very professional",
  "rating": 5
}
```

---

## 11. Meeting APIs — Admin (`/api/v1/admin/meetings`)
- **Auth:** Required — **Roles:** `official`, `admin`

### 11.1 Create Meeting
**POST** `/api/v1/admin/meetings`

**Request Body:**
```json
{
  "sellRequestId": "664abc...",
  "type": "inspection",
  "scheduledDate": "2025-06-20T10:00:00.000Z",
  "durationMinutes": 60,
  "location": {
    "type": "Point",
    "coordinates": [72.8777, 19.0760],
    "address": "WheelGenie Center, Andheri",
    "venue": "wheelgenie_center",
    "meetingLink": "https://meet.google.com/abc"
  },
  "officialId": "664def..."
}
```
`type` values: `inspection`, `test_drive`, `handover`, `document_verification`, `other`
`venue` values: `wheelgenie_center`, `client_location`, `dealership`, `virtual`, `other`

### 11.2 Get All Meetings
**GET** `/api/v1/admin/meetings`

**Query Parameters:**
```
page=1
limit=20
status=scheduled | confirmed | in_progress | completed | cancelled | rejected | rescheduled
type=inspection | test_drive | handover | document_verification | other
official=664abc...
dateFrom=2025-06-01
dateTo=2025-06-30
```

### 11.3 Get Meeting By ID (Admin)
**GET** `/api/v1/admin/meetings/:id`

### 11.4 Update Meeting
**PUT** `/api/v1/admin/meetings/:id`

**Request Body (all fields optional):**
```json
{
  "scheduledDate": "2025-06-21T11:00:00.000Z",
  "durationMinutes": 90,
  "officialNotes": "Rescheduled per customer request"
}
```

### 11.5 Update Meeting Status
**PUT** `/api/v1/admin/meetings/:id/status`

**Request Body:**
```json
{
  "status": "completed",
  "officialNotes": "Meeting completed successfully"
}
```

### 11.6 Delete Meeting
**DELETE** `/api/v1/admin/meetings/:id`

---

## 12. Car APIs — Public (`/api/v1/cars`)

### 12.1 Get Cars
**GET** `/api/v1/cars`

**Query Parameters:**
```
page=1
limit=12
brand=BMW
model=3 Series
fuel=Petrol | Diesel | CNG | Electric | Hybrid
transmission=Manual | Automatic
city=Mumbai
minPrice=500000
maxPrice=5000000
minYear=2018
maxYear=2024
minKms=0
maxKms=50000
sort=-createdAt
search=BMW
```

### 12.2 Get Featured Cars
**GET** `/api/v1/cars/featured`

**Query Parameters:**
```
limit=6
```

### 12.3 Get Latest Cars
**GET** `/api/v1/cars/latest`

**Query Parameters:**
```
limit=10
```

### 12.4 Search Cars
**GET** `/api/v1/cars/search`

**Query Parameters:**
```
q=BMW
page=1
limit=12
```

### 12.5 Filter Cars
**GET** `/api/v1/cars/filter`

**Query Parameters:**
```
page=1
limit=12
brands=BMW,Mercedes
fuels=Petrol,Diesel
transmissions=Automatic
cities=Mumbai,Delhi
minPrice=500000
maxPrice=5000000
minYear=2018
maxYear=2024
minKms=0
maxKms=50000
sort=-createdAt
```

### 12.6 Get Related Cars
**GET** `/api/v1/cars/related/:id`

**Query Parameters:**
```
limit=4
```

### 12.7 Get Car By ID
**GET** `/api/v1/cars/:id`

---

## 13. Car APIs — Admin (`/api/v1/admin/cars`)
- **Auth:** Required — **Roles:** `official`, `admin`

### 13.1 Create Car
**POST** `/api/v1/admin/cars`

**Request Body:**
```json
{
  "brand": "BMW",
  "model": "3 Series",
  "variant": "320d Luxury Line",
  "fuel": "Diesel",
  "transmission": "Automatic",
  "kms": 25000,
  "year": 2020,
  "ownership": 1,
  "city": "Mumbai",
  "images": [
    { "url": "https://example.com/img.jpg", "publicId": "abc123" }
  ],
  "listingPrice": 3000000,
  "listingDescription": "Excellent condition BMW",
  "sellRequestId": "664abc..."
}
```

### 13.2 Get Admin Cars
**GET** `/api/v1/admin/cars`

**Query Parameters:**
```
page=1
limit=20
status=active | sold | paused | draft | archived | reserved
brand=BMW
model=3 Series
search=BMW
```

### 13.3 Get Car By ID (Admin)
**GET** `/api/v1/admin/cars/:id`

### 13.4 Update Car
**PUT** `/api/v1/admin/cars/:id`

**Request Body (all fields optional):**
```json
{
  "listingPrice": 2900000,
  "status": "active"
}
```
`status` values: `active`, `sold`, `paused`, `draft`, `archived`, `reserved`

### 13.5 Delete Car
**DELETE** `/api/v1/admin/cars/:id`

### 13.6 Publish Car
**PUT** `/api/v1/admin/cars/:id/publish`

### 13.7 Make Car Private
**PUT** `/api/v1/admin/cars/:id/private`

### 13.8 Archive Car
**PUT** `/api/v1/admin/cars/:id/archive`

### 13.9 Mark Car As Sold
**PUT** `/api/v1/admin/cars/:id/sold`

### 13.10 Mark Car As Reserved
**PUT** `/api/v1/admin/cars/:id/reserved`

### 13.11 Mark Car As Unsold
**PUT** `/api/v1/admin/cars/:id/unsold`

### 13.12 Add Car Images
**POST** `/api/v1/admin/cars/:id/images`

**Request Body:**
```json
{
  "images": [
    { "url": "https://example.com/img.jpg", "publicId": "abc123" }
  ]
}
```

### 13.13 Delete Car Image
**DELETE** `/api/v1/admin/cars/:id/images/:imageId`

### 13.14 Add Car Documents
**POST** `/api/v1/admin/cars/:id/documents`

**Request Body:**
```json
{
  "documents": [
    {
      "name": "RC Certificate",
      "type": "RC",
      "url": "https://example.com/rc.pdf",
      "publicId": "doc123"
    }
  ]
}
```
`type` values: `RC`, `Insurance`, `PUC`, `ServiceHistory`, `Other`

### 13.15 Delete Car Document
**DELETE** `/api/v1/admin/cars/:id/documents/:documentId`

---

## 14. Test Drive APIs — Client (`/api/v1/test-drives`)

### 14.1 Create Test Drive
**POST** `/api/v1/test-drives`
- **Auth:** Required

**Request Body:**
```json
{
  "carId": "664abc...",
  "scheduledDate": "2025-06-22T11:00:00.000Z",
  "durationMinutes": 30,
  "location": {
    "type": "physical",
    "coordinates": [72.8777, 19.0760],
    "address": "WheelGenie Center, Andheri",
    "venue": "wheelgenie_center"
  },
  "notes": "Want to test highway performance"
}
```

### 14.2 Get My Test Drives
**GET** `/api/v1/test-drives/my`
- **Auth:** Required

**Query Parameters:**
```
page=1
limit=10
status=requested | approved | rejected | scheduled | in_progress | completed | cancelled | rescheduled
```

### 14.3 Get Test Drive By ID
**GET** `/api/v1/test-drives/:id`
- **Auth:** Required

### 14.4 Reschedule Test Drive
**PUT** `/api/v1/test-drives/:id/reschedule`
- **Auth:** Required

**Request Body:**
```json
{
  "newDate": "2025-06-23T14:00:00.000Z",
  "reason": "Urgent work came up"
}
```

### 14.5 Cancel Test Drive
**POST** `/api/v1/test-drives/:id/cancel`
- **Auth:** Required

**Request Body:**
```json
{
  "reason": "Found another car"
}
```

---

## 15. Test Drive APIs — Admin (`/api/v1/admin/test-drives`)
- **Auth:** Required — **Roles:** `official`, `admin`

### 15.1 Get All Test Drives
**GET** `/api/v1/admin/test-drives`

**Query Parameters:**
```
page=1
limit=20
status=requested | approved | rejected | scheduled | in_progress | completed | cancelled | rescheduled
car=664abc...
client=664abc...
official=664abc...
dateFrom=2025-06-01
dateTo=2025-06-30
```

### 15.2 Get Test Drive By ID (Admin)
**GET** `/api/v1/admin/test-drives/:id`

### 15.3 Update Test Drive Status
**PUT** `/api/v1/admin/test-drives/:id/status`

**Request Body:**
```json
{
  "status": "scheduled",
  "officialNotes": "Confirmed slot at 11 AM"
}
```

### 15.4 Approve Test Drive
**POST** `/api/v1/admin/test-drives/:id/approve`

**Request Body:**
```json
{
  "scheduledDate": "2025-06-22T11:00:00.000Z",
  "officialNotes": "Approved for your preferred slot",
  "officialId": "664abc..."
}
```

### 15.5 Reject Test Drive
**POST** `/api/v1/admin/test-drives/:id/reject`

**Request Body:**
```json
{
  "reason": "Car is currently unavailable for test drive"
}
```

### 15.6 Complete Test Drive
**POST** `/api/v1/admin/test-drives/:id/complete`

**Request Body:**
```json
{
  "officialNotes": "Customer satisfied with the drive"
}
```

---

## 16. Inquiry APIs — Client (`/api/v1/inquiries`)

### 16.1 Create Inquiry
**POST** `/api/v1/inquiries`
- **Auth:** Required

**Request Body:**
```json
{
  "carId": "664abc...",
  "subject": "Price Negotiation",
  "message": "Is the price negotiable? I am willing to buy today."
}
```

### 16.2 Get My Inquiries
**GET** `/api/v1/inquiries/my`
- **Auth:** Required

**Query Parameters:**
```
page=1
limit=10
status=open | in_progress | replied | closed
```

### 16.3 Get Inquiry By ID
**GET** `/api/v1/inquiries/:id`
- **Auth:** Required

### 16.4 Close Inquiry
**POST** `/api/v1/inquiries/:id/close`
- **Auth:** Required

---

## 17. Inquiry APIs — Admin (`/api/v1/admin/inquiries`)
- **Auth:** Required — **Roles:** `official`, `admin`

### 17.1 Get All Inquiries
**GET** `/api/v1/admin/inquiries`

**Query Parameters:**
```
page=1
limit=20
status=open | in_progress | replied | closed
car=664abc...
client=664abc...
official=664abc...
```

### 17.2 Get Inquiry By ID (Admin)
**GET** `/api/v1/admin/inquiries/:id`

### 17.3 Reply To Inquiry
**POST** `/api/v1/admin/inquiries/:id/reply`

**Request Body:**
```json
{
  "message": "Yes, the price is negotiable. Please visit our center for a discussion."
}
```

### 17.4 Update Inquiry Status
**PUT** `/api/v1/admin/inquiries/:id/status`

**Request Body:**
```json
{
  "status": "replied",
  "officialNotes": "Customer informed about pricing"
}
```

---

## 18. Deal APIs — Client (`/api/v1/deals`)

### 18.1 Get My Deals
**GET** `/api/v1/deals/my`
- **Auth:** Required

**Query Parameters:**
```
page=1
limit=10
status=draft | pending_payment | payment_received | documents_pending | completed | cancelled
```

### 18.2 Get Deal By ID
**GET** `/api/v1/deals/:id`
- **Auth:** Required

---

## 19. Deal APIs — Admin (`/api/v1/admin/deals`)
- **Auth:** Required — **Roles:** `official`, `admin`

### 19.1 Create Deal
**POST** `/api/v1/admin/deals`

**Request Body:**
```json
{
  "carId": "664abc...",
  "clientId": "664def...",
  "agreedPrice": 2750000,
  "sellRequestId": "664ghi...",
  "milestones": [
    {
      "title": "Payment Received",
      "description": "Full payment via bank transfer",
      "dueDate": "2025-07-01"
    },
    {
      "title": "RC Transfer",
      "description": "Complete RC transfer at RTO",
      "dueDate": "2025-07-10"
    }
  ]
}
```

### 19.2 Get All Deals
**GET** `/api/v1/admin/deals`

**Query Parameters:**
```
page=1
limit=20
status=draft | pending_payment | payment_received | documents_pending | completed | cancelled
car=664abc...
client=664abc...
official=664abc...
```

### 19.3 Get Deal By ID (Admin)
**GET** `/api/v1/admin/deals/:id`

### 19.4 Update Deal
**PUT** `/api/v1/admin/deals/:id`

**Request Body (all fields optional):**
```json
{
  "agreedPrice": 2700000,
  "paymentDetails": {
    "amount": 2700000,
    "method": "bank_transfer",
    "receivedAt": "2025-06-25T14:30:00.000Z",
    "reference": "NEFT123456",
    "notes": "Payment received via HDFC Bank"
  }
}
```
`method` values: `cash`, `bank_transfer`, `cheque`, `loan`, `other`

### 19.5 Update Deal Status
**PUT** `/api/v1/admin/deals/:id/status`

**Request Body:**
```json
{
  "status": "payment_received",
  "paymentDetails": {
    "amount": 2700000,
    "method": "bank_transfer",
    "receivedAt": "2025-06-25T14:30:00.000Z",
    "reference": "NEFT123456",
    "notes": "Full payment received"
  },
  "cancellationReason": ""
}
```

### 19.6 Cancel Deal
**POST** `/api/v1/admin/deals/:id/cancel`

**Request Body:**
```json
{
  "reason": "Customer backed out of the deal"
}
```

### 19.7 Complete Deal
**POST** `/api/v1/admin/deals/:id/complete`

---

## 20. Paperwork APIs — Client (`/api/v1/paperworks`)

### 20.1 Get My Paperworks
**GET** `/api/v1/paperworks/my`
- **Auth:** Required

**Query Parameters:**
```
page=1
limit=10
status=initiated | documents_uploaded | under_review | client_action_required | completed | rejected
```

### 20.2 Get Paperwork By ID
**GET** `/api/v1/paperworks/:id`
- **Auth:** Required

### 20.3 Get Paperwork Documents
**GET** `/api/v1/paperworks/:id/documents`
- **Auth:** Required

---

## 21. Paperwork APIs — Admin (`/api/v1/admin/paperworks`)
- **Auth:** Required — **Roles:** `official`, `admin`

### 21.1 Create Paperwork
**POST** `/api/v1/admin/paperworks`

**Request Body:**
```json
{
  "dealId": "664abc..."
}
```

### 21.2 Get Paperwork By ID (Admin)
**GET** `/api/v1/admin/paperworks/:id`

### 21.3 Update Paperwork
**PUT** `/api/v1/admin/paperworks/:id`

**Request Body (all fields optional):**
```json
{
  "officialNotes": "All documents verified",
  "documents": [
    {
      "name": "Sale Agreement",
      "type": "sale_agreement",
      "url": "https://example.com/agreement.pdf",
      "publicId": "doc123",
      "uploadedBy": "664abc...",
      "uploadedAt": "2025-06-25T10:00:00.000Z",
      "verified": true,
      "verifiedAt": "2025-06-25T11:00:00.000Z",
      "verifiedBy": "664abc..."
    }
  ]
}
```
`type` values: `sale_agreement`, `rc_transfer`, `insurance_transfer`, `noc`, `payment_receipt`, `loan_documents`, `delivery_receipt`, `other`

### 21.4 Upload Document
**POST** `/api/v1/admin/paperworks/:id/upload`

**Request Body:**
```json
{
  "name": "Sale Agreement",
  "type": "sale_agreement",
  "url": "https://example.com/agreement.pdf",
  "publicId": "doc123"
}
```

### 21.5 Delete Document
**DELETE** `/api/v1/admin/paperworks/:id/document/:documentId`

### 21.6 Update Paperwork Status
**PUT** `/api/v1/admin/paperworks/:id/status`

**Request Body:**
```json
{
  "status": "completed",
  "officialNotes": "Documentation process completed"
}
```
`status` values: `initiated`, `documents_uploaded`, `under_review`, `client_action_required`, `completed`, `rejected`

---

## 22. Timeline APIs (`/api/v1/timeline`)

### 22.1 Get Sell Request Timeline
**GET** `/api/v1/timeline/sell-request/:id`
- **Auth:** Required

### 22.2 Get Deal Timeline
**GET** `/api/v1/timeline/deal/:id`
- **Auth:** Required

### 22.3 Get Paperwork Timeline
**GET** `/api/v1/timeline/paperwork/:id`
- **Auth:** Required

---

## 23. Dashboard APIs (`/api/v1/dashboard`)

### 23.1 Get Client Dashboard
**GET** `/api/v1/dashboard/client`
- **Auth:** Required

### 23.2 Get Admin Dashboard
**GET** `/api/v1/dashboard/admin`
- **Auth:** Required — **Roles:** `official`, `admin`

---

## 24. Notification APIs (`/api/v1/notifications`)

### 24.1 Get Notifications
**GET** `/api/v1/notifications`
- **Auth:** Required

**Query Parameters:**
```
page=1
limit=20
unreadOnly=true | false
type=Booking | Service | System | Promotion
```

### 24.2 Get Notification By ID
**GET** `/api/v1/notifications/:id`
- **Auth:** Required

### 24.3 Mark Notification As Read
**PUT** `/api/v1/notifications/read/:id`
- **Auth:** Required

### 24.4 Mark All Notifications As Read
**PUT** `/api/v1/notifications/read-all`
- **Auth:** Required

### 24.5 Delete Notification
**DELETE** `/api/v1/notifications/:id`
- **Auth:** Required

---

## 25. Analytics APIs (`/api/v1/analytics`)
- **Auth:** Required — **Roles:** `official`, `admin`

### 25.1 Get Overview Analytics
**GET** `/api/v1/analytics/overview`

**Query Parameters:**
```
startDate=2025-01-01
endDate=2025-12-31
```

### 25.2 Get Sales Analytics
**GET** `/api/v1/analytics/sales`

**Query Parameters:**
```
startDate=2025-01-01
endDate=2025-12-31
```

### 25.3 Get Test Drive Analytics
**GET** `/api/v1/analytics/test-drives`

**Query Parameters:**
```
startDate=2025-01-01
endDate=2025-12-31
```

### 25.4 Get Inquiry Analytics
**GET** `/api/v1/analytics/inquiries`

**Query Parameters:**
```
startDate=2025-01-01
endDate=2025-12-31
```

### 25.5 Get Sell Request Analytics
**GET** `/api/v1/analytics/sell-requests`

**Query Parameters:**
```
startDate=2025-01-01
endDate=2025-12-31
```

---

## 26. Upload APIs (`/api/v1/uploads`)

### 26.1 Upload Image
**POST** `/api/v1/uploads/image`
- **Auth:** Required
- **Content-Type:** `multipart/form-data`

**Form Data:**
```
file: <image_file> (max 10MB)
```

### 26.2 Upload Document
**POST** `/api/v1/uploads/document`
- **Auth:** Required
- **Content-Type:** `multipart/form-data`

**Form Data:**
```
file: <document_file> (max 10MB)
```

### 26.3 Delete Upload
**DELETE** `/api/v1/uploads/:id`
- **Auth:** Required

---

## 27. Master Data APIs (`/api/v1/master`)

### 27.1 Get Brands
**GET** `/api/v1/master/brands`
- **Auth:** Required

**Query Parameters:**
```
active=true | false
page=1
limit=50
```

### 27.2 Get Brand By ID
**GET** `/api/v1/master/brands/:id`
- **Auth:** Required

### 27.3 Create Brand
**POST** `/api/v1/master/brands`
- **Auth:** Required — **Roles:** `official`, `admin`

**Request Body:**
```json
{
  "name": "BMW",
  "logo": "https://example.com/bmw-logo.png",
  "isActive": true,
  "displayOrder": 1
}
```

### 27.4 Update Brand
**PUT** `/api/v1/master/brands/:id`
- **Auth:** Required — **Roles:** `official`, `admin`

**Request Body:**
```json
{
  "name": "BMW India",
  "logo": "https://example.com/new-logo.png",
  "isActive": true,
  "displayOrder": 1
}
```

### 27.5 Delete Brand
**DELETE** `/api/v1/master/brands/:id`
- **Auth:** Required — **Roles:** `official`, `admin`

### 27.6 Get Models
**GET** `/api/v1/master/models`
- **Auth:** Required

**Query Parameters:**
```
brand=664abc... (filter by brand ID)
active=true | false
page=1
limit=50
```

### 27.7 Get Model By ID
**GET** `/api/v1/master/models/:id`
- **Auth:** Required

### 27.8 Create Model
**POST** `/api/v1/master/models`
- **Auth:** Required — **Roles:** `official`, `admin`

**Request Body:**
```json
{
  "name": "3 Series",
  "brand": "664abc...",
  "bodyType": "sedan",
  "isActive": true,
  "displayOrder": 1
}
```
`bodyType` values: `sedan`, `hatchback`, `suv`, `muv`, `coupe`, `convertible`, `wagon`, `pickup`, `van`, `other`

### 27.9 Update Model
**PUT** `/api/v1/master/models/:id`
- **Auth:** Required — **Roles:** `official`, `admin`

### 27.10 Delete Model
**DELETE** `/api/v1/master/models/:id`
- **Auth:** Required — **Roles:** `official`, `admin`

### 27.11 Get States
**GET** `/api/v1/master/states`
- **Auth:** Required

**Query Parameters:**
```
active=true | false
page=1
limit=50
```

### 27.12 Get State By ID
**GET** `/api/v1/master/states/:id`
- **Auth:** Required

### 27.13 Create State
**POST** `/api/v1/master/states`
- **Auth:** Required — **Roles:** `official`, `admin`

**Request Body:**
```json
{
  "name": "Maharashtra",
  "code": "MH",
  "isActive": true
}
```

### 27.14 Update State
**PUT** `/api/v1/master/states/:id`
- **Auth:** Required — **Roles:** `official`, `admin`

### 27.15 Delete State
**DELETE** `/api/v1/master/states/:id`
- **Auth:** Required — **Roles:** `official`, `admin`

### 27.16 Get Cities
**GET** `/api/v1/master/cities`
- **Auth:** Required

**Query Parameters:**
```
state=664abc... (filter by state ID)
active=true | false
page=1
limit=50
search=Mumbai
```

### 27.17 Get City By ID
**GET** `/api/v1/master/cities/:id`
- **Auth:** Required

### 27.18 Create City
**POST** `/api/v1/master/cities`
- **Auth:** Required — **Roles:** `official`, `admin`

**Request Body:**
```json
{
  "name": "Mumbai",
  "state": "664abc...",
  "coordinates": {
    "type": "Point",
    "coordinates": [72.8777, 19.0760]
  },
  "isActive": true
}
```

### 27.19 Update City
**PUT** `/api/v1/master/cities/:id`
- **Auth:** Required — **Roles:** `official`, `admin`

### 27.20 Delete City
**DELETE** `/api/v1/master/cities/:id`
- **Auth:** Required — **Roles:** `official`, `admin`

### 27.21 Get Cities By State
**GET** `/api/v1/master/states/:stateId/cities`
- **Auth:** Required

**Query Parameters:**
```
active=true | false
```

---

## 28. Wishlist APIs (`/api/v1/wishlist`)

### 28.1 Get Wishlist
**GET** `/api/v1/wishlist`
- **Auth:** Required

### 28.2 Add To Wishlist
**POST** `/api/v1/wishlist/:carId`
- **Auth:** Required

### 28.3 Remove From Wishlist
**DELETE** `/api/v1/wishlist/:carId`
- **Auth:** Required

---

## 29. Compare APIs (`/api/v1/compare`)

### 29.1 Get Compare List
**GET** `/api/v1/compare`
- **Auth:** Required

### 29.2 Add To Compare
**POST** `/api/v1/compare`
- **Auth:** Required

**Request Body:**
```json
{
  "carId": "664abc..."
}
```

### 29.3 Remove From Compare
**DELETE** `/api/v1/compare/:carId`
- **Auth:** Required

---

## 30. Admin User Management APIs (`/api/v1/admin/users`)
- **Auth:** Required — **Roles:** `official`, `admin`

### 30.1 Get All Users
**GET** `/api/v1/admin/users`

**Query Parameters:**
```
page=1
limit=20
role=customer | official | admin
search=John
isBlocked=true | false
```

### 30.2 Get User By ID
**GET** `/api/v1/admin/users/:id`

### 30.3 Update User
**PUT** `/api/v1/admin/users/:id`

**Request Body (all fields optional):**
```json
{
  "name": "John Updated",
  "phone": "9876543211",
  "address": {
    "street": "456 New St",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001"
  },
  "profilePic": "https://example.com/pic.jpg",
  "role": "customer",
  "isVerified": true
}
```

### 30.4 Block User
**PUT** `/api/v1/admin/users/:id/block`

### 30.5 Unblock User
**PUT** `/api/v1/admin/users/:id/unblock`

### 30.6 Delete User
**DELETE** `/api/v1/admin/users/:id`

---

## Summary of Access Levels

| Role | Type | Access |
|------|------|--------|
| **Public** | No auth | Car listings (view), Mechanics (view), Auth (register/login) |
| **Customer** | `customer` | Own profile, sell requests, test drives, inquiries, deals, meetings, wishlist, compare |
| **Official** | `official` | All customer access + admin sell requests, inspections, meetings, cars, test drives, inquiries, deals, paperwork, analytics, users |
| **Admin** | `admin` | All official access + master data management |

## Quick Reference — All API Groups

| # | Prefix | Description |
|---|--------|-------------|
| 1 | `/api/v1/auth` | Authentication & user management |
| 2 | `/api/v1/vehicles` | Marketplace listings |
| 3 | `/api/v1` | Mechanic bookings |
| 4 | `/api/v1/ai` | AI vehicle evaluation |
| 5 | `/api/v1/valuation` | Vehicle valuation |
| 6 | `/api/v1/client` | Client dashboard & notifications |
| 7 | `/api/v1/sell-requests` | Sell requests (customer) |
| 8 | `/api/v1/admin/sell-requests` | Sell requests (admin/official) |
| 9 | `/api/v1/inspections` | Vehicle inspections |
| 10 | `/api/v1/meetings` | Meetings (client) |
| 11 | `/api/v1/admin/meetings` | Meetings (admin/official) |
| 12 | `/api/v1/cars` | Cars (public) |
| 13 | `/api/v1/admin/cars` | Cars (admin/official) |
| 14 | `/api/v1/test-drives` | Test drives (client) |
| 15 | `/api/v1/admin/test-drives` | Test drives (admin/official) |
| 16 | `/api/v1/inquiries` | Inquiries (client) |
| 17 | `/api/v1/admin/inquiries` | Inquiries (admin/official) |
| 18 | `/api/v1/deals` | Deals (client) |
| 19 | `/api/v1/admin/deals` | Deals (admin/official) |
| 20 | `/api/v1/paperworks` | Paperwork (client) |
| 21 | `/api/v1/admin/paperworks` | Paperwork (admin/official) |
| 22 | `/api/v1/timeline` | Timeline events |
| 23 | `/api/v1/dashboard` | Dashboard data |
| 24 | `/api/v1/notifications` | Notifications |
| 25 | `/api/v1/analytics` | Analytics |
| 26 | `/api/v1/uploads` | File uploads |
| 27 | `/api/v1/master` | Master data (brands, models, states, cities) |
| 28 | `/api/v1/wishlist` | Wishlist |
| 29 | `/api/v1/compare` | Compare vehicles |
| 30 | `/api/v1/admin/users` | User management |
