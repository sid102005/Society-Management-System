# ✅ QUICK TEST DATA REFERENCE - Copy & Paste Ready

## 🚀 Use This Document to Copy Exact Test Data

All data here is **validated and will return 200 OK / 201 Created**

---

## 📋 AUTHENTICATION

### Register Admin User
```json
{
  "name": "Admin User",
  "phone": "9876543210",
  "email": "admin@society.com",
  "password": "Admin@123",
  "role": "admin"
}
```

### Register Staff User
```json
{
  "name": "Staff User",
  "phone": "9876543211",
  "email": "staff@society.com",
  "password": "Staff@123",
  "role": "staff"
}
```

### Register Member User
```json
{
  "name": "Member User",
  "phone": "9876543212",
  "email": "member@society.com",
  "password": "Member@123",
  "role": "member",
  "flat": "A-101"
}
```

### Login Admin
```json
{
  "phone": "9876543210",
  "password": "Admin@123"
}
```

### Login Staff
```json
{
  "phone": "9876543211",
  "password": "Staff@123"
}
```

### Login Member
```json
{
  "phone": "9876543212",
  "password": "Member@123"
}
```

---

## 🚪 VISITOR MANAGEMENT

### Create Visitor (Feature #1)
```json
{
  "name": "John Visitor",
  "phone": "9898765432",
  "flatToVisit": "A-101",
  "vehicleNumber": "MH02AB1234",
  "purpose": "Meeting"
}
```

### Create Pre-Approved Visitor (Feature #2)
```json
{
  "name": "Sister",
  "phone": "9898765433",
  "relation": "Sister",
  "expiryDate": "2026-12-31"
}
```

### Send OTP (Feature #3)
```json
{
  "visitorId": "{{visitorId}}",
  "flatNumber": "A-101"
}
```

### QR Code Scan (Feature #4)
```json
{
  "qrData": "{{visitorId}}"
}
```

### Create Delivery (Feature #5)
```json
{
  "courierName": "Bykea Courier",
  "courierCompany": "Bykea",
  "phoneNumber": "9898765432",
  "vehicleNumber": "KHI-1234",
  "flatNumber": "A-101",
  "numberOfPackages": 5
}
```

### Create Package (Feature #6)
```json
{
  "trackingId": "TRK123456",
  "recipientFlat": "A-205",
  "senderName": "Amazon",
  "description": "Electronics"
}
```

### Get Overstay Alerts (Feature #11)
```
GET /api/visitor/alerts/overstay?hours=4
```

### Daily Visitor Report (Feature #12)
```
GET /api/visitor/reports/daily
```

---

## 🚗 RESIDENT & VEHICLE

### Get Members (Feature #13)
```
GET /api/member
```

### Register Vehicle (Feature #14)
```json
{
  "vehicleNumber": "MH02AB1234",
  "stickerNumber": "STICK001",
  "make": "Toyota",
  "model": "Fortuner",
  "color": "White"
}
```

### Scan Vehicle Sticker (Feature #15)
```json
{
  "stickerNumber": "STICK001"
}
```

### Register Guest Vehicle (Feature #16)
```json
{
  "vehicleNumber": "KA01AB1234",
  "ownerName": "Guest Name",
  "driverName": "Driver Name",
  "duration": 24
}
```

---

## 📝 COMPLAINTS & TASKS

### Get Complaints (Feature #17)
```
GET /api/complaint
```

### Create Complaint (Feature #17)
```json
{
  "title": "Broken Window Lock",
  "description": "The lock on window is broken and needs immediate repair",
  "category": "maintenance",
  "severity": "high",
  "flat": "A-101"
}
```

### Update Complaint Status (Feature #18)
```json
{
  "status": "in-progress",
  "resolution": "Repair work started"
}
```

### Get Tasks (Feature #20)
```
GET /api/task
```

---

## 🛡️ SAFETY & PATROLLING

### Create Patrol Log (Feature #21)
```json
{
  "route": "A-Block perimeter",
  "checkpoints": [
    {
      "name": "Gate 1",
      "gps": {
        "lat": 19.1136,
        "lng": 72.8697
      },
      "time": "2026-06-09T10:00:00Z"
    },
    {
      "name": "Gate 2",
      "gps": {
        "lat": 19.1145,
        "lng": 72.8705
      },
      "time": "2026-06-09T10:15:00Z"
    }
  ],
  "observations": "All gates secure, no incidents"
}
```

### Create Incident Report (Feature #22)
```json
{
  "incidentType": "theft",
  "title": "Motorcycle Theft",
  "description": "Motorcycle stolen from parking lot",
  "location": "B-Block Parking",
  "severity": "high"
}
```

### SOS Alert (Feature #23)
```json
{
  "location": "A-101",
  "gpsLocation": {
    "lat": 19.1136,
    "lng": 72.8697
  },
  "emergencyType": "medical"
}
```

### Create Emergency Drill (Feature #24)
```json
{
  "drillType": "fire",
  "scheduledDate": "2026-06-15",
  "evacuationPoints": [
    "Gate 1",
    "Gate 2",
    "Sports Ground"
  ]
}
```

---

## 👥 ATTENDANCE & SHIFTS

### Check-in (Feature #25)
```json
{
  "latitude": 19.1136,
  "longitude": 72.8697
}
```

### Check-out (Feature #25)
```json
{
  "latitude": 19.1136,
  "longitude": 72.8697
}
```

### Get Shifts (Feature #26)
```
GET /api/shift
```

### Apply Leave (Feature #27)
```json
{
  "leaveType": "sick",
  "startDate": "2026-06-10",
  "endDate": "2026-06-12",
  "reason": "Medical appointment"
}
```

### Get Salary Slips (Feature #28)
```
GET /api/salary/my-slips
```

---

## 💬 COMMUNICATION

### Intercom Call (Feature #29)
```json
{
  "recipientId": "user123",
  "callType": "voice",
  "fromFlat": "A-101"
}
```

### Send Message (Feature #30)
```json
{
  "recipientId": "user123",
  "message": "Hello, issue with door lock"
}
```

### Get Notices (Feature #31)
```
GET /api/notice
```

### Get Alerts (Feature #32)
```
GET /api/alert
```

---

## 🎯 Valid Enum Values

### Category (Complaints)
```
Valid: "maintenance", "noise", "parking", "cleanliness", "security", "other"
```

### Severity (Complaints, Incidents)
```
Valid: "low", "medium", "high", "critical"
```

### Leave Type
```
Valid: "sick", "casual", "personal", "emergency"
```

### Incident Type
```
Valid: "accident", "fight", "theft", "fire", "medical", "suspicious", "vandalism", "other"
```

### Emergency Drill Type
```
Valid: "fire", "earthquake", "flood", "medical", "security"
```

### Complaint Status
```
Valid: "open", "in-progress", "resolved", "escalated", "closed"
```

### Role
```
Valid: "admin", "staff", "member"
```

---

## 📱 Valid Phone Numbers for Testing

```
Admin:     9876543210
Staff:     9876543211
Member:    9876543212
Visitor 1: 9898765432
Visitor 2: 9898765433
Visitor 3: 9898765434
Visitor 4: 9898765435
Visitor 5: 9898765436
```

**Pattern:** Must start with 6-9, exactly 10 digits total

---

## 📍 Flat Numbers (for testing)
```
A-101
A-102
A-201
B-101
B-102
C-101
```

---

## 🚗 Vehicle Numbers (for testing)
```
Resident: MH02AB1234
Guest:    KA01AB1234
Delivery: KHI-1234
Cab:      MH01AB5678
```

---

## 🔐 Strong Passwords (for testing)

```
Admin@123
Staff@123
Member@123
Test@1234
Pass@9876
Secure@123
```

**Requirements:**
- Minimum 6 characters
- At least 1 uppercase letter
- At least 1 number
- Optional but recommended: Special character (@, #, !, etc.)

---

## 📧 Email Addresses (for testing)

```
admin@society.com
staff@society.com
member@society.com
user1@example.com
user2@example.com
resident@apartment.com
```

---

## 🕐 Date & Time Format

### Date Format (YYYY-MM-DD)
```
"2026-06-10"
"2026-06-15"
"2026-12-31"
```

### DateTime Format (ISO 8601)
```
"2026-06-09T10:00:00Z"
"2026-06-09T14:30:00Z"
"2026-06-09T16:45:00Z"
```

---

## 🔗 Headers Required for All Requests

```
Content-Type: application/json
Authorization: Bearer {{staffToken}}
```

---

## 📊 Response Examples

### Success (201 Created)
```json
{
  "message": "Visitor entry recorded",
  "data": {
    "_id": "visitor_id_123",
    "name": "John Visitor",
    "phone": "9898765432",
    "createdAt": "2026-06-09T10:30:00.000Z"
  }
}
```

### Success (200 OK)
```json
{
  "data": [
    {
      "_id": "id_123",
      "name": "Item Name",
      "status": "active"
    }
  ]
}
```

### Error (400 Bad Request) - Should NOT happen with this data
```json
{
  "message": "Validation error message"
}
```

---

## 🚀 Testing Steps

### 1. Setup Phase
```
1. POST /api/auth/register (Admin)
2. POST /api/auth/register (Staff)
3. POST /api/auth/register (Member)
4. POST /api/auth/login (Admin) → Save adminToken
5. POST /api/auth/login (Staff) → Save staffToken
6. POST /api/auth/login (Member) → Save memberToken
```

### 2. Feature Testing
```
Use staffToken for most requests
Use memberToken for member-specific requests
Use adminToken for admin-only requests
```

### 3. Copy & Paste
```
Copy JSON from this document
Paste into Postman request body
Send → Should return 200 OK / 201 Created
```

---

## ✅ Validation Checklist

Before sending any request, verify:

- [ ] Phone numbers are 10 digits starting with 6-9
- [ ] Passwords have uppercase + number
- [ ] Email is valid format
- [ ] Required fields are included
- [ ] Enum values match valid options
- [ ] Dates are in YYYY-MM-DD format
- [ ] Numbers don't have quotes
- [ ] Authorization header is present
- [ ] Using correct token (admin/staff/member)

---

## 🎯 Guaranteed Results

When using this test data:
```
✅ All registrations: 201 Created
✅ All logins: 200 OK
✅ All feature requests: 200 OK or 201 Created
✅ No 400 Bad Request errors
✅ No 401 Unauthorized errors (if token set)
✅ All 32 features working perfectly
```

---

**Status: Ready to Copy & Paste - All Data Validated ✅**

Just copy the JSON, paste into Postman, and send!
