# Production Database Schema

## Collaborative Sessions Table

### Firebase Firestore Collection: `collaborative_sessions`

```javascript
{
  // Document ID: sessionId (e.g., "collab-1234567890")
  id: string,
  coupleId: string,
  partner1: {
    id: string,
    name: string,
    email: string
  },
  partner2: {
    id: string,
    name: string,
    email: string
  },
  createdAt: timestamp,
  status: 'active' | 'completed' | 'merged',
  
  // Individual partner responses
  partner1Response?: {
    partnerId: string,
    completedAt: timestamp,
    cards: Array<InsamaCard>,
    bills: Array<HouseholdBill>,
    isComplete: boolean
  },
  partner2Response?: {
    partnerId: string,
    completedAt: timestamp,
    cards: Array<InsamaCard>,
    bills: Array<HouseholdBill>,
    isComplete: boolean
  },
  
  // Conflicts detected
  conflicts?: Array<{
    id: string,
    type: 'card_ownership' | 'bill_responsibility' | 'amount_mismatch',
    itemId: string,
    itemName: string,
    partner1Choice: any,
    partner2Choice: any,
    resolution?: 'partner1' | 'partner2' | 'shared' | 'custom',
    customResolution?: any,
    resolvedBy?: string,
    resolvedAt?: timestamp
  }>,
  
  // Final merged data
  mergedData?: {
    cards: Array<InsamaCard>,
    bills: Array<HouseholdBill>
  },
  
  // Metadata
  version: number,
  lastUpdated: timestamp,
  expiresAt: timestamp // Optional: auto-cleanup old sessions
}
```

### Supabase PostgreSQL Table: `collaborative_sessions`

```sql
CREATE TABLE collaborative_sessions (
  id TEXT PRIMARY KEY,
  couple_id TEXT NOT NULL,
  partner1 JSONB NOT NULL,
  partner2 JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT CHECK (status IN ('active', 'completed', 'merged')) DEFAULT 'active',
  partner1_response JSONB,
  partner2_response JSONB,
  conflicts JSONB,
  merged_data JSONB,
  version INTEGER DEFAULT 1,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_collaborative_sessions_couple_id ON collaborative_sessions(couple_id);
CREATE INDEX idx_collaborative_sessions_status ON collaborative_sessions(status);
CREATE INDEX idx_collaborative_sessions_created_at ON collaborative_sessions(created_at);
CREATE INDEX idx_collaborative_sessions_expires_at ON collaborative_sessions(expires_at);

-- Auto-update last_updated
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    NEW.version = OLD.version + 1;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_collaborative_sessions_last_updated 
  BEFORE UPDATE ON collaborative_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();
```

## Regular Couple Data Table

### Firebase Firestore Collection: `couples`

```javascript
{
  // Document ID: coupleId
  id: string,
  partner1: {
    id: string,
    name: string,
    email: string,
    avatar?: string
  },
  partner2: {
    id: string,
    name: string,
    email: string,
    avatar?: string
  },
  mode: 'together' | 'individual',
  createdAt: timestamp,
  lastCheckIn?: timestamp,
  currentPartnerId?: string,
  
  // Household data
  cards: Array<InsamaCard>,
  bills: Array<HouseholdBill>,
  checkIns: Array<CheckInSession>,
  
  // Metadata
  version: number,
  lastUpdated: timestamp
}
```

### Supabase PostgreSQL Table: `couples`

```sql
CREATE TABLE couples (
  id TEXT PRIMARY KEY,
  partner1 JSONB NOT NULL,
  partner2 JSONB NOT NULL,
  mode TEXT CHECK (mode IN ('together', 'individual')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_check_in TIMESTAMP WITH TIME ZONE,
  current_partner_id TEXT,
  cards JSONB DEFAULT '[]',
  bills JSONB DEFAULT '[]',
  check_ins JSONB DEFAULT '[]',
  version INTEGER DEFAULT 1,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_couples_mode ON couples(mode);
CREATE INDEX idx_couples_created_at ON couples(created_at);
CREATE INDEX idx_couples_current_partner_id ON couples(current_partner_id);

-- Auto-update trigger
CREATE TRIGGER update_couples_last_updated 
  BEFORE UPDATE ON couples 
  FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();
```

## Production Deployment Options

### Option 1: Firebase (Recommended for simplicity)
```bash
# Install Firebase
npm install firebase

# Initialize Firebase in your app
# Set up Firestore rules for security
# Deploy to Firebase Hosting
```

### Option 2: Supabase (Recommended for PostgreSQL)
```bash
# Install Supabase
npm install @supabase/supabase-js

# Set up Supabase project
# Run the SQL schema above
# Deploy to Vercel/Netlify
```

### Option 3: AWS (For enterprise)
```bash
# Use DynamoDB for NoSQL
# Or RDS PostgreSQL for relational
# Deploy with AWS Amplify or Lambda
```

## Security Considerations

1. **Authentication**: Require user authentication
2. **Authorization**: Only session participants can access data
3. **Rate Limiting**: Prevent abuse
4. **Data Validation**: Validate all inputs
5. **Encryption**: Encrypt sensitive data
6. **Backup**: Regular automated backups
7. **Monitoring**: Track usage and errors

## Migration Strategy

1. **Phase 1**: Implement production storage service
2. **Phase 2**: Add authentication
3. **Phase 3**: Migrate existing localStorage data
4. **Phase 4**: Add real-time features
5. **Phase 5**: Add analytics and monitoring
