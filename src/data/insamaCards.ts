import { InsamaCard, CardCategory } from '../types';

const createCard = (
  title: string,
  category: CardCategory,
  description: string,
  mentalLoad: string,
  frequency: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'as-needed',
  timeEstimate: number,
  priority: 'low' | 'medium' | 'high' = 'medium'
): Omit<InsamaCard, 'id' | 'holder' | 'ownership' | 'createdAt'> => ({
  title,
  category,
  description,
  mentalLoad,
  frequency,
  timeEstimate,
  priority,
});

export const insamaCards = [
  // HOME & CLEANING (25 cards)
  createCard(
    'Dishes', 
    'home-cleaning', 
    'Keep dishes clean and kitchen tidy',
    'Notice when dishes are dirty, plan when to do them, load/unload dishwasher, hand wash items, put away clean dishes',
    'daily', 
    30, 
    'high'
  ),
  createCard(
    'Laundry', 
    'home-cleaning', 
    'Manage all household laundry',
    'Notice when clothes are dirty, sort by color/fabric, wash, dry, fold, put away in correct locations',
    'weekly', 
    120, 
    'high'
  ),
  createCard(
    'Bathroom Cleaning', 
    'home-cleaning', 
    'Keep bathrooms clean and stocked',
    'Notice when cleaning is needed, buy supplies, scrub toilet/shower/sink, restock toilet paper and toiletries',
    'weekly', 
    45
  ),
  createCard(
    'Vacuuming', 
    'home-cleaning', 
    'Keep floors clean throughout the house',
    'Notice when floors need cleaning, move furniture, vacuum all areas, empty vacuum bag/canister',
    'weekly', 
    40
  ),
  createCard(
    'Grocery Shopping', 
    'home-cleaning', 
    'Ensure household has food and supplies',
    'Check what\'s needed, make shopping list, go to store, put groceries away in proper places',
    'weekly', 
    90, 
    'high'
  ),
  createCard(
    'Kitchen Deep Clean', 
    'home-cleaning', 
    'Maintain kitchen appliances and surfaces',
    'Clean inside microwave, oven, refrigerator, wipe down cabinets, organize pantry, sanitize counters',
    'monthly', 
    90
  ),
  createCard(
    'Bed Making', 
    'home-cleaning', 
    'Keep bedrooms tidy and welcoming',
    'Make beds daily, change sheets weekly, fluff pillows, organize nightstands',
    'daily', 
    10
  ),
  createCard(
    'Dusting', 
    'home-cleaning', 
    'Keep surfaces clean and allergen-free',
    'Notice dust accumulation, dust furniture, electronics, decorative items, ceiling fans',
    'weekly', 
    30
  ),
  createCard(
    'Mopping', 
    'home-cleaning', 
    'Deep clean hard floors',
    'Sweep first, choose appropriate cleaner, mop all hard surfaces, clean mop after use',
    'weekly', 
    25
  ),
  createCard(
    'Trash & Recycling', 
    'home-cleaning', 
    'Manage household waste',
    'Empty bins when full, take to curb on collection day, bring bins back, replace liners',
    'weekly', 
    15
  ),
  createCard(
    'Closet Organization', 
    'home-cleaning', 
    'Maintain organized clothing storage',
    'Sort clothes by season, donate unused items, organize by type, maintain hangers',
    'seasonal', 
    120
  ),
  createCard(
    'Window Cleaning', 
    'home-cleaning', 
    'Keep windows clear and bright',
    'Notice when windows are dirty, gather supplies, clean inside and outside, clean window sills',
    'monthly', 
    60
  ),
  createCard(
    'Pantry Organization', 
    'home-cleaning', 
    'Maintain organized food storage',
    'Check expiration dates, organize by category, maintain inventory, clean shelves',
    'monthly', 
    45
  ),
  createCard(
    'Refrigerator Maintenance', 
    'home-cleaning', 
    'Keep refrigerator clean and organized',
    'Check expiration dates, clean spills, organize shelves, maintain temperature',
    'weekly', 
    20
  ),
  createCard(
    'Linen Management', 
    'home-cleaning', 
    'Maintain household linens',
    'Wash towels and sheets, fold and store properly, replace worn items, maintain inventory',
    'weekly', 
    30
  ),
  createCard(
    'Garage Organization', 
    'home-cleaning', 
    'Keep garage functional and organized',
    'Sort tools and equipment, maintain clear pathways, organize seasonal items',
    'seasonal', 
    180
  ),
  createCard(
    'Basement/Attic Maintenance', 
    'home-cleaning', 
    'Maintain storage areas',
    'Check for moisture, organize stored items, label boxes, maintain accessibility',
    'seasonal', 
    120
  ),
  createCard(
    'Light Bulb Replacement', 
    'home-cleaning', 
    'Maintain proper lighting',
    'Notice burned out bulbs, buy correct replacements, safely install new bulbs',
    'as-needed', 
    15
  ),
  createCard(
    'Air Filter Replacement', 
    'home-cleaning', 
    'Maintain air quality',
    'Check filter monthly, buy correct size, replace when dirty, maintain HVAC system',
    'monthly', 
    10
  ),
  createCard(
    'Cleaning Supply Management', 
    'home-cleaning', 
    'Maintain cleaning inventory',
    'Monitor supply levels, research products, purchase when needed, organize storage',
    'monthly', 
    30
  ),
  createCard(
    'Shoe Organization', 
    'home-cleaning', 
    'Maintain entryway organization',
    'Organize shoes by season, clean shoe storage area, maintain shoe care supplies',
    'weekly', 
    15
  ),
  createCard(
    'Mail Organization', 
    'home-cleaning', 
    'Manage incoming mail and packages',
    'Sort daily mail, file important documents, recycle junk mail, track packages',
    'daily', 
    10
  ),
  createCard(
    'Seasonal Decorating', 
    'home-cleaning', 
    'Maintain seasonal home atmosphere',
    'Plan seasonal changes, store previous decorations, set up new decorations',
    'seasonal', 
    90
  ),
  createCard(
    'Deep Cleaning Projects', 
    'home-cleaning', 
    'Tackle intensive cleaning tasks',
    'Plan deep cleaning schedule, gather supplies, clean baseboards, light fixtures, behind appliances',
    'seasonal', 
    240
  ),
  createCard(
    'Household Inventory', 
    'home-cleaning', 
    'Track household items and supplies',
    'Maintain lists of household items, track warranties, organize receipts, plan replacements',
    'monthly', 
    45
  ),

  // CHILDREN (25 cards)
  createCard(
    'School Lunches', 
    'children', 
    'Prepare daily school lunches',
    'Plan nutritious meals, buy lunch supplies, pack lunches each morning, include utensils/napkins',
    'daily', 
    15, 
    'high'
  ),
  createCard(
    'Doctor Appointments', 
    'children', 
    'Manage children\'s healthcare',
    'Schedule appointments, remember dates, arrange transportation, follow up on treatments',
    'as-needed', 
    120, 
    'high'
  ),
  createCard(
    'School Events', 
    'children', 
    'Participate in school community',
    'Read school communications, RSVP to events, arrange attendance, volunteer when needed',
    'as-needed', 
    90
  ),
  createCard(
    'Bedtime Routine', 
    'children', 
    'Ensure children get proper sleep',
    'Set consistent bedtime, oversee baths/teeth brushing, read stories, create calm environment',
    'daily', 
    45, 
    'high'
  ),
  createCard(
    'Playdates', 
    'children', 
    'Facilitate children\'s social connections',
    'Coordinate with other parents, plan activities, supervise play, arrange transportation',
    'weekly', 
    120
  ),
  createCard(
    'School Pickup/Dropoff', 
    'children', 
    'Manage school transportation',
    'Plan timing, arrange backup plans, communicate with school, ensure safety',
    'daily', 
    30, 
    'high'
  ),
  createCard(
    'Homework Supervision', 
    'children', 
    'Support children\'s academic success',
    'Check homework completion, provide help when needed, communicate with teachers',
    'daily', 
    45
  ),
  createCard(
    'Extracurricular Activities', 
    'children', 
    'Manage children\'s activities and sports',
    'Research options, register for activities, arrange transportation, buy equipment',
    'seasonal', 
    180
  ),
  createCard(
    'Children\'s Clothing', 
    'children', 
    'Maintain appropriate clothing',
    'Monitor growth, shop for new clothes, organize seasonal clothing, donate outgrown items',
    'seasonal', 
    120
  ),
  createCard(
    'Dental Appointments', 
    'children', 
    'Maintain children\'s dental health',
    'Schedule cleanings, arrange orthodontic care, teach proper brushing, monitor dental health',
    'as-needed', 
    90
  ),
  createCard(
    'Birthday Parties', 
    'children', 
    'Celebrate children\'s milestones',
    'Plan parties, send invitations, buy gifts for friends\' parties, arrange activities',
    'as-needed', 
    180
  ),
  createCard(
    'Summer Camp', 
    'children', 
    'Plan summer activities',
    'Research camps, register early, arrange transportation, pack supplies',
    'seasonal', 
    240
  ),
  createCard(
    'School Supplies', 
    'children', 
    'Maintain educational materials',
    'Buy school supplies, organize backpacks, replace broken items, prepare for new school year',
    'seasonal', 
    90
  ),
  createCard(
    'Children\'s Chores', 
    'children', 
    'Teach responsibility and life skills',
    'Assign age-appropriate chores, create chore charts, provide guidance and follow-up',
    'weekly', 
    30
  ),
  createCard(
    'Screen Time Management', 
    'children', 
    'Balance technology use',
    'Set screen time limits, choose appropriate content, monitor usage, plan tech-free activities',
    'daily', 
    20
  ),
  createCard(
    'Children\'s Mental Health', 
    'children', 
    'Support emotional wellbeing',
    'Monitor emotional state, arrange counseling if needed, teach coping skills',
    'as-needed', 
    120, 
    'high'
  ),
  createCard(
    'Babysitter Coordination', 
    'children', 
    'Arrange childcare when needed',
    'Find reliable babysitters, provide instructions, arrange payment, maintain contact list',
    'as-needed', 
    60
  ),
  createCard(
    'Children\'s Room Organization', 
    'children', 
    'Maintain organized living spaces',
    'Organize toys, books, and clothes, teach organization skills, create functional spaces',
    'weekly', 
    45
  ),
  createCard(
    'Potty Training', 
    'children', 
    'Support toilet independence',
    'Plan training approach, buy supplies, maintain consistency, celebrate progress',
    'as-needed', 
    60, 
    'high'
  ),
  createCard(
    'Children\'s Nutrition', 
    'children', 
    'Ensure healthy eating habits',
    'Plan nutritious meals, monitor eating habits, teach about healthy foods',
    'daily', 
    30
  ),
  createCard(
    'School Communication', 
    'children', 
    'Maintain connection with teachers',
    'Read school emails, attend conferences, respond to teacher requests, volunteer',
    'weekly', 
    30
  ),
  createCard(
    'Children\'s Safety', 
    'children', 
    'Ensure physical safety and security',
    'Teach safety rules, childproof home, monitor online activity, plan emergency procedures',
    'as-needed', 
    90, 
    'high'
  ),
  createCard(
    'Teenage Independence', 
    'children', 
    'Support growing autonomy',
    'Teach life skills, discuss responsibilities, provide guidance while allowing independence',
    'weekly', 
    60
  ),
  createCard(
    'College Preparation', 
    'children', 
    'Support higher education planning',
    'Research colleges, help with applications, arrange campus visits, plan financing',
    'as-needed', 
    300
  ),
  createCard(
    'Children\'s Transportation', 
    'children', 
    'Coordinate all child transportation needs',
    'Plan routes, arrange carpools, teach public transportation, ensure safety',
    'daily', 
    45
  ),

  // ADULT RELATIONSHIPS (20 cards)
  createCard(
    'Date Nights', 
    'adult-relationships', 
    'Nurture romantic relationship',
    'Plan activities, arrange childcare, make reservations, create special moments together',
    'weekly', 
    30
  ),
  createCard(
    'Family Birthdays', 
    'adult-relationships', 
    'Celebrate family milestones',
    'Remember dates, plan celebrations, buy gifts, coordinate with extended family',
    'as-needed', 
    180
  ),
  createCard(
    'Holiday Planning', 
    'adult-relationships', 
    'Organize holiday celebrations',
    'Plan menus, buy decorations, coordinate travel, manage gift exchanges',
    'seasonal', 
    300, 
    'high'
  ),
  createCard(
    'Extended Family', 
    'adult-relationships', 
    'Maintain family relationships',
    'Remember important events, coordinate visits, send cards/gifts, plan gatherings',
    'monthly', 
    60
  ),
  createCard(
    'Anniversary Celebrations', 
    'adult-relationships', 
    'Honor relationship milestones',
    'Plan special celebrations, make reservations, buy gifts, create meaningful experiences',
    'as-needed', 
    120
  ),
  createCard(
    'Friend Relationships', 
    'adult-relationships', 
    'Maintain social connections',
    'Plan social activities, remember birthdays, coordinate group events, nurture friendships',
    'monthly', 
    90
  ),
  createCard(
    'Couple\'s Therapy', 
    'adult-relationships', 
    'Invest in relationship health',
    'Research therapists, schedule appointments, prepare for sessions, implement strategies',
    'as-needed', 
    120
  ),
  createCard(
    'Valentine\'s Day', 
    'adult-relationships', 
    'Celebrate romantic love',
    'Plan romantic activities, buy gifts, make reservations, create special atmosphere',
    'seasonal', 
    90
  ),
  createCard(
    'Wedding Planning', 
    'adult-relationships', 
    'Plan wedding celebrations for others',
    'Coordinate bachelor/bachelorette parties, buy gifts, arrange travel, participate in ceremonies',
    'as-needed', 
    240
  ),
  createCard(
    'Couple\'s Finances', 
    'adult-relationships', 
    'Manage shared financial goals',
    'Plan budgets together, discuss financial goals, coordinate major purchases',
    'monthly', 
    90
  ),
  createCard(
    'In-Law Relationships', 
    'adult-relationships', 
    'Maintain extended family harmony',
    'Plan visits, remember important dates, coordinate holiday schedules, manage boundaries',
    'monthly', 
    60
  ),
  createCard(
    'Couple\'s Hobbies', 
    'adult-relationships', 
    'Share interests and activities',
    'Plan shared activities, research new hobbies, coordinate schedules, invest in equipment',
    'weekly', 
    60
  ),
  createCard(
    'Relationship Goals', 
    'adult-relationships', 
    'Plan for the future together',
    'Discuss life goals, plan major decisions, coordinate career moves, plan family growth',
    'monthly', 
    90
  ),
  createCard(
    'Social Calendar', 
    'adult-relationships', 
    'Coordinate social activities',
    'Plan dinner parties, coordinate with friends, manage invitations, balance social commitments',
    'weekly', 
    45
  ),
  createCard(
    'Gift Giving', 
    'adult-relationships', 
    'Manage gift obligations',
    'Remember occasions, shop for gifts, wrap presents, coordinate gift exchanges',
    'as-needed', 
    90
  ),
  createCard(
    'Vacation Planning', 
    'adult-relationships', 
    'Plan couple getaways',
    'Research destinations, book accommodations, plan activities, arrange time off',
    'as-needed', 
    240
  ),
  createCard(
    'Communication Rituals', 
    'adult-relationships', 
    'Maintain open communication',
    'Schedule regular check-ins, practice active listening, address conflicts constructively',
    'weekly', 
    30
  ),
  createCard(
    'Intimacy Planning', 
    'adult-relationships', 
    'Nurture physical connection',
    'Plan romantic evenings, communicate needs, create intimate atmosphere, prioritize connection',
    'weekly', 
    45
  ),
  createCard(
    'Career Support', 
    'adult-relationships', 
    'Support partner\'s professional growth',
    'Discuss career goals, provide encouragement, adjust household responsibilities during busy periods',
    'as-needed', 
    60
  ),
  createCard(
    'Conflict Resolution', 
    'adult-relationships', 
    'Address relationship challenges',
    'Identify issues early, practice healthy conflict resolution, seek help when needed',
    'as-needed', 
    90
  ),

  // MAGIC (15 cards)
  createCard(
    'Family Traditions', 
    'magic', 
    'Create meaningful family memories',
    'Plan special traditions, gather supplies, document moments, maintain consistency year to year',
    'seasonal', 
    120
  ),
  createCard(
    'Surprise Gifts', 
    'magic', 
    'Create unexpected joy',
    'Notice what would bring happiness, plan surprises, shop for special items, coordinate timing',
    'as-needed', 
    90
  ),
  createCard(
    'Photo Organization', 
    'magic', 
    'Preserve family memories',
    'Take photos, organize digital files, create albums, print special photos, backup files',
    'monthly', 
    60
  ),
  createCard(
    'Special Occasions', 
    'magic', 
    'Make ordinary moments extraordinary',
    'Recognize opportunities for celebration, plan special touches, create atmosphere',
    'as-needed', 
    45
  ),
  createCard(
    'Memory Books', 
    'magic', 
    'Document family history',
    'Create scrapbooks, write family stories, organize memorabilia, interview relatives',
    'seasonal', 
    180
  ),
  createCard(
    'Tooth Fairy', 
    'magic', 
    'Maintain childhood magic',
    'Remember when teeth are lost, prepare special notes, coordinate with partner, create wonder',
    'as-needed', 
    15
  ),
  createCard(
    'Santa/Holiday Magic', 
    'magic', 
    'Create holiday wonder',
    'Plan Santa visits, wrap special gifts, create magical experiences, maintain belief',
    'seasonal', 
    240
  ),
  createCard(
    'Birthday Magic', 
    'magic', 
    'Make birthdays special',
    'Plan surprise elements, create special traditions, coordinate celebrations, document milestones',
    'as-needed', 
    120
  ),
  createCard(
    'Adventure Planning', 
    'magic', 
    'Create exciting family experiences',
    'Plan special outings, research unique activities, create adventure lists, document experiences',
    'monthly', 
    90
  ),
  createCard(
    'Seasonal Activities', 
    'magic', 
    'Celebrate changing seasons',
    'Plan seasonal activities, create seasonal traditions, embrace weather changes, make memories',
    'seasonal', 
    60
  ),
  createCard(
    'Learning Adventures', 
    'magic', 
    'Make education exciting',
    'Plan educational trips, create learning games, explore museums, encourage curiosity',
    'monthly', 
    120
  ),
  createCard(
    'Milestone Celebrations', 
    'magic', 
    'Honor important achievements',
    'Recognize accomplishments, plan celebrations, create certificates, document progress',
    'as-needed', 
    90
  ),
  createCard(
    'Family Game Nights', 
    'magic', 
    'Create fun family bonding time',
    'Plan game nights, buy new games, create tournaments, make special snacks',
    'weekly', 
    30
  ),
  createCard(
    'Storytelling Traditions', 
    'magic', 
    'Create narrative family culture',
    'Tell family stories, create bedtime stories, record stories, encourage imagination',
    'weekly', 
    45
  ),
  createCard(
    'Gratitude Practices', 
    'magic', 
    'Foster appreciation and mindfulness',
    'Create gratitude rituals, teach thankfulness, document blessings, celebrate abundance',
    'weekly', 
    20
  ),

  // WILD CARDS (15 cards)
  createCard(
    'Illness Management', 
    'wild-cards', 
    'Handle family health crises',
    'Recognize symptoms, contact doctors, manage medications, arrange care, adjust schedules',
    'as-needed', 
    240, 
    'high'
  ),
  createCard(
    'Travel Planning', 
    'wild-cards', 
    'Organize family trips',
    'Research destinations, book flights/hotels, plan itineraries, pack for everyone, arrange pet care',
    'as-needed', 
    360
  ),
  createCard(
    'Home Repairs', 
    'wild-cards', 
    'Maintain household functionality',
    'Notice what needs fixing, research solutions, contact contractors, oversee repairs',
    'as-needed', 
    180
  ),
  createCard(
    'School Issues', 
    'wild-cards', 
    'Handle unexpected school situations',
    'Communicate with teachers, attend meetings, advocate for children, implement solutions',
    'as-needed', 
    120, 
    'high'
  ),
  createCard(
    'Financial Emergencies', 
    'wild-cards', 
    'Manage unexpected expenses',
    'Assess situation, research options, make decisions, implement solutions, adjust budget',
    'as-needed', 
    180, 
    'high'
  ),
  createCard(
    'Pet Care', 
    'wild-cards', 
    'Manage pet health and needs',
    'Schedule vet visits, manage feeding, arrange pet sitting, handle emergencies',
    'weekly', 
    60
  ),
  createCard(
    'Technology Issues', 
    'wild-cards', 
    'Handle tech problems and updates',
    'Troubleshoot problems, research solutions, coordinate repairs, manage updates',
    'as-needed', 
    90
  ),
  createCard(
    'Insurance Claims', 
    'wild-cards', 
    'Handle insurance matters',
    'File claims, communicate with agents, gather documentation, follow up on claims',
    'as-needed', 
    180
  ),
  createCard(
    'Legal Issues', 
    'wild-cards', 
    'Handle legal matters',
    'Research legal requirements, contact attorneys, gather documents, attend meetings',
    'as-needed', 
    240, 
    'high'
  ),
  createCard(
    'Moving/Relocation', 
    'wild-cards', 
    'Coordinate household moves',
    'Research movers, pack belongings, coordinate utilities, update addresses',
    'as-needed', 
    480, 
    'high'
  ),
  createCard(
    'Job Loss/Career Change', 
    'wild-cards', 
    'Navigate employment transitions',
    'Update resume, search for jobs, network, adjust budget, provide emotional support',
    'as-needed', 
    300, 
    'high'
  ),
  createCard(
    'Family Emergencies', 
    'wild-cards', 
    'Handle family crises',
    'Coordinate care for family members, arrange travel, manage communications, provide support',
    'as-needed', 
    360, 
    'high'
  ),
  createCard(
    'Natural Disasters', 
    'wild-cards', 
    'Prepare for and respond to emergencies',
    'Create emergency plans, maintain emergency supplies, coordinate evacuation if needed',
    'as-needed', 
    240, 
    'high'
  ),
  createCard(
    'Aging Parents', 
    'wild-cards', 
    'Support elderly family members',
    'Coordinate care, manage medical appointments, research care options, provide emotional support',
    'as-needed', 
    240, 
    'high'
  ),
  createCard(
    'Unexpected Guests', 
    'wild-cards', 
    'Handle surprise visitors',
    'Prepare accommodations, adjust meal plans, coordinate schedules, ensure comfort',
    'as-needed', 
    120
  ),
];