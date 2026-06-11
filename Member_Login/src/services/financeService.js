const crypto = require("crypto");
const AppError = require("../utils/appError");

function generateTransactionId() {
  return `TXN-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
}

function generateReceiptNumber() {
  return `RCT-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
}

function createReceiptPath(receiptNumber) {
  return `/uploads/receipts/${receiptNumber}.pdf`;
}

function simulateGatewayPayment({ amountPaid, paymentMode }) {
  if (!Number.isFinite(amountPaid) || amountPaid <= 0) {
    throw new AppError(400, "Payment amount must be greater than zero");
  }

  return {
    gateway: "DummyPay",
    transactionId: generateTransactionId(),
    status: "Success",
    paymentMode,
  };
}

function calculateBillTotals(bill) {
  const amount = Number(bill.amount || 0);
  const penaltyAmount = Number(bill.penaltyAmount || 0);
  const paidAmount = Number(bill.paidAmount || 0);
  const totalAmount = amount + penaltyAmount;
  const outstandingAmount = Math.max(totalAmount - paidAmount, 0);

  return {
    amount,
    penaltyAmount,
    paidAmount,
    totalAmount,
    outstandingAmount,
    isOverdue:
      outstandingAmount > 0 &&
      bill.dueDate &&
      new Date(bill.dueDate) < new Date(),
  };
}

function normalizeBill(bill) {
  const plainBill = bill.toObject ? bill.toObject() : { ...bill };
  const computed = calculateBillTotals(plainBill);

  return {
    ...plainBill,
    ...computed,
    status: computed.outstandingAmount === 0 ? "Paid" : plainBill.status,
  };
}

module.exports = {
  generateTransactionId,
  generateReceiptNumber,
  createReceiptPath,
  simulateGatewayPayment,
  calculateBillTotals,
  normalizeBill,
};
