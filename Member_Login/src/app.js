const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createSessionMiddleware = require("./config/session");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const errorHandler = require("./middleware/errorHandler");
const familyRoutes = require("./routes/familyRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const kycRoutes = require("./routes/kycRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const documentSharingRoutes = require("./routes/documentSharingRoutes");
const moveOutRoutes = require("./routes/moveOutRoutes");
const listingRoutes = require("./routes/listingRoutes");
const documentRoutes = require("./routes/documentRoutes");
const billsRoutes = require("./routes/billsRoutes");
const disputesRoutes = require("./routes/disputesRoutes");
const nocRoutes = require("./routes/nocRoutes");
const paymentsRoutes = require("./routes/paymentsRoutes");
const receiptsRoutes = require("./routes/receiptsRoutes");
const utilitiesRoutes = require("./routes/utilitiesRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const helperRoutes = require("./routes/helperRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const parcelRoutes = require("./routes/parcelRoutes");
const amenityRoutes = require("./routes/amenityRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const communityRoutes = require("./routes/communityRoutes");
const homeRoutes = require("./routes/homeRoutes");
const documentShareRoutes = require("./routes/documentShareRoutes");
const accommodationRoutes = require("./routes/accommodationRoutes");
const surveyRoutes = require("./routes/surveyRoutes");
const resolutionRoutes = require("./routes/resolutionRoutes");



const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(createSessionMiddleware());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Society Management API is running",
    data: {},
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/family", familyRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/moveout", moveOutRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/documents", documentSharingRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/bills", billsRoutes);
app.use("/api/disputes", disputesRoutes);
app.use("/api/noc", nocRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/receipts", receiptsRoutes);
app.use("/api/utilities", utilitiesRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/helpers", helperRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/parcels", parcelRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/document-share", documentShareRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/resolutions", resolutionRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    errors: [],
  });
});

app.use(errorHandler);

module.exports = app;
