# Society Management System - Setup & Testing Guide

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**All 32 Features:** 100% Complete

---

## Quick Start

### 1. Prerequisites
- Node.js v14+ 
- MongoDB (local or cloud)
- Git

### 2. Installation

```bash
# Clone repository
git clone <repository_url>
cd society-management/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### 3. Configure Environment Variables

Create `.env` file:

```
# Database
MONGO_URI=mongodb://localhost:27017/society

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Server
PORT=4000
NODE_ENV=development

# Optional: SMS/OTP
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE=+1234567890

# Optional: File Storage
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=society-management-bucket
```

### 4. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Expected output:
```
✅ Server running on http://localhost:4000
```

### 5. Test API Connection

```bash
curl http://localhost:4000/health
# Response: { "message": "Server is running", "timestamp": "..." }
```

---

## API Testing with Postman

### 1. Import API Collection

1. Open Postman
2. Click **Import** → Select `postman_collection.json`
3. Import environment: Select `postman_environment.json`

### 2. Authentication Flow

**Step 1: Register as Admin**
```
POST http://localhost:4000/api/auth/register

{
  "name": "Admin User",
  "phone": "9999999999",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin",
  "flat": "A-100"
}
```

**Step 2: Login**
```
POST http://localhost:4000/api/auth/login

{
  "phone": "9999999999",
  "password": "admin123"
}
```

Copy the returned `token` and add to Postman:
- Go to **Collections** → **Edit** → **Authorization**
- Select **Bearer Token**
- Paste the token

---

## Sample Test Data

### Create Test Users

```bash
# Staff Member
POST /api/auth/register
{
  "name": "Rajesh Kumar",
  "phone": "9876543210",
  "email": "rajesh@example.com",
  "password": "staff123",
  "role": "staff"
}

# Member/Resident
POST /api/auth/register
{
  "name": "Priya Singh",
  "phone": "9876543211",
  "email": "priya@example.com",
  "password": "member123",
  "role": "member",
  "flat": "A-101"
}
```

### Create Test Visitor

```bash
POST /api/visitor
{
  "name": "Guest Person",
  "phone": "9999999990",
  "flatToVisit": "A-101",
  "vehicleNumber": "DL01AB1234",
  "purpose": "Meeting"
}
```

### Create Test Complaint

```bash
POST /api/complaint
Headers: Authorization: Bearer <token>
{
  "title": "Water leak",
  "description": "Water leaking from ceiling",
  "category": "maintenance",
  "severity": "high",
  "flat": "A-101",
  "dueDate": "2026-06-15"
}
```

---

## Database Setup

### MongoDB Local Setup

```bash
# Install MongoDB Community Edition
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install mongodb
# Windows: Download from mongodb.com

# Start MongoDB service
mongod

# In another terminal, connect to database
mongo

# Create database
use society

# View collections
show collections
```

### MongoDB Cloud (Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Add to `.env`:
   ```
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/society
   ```

---

## Feature Testing Checklist

### ✅ Gate & Visitor Management (Features 1-12)

- [ ] Record visitor entry
- [ ] Record visitor exit  
- [ ] Send OTP to resident
- [ ] Verify OTP approval
- [ ] Check pre-approved visitors
- [ ] Generate QR code
- [ ] Record delivery entry/exit
- [ ] Record package receipt
- [ ] Handover package with acknowledgement
- [ ] Add/remove blacklist
- [ ] Check overstay alerts
- [ ] Generate daily report

### ✅ Resident Management (Features 13-16)

- [ ] Access member directory
- [ ] View member profiles
- [ ] Register resident vehicle
- [ ] Verify vehicle sticker
- [ ] Register guest vehicle
- [ ] Record guest vehicle exit

### ✅ Complaints & Tasks (Features 17-20)

- [ ] File complaint
- [ ] Update complaint status
- [ ] Upload proof photos
- [ ] Create task
- [ ] View daily task checklist
- [ ] Update task status

### ✅ Safety & Patrolling (Features 21-24)

- [ ] Start patrol log
- [ ] Add checkpoints
- [ ] End patrol
- [ ] File incident report
- [ ] Send SOS alert

### ✅ Attendance & Shifts (Features 25-28)

- [ ] Check-in attendance
- [ ] Check-out attendance
- [ ] Create shift roster
- [ ] Assign staff to shift
- [ ] Apply for leave
- [ ] Approve/reject leave

### ✅ Communication (Features 29-32)

- [ ] Send message to staff/admin
- [ ] Initiate intercom call
- [ ] Create notice/announcement
- [ ] Receive emergency alerts
- [ ] Acknowledge alerts

---

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
```
Solution:
1. Ensure MongoDB is running
2. Check MONGO_URI in .env
3. Verify network access (if using Atlas)
4. Check MongoDB logs: tail -f /var/log/mongodb/mongod.log
```

### Issue: "JWT token expired"
```
Solution:
1. Login again to get new token
2. Token expires in 12 hours by default
3. Update JWT_SECRET in .env for new tokens
```

### Issue: "Port 4000 already in use"
```
Solution:
# Find process using port
lsof -i :4000

# Kill process
kill -9 <PID>

# Or change PORT in .env
PORT=5000
```

### Issue: "Validation error"
```
Solution:
1. Check request body format matches schema
2. Ensure all required fields are present
3. Verify phone number format (10 digits starting with 6-9)
4. Check date format (ISO 8601)
```

---

## Performance Optimization

### 1. Database Indexes
```javascript
// Added automatically in models for frequently queried fields
```

### 2. Caching Strategy
```
Consider adding Redis for:
- Session management
- Frequently accessed data (member directory)
- Rate limiting
```

### 3. Pagination
- Default: 20 items per page
- Maximum: 100 items per page
- Use `page` and `limit` query parameters

---

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Enable HTTPS
- [ ] Set strong MongoDB password
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted domains
- [ ] Implement rate limiting
- [ ] Use helmet.js for security headers
- [ ] Validate all user inputs
- [ ] Sanitize data before storing

---

## Deployment Guide

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create society-management-backend

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### AWS EC2 Deployment

```bash
# SSH into instance
ssh -i key.pem ec2-user@instance-ip

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install nodejs

# Clone repo and install
git clone <repo>
cd society-management/backend
npm install

# Install PM2 for process management
sudo npm install -g pm2
pm2 start src/index.js --name "society-api"
pm2 startup
pm2 save

# View logs
pm2 logs society-api
```

---

## API Rate Limiting

```
- 100 requests per 15 minutes per IP
- Configurable in src/index.js
- Returns 429 Too Many Requests when exceeded
```

---

## Monitoring & Logging

### Enable Logging

Logs are output to console. For production, consider:

1. **Winston Logger** (already in dependencies)
2. **MongoDB Logging**
3. **Third-party services**: Datadog, New Relic, Sentry

### Health Check Endpoint

```
GET http://localhost:4000/health
```

---

## Backup & Recovery

### MongoDB Backup

```bash
# Export database
mongodump --uri="mongodb://localhost:27017/society" --out=./backup

# Import database
mongorestore --uri="mongodb://localhost:27017/society" ./backup/society
```

### Automated Backups

```bash
# Using cron job (Linux/Mac)
0 2 * * * mongodump --uri="mongodb://localhost:27017/society" --out=/backup/$(date +\%Y\%m\%d)
```

---

## Version History

- **v1.0.0** (2026-06-07): All 32 features implemented

---

## Support & Documentation

- API Documentation: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Feature Analysis: See [FEATURE_ANALYSIS.md](FEATURE_ANALYSIS.md)
- GitHub Issues: Report bugs
- Pull Requests: Submit improvements

---

## Next Steps

1. ✅ **Phase 1 Complete**: All features implemented
2. ⏳ **Phase 2**: Frontend development (React/Vue)
3. ⏳ **Phase 3**: Mobile app (React Native/Flutter)
4. ⏳ **Phase 4**: Real-time features (WebSocket/Socket.io)
5. ⏳ **Phase 5**: Advanced analytics & reporting

---

**Happy coding! 🚀**
