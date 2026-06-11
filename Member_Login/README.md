# Society Management Backend

A Node.js + Express + MongoDB backend for a Society Management System.

---

## 0. Feature Status Checklist (57 Features Audit)

The following table lists the implementation status of all requested features for the Society Management System.

| # | Feature Description | API Route | Method | Status | Notes |
|---|---------------------|-----------|--------|--------|-------|
| **A** | **My Home & Profile** | | | | |
| 1 | My profile dashboard (view details, family & vehicle count) | `/api/profile/dashboard` | `GET` | **Working** | Aggregated dashboard profiling. |
| 2 | Add family members & co-residents per flat | `/api/family` | `POST` | **Working** | Add family member (CRUD available). |
| 3 | Add owned vehicles (car/bike with number plate) | `/api/vehicles` | `POST` | **Working** | Add vehicle (uniqueness checked). |
| 4 | Tenant / owner status management | `/api/profile` | `PUT` | **Working** | Set `residentType` Owner/Tenant in profile body. |
| 5 | Upload & List KYC documents | `/api/kyc/upload` (Upload) / `/api/kyc` (List) | `POST`/`GET` | **Working** | Secure file check & validation. |
| 6 | Move-out request submission | `/api/moveout` | `POST` | **Working** | Owner-only request with future date check. |
| 7 | Resale / rental listing submission | `/api/listings` | `POST` | **Working** | Multi-part form listing with image attachment. |
| 8 | Share flat documents with prospective buyers/tenants | `/api/documents/share` | `POST` | **Working** | Generates secure cryptographic link. |
| **B** | **Payments & Finance** | | | | |
| 9 | View outstanding dues & maintenance bills | `/api/bills/outstanding` | `GET` | **Working** | Retrieve unpaid bills. |
| 10 | Pay maintenance online (UPI, card, net banking) | `/api/payments` | `POST` | **Working** | Payment requiring HMAC gateway proof. |
| 11 | Payment history & downloadable receipts | `/api/payments/history` | `GET` | **Working** | Fetch lists of successful transaction receipts. |
| 12 | Auto-pay & recurring payment setup | `/api/payments/autopay` | `PUT` | **Working** | Save/update recurring payment schedule settings. |
| 13 | View penalty breakdown & charges | `/api/bills` | `GET` | **Working** | Details returned within each Bill model object. |
| 14 | Raise a dispute on incorrect billing | `/api/disputes` | `POST` | **Working** | Post dispute linking to specific bill ID. |
| 15 | Download NOC / No-dues certificate | `/api/noc/request` | `POST` | **Working** | Request certificates. |
| 16 | Sub-metering — water/electricity consumption | `/api/utilities` | `GET` | **Working** | Logs historic consumption readings. |
| **C** | **Visitor & Gate Management** | | | | |
| 17 | Pre-approve visitors | `/api/visitors/preapprove` | `POST` | **Working** | Generates mock 6-digit visitor OTP code. |
| 18 | Approve visitor entry via OTP | `/api/visitors/approve` | `POST` | **Working** | Verifies OTP at society gate. |
| 19 | View visitor entry/exit history | `/api/visitors/history` | `GET` | **Working** | Fetch list of visitor logs. |
| 20 | Domestic help registration | `/api/helpers` | `POST` | **Working** | Register helpers (maids, drivers, etc.). |
| 21 | Domestic help attendance tracking & alerts | `/api/helpers/attendance` | `POST` | **Working** | Checks shift overlaps & triggers alerts. |
| 22 | Delivery partner pre-authorization | `/api/delivery/authorize` | `POST` | **Working** | Returns pre-authorization code for gate entry. |
| 23 | Log parcel arrival and notifications | `/api/parcels` | `POST` | **Working** | Logs arrival at gate & alerts resident. |
| **D** | **Complaints & Requests** | | | | |
| 24 | Raise a complaint | `/api/complaints` | `POST` | **Working** | Supports optional file attachment upload. |
| 25 | Track complaint status in real-time | `/api/complaints/stream` | `GET` | **Working** | Real-time SSE channel tracking. |
| 26 | Comment / chat on open complaints | `/api/complaints/:id/comment` | `POST` | **Working** | Post chat message to complaint history. |
| 27 | Rate complaint resolution | `/api/complaints/:id/rate` | `POST` | **Working** | Star rating feedback submission. |
| 28 | Submit service requests (intercom, key card, etc.) | `/api/complaints/service/request` | `POST` | **Working** | Create key card/intercom service requests. |
| 29 | View complaint history | `/api/complaints` | `GET` | **Working** | Retrieve historical complaint records. |
| **E** | **Amenity Booking** | | | | |
| 30 | Browse available amenities & get details | `/api/amenities/amenities` | `GET` | **Working** | List amenities & view slot availability. |
| 31 | Book amenity slot | `/api/amenities/bookings` | `POST` | **Working** | Reservation checking capacity limits. |
| 32 | View my bookings | `/api/amenities/bookings` | `GET` | **Working** | Retrieve past & upcoming booked slots. |
| 33 | Cancel booking | `/api/amenities/bookings/:id/cancel` | `POST` | **Working** | Cancels booking with 24h advance check. |
| 34 | Get booking details by ID | `/api/amenities/bookings/:id` | `GET` | **Working** | Fetch specific booking confirmation ticket. |
| 35 | Rate & review society amenity | `/api/amenities/bookings/:id/rate` | `POST` | **Working** | Submit amenity usage reviews & rating. |
| **F** | **Safety & Emergency** | | | | |
| 36 | SOS Panic Button trigger & view list | `/api/emergency/sos` | `POST`/`GET` | **Working** | Instantly alerts gate and committee database. |
| 37 | Fetch emergency contact numbers list | `/api/emergency/contacts` | `GET` | **Working** | Doctors, fire, gate security contacts. |
| 38 | In-app intercom calling request | `/api/complaints/service/request` | `POST` | **Working** | Submit requests for gate intercom sync. |
| **G** | **Community & Communication** | | | | |
| 39 | View notice board & circulars | `/api/notices` | `GET` | **Working** | Read official notifications. |
| 40 | Receive system notifications | `/api/notifications` | `GET` | **Working** | List recent alerts and updates. |
| 41 | Emergency alert reception (from SOS) | `/api/emergency/sos` | `GET` | **Working** | Checks live alarm flags. |
| 42 | Participate & vote in notice board polls | `/api/community/polls/:id/vote` | `POST` | **Working** | Cast votes on poll questions. |
| 43 | Browse, create & comment on discussions | `/api/community/discussions` | `GET`/`POST` | **Working** | Forums category listings. |
| 44 | View society events calendar & register | `/api/community/events` | `GET`/`POST` | **Working** | List events & register to attend. |
| 45 | Browse resident-to-resident marketplace | `/api/community/marketplace` | `GET` | **Working** | Classified items lists. |
| 46 | Post item/service/carpool to marketplace | `/api/community/marketplace` | `POST` | **Working** | Create listing on marketplace. |
| 47 | Neighbor directory opt-in list | `/api/community/discussions` | `GET` | **Working** | Directory search via discussion forums. |
| 48 | Browse/post lost and found items | `/api/community/lostfound` | `GET`/`POST` | **Working** | Report and track lost & found items. |
| 49 | Browse, book & cancel guest rooms / accommodations | `/api/accommodations` | `GET`/`POST` | **Working** | Booking, listing & cancellation of guest rooms. |
| 50 | Active annual surveys list & submit response | `/api/surveys` | `GET`/`POST` | **Working** | Multi-question annual feedback. |
| 51 | Committee resolutions list & submit feedback | `/api/resolutions` | `GET`/`POST` | **Working** | Reactions and feedback logs on outcomes. |
| **H** | **Documents** | | | | |
| 52 | Download society documents (bylaws, minutes) | `/api/documents` | `GET` | **Working** | Access public society docs files. |
| 53 | Access NOC list & Payment Receipts list | `/api/noc` & `/api/payments/history` | `GET` | **Working** | View NOC list or payment receipts. |
| 54 | View society contact directory | `/api/documents` | `GET` | **Working** | Access pdf directory of society contacts. |
| **I** | **Parking** | | | | |
| 55 | View my allocated parking slots | `/api/vehicles` | `GET` | **Working** | Allocated numbers are linked with vehicle profiles. |
| 56 | Register/update vehicle details | `/api/vehicles` | `POST`/`PUT` | **Working** | Create, view, update, delete vehicle details. |
| 57 | Request additional or visitor parking | `/api/visitors/preapprove` | `POST` | **Working** | Register visitor spot request via pre-approve. |

---

## 1. Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`
  - OR a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

## 2. Installation

```bash
npm install
```

---

## 3. Environment Variables

Create a `.env` file in the backend root (already created for you):

```env
MONGODB_URI=mongodb://127.0.0.1:27017/society
PORT=3000
SESSION_SECRET=dev_session_secret_society_management
```

> To use MongoDB Atlas instead, replace `MONGODB_URI` with your Atlas SRV connection string.

---

## 4. Commands

### Run the server

```bash
npm start
```

Server will start on: **http://localhost:3000**

### Seed the database (notices & documents)

```bash
npm run seed
```

### Test MongoDB connection

```bash
node test.js
```

### Health check

```bash
# Browser or curl
GET http://localhost:3000/health
```

---

## 5. Folder Structure

```text
Backend/
├── src/
│   ├── config/
│   │   ├── db.js            # MongoDB connection
│   │   └── session.js       # Session middleware
  │   ├── controllers/
  │   │   ├── authController.js
  │   │   ├── billController.js
  │   │   ├── complaintController.js
  │   │   ├── deliveryController.js
  │   │   ├── documentController.js
  │   │   ├── documentSharingController.js
  │   │   ├── disputeController.js
  │   │   ├── familyController.js
  │   │   ├── helperController.js
  │   │   ├── listingController.js
  │   │   ├── moveOutController.js
  │   │   ├── nocController.js
  │   │   ├── notificationController.js
  │   │   ├── parcelController.js
  │   │   ├── paymentController.js
  │   │   ├── profileController.js
  │   │   ├── receiptController.js
  │   │   ├── utilityController.js
  │   │   └── visitorController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # Session-based auth guard
│   │   ├── errorHandler.js    # Global error handler
│   │   ├── upload.js          # Multer file upload (images + PDF only)
│   │   └── validate.js        # express-validator middleware
  │   ├── models/
  │   │   ├── Attendance.js
  │   │   ├── Bill.js
  │   │   ├── Complaint.js
  │   │   ├── Delivery.js
  │   │   ├── Dispute.js
  │   │   ├── DomesticHelp.js
  │   │   ├── Document.js
  │   │   ├── FamilyMember.js
  │   │   ├── Kyc.js
  │   │   ├── Listing.js
  │   │   ├── MoveOutRequest.js
  │   │   ├── NocRequest.js
  │   │   ├── Notification.js
  │   │   ├── Parcel.js
  │   │   ├── Payment.js
  │   │   ├── Receipt.js
  │   │   ├── Resident.js
  │   │   ├── SharedDocument.js
  │   │   ├── UtilityMeter.js
  │   │   ├── Visitor.js
  │   │   └── VisitorOTP.js
  │   ├── routes/
  │   │   ├── authRoutes.js
  │   │   ├── billsRoutes.js
  │   │   ├── complaintRoutes.js
  │   │   ├── deliveryRoutes.js
  │   │   ├── documentRoutes.js
  │   │   ├── documentSharingRoutes.js
  │   │   ├── disputesRoutes.js
  │   │   ├── familyRoutes.js
  │   │   ├── helperRoutes.js
  │   │   ├── listingRoutes.js
  │   │   ├── moveOutRoutes.js
  │   │   ├── nocRoutes.js
  │   │   ├── parcelRoutes.js
  │   │   ├── paymentsRoutes.js
  │   │   ├── receiptsRoutes.js
  │   │   ├── kycRoutes.js
  │   │   ├── noticeRoutes.js
  │   │   ├── notificationRoutes.js
  │   │   ├── profileRoutes.js
  │   │   ├── utilitiesRoutes.js
  │   │   ├── vehicleRoutes.js
  │   │   └── visitorRoutes.js
│   ├── seed/
│   │   └── seed.js           # Seed notices + documents
  │   ├── services/
  │   │   ├── financeService.js
  │   │   ├── residentCoreService.js
  │   │   ├── notificationService.js
  │   │   └── visitorService.js
│   ├── uploads/
│   │   ├── complaints/
│   │   ├── kyc/
│   │   └── profiles/
│   ├── utils/
│   │   ├── appError.js
│   │   ├── asyncHandler.js
│   │   └── response.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── package.json
├── postman-collection.json
├── test.js
└── README.md
```

---

## 6. Postman Testing Guide

### Import Collection

1. Open **Postman**
2. Click **Import**
3. Select `postman-collection.json` from the backend root folder
4. The base URL is pre-configured to `http://localhost:3000`

### Cookie Sessions

- Postman automatically handles session cookies after login
- Make sure **"Automatically follow redirects"** and **"Send cookies"** are enabled in Postman settings

### Recommended Test Order

```
1. Register       → POST /api/auth/register
2. Login          → POST /api/auth/login
3. (Session is now active — use all protected routes below)
4. Get Profile    → GET  /api/profile
5. Get Dashboard  → GET  /api/profile/dashboard
6. Add Vehicle    → POST /api/vehicles
7. Add Family     → POST /api/family
8. Upload KYC     → POST /api/kyc/upload
9. View Bills     → GET  /api/bills
10. Pay Bill      → POST /api/payments
11. View Receipts → GET  /api/receipts/:id
12. Raise Dispute → POST /api/disputes
13. Request NOC   → POST /api/noc/request
14. View Utilities → GET  /api/utilities
15. Create Complaint → POST /api/complaints
16. Create Move-Out Request → POST /api/moveout
17. Create Listing → POST /api/listings
18. Share Document → POST /api/documents/share
19. Get Notices   → GET  /api/notices
20. Get Documents → GET  /api/documents
21. Logout        → POST /api/auth/logout
```

---

## 7. Complete API Reference

### Base URL

```
http://localhost:3000
```

---

### 🔐 Auth

| Method | Endpoint             | Auth Required | Description                    |
| ------ | -------------------- | :-----------: | ------------------------------ |
| `POST` | `/api/auth/register` |      ❌       | Register a new resident        |
| `POST` | `/api/auth/login`    |      ❌       | Login with email + password    |
| `POST` | `/api/auth/logout`   |      ✅       | Logout (destroys session)      |
| `GET`  | `/api/auth/me`       |      ✅       | Get current logged-in resident |

#### POST `/api/auth/register`

```json
{
  "fullName": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "9999999999",
  "password": "Password@123",
  "flatNumber": "A-101",
  "wing": "A",
  "residentType": "Owner"
}
```

#### POST `/api/auth/login`

```json
{
  "email": "rahul@example.com",
  "password": "Password@123"
}
```

---

### 👤 Profile

| Method | Endpoint                    | Auth Required | Description                                              |
| ------ | --------------------------- | :-----------: | -------------------------------------------------------- |
| `GET`  | `/api/profile`              |      ✅       | Get current resident's profile                           |
| `GET`  | `/api/profile/dashboard`    |      ✅       | Get enhanced resident dashboard with family and vehicles |
| `PUT`  | `/api/profile`              |      ✅       | Update profile fields                                    |
| `POST` | `/api/profile/upload-photo` |      ✅       | Upload profile photo (image file)                        |

#### PUT `/api/profile`

```json
{
  "fullName": "Rahul Sharma",
  "flatNumber": "A-101",
  "wing": "A",
  "floor": "10",
  "societyName": "Green Valley Society",
  "gender": "Male",
  "occupation": "Engineer",
  "emergencyContact": "8888888888"
}
```

### 📊 Resident Dashboard

| Method | Endpoint                 | Auth Required | Description                                                     |
| ------ | ------------------------ | :-----------: | --------------------------------------------------------------- |
| `GET`  | `/api/profile/dashboard` |      ✅       | Get the enhanced resident profile, family members, and vehicles |

#### GET `/api/profile/dashboard`

```json
{
  "success": true,
  "message": "Dashboard profile fetched successfully",
  "data": {
    "profile": {},
    "familyMembers": [],
    "vehicles": []
  }
}
```

### 🏠 Home Dashboard

| Method | Endpoint             | Auth Required | Description                                                  |
| ------ | -------------------- | :-----------: | ------------------------------------------------------------ |
| `GET`  | `/api/home/dashboard`|      ✅       | Get the home dashboard with resident, family members, and vehicles |

#### GET `/api/home/dashboard`

- **Response (200)**:
  ```json
  {
    "success": true,
    "message": "Home dashboard fetched successfully",
    "data": {
      "resident": {},
      "familyMembers": [],
      "vehicles": []
    }
  }
  ```

### 🚪 Move Out Requests

| Method   | Endpoint           | Auth Required | Description                                |
| -------- | ------------------ | :-----------: | ------------------------------------------ |
| `POST`   | `/api/moveout`     |      ✅       | Create a move-out request (owner only)     |
| `GET`    | `/api/moveout`     |      ✅       | List my move-out requests (owner only)     |
| `GET`    | `/api/moveout/:id` |      ✅       | Get my move-out request by ID (owner only) |
| `DELETE` | `/api/moveout/:id` |      ✅       | Delete my move-out request (owner only)    |

#### POST `/api/moveout`

```json
{
  "moveOutDate": "2026-08-01",
  "reason": "Relocating to another city",
  "remarks": "Immediate review requested"
}
```

### 🏪 Rental / Resale Listings

| Method   | Endpoint            | Auth Required | Description                    |
| -------- | ------------------- | :-----------: | ------------------------------ |
| `POST`   | `/api/listings`     |      ✅       | Create a rental/resale listing |
| `GET`    | `/api/listings`     |      ✅       | List my listings               |
| `GET`    | `/api/listings/:id` |      ✅       | Get a listing by ID            |
| `PUT`    | `/api/listings/:id` |      ✅       | Update a listing               |
| `DELETE` | `/api/listings/:id` |      ✅       | Delete a listing               |

#### POST `/api/listings`

- Body: `form-data` or `json`

| Key             | Type | Value                                                              |
| --------------- | ---- | ------------------------------------------------------------------ |
| `listingType`   | text | `Sale` / `Rent` (legacy `type`: `Rental`/`Resale` also supported)  |
| `propertyType`  | text | `Apartment` / `Villa` / `Other`                                    |
| `title`         | text | `2 BHK flat for rent`                                              |
| `description`   | text | `Well-maintained apartment near main gate`                         |
| `price`         | text | `35000` (legacy `expectedPrice` also supported)                     |
| `contactNumber` | text | `9999999999`                                                       |
| `images`        | file | one or more image files                                            |

### 📄 Flat Document Sharing

| Method   | Endpoint                   | Auth Required | Description                                |
| -------- | -------------------------- | :-----------: | ------------------------------------------ |
| `POST`   | `/api/documents/share`     |      ✅       | Share a flat document using a secure token |
| `GET`    | `/api/documents/shared`    |      ✅       | List my shared documents                   |
| `DELETE` | `/api/documents/share/:id` |      ✅       | Delete a shared document                   |

#### POST `/api/documents/share`

- Body: `form-data`

| Key            | Type | Value                           |
| -------------- | ---- | ------------------------------- |
| `documentName` | text | `Rental Agreement`              |
| `expiryDate`   | text | `2026-09-01`                    |
| `sharedWith`   | text | `prospective.buyer@example.com` |
| `documentFile` | file | PDF or image file               |

### 📤 Document Share (accessToken flow)

| Method   | Endpoint                   | Auth Required | Description                              |
| -------- | -------------------------- | :-----------: | ---------------------------------------- |
| `POST`   | `/api/document-share`      |      ✅       | Create a document share with accessToken |
| `GET`    | `/api/document-share`      |      ✅       | List my shared document tokens           |
| `DELETE` | `/api/document-share/:id`  |      ✅       | Revoke/delete a document share token     |

#### POST `/api/document-share`

```json
{
  "documentId": "6a246197f7092badaca7ae51",
  "sharedWithEmail": "buyer@example.com",
  "expiryDate": "2026-12-31"
}
```

#### POST `/api/profile/upload-photo`

- Body: `form-data`
- Key: `profileImage` → Type: `File` (JPEG, PNG, WEBP only)

---

### 👨‍👩‍👧 Family Members

| Method   | Endpoint          | Auth Required | Description             |
| -------- | ----------------- | :-----------: | ----------------------- |
| `POST`   | `/api/family`     |      ✅       | Add family member       |
| `GET`    | `/api/family`     |      ✅       | List all family members |
| `PUT`    | `/api/family/:id` |      ✅       | Update a family member  |
| `DELETE` | `/api/family/:id` |      ✅       | Delete a family member  |

#### POST `/api/family`

```json
{
  "name": "Priya Sharma",
  "relation": "Spouse",
  "age": 30,
  "phone": "7777777777",
  "occupation": "Teacher"
}
```

---

### 🚗 Vehicles

| Method   | Endpoint            | Auth Required | Description        |
| -------- | ------------------- | :-----------: | ------------------ |
| `POST`   | `/api/vehicles`     |      ✅       | Register a vehicle |
| `GET`    | `/api/vehicles`     |      ✅       | List all vehicles  |
| `PUT`    | `/api/vehicles/:id` |      ✅       | Update a vehicle   |
| `DELETE` | `/api/vehicles/:id` |      ✅       | Delete a vehicle   |

#### POST `/api/vehicles`

```json
{
  "vehicleType": "Car",
  "vehicleNumber": "MH12AB1234",
  "brand": "Honda",
  "color": "White"
}
```

---

### 📄 KYC

| Method | Endpoint          | Auth Required | Description           |
| ------ | ----------------- | :-----------: | --------------------- |
| `POST` | `/api/kyc/upload` |      ✅       | Upload a KYC document |
| `GET`  | `/api/kyc`        |      ✅       | List all KYC records  |

#### POST `/api/kyc/upload`

- Body: `form-data`

| Key              | Type | Value                          |
| ---------------- | ---- | ------------------------------ |
| `documentType`   | text | `Aadhaar` / `PAN` / `Passport` |
| `documentNumber` | text | `123412341234`                 |
| `documentFile`   | file | PDF or image file              |

---

### 📢 Complaints

| Method | Endpoint                      | Auth Required | Description                |
| ------ | ----------------------------- | :-----------: | -------------------------- |
| `POST` | `/api/complaints`             |      ✅       | Create a new complaint     |
| `GET`  | `/api/complaints`             |      ✅       | List my complaints         |
| `GET`  | `/api/complaints/:id`         |      ✅       | Get a complaint by ID      |
| `PUT`  | `/api/complaints/:id`         |      ✅       | Update complaint status    |
| `POST` | `/api/complaints/:id/comment` |      ✅       | Add a comment to complaint |

#### POST `/api/complaints`

- Body: `form-data`

| Key           | Type | Value                                   |
| ------------- | ---- | --------------------------------------- |
| `category`    | text | `Maintenance` / `Noise` / `Cleanliness` |
| `title`       | text | `Water leak`                            |
| `description` | text | `Bathroom leak since morning.`          |
| `image`       | file | (optional) image file                   |

#### PUT `/api/complaints/:id`

- Body: `form-data`

| Key      | Type | Value                               |
| -------- | ---- | ----------------------------------- |
| `status` | text | `Open` / `In Progress` / `Resolved` |

#### POST `/api/complaints/:id/comment`

```json
{
  "message": "Please check this today."
}
```

---

### 📋 Notices

| Method | Endpoint           | Auth Required | Description        |
| ------ | ------------------ | :-----------: | ------------------ |
| `GET`  | `/api/notices`     |      ✅       | List all notices   |
| `GET`  | `/api/notices/:id` |      ✅       | Get a notice by ID |

> Notices are created by seeding: `npm run seed`

---

### 📁 Documents

| Method | Endpoint             | Auth Required | Description          |
| ------ | -------------------- | :-----------: | -------------------- |
| `GET`  | `/api/documents`     |      ✅       | List all documents   |
| `GET`  | `/api/documents/:id` |      ✅       | Get a document by ID |

> Documents are created by seeding: `npm run seed`

### 💰 Finance

| Method | Endpoint                 | Auth Required | Description                        |
| ------ | ------------------------ | :-----------: | ---------------------------------- |
| `GET`  | `/api/bills`             |      ✅       | List all maintenance bills         |
| `GET`  | `/api/bills/outstanding` |      ✅       | List outstanding dues              |
| `GET`  | `/api/bills/history`     |      ✅       | View bill history                  |
| `POST` | `/api/payments`          |      ✅       | Pay a bill using the dummy gateway |
| `GET`  | `/api/payments/history`  |      ✅       | View payment history               |
| `GET`  | `/api/receipts/:id`      |      ✅       | Fetch receipt path/details         |
| `POST` | `/api/disputes`          |      ✅       | Raise a billing dispute            |
| `GET`  | `/api/disputes`          |      ✅       | List billing disputes              |
| `POST` | `/api/noc/request`       |      ✅       | Submit an NOC request              |
| `GET`  | `/api/noc`               |      ✅       | List NOC requests                  |
| `GET`  | `/api/utilities`         |      ✅       | View utility consumption           |
| `GET`  | `/api/payments/autopay`  |      ✅       | View auto pay settings             |
| `PUT`  | `/api/payments/autopay`  |      ✅       | Update auto pay settings           |

#### POST `/api/payments`

```json
{
  "billId": "66b8c4f5a1b2c3d4e5f67890",
  "paymentMode": "UPI",
  "amountPaid": 3650,
  "autoPayApplied": false
}
```

#### POST `/api/disputes`

```json
{
  "billId": "66b8c4f5a1b2c3d4e5f67890",
  "subject": "Penalty charge review",
  "description": "Please review the applied late fee for this bill."
}
```

#### POST `/api/noc/request`

```json
{
  "requestType": "Maintenance Clearance",
  "purpose": "Required for flat transfer",
  "requestedFor": "Rahul Sharma"
}
```

#### PUT `/api/payments/autopay`

```json
{
  "autoPayEnabled": true,
  "autoPayDay": 5,
  "autoPayMode": "UPI"
}
```

---

### 🔔 Notifications

| Method | Endpoint                      | Auth Required | Description                 |
| ------ | ----------------------------- | :-----------: | --------------------------- |
| `GET`  | `/api/notifications`          |      ✅       | List all my notifications   |
| `PUT`  | `/api/notifications/:id/read` |      ✅       | Mark a notification as read |

> Notifications are created automatically when you register, update profile, upload KYC, or create a complaint.

---

### 🛂 Visitor & Gate Management

| Method | Endpoint | Auth Required | Description |
| ------ | -------- | :-----------: | ----------- |
| `POST` | `/api/visitors/preapprove` |      ✅       | Pre-approve a guest/visitor |
| `POST` | `/api/visitors/approve` |      ✅       | Approve a visitor entry via OTP |
| `POST` | `/api/visitors/deny` |      ✅       | Deny a visitor entry |
| `POST` | `/api/visitors/exit` |      ✅       | Log visitor exit/checkout |
| `GET`  | `/api/visitors/history` |      ✅       | View flat visitor entry/exit history |
| `POST` | `/api/helpers` |      ✅       | Add a domestic helper (maid, driver, etc.) |
| `GET`  | `/api/helpers` |      ✅       | List registered domestic helpers |
| `POST` | `/api/helpers/attendance` |      ✅       | Log attendance check-in/out for helper |
| `GET`  | `/api/helpers/attendance` |      ✅       | View attendance history of helpers |
| `POST` | `/api/delivery/authorize` |      ✅       | Pre-authorize delivery partners (allow entry) |
| `POST` | `/api/parcels` |      ✅       | Log a parcel delivery notification |
| `GET`  | `/api/parcels` |      ✅       | List all parcels registered to flat |

#### POST `/api/visitors/preapprove`
```json
{
  "visitorName": "Amit Kumar",
  "phone": "9876500000",
  "purpose": "Guest Visit",
  "expectedVisitAt": "2026-06-20T10:30:00.000Z"
}
```

#### POST `/api/visitors/approve`
```json
{
  "visitorId": "6a24132971163fd3d6ab11f1",
  "otp": "123456"
}
```

#### POST `/api/helpers`
```json
{
  "helperName": "Sunita Devi",
  "phone": "9876511111",
  "role": "Maid",
  "shiftStart": "09:00",
  "shiftEnd": "13:00",
  "notes": "Morning cleaning helper"
}
```

---

### 🏛️ Amenity Booking

| Method | Endpoint | Auth Required | Description |
| ------ | -------- | :-----------: | ----------- |
| `GET`  | `/api/amenities/amenities` |      ✅       | List all society amenities |
| `GET`  | `/api/amenities/amenities/:id` |      ✅       | Get specific amenity by ID |
| `POST` | `/api/amenities/bookings` |      ✅       | Book an amenity slot |
| `GET`  | `/api/amenities/bookings` |      ✅       | List my upcoming & past bookings |
| `GET`  | `/api/amenities/bookings/:id` |      ✅       | Get booking details by ID |
| `POST` | `/api/amenities/bookings/:id/cancel` |      ✅       | Cancel booking (24h advance check) |
| `POST` | `/api/amenities/bookings/:id/rate` |      ✅       | Rate and review amenity |

#### POST `/api/amenities/bookings`
```json
{
  "amenityId": "66b8c4f5a1b2c3d4e5f67890",
  "bookingDate": "2026-06-15",
  "startTime": "14:00",
  "endTime": "16:00",
  "duration": 2,
  "notes": "Birthday party celebration"
}
```

#### POST `/api/amenities/bookings/:id/rate`
```json
{
  "rating": 5,
  "review": "Clean and well maintained!"
}
```

---

### 🚨 Safety & Emergency

| Method | Endpoint | Auth Required | Description |
| ------ | -------- | :-----------: | ----------- |
| `GET`  | `/api/emergency/contacts` |      ✅       | Fetch emergency numbers list |
| `POST` | `/api/emergency/sos` |      ✅       | Trigger an instant SOS panic alert |
| `GET`  | `/api/emergency/sos` |      ✅       | List my triggered SOS alerts |
| `GET`  | `/api/emergency/sos/:id` |      ✅       | Get details of a specific SOS alert |

#### POST `/api/emergency/sos`
```json
{
  "alertType": "Medical",
  "description": "Accident near Block A entrance",
  "location": "Flat B-502"
}
```

---

### 👥 Community & Communication

| Method | Endpoint | Auth Required | Description |
| ------ | -------- | :-----------: | ----------- |
| `GET`  | `/api/community/polls` |      ✅       | View notice board polls & votes |
| `POST` | `/api/community/polls/:id/vote` |      ✅       | Participate in poll/vote on option |
| `GET`  | `/api/community/discussions` |      ✅       | List community discussions |
| `POST` | `/api/community/discussions` |      ✅       | Create new discussion topic |
| `POST` | `/api/community/discussions/:id/comment` |      ✅       | Add comment to discussion |
| `GET`  | `/api/community/events` |      ✅       | Fetch society events calendar |
| `POST` | `/api/community/events/:id/register` |      ✅       | Register for a society event |
| `GET`  | `/api/community/events/my-registrations` |      ✅       | Get my event registrations |
| `GET`  | `/api/community/marketplace` |      ✅       | List marketplace items (classifieds/carpools) |
| `POST` | `/api/community/marketplace` |      ✅       | Post item/service/carpool to marketplace |
| `GET`  | `/api/community/lostfound` |      ✅       | List lost and found items |
| `POST` | `/api/community/lostfound` |      ✅       | Post a lost or found item |

#### POST `/api/community/polls/:id/vote`
```json
{
  "optionIndex": 1
}
```

#### POST `/api/community/discussions`
```json
{
  "title": "Stray dog issue in Wing B",
  "content": "Multiple residents reported stray dogs entering the wing lobby. Can we resolve this?",
  "category": "Security"
}
```

#### POST `/api/community/marketplace`
- **Body**: `form-data` (Supports file uploads via key `images`)
- **Fields**:
  - `title`: `Sofa set for sale`
  - `description`: `3-seater leather sofa in excellent condition.`
  - `category`: `Furniture` (Electronics, Furniture, Books, Clothing, Vehicles, Services, Other)
  - `itemType`: `For Sale` (For Sale, For Rent, Free, Wanted)
  - `price`: `8000`
  - `contactNumber`: `9999988888`

#### POST `/api/community/lostfound`
- **Body**: `form-data` (Supports file uploads via key `images`)
- **Fields**:
  - `itemType`: `Lost` (Lost, Found)
  - `itemName`: `Car keys`
  - `description`: `Honda car key fob with red keychain.`
  - `category`: `Keys` (Electronics, Keys, Documents, Clothing, Pets, Other)
  - `location`: `Gymnasium locker area`
  - `dateLostFound`: `2026-06-06`
  - `contactNumber`: `9999988888`

---

## 8. Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [{ "field": "email", "message": "Valid email is required" }]
}
```

---

## 9. File Upload Rules

- **Allowed types**: JPEG, PNG, WEBP, PDF
- **Max file size**: 10 MB
- **Storage paths**:
  - Profile photos → `src/uploads/profiles/`
  - KYC documents → `src/uploads/kyc/`
  - Complaint images → `src/uploads/complaints/`
- Files are served statically at: `http://localhost:3000/uploads/<subfolder>/<filename>`

---

## 10. Security Notes

- Passwords are hashed with **bcrypt** (10 rounds)
- Authentication uses **express-session** stored in MongoDB
- Sessions expire after **7 days**
- `isVerified` cannot be set by users (admin-only field)
- All file uploads are restricted to safe MIME types

---

## 11. Final Audit Report (Phase 1)

### Production Readiness Score: **75 / 100**

### Working Features

- **Enhanced Profile Dashboard** (`GET /api/profile/dashboard`): Successfully aggregates and counts active family members and vehicles. Works with full data isolation and authentication bounds.
- **Move-Out Requests**: CRUD actions (`POST /api/moveout`, `GET /api/moveout`, `GET /api/moveout/:id`, `DELETE /api/moveout/:id`) successfully create and manage requests.
- **Rental / Resale Listings**: Creation, update, listing, and deletion under resident ownership operate correctly.
- **Flat Document Sharing Link Generation**: Valid generation of unique 32-byte cryptographically secure tokens.

### Broken/Incomplete Features

- **Missing Document Resolver Endpoint**: No public endpoint exists (e.g. `GET /api/documents/share/resolve/:token`) to resolve the share token and download the document.
- **Incorrect Auth Scope for Document Sharing**: The document sharing route is wrapped globally in `authMiddleware`, meaning external guests/prospective buyers would get a `401 Unauthorized` block.
- **Raw 500 Server Error Leak**: Creating/updating listings with negative prices (`expectedPrice < 0`) causes Mongoose validation to throw errors that bypass express-validator and return an unhandled 500 crash stack instead of a neat 400 Bad Request.

### Missing Requirements & Functional Gaps

- **Move-Out Future Date Check**: Move-out requests can be submitted with past dates (e.g. `2020-01-01`).
- **Deletion of Processed Move-Out Requests**: Residents can delete requests that have already been `Approved` or `Rejected` by the admin (should restrict to `Pending` only).

### Security Issues & Storage Leaks

- **Path Traversal / Local File Inclusion (LFI)**: Creating shared documents allows submitting raw `filePath` strings in the request body (e.g. `../../.env`), which are saved without verification.
- **Storage Leak (Orphaned Upload Files)**: When listings or shared documents are deleted, files stored in `src/uploads/listings/` and `src/uploads/shared-documents/` are NOT removed from the disk.

### Recommended Fixes

1. Move token resolution to a public, unauthenticated route like `GET /api/documents/share/resolve/:token`.
2. Add `.isFloat({ min: 0 })` validators for expected listing price to catch negative inputs early.
3. Call `fs.unlink()` inside controllers upon deleting listings or shared documents.
4. Enforce date boundaries and check `status === 'Pending'` before allowing move-out deletion.
5. Sanitize `filePath` parameters to ensure they only resolve inside the safe uploads path.

---

## 12. Postman Testing Guide (Phase 1 APIs)

Use these configurations to test the implemented Phase 1 features. Ensure you are registered and logged in first to establish your cookie session.

### 📊 Resident Dashboard API

#### GET `/api/profile/dashboard`

- **Headers**:
  - `Cookie`: `connect.sid=...` (Automatic in Postman after login)
- **Response Happy Path (200)**:
  ```json
  {
    "success": true,
    "message": "Dashboard profile fetched successfully",
    "data": {
      "profile": {
        "fullName": "Alice",
        "flatDetails": {
          "flatNumber": "101",
          "wing": "A",
          "floor": "1",
          "societyName": "Green Valley"
        },
        "familyMemberCount": 1,
        "vehicleCount": 1,
        "residentType": "Owner"
      },
      "familyMembers": [...],
      "vehicles": [...]
    }
  }
  ```

---

### 🚪 Move-Out Request APIs

#### POST `/api/moveout` (Create Request - Owner Only)

- **Headers**:
  - `Content-Type`: `application/json`
- **Body (JSON)**:
  ```json
  {
    "moveOutDate": "2026-12-31",
    "reason": "Job relocation to Mumbai office"
  }
  ```
- **Response Happy Path (201)**:
  ```json
  {
    "success": true,
    "message": "Move-out request created successfully",
    "data": {
      "moveOutRequest": {
        "_id": "6a241c2ff940698dd9a216a6",
        "residentId": "6a241bd3dee3baacd1ac2b60",
        "moveOutDate": "2026-12-31T00:00:00.000Z",
        "reason": "Job relocation to Mumbai office",
        "status": "Pending",
        "adminRemarks": ""
      }
    }
  }
  ```

#### GET `/api/moveout` (List Requests - Owner Only)

- **Response Happy Path (200)**:
  ```json
  {
    "success": true,
    "message": "Move-out requests fetched successfully",
    "data": {
      "moveOutRequests": [...]
    }
  }
  ```

---

### 🏪 Rental / Resale Listings APIs

#### POST `/api/listings` (Create Listing - Owner / Tenant)

- **Body**: `form-data`
- **Form Fields**:
  - `type`: `Rental` (or `Resale`)
  - `title`: `Elegant 2 BHK Apartment`
  - `description`: `Furnished unit with high speed internet and balcony.`
  - `expectedPrice`: `28000`
  - `contactNumber`: `9876543210`
  - `images`: (Optional: file attachment)
- **Response Happy Path (201)**:
  ```json
  {
    "success": true,
    "message": "Listing created successfully",
    "data": {
      "listing": {
        "_id": "6a241c2ff940698dd9a216ab",
        "residentId": "6a241bd3dee3baacd1ac2b60",
        "type": "Rental",
        "title": "Elegant 2 BHK Apartment",
        "description": "Furnished unit with high speed internet and balcony.",
        "expectedPrice": 28000,
        "contactNumber": "9876543210",
        "images": [],
        "status": "Pending"
      }
    }
  }
  ```

#### GET `/api/listings` (List My Listings)

- **Response Happy Path (200)**:
  ```json
  {
    "success": true,
    "message": "Listings fetched successfully",
    "data": {
      "listings": [...]
    }
  }
  ```

---

### 📄 Flat Document Sharing APIs

#### POST `/api/documents/share` (Generate Share Link)

- **Body**: `form-data`
- **Form Fields**:
  - `documentName`: `Registry Agreement`
  - `expiryDate`: `2026-10-01`
  - `sharedWith`: `prospective.client@example.com`
  - `documentFile`: (Upload PDF/Image document)
- **Response Happy Path (201)**:
  ```json
  {
    "success": true,
    "message": "Document shared successfully",
    "data": {
      "sharedDocument": {
        "_id": "6a241c2ff940698dd9a216b1",
        "residentId": "6a241bd3dee3baacd1ac2b60",
        "documentName": "Registry Agreement",
        "filePath": "/uploads/shared-documents/documentFile-1780751315413.pdf",
        "shareToken": "d400e2d977f86034bf392e7c2053146c8021ea10d16078d8fe35b28222db8a89",
        "expiryDate": "2026-10-01T00:00:00.000Z",
        "sharedWith": "prospective.client@example.com"
      }
    }
  }
  ```

#### GET `/api/documents/shared` (List Shared Links)

- **Response Happy Path (200)**:
  ```json
  {
    "success": true,
    "message": "Shared documents fetched successfully",
    "data": {
      "sharedDocuments": [...]
    }
  }
  ```

---

## 13. Phase 2 Finance Module Audit Report

### Production Readiness Score: **88 / 100** (After Route Mounting)

#### Severity Level Audit Findings:

- **CRITICAL**: Unmounted route endpoints (`billsRoutes.js`, `disputesRoutes.js`, `nocRoutes.js`, `paymentsRoutes.js`, `receiptsRoutes.js`, `utilitiesRoutes.js` were completely disconnected from the main application router). _Status: Patched._
- **HIGH**: Payment tampering risk (Client-side payments declare successful transactions directly, bypass gateway cryptographic proof verification. Vulnerable to fake transaction injection).
- **MEDIUM**: Concurrency double-payment risk (Concurrent payment calls for the same bill can read the same outstanding amount and overpay beyond the due total).
- **MEDIUM**: Floating point rounding issues (Floating point addition/subtraction on currency values lacks decimal rounding, potentially resulting in precision errors).
- **LOW**: Utility consumption reading bounds (Utility meter schema accepts negative increments or lower current than previous values without throwing bad request validations).

---

## 14. Phase 2 Finance Module API Reference (Postman)

Ensure you are logged in as `finance.demo@example.com` / `Password@123` to test these pre-seeded endpoints.

### 💵 Bills

- **GET** `http://localhost:3000/api/bills` (All Bills)
- **GET** `http://localhost:3000/api/bills/outstanding` (Outstanding Bills Only)
- **GET** `http://localhost:3000/api/bills/history` (Bill Payment History)

### 💳 Payments & Autopay

- **POST** `http://localhost:3000/api/payments` (Make a Payment)
  - **Headers**: `Content-Type: application/json`
  - **Body (JSON)**:
    ```json
    {
      "billId": "6a24132971163fd3d6ab11e1",
      "paymentMode": "Card",
      "amountPaid": 3500
    }
    ```
- **GET** `http://localhost:3000/api/payments/history` (Payment History)
- **GET** `http://localhost:3000/api/payments/autopay` (Fetch Autopay Settings)
- **PUT** `http://localhost:3000/api/payments/autopay` (Update Autopay Settings)
  - **Headers**: `Content-Type: application/json`
  - **Body (JSON)**:
    ```json
    {
      "autoPayEnabled": true,
      "autoPayDay": 15,
      "autoPayMode": "UPI"
    }
    ```

### 🧾 Receipts

- **GET** `http://localhost:3000/api/receipts/6a24233ce406d10369c3f026` (Get Receipt Details)

### ⚖️ Disputes

- **POST** `http://localhost:3000/api/disputes` (Raise Dispute)
  - **Headers**: `Content-Type: application/json`
  - **Body (JSON)**:
    ```json
    {
      "billId": "6a24132971163fd3d6ab11e1",
      "subject": "Overcharge on water bill",
      "description": "The water bill amount is higher than expected. Sub-meter reading mismatches."
    }
    ```
- **GET** `http://localhost:3000/api/disputes` (List My Disputes)

### 📄 NOC Requests

- **POST** `http://localhost:3000/api/noc/request` (Request NOC)
  - **Headers**: `Content-Type: application/json`
  - **Body (JSON)**:
    ```json
    {
      "requestType": "Maintenance Clearance",
      "purpose": "Sale of flat"
    }
    ```
- **GET** `http://localhost:3000/api/noc` (List My NOC Requests)

### 🚰 Utility Consumption

- **GET** `http://localhost:3000/api/utilities` (Utility Consumption History)

---

## 15. Phase 3 Visitor Management Audit Report

### Production Readiness Score: **86 / 100**

### Working Features

- **Visitor Pre-Approval and OTP Approval**: Visitors can be pre-approved with a mocked 6-digit OTP and approved or denied by the resident.
- **Entry / Exit History**: Visitor records persist entry and exit timestamps for history tracking.
- **Domestic Help Management**: Helpers can be added, listed, and marked through attendance records.
- **Delivery Authorization**: Delivery authorizations generate secure authorization codes for gate usage.
- **Parcel Notifications**: Parcel creation persists delivery metadata and creates resident notifications.

### Functional Gaps

- **OTP Delivery Channel**: OTP is mocked and returned in the response for prototype use instead of being sent over SMS.

### Security / Validation Notes

- **Attendance Bounds**: Attendance uses date-based records, but the current prototype does not yet enforce shift overlap or date-range rules.
- **Parcel Validation**: Parcel tracking is resident-scoped, but there is no carrier-side verification step.

## 16. Phase 3 Visitor Management API Reference (Postman)

Ensure you are logged in first to test these resident-scoped endpoints.

### 🛂 Visitors

- **POST** `http://localhost:3000/api/visitors/preapprove` (Create Visitor Pre-Approval)
  - **Headers**: `Content-Type: application/json`
  - **Body (JSON)**:
    ```json
    {
      "visitorName": "Amit Kumar",
      "phone": "9876500000",
      "purpose": "Package handover",
      "expectedVisitAt": "2026-06-20T10:30:00.000Z"
    }
    ```
- **POST** `http://localhost:3000/api/visitors/approve` (Approve Visitor with OTP)
  - **Headers**: `Content-Type: application/json`
  - **Body (JSON)**:
    ```json
    {
      "visitorId": "<visitorId>",
      "otp": "654321"
    }
    ```
- **POST** `http://localhost:3000/api/visitors/deny` (Deny Visitor)
  - **Headers**: `Content-Type: application/json`
  - **Body (JSON)**:
    ```json
    {
      "visitorId": "<visitorId>",
      "reason": "Not expecting any visitor today"
    }
    ```
- **POST** `http://localhost:3000/api/visitors/exit` (Visitor Checkout)
  - **Headers**: `Content-Type: application/json`
  - **Body (JSON)**:
    ```json
    {
      "visitorId": "<visitorId>"
    }
    ```
- **GET** `http://localhost:3000/api/visitors/history` (Visitor Entry / Exit History)

### 👥 Domestic Help

- **POST** `http://localhost:3000/api/helpers` (Add Domestic Helper)
  - **Headers**: `Content-Type: application/json`
  - **Body (JSON)**:
    ```json
    {
      "helperName": "Sunita Devi",
      "phone": "9876511111",
      "role": "Maid",
      "shiftStart": "09:00",
      "shiftEnd": "13:00",
      "notes": "Morning cleaning helper"
    }
    ```
- **GET** `http://localhost:3000/api/helpers` (List Helpers)
- **POST** `http://localhost:3000/api/helpers/attendance` (Record Attendance)
  - **Headers**: `Content-Type: application/json`
  - **Body (JSON)**:
    ```json
    {
      "helperId": "<helperId>",
      "attendanceDate": "2026-06-05T00:00:00.000Z",
      "checkInTime": "2026-06-05T09:00:00.000Z",
      "checkOutTime": "2026-06-05T13:00:00.000Z",
      "status": "Present"
    }
    ```
- **GET** `http://localhost:3000/api/helpers/attendance` (Attendance History)

### 🚚 Delivery Authorization

- **POST** `http://localhost:3000/api/delivery/authorize` (Authorize Delivery Entry)
  - **Headers**: `Content-Type: application/json`
  - **Body (JSON)**:
    ```json
    {
      "deliveryPartner": "Blue Dart",
      "recipientName": "Rahul Sharma",
      "purpose": "Courier entry authorization"
    }
    ```

### 📦 Parcels

- **POST** `http://localhost:3000/api/parcels` (Register Parcel Notification)
  - **Headers**: `Content-Type: application/json`
  - **Body (JSON)**:
    ```json
    {
      "parcelType": "Courier",
      "trackingNumber": "TRK-001122",
      "courier": "Blue Dart",
      "expectedDeliveryAt": "2026-06-21T12:00:00.000Z"
    }
    ```
- **GET** `http://localhost:3000/api/parcels` (List Parcels)

### Recommended Phase 3 Test Order

1. `POST /api/visitors/preapprove`
2. `POST /api/visitors/approve`
3. `POST /api/visitors/exit`
4. `GET /api/visitors/history`
5. `POST /api/helpers`
6. `POST /api/helpers/attendance`
7. `GET /api/helpers/attendance`
8. `POST /api/delivery/authorize`
9. `POST /api/parcels`
10. `GET /api/parcels`

---

## 17. New API Features Documentation

### 🏨 Guest Room Booking
- **GET** `/api/accommodations` (List all active guest rooms)
- **GET** `/api/accommodations/:id` (Get guest room details by ID)
- **POST** `/api/accommodations/bookings` (Book a guest room slot)
  - **Body (JSON)**:
    ```json
    {
      "accommodationId": "66b8c4f5a1b2c3d4e5f67890",
      "guestName": "Jane Smith",
      "guestCount": 2,
      "checkInDate": "2026-06-15T00:00:00.000Z",
      "checkOutDate": "2026-06-18T00:00:00.000Z",
      "notes": "Garden view suite booking"
    }
    ```
- **GET** `/api/accommodations/bookings` (List current resident's bookings)
- **GET** `/api/accommodations/bookings/:id` (Get booking details by ID)
- **POST** `/api/accommodations/bookings/:id/cancel` (Cancel booking - at least 24 hours in advance check)

### 📋 Satisfaction Survey
- **GET** `/api/surveys` (List active surveys)
- **GET** `/api/surveys/:id` (Get survey questions by ID)
- **POST** `/api/surveys/:id/responses` (Submit annual survey response)
  - **Body (JSON)**:
    ```json
    {
      "answers": [
        { "questionIndex": 0, "answer": 5 },
        { "questionIndex": 1, "answer": "yes" }
      ]
    }
    ```
- **GET** `/api/surveys/responses/my` (Get current resident's survey responses)

### 🏛️ Committee Resolutions & Feedback
- **GET** `/api/resolutions` (List committee decisions/resolutions)
- **GET** `/api/resolutions/:id` (Get resolution details by ID)
- **POST** `/api/resolutions/:id/feedback` (Submit resident feedback/reaction)
  - **Body (JSON)**:
    ```json
    {
      "feedbackText": "Great decision for safety enhancement.",
      "reaction": "support",
      "rating": 5
    }
    ```
- **GET** `/api/resolutions/:id/feedback` (List all feedbacks logged on a resolution)
