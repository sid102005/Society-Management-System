const Bill = require("../models/Bill");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/response");
const { normalizeBill } = require("../services/financeService");

async function listResidentBills(residentId) {
  const bills = await Bill.find({ residentId }).sort({
    dueDate: -1,
    createdAt: -1,
  });
  return bills.map(normalizeBill);
}

const listBills = asyncHandler(async (req, res) => {
  const bills = await listResidentBills(req.currentResident._id);

  return successResponse(res, "Bills fetched successfully", { bills });
});

const listOutstandingBills = asyncHandler(async (req, res) => {
  const bills = await listResidentBills(req.currentResident._id);
  const outstandingBills = bills.filter((bill) => bill.outstandingAmount > 0);

  return successResponse(res, "Outstanding bills fetched successfully", {
    outstandingBills,
  });
});

const listBillHistory = asyncHandler(async (req, res) => {
  const bills = await listResidentBills(req.currentResident._id);

  return successResponse(res, "Billing history fetched successfully", {
    bills,
  });
});

module.exports = {
  listBills,
  listOutstandingBills,
  listBillHistory,
};
