const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  staffUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // YYYY-MM
  year: { type: Number, required: true },
  
  baseSalary: { type: Number, required: true },
  allowances: {
    dearness: { type: Number, default: 0 },
    house: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  totalAllowances: { type: Number, default: 0 },
  
  deductions: {
    providentFund: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  totalDeductions: { type: Number, default: 0 },
  
  grossSalary: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  
  attendance: {
    daysWorked: { type: Number, default: 0 },
    leaveTaken: { type: Number, default: 0 },
    unpaidLeave: { type: Number, default: 0 }
  },
  
  bonus: { type: Number, default: 0 },
  penalty: { type: Number, default: 0 },
  
  paymentStatus: { type: String, enum: ['pending', 'processed', 'paid', 'rejected'], default: 'pending' },
  paymentDate: Date,
  paymentMethod: { type: String, enum: ['bank-transfer', 'cheque', 'cash'], default: 'bank-transfer' },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  
  remarks: String,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedDate: Date,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Salary', SalarySchema);
