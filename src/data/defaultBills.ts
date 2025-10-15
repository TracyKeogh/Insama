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
  createBill('Rent/Mortgage', 'housing', 2500, 'monthly', '1st', 'auto-pay'),
  createBill('Property Tax', 'housing', 800, 'quarterly', '15th'),
  createBill('HOA Fees', 'housing', 150, 'monthly', '1st'),
  createBill('Home Insurance', 'housing', 200, 'monthly', '15th'),
  
  // Utilities
  createBill('Electricity', 'utilities', 120, 'monthly', '10th'),
  createBill('Gas', 'utilities', 80, 'monthly', '15th'),
  createBill('Water & Sewer', 'utilities', 60, 'monthly', '20th'),
  createBill('Trash & Recycling', 'utilities', 35, 'monthly', '1st'),
  createBill('Internet', 'utilities', 75, 'monthly', '5th'),
  createBill('Cable/Streaming', 'utilities', 120, 'monthly', '12th'),
  createBill('Phone (Mobile)', 'utilities', 140, 'monthly', '8th'),
  
  // Transportation
  createBill('Car Payment', 'transportation', 450, 'monthly', '3rd'),
  createBill('Car Insurance', 'transportation', 180, 'monthly', '25th'),
  createBill('Gas (Fuel)', 'transportation', 200, 'monthly', 'variable'),
  createBill('Car Maintenance', 'transportation', 100, 'monthly', 'variable'),
  createBill('Registration/Tags', 'transportation', 120, 'annually', 'birthday month'),
  
  // Insurance
  createBill('Health Insurance', 'insurance', 450, 'monthly', '1st'),
  createBill('Dental Insurance', 'insurance', 60, 'monthly', '1st'),
  createBill('Vision Insurance', 'insurance', 25, 'monthly', '1st'),
  createBill('Life Insurance', 'insurance', 85, 'monthly', '15th'),
  createBill('Disability Insurance', 'insurance', 40, 'monthly', '15th'),
  
  // Food
  createBill('Groceries', 'food', 600, 'monthly', 'variable'),
  createBill('Dining Out', 'food', 300, 'monthly', 'variable'),
  
  // Healthcare
  createBill('Prescriptions', 'healthcare', 50, 'monthly', 'variable'),
  createBill('Doctor Copays', 'healthcare', 100, 'monthly', 'variable'),
  createBill('Gym Membership', 'healthcare', 80, 'monthly', '1st'),
  
  // Childcare
  createBill('Daycare/Preschool', 'childcare', 1200, 'monthly', '1st'),
  createBill('After School Care', 'childcare', 400, 'monthly', '1st'),
  createBill('School Lunch', 'childcare', 60, 'monthly', '1st'),
  
  // Entertainment
  createBill('Netflix', 'entertainment', 15, 'monthly', '12th'),
  createBill('Spotify', 'entertainment', 10, 'monthly', '8th'),
  createBill('Amazon Prime', 'entertainment', 139, 'annually', '15th'),
  createBill('Date Night Budget', 'entertainment', 200, 'monthly', 'variable'),
  
  // Debt
  createBill('Credit Card 1', 'debt', 150, 'monthly', '20th'),
  createBill('Credit Card 2', 'debt', 100, 'monthly', '25th'),
  createBill('Student Loan', 'debt', 300, 'monthly', '10th'),
  createBill('Personal Loan', 'debt', 250, 'monthly', '5th'),
  
  // Savings
  createBill('Emergency Fund', 'savings', 500, 'monthly', '1st'),
  createBill('Retirement (401k)', 'savings', 800, 'monthly', '1st'),
  createBill('Vacation Fund', 'savings', 200, 'monthly', '1st'),
  createBill('Kids College Fund', 'savings', 300, 'monthly', '1st'),
  
  // Other
  createBill('Pet Insurance', 'other', 45, 'monthly', '10th'),
  createBill('Pet Food & Supplies', 'other', 80, 'monthly', 'variable'),
  createBill('Clothing Budget', 'other', 150, 'monthly', 'variable'),
  createBill('Personal Care', 'other', 100, 'monthly', 'variable'),
  createBill('Gifts Budget', 'other', 100, 'monthly', 'variable'),
];