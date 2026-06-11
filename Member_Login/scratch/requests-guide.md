# Postman API Testing Reference (IDs 36 - 57)

## [ID-36] SOS / Panic Button Activation

- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/emergency/sos`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:**
```json
{
  "alertType": "Medical",
  "description": "Elderly resident requires medical support."
}
```

---

## [ID-36] List triggered SOS Alerts

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/emergency/sos`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-37] Emergency Contact List

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/emergency/contacts`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-38] In-app Intercom Calling request

- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/complaints/service/request`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:**
```json
category: "Intercom"
title: "Gate 1 dialing link setup"
description: "Dialing security sync configuration request."
```

---

## [ID-39] View Notice Board

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/notices`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-39] Get Specific Notice by ID

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/notices/{{noticeId}}`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-40] Receive Push & SMS Notifications list

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/notifications`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-40] Mark Notification as Read

- **Method:** `PUT`
- **URL:** `{{baseUrl}}/api/notifications/{{notificationId}}/read`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-41] Emergency Alert Reception list

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/emergency/sos`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-42] List Notice Board Polls

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/community/polls`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-42] Participate in Polls (Vote)

- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/community/polls/{{pollId}}/vote`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:**
```json
{
  "optionIndex": 1
}
```

---

## [ID-43] Community discussion board forum list

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/community/discussions`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-43] Create Discussion Board Thread

- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/community/discussions`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:**
```json
{
  "title": "Water timings shift",
  "content": "Can we request shifting supply to 7:00 AM instead of 6:00 AM?",
  "category": "Maintenance"
}
```

---

## [ID-43] Comment on Discussion Thread

- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/community/discussions/{{discussionId}}/comment`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:**
```json
{
  "message": "I strongly agree with this suggestion."
}
```

---

## [ID-44] Society Events Calendar

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/community/events`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-44] Register for Society Event

- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/community/events/{{eventId}}/register`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-44] View My Event Registrations

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/community/events/my-registrations`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-45] Resident-to-resident marketplace

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/community/marketplace`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-45] Post item to Marketplace

- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/community/marketplace`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:**
```json
title: "Selling leather sofa"
description: "3-seater sofa in mint condition"
category: "Furniture"
itemType: "For Sale"
price: "8000"
contactNumber: "9999988888"
```

---

## [ID-46] Post Carpool Offer (Marketplace Service)

- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/community/marketplace`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:**
```json
title: "Carpool to IT Park daily"
description: "Leaving daily at 8:30 AM. 3 slots."
category: "Services"
itemType: "Free"
contactNumber: "9999988888"
```

---

## [ID-47] Neighbor directory opt-in list

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/community/discussions`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-48] Browse Lost & Found

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/community/lostfound`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-48] Post Lost/Found Item

- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/community/lostfound`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:**
```json
itemType: "Lost"
itemName: "Honda Car Keys"
description: "Red tag keychain keys"
category: "Keys"
location: "Gym locker room"
dateLostFound: "2026-06-06"
contactNumber: "9999988888"
```

---

## [ID-49] Browse Accommodations / Guest Rooms

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/accommodations`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-49] Book Guest Room

- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/accommodations/bookings`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:**
```json
{
  "accommodationId": "{{accommodationId}}",
  "guestName": "Uncle Sharma",
  "guestCount": 2,
  "checkInDate": "2026-07-01T12:00:00.000Z",
  "checkOutDate": "2026-07-05T10:00:00.000Z",
  "notes": "Ground floor suite preferred"
}
```

---

## [ID-49] List my Guest Room Bookings

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/accommodations/bookings`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-49] Cancel Guest Room Booking

- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/accommodations/bookings/{{accommodationBookingId}}/cancel`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-50] Get Active Feedback Surveys

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/surveys`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-50] Submit annual feedback satisfaction survey response

- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/surveys/{{surveyId}}/responses`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:**
```json
{
  "answers": [
    {
      "questionIndex": 0,
      "answer": 5
    },
    {
      "questionIndex": 1,
      "answer": 4
    },
    {
      "questionIndex": 2,
      "answer": "yes"
    }
  ]
}
```

---

## [ID-50] View My Survey Responses

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/surveys/responses/my`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-51] View Committee Resolutions/Decisions

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/resolutions`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-51] Submit feedback on committee resolution

- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/resolutions/{{resolutionId}}/feedback`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:**
```json
{
  "feedbackText": "Fully support the green color scheme.",
  "reaction": "support",
  "rating": 5
}
```

---

## [ID-51] List Feedback on Committee Resolution

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/resolutions/{{resolutionId}}/feedback`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-52] Download Society bylaws, rules, minutes documents

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/documents`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-53] Access my personal documents - NOC certificate list

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/noc`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-53] Access my personal documents - Receipts list

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/payments/history`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-54] View society contact directory

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/documents`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-55] View my allocated parking slots

- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/vehicles`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:** None (GET request or empty POST)

---

## [ID-56] Register/Update Vehicle details

- **Method:** `PUT`
- **URL:** `{{baseUrl}}/api/vehicles/{{vehicleId}}`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:**
```json
{
  "color": "Silver"
}
```

---

## [ID-57] Request Additional or Visitor Parking

- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/visitors/preapprove`
- **Headers:**
  - `Content-Type: application/json` (if sending a JSON body)
  - Cookie authentication is handled automatically by your active session cookie in Postman after logging in.

**Request Body:**
```json
{
  "visitorName": "Guest Parking",
  "phone": "9876543210",
  "purpose": "Request temporary slot for vehicle MH12AB1234",
  "expectedVisitAt": "2026-06-20T10:30:00.000Z"
}
```

---

