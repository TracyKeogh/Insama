export interface Partner {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface InsamaCard {
  id: string;
  title: string;
  category: CardCategory;
  description: string;
  mentalLoad: string; // What the full mental load entails
  frequency: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'as-needed';
  timeEstimate: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  holder?: string; // partner id who "holds" this card
  ownership: {
    think: string | null; // partner id - who notices and conceives the need
    plan: string | null;  // partner id - who plans and organizes the task
    do: string | null;    // partner id - who executes the task
  };
  preferences?: {
    partner1: 'hate' | 'meh' | 'enjoy' | null;
    partner2: 'hate' | 'meh' | 'enjoy' | null;
  };
  notes?: {
    partner1: string;
    partner2: string;
  };
  isNotApplicable?: boolean; // New field to mark cards as not applicable
  createdAt: Date;
  lastReviewed?: Date;
}

export type CardCategory = 
  | 'home-cleaning'
  | 'children' 
  | 'adult-relationships'
  | 'magic'
  | 'wild-cards';

export interface HouseholdBill {
  id: string;
  name: string;
  category: BillCategory;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  dueDate: string; // Day of month or specific date
  paymentMethod: 'auto-pay' | 'manual' | 'online' | 'check';
  responsiblePartner?: string; // partner id who pays this bill
  isShared?: boolean; // if both partners contribute
  splitPercentage?: {
    partner1: number;
    partner2: number;
  };
  notes?: string;
  isActive: boolean;
  createdAt: Date;
}

export type BillCategory = 
  | 'housing'
  | 'utilities'
  | 'insurance'
  | 'transportation'
  | 'food'
  | 'healthcare'
  | 'childcare'
  | 'entertainment'
  | 'debt'
  | 'savings'
  | 'other';

export interface CheckInResponse {
  unfairThisWeek: string[];
  cardsToPass: { cardId: string; reason: string }[];
  appreciations: string[];
  nextWeekFocus: string[];
}

export interface CheckInSession {
  id: string;
  date: Date;
  mode: 'together' | 'individual';
  responses: CheckInResponse | {
    partner1: CheckInResponse;
    partner2: CheckInResponse;
  };
  notes: string;
  isComplete: boolean;
  completedBy?: string[]; // For individual mode - tracks who has completed
}

export interface Couple {
  id: string;
  partner1: Partner;
  partner2: Partner;
  mode: 'together' | 'individual'; // New field for usage mode
  createdAt: Date;
  cards: InsamaCard[];
  bills: HouseholdBill[]; // New field for household bills
  checkIns: CheckInSession[];
  lastCheckIn?: Date;
  currentPartnerId?: string; // For individual mode - tracks current user
}

export interface IndividualSession {
  partnerId: string;
  partnerName: string;
  coupleId: string;
  isWaitingForPartner?: boolean;
}

export interface CollaborativeSession {
  id: string;
  coupleId: string;
  partner1: Partner;
  partner2: Partner;
  createdAt: Date;
  status: 'active' | 'completed' | 'merged';
  
  // Individual partner responses
  partner1Response?: PartnerResponse;
  partner2Response?: PartnerResponse;
  
  // Conflicts detected
  conflicts?: Conflict[];
  
  // Final merged data
  mergedData?: {
    cards: InsamaCard[];
    bills: HouseholdBill[];
  };
}

export interface PartnerResponse {
  partnerId: string;
  completedAt: Date;
  cards: InsamaCard[];
  bills: HouseholdBill[];
  isComplete: boolean;
}

export interface Conflict {
  id: string;
  type: 'card_ownership' | 'bill_responsibility' | 'amount_mismatch';
  itemId: string; // card or bill id
  itemName: string;
  partner1Choice: any;
  partner2Choice: any;
  resolution?: 'partner1' | 'partner2' | 'shared' | 'custom';
  customResolution?: any;
  resolvedBy?: string;
  resolvedAt?: Date;
}