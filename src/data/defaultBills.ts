import { HouseholdBill, BillCategory } from '../types';

const createBill = (
  name: string,
  category: BillCategory,
  amount: number,
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually',
  dueDate: string,
  paymentMethod: 'auto-pay' | 'manual' | 'online' | 'check' = 'online'
): Omit<HouseholdBill, 'id' | 'responsiblePartner' | 'isShared' | 'splitPercentage' | 'notes' | 'isActive' | 'createdAt'> => ({
  name,
  category,
  amount,
  frequency,
  dueDate,
  paymentMethod,
});

export const defaultBills = [
  // Housing
  createBill('Mortgage/Rent', 'housing', 0, 'monthly', '1st', 'auto-pay'),
  createBill('Local Property Tax (LPT)', 'housing', 0, 'annually', '1st'),
  createBill('Home Insurance', 'housing', 0, 'annually', '1st'),
  createBill('Management Fees', 'housing', 0, 'monthly', '1st'),
  
  // Utilities
  createBill('ESB (Electricity)', 'utilities', 0, 'monthly', '15th'),
  createBill('Gas (Natural Gas)', 'utilities', 0, 'monthly', '20th'),
  createBill('Irish Water', 'utilities', 0, 'monthly', '25th'),
  createBill('Waste Collection', 'utilities', 0, 'monthly', '1st'),
  createBill('Broadband/Internet', 'utilities', 0, 'monthly', '5th'),
  createBill('TV Licence', 'utilities', 0, 'annually', '1st'),
  createBill('Mobile Phone', 'utilities', 0, 'monthly', '8th'),
  
  // Transportation
  createBill('Motor Tax', 'transportation', 0, 'annually', '1st'),
  createBill('Car Insurance', 'transportation', 0, 'annually', '1st'),
  createBill('NCT (Vehicle Test)', 'transportation', 0, 'annually', 'test due date'),
  createBill('Petrol/Diesel', 'transportation', 0, 'monthly', 'variable'),
  createBill('Car Maintenance', 'transportation', 0, 'monthly', 'variable'),
  createBill('Public Transport (Leap Card)', 'transportation', 0, 'monthly', 'variable'),
  createBill('Parking', 'transportation', 0, 'monthly', 'variable'),
  
  // Insurance
  createBill('Health Insurance (VHI/Laya)', 'insurance', 0, 'monthly', '1st'),
  createBill('Life Assurance', 'insurance', 0, 'monthly', '1st'),
  createBill('Income Protection', 'insurance', 0, 'monthly', '1st'),
  
  // Food
  createBill('Groceries', 'food', 0, 'monthly', 'variable'),
  createBill('Dining Out', 'food', 0, 'monthly', 'variable'),
  
  // Healthcare
  createBill('GP Visits', 'healthcare', 0, 'monthly', 'variable'),
  createBill('Prescriptions', 'healthcare', 0, 'monthly', 'variable'),
  createBill('Dental Check-ups', 'healthcare', 0, 'monthly', 'variable'),
  createBill('Gym Membership', 'healthcare', 0, 'monthly', '1st'),
  
  // Childcare
  createBill('Childcare/Creche', 'childcare', 0, 'monthly', '1st'),
  createBill('School Fees', 'childcare', 0, 'monthly', '1st'),
  createBill('After School Activities', 'childcare', 0, 'monthly', '1st'),
  
  // Entertainment
  createBill('Netflix', 'entertainment', 0, 'monthly', '12th'),
  createBill('Spotify', 'entertainment', 0, 'monthly', '8th'),
  createBill('Disney+', 'entertainment', 0, 'monthly', '15th'),
  createBill('NOW TV/Sky', 'entertainment', 0, 'monthly', '1st'),
  
  // Debt
  createBill('Credit Card', 'debt', 0, 'monthly', '20th'),
  createBill('Personal Loan', 'debt', 0, 'monthly', '5th'),
  createBill('Credit Union Loan', 'debt', 0, 'monthly', '1st'),
  
  // Savings
  createBill('Savings Account', 'savings', 0, 'monthly', '1st'),
  createBill('Credit Union Savings', 'savings', 0, 'monthly', '1st'),
  createBill('Pension Contribution', 'savings', 0, 'monthly', '1st'),
  createBill('Holiday Fund', 'savings', 0, 'monthly', '1st'),
  
  // Other
  createBill('Pet Insurance', 'other', 0, 'monthly', '10th'),
  createBill('Pet Food & Vet', 'other', 0, 'monthly', 'variable'),
  createBill('Clothing', 'other', 0, 'monthly', 'variable'),
  createBill('Personal Care', 'other', 0, 'monthly', 'variable'),
  createBill('Gifts & Occasions', 'other', 0, 'monthly', 'variable'),
];