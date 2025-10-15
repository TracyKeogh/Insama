import { Task, TaskCategory } from '../types';

const createTask = (
  title: string,
  category: TaskCategory,
  description: string,
  frequency: 'daily' | 'weekly' | 'monthly' | 'as-needed',
  timeEstimate: number,
  priority: 'low' | 'medium' | 'high' = 'medium'
): Omit<Task, 'id' | 'assignedTo' | 'cpe' | 'completed' | 'createdAt'> => ({
  title,
  category,
  description,
  frequency,
  timeEstimate,
  priority,
});

export const defaultTasks = [
  // Home
  createTask('Vacuum Living Areas', 'home', 'Vacuum all carpeted and hard floor areas in common spaces', 'weekly', 45),
  createTask('Dust Furniture', 'home', 'Dust all surfaces, shelves, and decorative items', 'weekly', 30),
  createTask('Organize Closets', 'home', 'Keep closets tidy and organized', 'monthly', 90),
  
  // Cleaning
  createTask('Clean Bathrooms', 'cleaning', 'Deep clean toilets, showers, sinks, and floors', 'weekly', 60, 'high'),
  createTask('Kitchen Deep Clean', 'cleaning', 'Clean appliances, counters, and cabinets thoroughly', 'weekly', 75, 'high'),
  createTask('Laundry', 'cleaning', 'Wash, dry, fold, and put away clothes', 'weekly', 120),
  createTask('Change Bed Sheets', 'cleaning', 'Strip, wash, and remake beds with fresh linens', 'weekly', 20),
  
  // Cooking
  createTask('Meal Planning', 'cooking', 'Plan weekly meals and create shopping list', 'weekly', 30, 'high'),
  createTask('Grocery Shopping', 'cooking', 'Purchase groceries and household items', 'weekly', 90),
  createTask('Dinner Preparation', 'cooking', 'Cook dinner for the family', 'daily', 45, 'high'),
  createTask('Pack Lunches', 'cooking', 'Prepare and pack lunches for work/school', 'daily', 15),
  
  // Childcare
  createTask('School Pickup/Dropoff', 'childcare', 'Transport children to and from school', 'daily', 30, 'high'),
  createTask('Bedtime Routine', 'childcare', 'Oversee baths, teeth brushing, stories, and bedtime', 'daily', 45),
  createTask('Schedule Playdates', 'childcare', 'Coordinate social activities with other families', 'as-needed', 20),
  createTask('Doctor Appointments', 'childcare', 'Schedule and attend medical appointments', 'as-needed', 120, 'high'),
  
  // Finance
  createTask('Pay Bills', 'finance', 'Review and pay monthly bills on time', 'monthly', 45, 'high'),
  createTask('Budget Review', 'finance', 'Track expenses and review monthly budget', 'monthly', 60),
  createTask('Investment Management', 'finance', 'Review and manage investment accounts', 'monthly', 30),
  
  // Social
  createTask('Plan Date Nights', 'social', 'Organize regular couple time and activities', 'weekly', 20),
  createTask('Family Events', 'social', 'Coordinate family gatherings and celebrations', 'as-needed', 90),
  createTask('Gift Shopping', 'social', 'Purchase gifts for birthdays, holidays, etc.', 'as-needed', 60),
  
  // Health
  createTask('Schedule Medical Checkups', 'health', 'Book and attend routine medical appointments', 'as-needed', 45),
  createTask('Manage Medications', 'health', 'Ensure prescriptions are filled and taken', 'weekly', 10, 'high'),
  createTask('Exercise Planning', 'health', 'Coordinate fitness activities and schedules', 'weekly', 15),
  
  // Maintenance
  createTask('Car Maintenance', 'maintenance', 'Schedule oil changes, repairs, and inspections', 'as-needed', 120),
  createTask('Home Repairs', 'maintenance', 'Fix household items and coordinate repairs', 'as-needed', 180),
  createTask('Yard Work', 'maintenance', 'Maintain lawn, garden, and outdoor spaces', 'weekly', 90),
  
  // Admin
  createTask('Mail Management', 'admin', 'Sort, file, and respond to mail and emails', 'daily', 15),
  createTask('Insurance Reviews', 'admin', 'Review and update insurance policies', 'as-needed', 60),
  createTask('Tax Preparation', 'admin', 'Gather documents and file taxes', 'as-needed', 240, 'high'),
];