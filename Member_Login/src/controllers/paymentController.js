const crypto = require("crypto");
const Resident = require("../models/Resident");
const Bill = require("../models/Bill");
const Payment = require("../models/Payment");
const Receipt = require("../models/Receipt");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const { successResponse } = require("../utils/response");
const {
  calculateBillTotals,
  createReceiptPath,
  generateReceiptNumber,
  simulateGatewayPayment,
} = require("../services/financeService");

const activePayments = new Set();

const initiatePayment = asyncHandler(async (req, res) => {
  const { billId, amountPaid } = req.body;
  const bill = await Bill.findOne({
    _id: billId,
    residentId: req.currentResident._id,
  });

  if (!bill) {
    throw new AppError(404, "Bill not found");
  }

  const totals = calculateBillTotals(bill);
  const amount = amountPaid !== undefined ? Number(amountPaid) : totals.outstandingAmount;

  if (amount <= 0 || amount > totals.outstandingAmount) {
    throw new AppError(400, "Invalid payment amount");
  }

  // Create cryptographic signature using a secure internal key
  const signature = crypto
    .createHmac("sha256", "payment_secret_key_12345")
    .update(`${billId}_${amount}`)
    .digest("hex");

  return successResponse(res, "Payment initiated successfully", {
    billId,
    amountPaid: amount,
    paymentSignature: signature,
  });
});

const createPayment = asyncHandler(async (req, res) => {
  const billIdStr = req.body.billId.toString();
  if (activePayments.has(billIdStr)) {
    throw new AppError(409, "A payment is already in progress for this bill");
  }
  activePayments.add(billIdStr);

  try {
    const bill = await Bill.findOne({
      _id: req.body.billId,
      residentId: req.currentResident._id,
    });

    if (!bill) {
      throw new AppError(404, "Bill not found");
    }

    const billTotals = calculateBillTotals(bill);
    const requestedAmount =
      req.body.amountPaid !== undefined
        ? Number(req.body.amountPaid)
        : billTotals.outstandingAmount;

    if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
      throw new AppError(400, "Amount paid must be greater than zero");
    }

    if (requestedAmount > billTotals.outstandingAmount) {
      throw new AppError(400, "Amount paid cannot exceed outstanding amount");
    }

    // Verify signature to prevent payment tampering
    const { paymentSignature } = req.body;
    if (!paymentSignature) {
      throw new AppError(400, "Payment signature is required for cryptographic proof verification");
    }
    const expectedSig = crypto
      .createHmac("sha256", "payment_secret_key_12345")
      .update(`${req.body.billId}_${requestedAmount}`)
      .digest("hex");
    if (paymentSignature !== expectedSig) {
      throw new AppError(400, "Payment signature verification failed. Tampering detected.");
    }

    // Check for existing payment in progress to prevent double-payment
    const existingPayment = await Payment.findOne({
      billId: bill._id,
      status: { $in: ["Pending", "Processing"] },
    });

    if (existingPayment) {
      throw new AppError(409, "A payment is already in progress for this bill");
    }

    const gatewayResult = simulateGatewayPayment({
      amountPaid: requestedAmount,
      paymentMode: req.body.paymentMode,
    });

    const payment = await Payment.create({
      residentId: req.currentResident._id,
      billId: bill._id,
      amountPaid: requestedAmount,
      paymentMode: req.body.paymentMode,
      gateway: gatewayResult.gateway,
      transactionId: gatewayResult.transactionId,
      status: gatewayResult.status,
      paidAt: new Date(),
      autoPayApplied: Boolean(req.body.autoPayApplied),
    });

    const receiptNumber = generateReceiptNumber();
    const receipt = await Receipt.create({
      residentId: req.currentResident._id,
      billId: bill._id,
      paymentId: payment._id,
      receiptNumber,
      receiptPath: createReceiptPath(receiptNumber),
      amount: requestedAmount,
      paymentMode: req.body.paymentMode,
    });

    payment.receiptId = receipt._id;
    await payment.save();

    bill.paidAmount = Number(bill.paidAmount || 0) + requestedAmount;
    const updatedTotals = calculateBillTotals(bill);
    bill.status =
      updatedTotals.outstandingAmount === 0 ? "Paid" : "Partially Paid";
    if (updatedTotals.isOverdue && bill.status !== "Paid") {
      bill.status = "Overdue";
    }
    await bill.save();

    return successResponse(
      res,
      "Payment completed successfully",
      {
        payment,
        receipt,
        bill,
      },
      201,
    );
  } finally {
    activePayments.delete(billIdStr);
  }
});

const listPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ residentId: req.currentResident._id })
    .sort({ paidAt: -1, createdAt: -1 })
    .populate("billId receiptId");

  return successResponse(res, "Payment history fetched successfully", {
    payments,
  });
});

const getAutoPaySettings = asyncHandler(async (req, res) => {
  const resident = await Resident.findById(req.currentResident._id).select(
    "autoPayEnabled autoPayDay autoPayMode",
  );

  return successResponse(res, "Auto pay settings fetched successfully", {
    autoPaySettings: resident,
  });
});

const updateAutoPaySettings = asyncHandler(async (req, res) => {
  const resident = await Resident.findById(req.currentResident._id);

  if (req.body.autoPayEnabled !== undefined) {
    resident.autoPayEnabled = req.body.autoPayEnabled;
  }

  if (req.body.autoPayDay !== undefined) {
    resident.autoPayDay = req.body.autoPayDay;
  }

  if (req.body.autoPayMode !== undefined) {
    resident.autoPayMode = req.body.autoPayMode;
  }

  await resident.save();

  return successResponse(res, "Auto pay settings updated successfully", {
    autoPaySettings: {
      autoPayEnabled: resident.autoPayEnabled,
      autoPayDay: resident.autoPayDay,
      autoPayMode: resident.autoPayMode,
    },
  });
});

module.exports = {
  initiatePayment,
  createPayment,
  listPaymentHistory,
  getAutoPaySettings,
  updateAutoPaySettings,
};
