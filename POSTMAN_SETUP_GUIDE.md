# Postman Collection Setup Guide - Society Management API

**Generated:** 2026-06-07  
**Status:** ✅ Ready to use  
**All 32 Features:** Complete API endpoints included

---

## 📥 **QUICK START (3 STEPS)**

### Step 1: Import Collection
1. Open **Postman**
2. Click **Import** (top left)
3. Select `Society_Management_API_Complete.postman_collection.json`
4. Click **Import**

### Step 2: Import Environment
1. In Postman, click **Environments** (left sidebar)
2. Click **Import**
3. Select `Society_Management_Environment.postman_environment.json`
4. Click **Import**

### Step 3: Select Environment
1. Top right corner, select environment dropdown
2. Choose **"Society Management - Development"**
3. You're ready to test!

---

## ✅ **HOW TO TEST WITHOUT ERRORS**

### **STEP 1: Run Setup Requests (In Order)**

Before testing any features, run these requests in this exact order:

```
1️⃣ SETUP & AUTHENTICATION
  ├─ Health Check (GET) ✅
  ├─ Register Admin User (POST)
  ├─ Register Staff User (POST)
  ├─ Register Member User (POST)
  ├─ Login Admin (POST)
  ├─ Login Staff (POST) ⭐ Set as {{staffToken}}
  └─ Login Member (POST)
```

**Result:** Tokens are automatically saved to environment variables

### **STEP 2: Test Features**

Each feature folder is ready to use:

```
2️⃣ GATE & VISITOR MANAGEMENT (Features 1-12)
3️⃣ RESIDENT & VEHICLE TRACKING (Features 13-16)
4️⃣ COMPLAINTS & TASKS (Features 17-20)
5️⃣ SAFETY & PATROLLING (Features 21-24)
6️⃣ ATTENDANCE & SHIFTS (Features 25-28)
7️⃣ COMMUNICATION (Features 29-32)
```

### **STEP 3: Run Collection (Runner)**

Use Postman Runner for batch testing:

1. Click **Runner** (top left)
2. Select collection: **Society Management System**
3. Select environment: **Society Management - Development**
4. Click **Run** → All requests execute in sequence

---

## 📋 **WHAT'S IN THE COLLECTION**

### **Authentication (Setup Phase)**
```
✅ Health Check - Verify server running
✅ Register 3 users - Admin, Staff, Member
✅ Login all users - Get tokens for testing
```

### **All 32 Features Organized**

| Category | Features | Count |
|----------|----------|-------|
| Gate & Visitor | 1-12 | 24 endpoints |
| Resident & Vehicle | 13-16 | 5 endpoints |
| Complaints & Tasks | 17-20 | 6 endpoints |
| Safety & Patrolling | 21-24 | 6 endpoints |
| Attendance & Shifts | 25-28 | 8 endpoints |
| Communication | 29-32 | 12 endpoints |

**Total:** 61 pre-configured requests

---

## 🔑 **ENVIRONMENT VARIABLES (Auto-Saved)**

After running setup requests, these variables are automatically populated:

```
{{baseUrl}}          → http://localhost:4000
{{adminToken}}       → Admin's JWT token
{{staffToken}}       → Staff's JWT token
{{memberToken}}      → Member's JWT token
{{authToken}}        → Default auth token
{{visitorId}}        → Last created visitor ID
{{complaintId}}      → Last created complaint ID
{{patrolId}}         → Last patrol ID
... (22 more)
```

All requests use these variables automatically!

---

## 🚀 **TESTING WORKFLOW**

### **Option 1: Manual Testing (Step by Step)**

1. Open folder **"1️⃣ SETUP & AUTHENTICATION"**
2. Click first request: **Health Check**
3. Click **Send** → See response ✅
4. Repeat for each request in order
5. Move to next feature folder

### **Option 2: Batch Testing (Runner)**

1. Click **Runner** icon
2. Select collection
3. Click **Run** → All tests execute
4. View results summary

### **Option 3: Automated Testing (with Tests)**

Each request has pre-configured tests that:
- Verify response status codes
- Extract IDs and tokens
- Save to environment variables
- Chain requests together

---

## 🔐 **AUTHENTICATION EXPLAINED**

### **How Tokens Work**

Each request automatically includes:
```
Authorization: Bearer {{staffToken}}
```

### **Token Flow**

```
1. Register User (POST /api/auth/register)
   ↓
2. Login (POST /api/auth/login)
   ↓
3. Receive token in response
   ↓
4. Token saved to {{staffToken}}
   ↓
5. All subsequent requests use this token
```

### **Different User Tokens**

```
Admin operations:    Use {{adminToken}}
Staff operations:    Use {{staffToken}}
Member operations:   Use {{memberToken}}
```

Each request specifies which token to use!

---

## 📊 **FEATURE-BY-FEATURE TESTING**

### **Example: Test Visitor Feature**

1. **Go to:** 2️⃣ GATE & VISITOR MANAGEMENT
2. **Open:** Feature #1 - Create Visitor Entry
3. **Check body:** Pre-filled with test data
4. **Click Send:** ✅ Visitor created
5. **Next:** Feature #1 - List Visitors
6. **See:** Your new visitor in the list

### **Pre-Filled Test Data**

All requests come with realistic test data:

```json
{
  "name": "John Visitor",
  "phone": "9999999999",
  "flatToVisit": "101",
  "vehicleNumber": "MH01AB1234"
}
```

You can modify values before sending!

---

## 🛠️ **COMMON POSTMAN TIPS**

### **Tip 1: View Saved Variables**

```
Click 🔓 icon (top right) → Environment quick look
See all variables and their values
```

### **Tip 2: Search Collections**

```
Ctrl+K (Windows) / Cmd+K (Mac)
Type feature name → Jump to it
```

### **Tip 3: View Request History**

```
Left sidebar → History tab
See all previous requests
Re-run any past request
```

### **Tip 4: Pretty-Print Responses**

```
In response area, click "Pretty"
Formatted JSON for easy reading
```

### **Tip 5: Copy as cURL**

```
Right-click request → Code
Select cURL and copy
Paste in terminal for testing
```

---

## ❌ **TROUBLESHOOTING**

### **Error: "Token not found"**

```
Solution:
1. Run login requests first
2. Verify environment is selected (top right)
3. Check token is visible in {{staffToken}}
```

### **Error: "User exists"**

```
Solution:
1. Phone number already registered
2. Use different phone number
3. Or clear database and restart
```

### **Error: "Not found (404)"**

```
Solution:
1. Create resource first (e.g., create visitor before exit)
2. Check {{visitorId}} has a value
3. Test in correct order
```

### **Error: "Unauthorized (401)"**

```
Solution:
1. Run login requests to get token
2. Select correct environment
3. Verify Authorization header is present
```

### **Error: "Validation failed (400)"**

```
Solution:
1. Check request body for required fields
2. Verify data types (phone should be 10 digits)
3. See error message for specific field
```

---

## 📈 **TESTING ALL 32 FEATURES**

### **Full Test Sequence (Takes ~15 min)**

```
Phase 1: Setup (2 min)
  → Register users
  → Login and get tokens

Phase 2: Visitors (3 min)
  → Create, list, exit visitors
  → Generate QR codes
  → Check overstay

Phase 3: Deliveries & Packages (2 min)
  → Record deliveries
  → Log packages
  → Handover tracking

Phase 4: Vehicles (2 min)
  → Register vehicles
  → Verify stickers
  → Track guests

Phase 5: Complaints & Tasks (2 min)
  → File complaints
  → Update status
  → View tasks

Phase 6: Safety & Patrolling (2 min)
  → Start patrol
  → Add checkpoints
  → Report incidents
  → Trigger SOS

Phase 7: Attendance & Shifts (2 min)
  → Check-in/out
  → View shifts
  → Apply leave

Phase 8: Communication (1 min)
  → Send messages
  → Create notices
  → Get alerts
```

---

## ✨ **POSTMAN FEATURES USED**

### **Pre-request Scripts**
- Automatically set timestamps
- Calculate dates for filters
- Prepare request data

### **Test Scripts**
- Validate response codes
- Extract IDs from responses
- Save to environment
- Create assertions

### **Collections**
- Organized into 7 feature categories
- 61 pre-configured requests
- Ready-to-use test data
- Proper auth headers

### **Environment Variables**
- 22 variables for state management
- Auto-populated from responses
- Shared across all requests
- Reusable in chains

---

## 🔄 **REQUEST CHAINING EXAMPLE**

**How it works:**

```
Request 1: Create Visitor
  ↓ Response has _id
  ↓ Test extracts _id
  ↓ Saves as {{visitorId}}
  ↓
Request 2: Get Visitor
  Uses: /visitor/{{visitorId}}
  ↓ Automatically uses saved ID
  ↓ No manual ID copying needed!
```

---

## 📚 **DOCUMENTATION**

For more info, see:
- **README.md** - Project overview
- **API_DOCUMENTATION.md** - All endpoints explained
- **TEST_REPORT.md** - Complete feature status
- **SETUP_GUIDE.md** - Installation guide

---

## 🎯 **SUCCESS INDICATORS**

You're testing correctly when:

✅ Health check returns 200  
✅ Register requests return 201  
✅ Login returns 200 with token  
✅ Tokens appear in environment  
✅ Feature requests return 2xx status  
✅ Error messages are descriptive  
✅ IDs are saved and reused  

---

## 📞 **QUICK REFERENCE**

| Task | Steps |
|------|-------|
| Import Collection | Click Import → Select JSON file |
| Import Environment | Click Environments → Import → Select JSON |
| Run Setup | Execute requests in order |
| Test Feature | Open folder → Send requests |
| View Results | Check response tab → Click Pretty |
| See Variables | Click 🔓 icon top right |
| Run All | Click Runner → Click Run |

---

## 🚀 **YOU'RE ALL SET!**

1. ✅ Postman collection imported
2. ✅ Environment configured
3. ✅ All 32 features ready to test
4. ✅ No manual token management
5. ✅ No error expected (if following guide)

**Start Testing:**
- Run "1️⃣ SETUP & AUTHENTICATION" first
- Then test any feature folder
- Use Runner for batch testing

---

**Happy Testing! 🎉**

*All 32 features are ready in your Postman collection*
