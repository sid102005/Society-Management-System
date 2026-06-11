require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Resident = require("../models/Resident");
const Notice = require("../models/Notice");
const Document = require("../models/Document");
const Bill = require("../models/Bill");
const Payment = require("../models/Payment");
const Receipt = require("../models/Receipt");
const Dispute = require("../models/Dispute");
const NocRequest = require("../models/NocRequest");
const UtilityMeter = require("../models/UtilityMeter");
const Visitor = require("../models/Visitor");
const VisitorOTP = require("../models/VisitorOTP");
const DomesticHelp = require("../models/DomesticHelp");
const Attendance = require("../models/Attendance");
const Delivery = require("../models/Delivery");
const Parcel = require("../models/Parcel");
const Accommodation = require("../models/Accommodation");
const AccommodationBooking = require("../models/AccommodationBooking");
const AnnualSurvey = require("../models/AnnualSurvey");
const SurveyResponse = require("../models/SurveyResponse");
const CommitteeDecision = require("../models/CommitteeDecision");
const ResolutionFeedback = require("../models/ResolutionFeedback");
const Poll = require("../models/Poll");
const PollVote = require("../models/PollVote");
const Amenity = require("../models/Amenity");
const AmenityBooking = require("../models/AmenityBooking");
const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");
const EmergencyContact = require("../models/EmergencyContact");
const LostFoundItem = require("../models/LostFoundItem");
const MarketplaceItem = require("../models/MarketplaceItem");
const Vehicle = require("../models/Vehicle");
const FamilyMember = require("../models/FamilyMember");
const Kyc = require("../models/Kyc");
const MoveOutRequest = require("../models/MoveOutRequest");
const Listing = require("../models/Listing");

async function seed() {
  try {
    await connectDB();

    await Resident.deleteMany({ email: { $ne: "finance.demo@example.com" } });
    await Vehicle.deleteMany({});
    await FamilyMember.deleteMany({});
    await Kyc.deleteMany({});
    await MoveOutRequest.deleteMany({});
    await Listing.deleteMany({});
    await Notice.deleteMany({});
    await Document.deleteMany({});
    await Bill.deleteMany({});
    await Payment.deleteMany({});
    await Receipt.deleteMany({});
    await Dispute.deleteMany({});
    await NocRequest.deleteMany({});
    await UtilityMeter.deleteMany({});
    await Visitor.deleteMany({});
    await VisitorOTP.deleteMany({});
    await DomesticHelp.deleteMany({});
    await Attendance.deleteMany({});
    await Delivery.deleteMany({});
    await Parcel.deleteMany({});
    await Accommodation.deleteMany({});
    await AccommodationBooking.deleteMany({});
    await AnnualSurvey.deleteMany({});
    await SurveyResponse.deleteMany({});
    await CommitteeDecision.deleteMany({});
    await ResolutionFeedback.deleteMany({});
    await Poll.deleteMany({});
    await PollVote.deleteMany({});
    await Amenity.deleteMany({});
    await AmenityBooking.deleteMany({});
    await Event.deleteMany({});
    await EventRegistration.deleteMany({});
    await EmergencyContact.deleteMany({});
    await LostFoundItem.deleteMany({});
    await MarketplaceItem.deleteMany({});

    let demoResident = await Resident.findOne({
      email: "finance.demo@example.com",
    });

    if (!demoResident) {
      demoResident = await Resident.create({
        fullName: "Finance Demo Resident",
        email: "finance.demo@example.com",
        phone: "9000000000",
        password: "Password@123",
        flatNumber: "A-101",
        wing: "A",
        floor: "10",
        societyName: "Green Valley Society",
        residentType: "Owner",
        isVerified: true,
      });
    }

    await Notice.insertMany([
      {
        title: "Water Tank Maintenance",
        description:
          "Water supply will be interrupted on Sunday from 10 AM to 1 PM.",
        createdBy: "Society Office",
      },
      {
        title: "Parking Reminder",
        description: "Please park only in your allotted parking slot.",
        createdBy: "Society Office",
      },
    ]);

    await Document.insertMany([
      {
        title: "Society Rules",
        description: "General society rules and regulations document.",
        documentFile: "/uploads/documents/society-rules.pdf",
      },
      {
        title: "Maintenance Policy",
        description: "Monthly maintenance and billing policy document.",
        documentFile: "/uploads/documents/maintenance-policy.pdf",
      },
    ]);

    const firstBill = await Bill.create({
      residentId: demoResident._id,
      billType: "Maintenance",
      billingPeriod: "May 2026",
      dueDate: new Date("2026-06-10T00:00:00.000Z"),
      amount: 3500,
      penaltyAmount: 150,
      paidAmount: 0,
      status: "Overdue",
      notes: "Monthly maintenance charges",
    });

    const secondBill = await Bill.create({
      residentId: demoResident._id,
      billType: "Water",
      billingPeriod: "May 2026",
      dueDate: new Date("2026-06-20T00:00:00.000Z"),
      amount: 900,
      penaltyAmount: 0,
      paidAmount: 900,
      status: "Paid",
      notes: "Water consumption bill",
    });

    const payment = await Payment.create({
      residentId: demoResident._id,
      billId: secondBill._id,
      amountPaid: 900,
      paymentMode: "UPI",
      gateway: "DummyPay",
      transactionId: "TXN-DEMO-0001",
      status: "Success",
      paidAt: new Date("2026-06-05T10:00:00.000Z"),
    });

    const receipt = await Receipt.create({
      residentId: demoResident._id,
      billId: secondBill._id,
      paymentId: payment._id,
      receiptNumber: "RCT-DEMO-0001",
      receiptPath: "/uploads/receipts/RCT-DEMO-0001.pdf",
      amount: 900,
      paymentMode: "UPI",
    });

    payment.receiptId = receipt._id;
    await payment.save();

    await Dispute.create({
      residentId: demoResident._id,
      billId: firstBill._id,
      subject: "Penalty charge review",
      description: "Please review the applied penalty amount for May 2026.",
      status: "Pending",
    });

    await NocRequest.create({
      residentId: demoResident._id,
      requestType: "Maintenance Clearance",
      purpose: "Required for flat transfer",
      requestedFor: demoResident.fullName,
      status: "Pending",
    });

    await UtilityMeter.insertMany([
      {
        residentId: demoResident._id,
        utilityType: "Electricity",
        readingMonth: "May 2026",
        previousReading: 1250,
        currentReading: 1425,
        ratePerUnit: 8,
        status: "Billed",
        notes: "Electricity meter reading",
      },
      {
        residentId: demoResident._id,
        utilityType: "Water",
        readingMonth: "May 2026",
        previousReading: 510,
        currentReading: 560,
        ratePerUnit: 15,
        status: "Billed",
        notes: "Water meter reading",
      },
    ]);

    const visitor = await Visitor.create({
      residentId: demoResident._id,
      visitorName: "Amit Kumar",
      phone: "9876500000",
      purpose: "Package handover",
      expectedVisitAt: new Date("2026-06-20T10:30:00.000Z"),
      status: "Pending",
    });

    await VisitorOTP.create({
      residentId: demoResident._id,
      visitorId: visitor._id,
      otpCode: "654321",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const helper = await DomesticHelp.create({
      residentId: demoResident._id,
      helperName: "Sunita Devi",
      phone: "9876511111",
      role: "Maid",
      shiftStart: "09:00",
      shiftEnd: "13:00",
      status: "Active",
      notes: "Morning cleaning helper",
    });

    await Attendance.create({
      residentId: demoResident._id,
      helperId: helper._id,
      attendanceDate: new Date("2026-06-05T00:00:00.000Z"),
      checkInTime: new Date("2026-06-05T09:00:00.000Z"),
      checkOutTime: new Date("2026-06-05T13:00:00.000Z"),
      status: "Present",
      notes: "Regular attendance",
    });

    await Delivery.create({
      residentId: demoResident._id,
      deliveryPartner: "Blue Dart",
      recipientName: demoResident.fullName,
      purpose: "Courier entry authorization",
      authorizationCode: "AUTH-DEMO-01",
      status: "Authorized",
      authorizedAt: new Date("2026-06-05T11:00:00.000Z"),
    });

    await Parcel.create({
      residentId: demoResident._id,
      parcelType: "Courier",
      trackingNumber: "TRK-DEMO-001",
      courier: "Blue Dart",
      expectedDeliveryAt: new Date("2026-06-21T12:00:00.000Z"),
      status: "Expected",
      notificationSent: true,
      notes: "Sample parcel notification",
    });

    await Accommodation.create({
      name: "Guest Suite 101",
      description: "Standard guest room near block entrance",
      capacity: 4,
      chargesPerDay: 1500,
      isActive: true,
    });

    await AnnualSurvey.create({
      title: "Annual Satisfaction Survey 2026",
      description: "Please provide your annual feedback.",
      year: 2026,
      questions: [
        { questionText: "How satisfied are you with society security?", questionType: "rating" },
        { questionText: "How satisfied are you with water/electricity services?", questionType: "rating" },
        { questionText: "Would you support a solar panel installation?", questionType: "yes_no" }
      ],
      isActive: true,
    });

    await CommitteeDecision.create({
      title: "CCTV Installation in Wing B",
      description: "Proposal to install 4 new cameras in the lobby.",
      category: "Security",
      outcome: "Proposal approved; installation starts next week.",
      status: "In Progress",
    });

    await EmergencyContact.insertMany([
      { name: "General Ambulance", type: "Ambulance", phone: "102", address: "City Hospital", notes: "24/7 service" },
      { name: "Fire Department", type: "Fire", phone: "101", address: "Central Fire Station", notes: "Fire emergency helpline" },
      { name: "Police Station", type: "Police", phone: "100", address: "Local Police Station", notes: "Local emergency response" },
      { name: "Society Main Gate Security", type: "Society Helpline", phone: "9000000001", address: "Main Gate Guard Room", notes: "Gate intercom sync available" },
    ]);

    await Poll.create({
      title: "New Color Scheme for Wing B Lobby",
      description: "Please vote on your preferred color scheme for the upcoming painting work.",
      options: [
        { text: "Classic Cream & Brown", votes: 0 },
        { text: "Modern Light Gray & Navy", votes: 0 },
        { text: "Pastel Mint & White", votes: 0 }
      ],
      createdBy: demoResident._id,
      status: "Active",
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
      allowMultipleVotes: false
    });

    await Amenity.create({
      name: "Clubhouse Hall",
      description: "Spacious community hall with seating and lighting for private events.",
      type: "Community Hall",
      capacity: 100,
      chargesPerHour: 500,
      operatingHours: { start: "09:00", end: "22:00" },
      facilities: ["Air Conditioning", "Chairs", "Sound System"],
      isActive: true
    });

    await Amenity.create({
      name: "Rooftop Swimming Pool",
      description: "Shared swimming pool with standard security.",
      type: "Swimming Pool",
      capacity: 20,
      chargesPerHour: 100,
      operatingHours: { start: "06:00", end: "20:00" },
      facilities: ["Showers", "Lounge Chairs"],
      isActive: true
    });

    await Event.create({
      title: "International Yoga Day",
      description: "Join us for a morning yoga session at the society clubhouse.",
      eventType: "Social",
      eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
      startTime: "07:00",
      endTime: "08:30",
      location: "Clubhouse Hall",
      organizer: "Health Committee",
      maxParticipants: 50,
      currentParticipants: 0,
      registrationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2)
    });

    console.log("Seed completed successfully");
    await mongoose.connection.close();
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seed();
