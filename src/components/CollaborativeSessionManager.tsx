import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, AlertTriangle, Clock, Link, Copy, Share2, Euro, BarChart3 } from 'lucide-react';
import { CollaborativeSession, PartnerResponse, Conflict, InsamaCard, HouseholdBill, Partner } from '../types';
import { defaultBills } from '../data/defaultBills';
import { insamaCards } from '../data/insamaCards';

interface CollaborativeSessionManagerProps {
  partner1: Partner;
  partner2: Partner;
  onSessionComplete: (session: CollaborativeSession) => void;
}

export const CollaborativeSessionManager: React.FC<CollaborativeSessionManagerProps> = ({
  partner1,
  partner2,
  onSessionComplete
}) => {
  const [session, setSession] = useState<CollaborativeSession | null>(null);
  const [currentPartner, setCurrentPartner] = useState<'partner1' | 'partner2' | null>(null);
  const [showConflictResolution, setShowConflictResolution] = useState(false);

  useEffect(() => {
    // Check URL parameters to determine which partner is accessing
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    const partnerId = urlParams.get('partner');
    
    if (sessionId && partnerId) {
      // Load existing session
      const existingSession = loadSession(sessionId);
      if (existingSession) {
        setSession(existingSession);
        setCurrentPartner(partnerId as 'partner1' | 'partner2');
      }
    } else {
      // Create new collaborative session
      const newSession = createNewSession();
      setSession(newSession);
      setCurrentPartner('partner1'); // Default to partner1 for setup
    }
  }, []);

  const createNewSession = (): CollaborativeSession => {
    const sessionId = `collab-${Date.now()}`;
    const newSession: CollaborativeSession = {
      id: sessionId,
      coupleId: `couple-${Date.now()}`,
      partner1,
      partner2,
      createdAt: new Date(),
      status: 'active'
    };
    
    // Save to localStorage
    localStorage.setItem(`collab-session-${sessionId}`, JSON.stringify(newSession));
    return newSession;
  };

  const loadSession = (sessionId: string): CollaborativeSession | null => {
    const saved = localStorage.getItem(`collab-session-${sessionId}`);
    return saved ? JSON.parse(saved) : null;
  };

  const saveSession = (updatedSession: CollaborativeSession) => {
    localStorage.setItem(`collab-session-${updatedSession.id}`, JSON.stringify(updatedSession));
    setSession(updatedSession);
  };

  const generatePartnerLink = (partnerId: 'partner1' | 'partner2'): string => {
    if (!session) return '';
    return `${window.location.origin}${window.location.pathname}?session=${session.id}&partner=${partnerId}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handlePartnerComplete = (partnerId: 'partner1' | 'partner2', response: PartnerResponse) => {
    if (!session) return;

    const updatedSession = {
      ...session,
      [`${partnerId}Response`]: response
    };

    // Check if both partners have completed
    if (updatedSession.partner1Response && updatedSession.partner2Response) {
      updatedSession.status = 'completed';
      updatedSession.conflicts = detectConflicts(updatedSession);
      setShowConflictResolution(true);
    }

    saveSession(updatedSession);
  };

  const detectConflicts = (session: CollaborativeSession): Conflict[] => {
    const conflicts: Conflict[] = [];
    
    if (!session.partner1Response || !session.partner2Response) return conflicts;

    // Check card ownership conflicts
    session.partner1Response.cards.forEach(card1 => {
      const card2 = session.partner2Response!.cards.find(c => c.id === card1.id);
      if (card2) {
        // Check for ownership conflicts in think/plan/do
        const ownershipConflicts = [];
        if (card1.ownership.think && card2.ownership.think && card1.ownership.think !== card2.ownership.think) {
          ownershipConflicts.push('think');
        }
        if (card1.ownership.plan && card2.ownership.plan && card1.ownership.plan !== card2.ownership.plan) {
          ownershipConflicts.push('plan');
        }
        if (card1.ownership.do && card2.ownership.do && card1.ownership.do !== card2.ownership.do) {
          ownershipConflicts.push('do');
        }

        if (ownershipConflicts.length > 0) {
          conflicts.push({
            id: `conflict-${card1.id}-ownership`,
            type: 'card_ownership',
            itemId: card1.id,
            itemName: card1.title,
            partner1Choice: card1.ownership,
            partner2Choice: card2.ownership,
            conflictDetails: ownershipConflicts
          });
        }
      }
    });

    // Check bill responsibility conflicts
    session.partner1Response.bills.forEach(bill1 => {
      const bill2 = session.partner2Response!.bills.find(b => b.id === bill1.id);
      if (bill2) {
        // Check for responsibility conflicts
        const p1Responsible = bill1.responsiblePartner || (bill1.isShared ? 'shared' : 'unassigned');
        const p2Responsible = bill2.responsiblePartner || (bill2.isShared ? 'shared' : 'unassigned');
        
        if (p1Responsible !== p2Responsible) {
          conflicts.push({
            id: `conflict-${bill1.id}-responsibility`,
            type: 'bill_responsibility',
            itemId: bill1.id,
            itemName: bill1.name,
            partner1Choice: p1Responsible,
            partner2Choice: p2Responsible
          });
        }

        // Check for amount mismatches (if both provided amounts)
        if (bill1.amount > 0 && bill2.amount > 0 && Math.abs(bill1.amount - bill2.amount) > 0.01) {
          conflicts.push({
            id: `conflict-${bill1.id}-amount`,
            type: 'amount_mismatch',
            itemId: bill1.id,
            itemName: bill1.name,
            partner1Choice: bill1.amount,
            partner2Choice: bill2.amount
          });
        }
      }
    });

    return conflicts;
  };

  const handleConflictResolution = (conflictId: string, resolution: any) => {
    if (!session || !session.conflicts) return;

    const updatedConflicts = session.conflicts.map(conflict => 
      conflict.id === conflictId 
        ? { ...conflict, resolution: resolution.type, customResolution: resolution.data, resolvedBy: currentPartner, resolvedAt: new Date() }
        : conflict
    );

    const updatedSession = {
      ...session,
      conflicts: updatedConflicts
    };

    saveSession(updatedSession);
  };

  const finalizeSession = () => {
    if (!session || !session.partner1Response || !session.partner2Response) return;

    // Merge the responses, resolving conflicts
    const mergedCards = mergeCards(session);
    const mergedBills = mergeBills(session);

    const finalizedSession = {
      ...session,
      status: 'merged',
      mergedData: {
        cards: mergedCards,
        bills: mergedBills
      }
    };

    saveSession(finalizedSession);
    onSessionComplete(finalizedSession);
  };

  const mergeCards = (session: CollaborativeSession): InsamaCard[] => {
    // Implementation for merging cards with conflict resolution
    return session.partner1Response!.cards; // Simplified for now
  };

  const mergeBills = (session: CollaborativeSession): HouseholdBill[] => {
    // Implementation for merging bills with conflict resolution
    return session.partner1Response!.bills; // Simplified for now
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  // Show conflict resolution if both partners completed
  if (showConflictResolution && session.status === 'completed') {
    return (
      <ConflictResolutionPage 
        session={session}
        currentPartner={currentPartner!}
        onResolveConflict={handleConflictResolution}
        onFinalize={finalizeSession}
      />
    );
  }

  // Show partner link sharing if no current partner determined
  if (!currentPartner) {
    return (
      <PartnerLinkSharing 
        session={session}
        onPartnerSelected={setCurrentPartner}
        generatePartnerLink={generatePartnerLink}
        copyToClipboard={copyToClipboard}
      />
    );
  }

  // Show individual partner interface
  return (
    <IndividualPartnerInterface
      session={session}
      currentPartner={currentPartner}
      onComplete={handlePartnerComplete}
    />
  );
};

// Component for sharing partner links
const PartnerLinkSharing: React.FC<{
  session: CollaborativeSession;
  onPartnerSelected: (partner: 'partner1' | 'partner2') => void;
  generatePartnerLink: (partnerId: 'partner1' | 'partner2') => string;
  copyToClipboard: (text: string) => void;
}> = ({ session, onPartnerSelected, generatePartnerLink, copyToClipboard }) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100">
            <div className="text-6xl mb-6">🤝</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Collaborative Setup</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              Share these links with your partner. Each person will complete their section independently, 
              then we'll show you any conflicts to resolve together.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">{session.partner1.name}'s Link</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generatePartnerLink('partner1')}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-white border border-blue-200 rounded"
                  />
                  <button
                    onClick={() => copyToClipboard(generatePartnerLink('partner1'))}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">{session.partner2.name}'s Link</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generatePartnerLink('partner2')}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-white border border-green-200 rounded"
                  />
                  <button
                    onClick={() => copyToClipboard(generatePartnerLink('partner2'))}
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => onPartnerSelected('partner1')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                I'm {session.partner1.name}
              </button>
              <button
                onClick={() => onPartnerSelected('partner2')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                I'm {session.partner2.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for individual partner interface
const IndividualPartnerInterface: React.FC<{
  session: CollaborativeSession;
  currentPartner: 'partner1' | 'partner2';
  onComplete: (partnerId: 'partner1' | 'partner2', response: PartnerResponse) => void;
}> = ({ session, currentPartner, onComplete }) => {
  const [cards, setCards] = useState<InsamaCard[]>([]);
  const [bills, setBills] = useState<HouseholdBill[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Load sample data
    const sampleCards = insamaCards.map((card, index) => ({
      ...card,
      id: `card-${Date.now()}-${index}`,
      ownership: { think: null, plan: null, do: null },
      createdAt: new Date(),
    }));

    const sampleBills = defaultBills.map((bill, index) => ({
      ...bill,
      id: `bill-${Date.now()}-${index}`,
      isActive: true,
      createdAt: new Date(),
    }));

    setCards(sampleCards);
    setBills(sampleBills);
  }, []);

  const handleComplete = () => {
    const response: PartnerResponse = {
      partnerId: currentPartner,
      completedAt: new Date(),
      cards,
      bills,
      isComplete: true
    };

    onComplete(currentPartner, response);
    setIsComplete(true);
  };

  const currentPartnerName = currentPartner === 'partner1' ? session.partner1.name : session.partner2.name;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Great work, {currentPartnerName}!</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                You've completed your section. Once your partner finishes, we'll show you both 
                any conflicts to resolve together.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
                <h3 className="font-semibold text-blue-900 mb-2">Waiting for {currentPartner === 'partner1' ? session.partner2.name : session.partner1.name}</h3>
                <p className="text-blue-700">Share the link with them if you haven't already!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Return the normal dashboard interface for this partner
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{currentPartnerName}'s Section</h1>
                <p className="text-sm text-gray-500">Complete your tasks and bills independently</p>
              </div>
            </div>
            <button
              onClick={handleComplete}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Complete My Section</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* This would render the normal dashboard components */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">
          Here you would see the normal task cards and bills interface for {currentPartnerName} to complete.
          The cards and bills state would be managed here.
        </p>
      </div>
    </div>
  );
};

// Component for conflict resolution
const ConflictResolutionPage: React.FC<{
  session: CollaborativeSession;
  currentPartner: 'partner1' | 'partner2';
  onResolveConflict: (conflictId: string, resolution: any) => void;
  onFinalize: () => void;
}> = ({ session, currentPartner, onResolveConflict, onFinalize }) => {
  const currentPartnerName = currentPartner === 'partner1' ? session.partner1.name : session.partner2.name;
  const otherPartnerName = currentPartner === 'partner1' ? session.partner2.name : session.partner1.name;

  if (!session.conflicts || session.conflicts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Perfect Harmony!</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                No conflicts detected! Both partners' responses align perfectly. 
                Your household setup is ready.
              </p>
              <button
                onClick={onFinalize}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Finalize Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">Conflict Resolution</h2>
          </div>
          
          <p className="text-gray-600 mb-8">
            We found {session.conflicts.length} conflict(s) between your responses. 
            Please resolve each one to finalize your household setup.
          </p>

          <div className="space-y-6">
            {session.conflicts.map((conflict, index) => (
              <ConflictCard
                key={conflict.id}
                conflict={conflict}
                currentPartnerName={currentPartnerName}
                otherPartnerName={otherPartnerName}
                onResolve={(resolution) => onResolveConflict(conflict.id, resolution)}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onFinalize}
              disabled={session.conflicts.some(c => !c.resolution)}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Finalize Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for individual conflict cards
const ConflictCard: React.FC<{
  conflict: Conflict;
  currentPartnerName: string;
  otherPartnerName: string;
  onResolve: (resolution: any) => void;
}> = ({ conflict, currentPartnerName, otherPartnerName, onResolve }) => {
  const [resolution, setResolution] = useState<string>('');

  const handleResolve = (choice: string) => {
    const resolutionData = {
      type: choice,
      data: choice === 'custom' ? resolution : null
    };
    onResolve(resolutionData);
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
      <h3 className="font-semibold text-orange-900 mb-4">{conflict.itemName}</h3>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">{currentPartnerName}'s Choice</h4>
          <div className="text-sm text-blue-700">
            {conflict.type === 'card_ownership' && (
              <div>
                {Object.entries(conflict.partner1Choice).map(([key, value]) => (
                  <div key={key}>{key}: {value || 'unassigned'}</div>
                ))}
              </div>
            )}
            {conflict.type === 'bill_responsibility' && (
              <div>Responsible: {conflict.partner1Choice}</div>
            )}
            {conflict.type === 'amount_mismatch' && (
              <div>Amount: €{conflict.partner1Choice}</div>
            )}
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">{otherPartnerName}'s Choice</h4>
          <div className="text-sm text-green-700">
            {conflict.type === 'card_ownership' && (
              <div>
                {Object.entries(conflict.partner2Choice).map(([key, value]) => (
                  <div key={key}>{key}: {value || 'unassigned'}</div>
                ))}
              </div>
            )}
            {conflict.type === 'bill_responsibility' && (
              <div>Responsible: {conflict.partner2Choice}</div>
            )}
            {conflict.type === 'amount_mismatch' && (
              <div>Amount: €{conflict.partner2Choice}</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => handleResolve('partner1')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Use {currentPartnerName}'s Choice
        </button>
        <button
          onClick={() => handleResolve('partner2')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Use {otherPartnerName}'s Choice
        </button>
        <button
          onClick={() => handleResolve('shared')}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          Make Shared
        </button>
      </div>
    </div>
  );
};
