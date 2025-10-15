import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Welcome } from './components/Welcome';
import { Dashboard } from './components/Dashboard';
import { IndividualModeSelector } from './components/IndividualModeSelector';
import { CollaborativeSessionManager } from './components/CollaborativeSessionManager';
import { useLocalStorage } from './hooks/useLocalStorage';
import { InsamaCard, Partner, Couple, CheckInSession, HouseholdBill, CollaborativeSession } from './types';

function App() {
  const [couple, setCouple] = useLocalStorage<Couple | null>('insamaCouple', null);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'individual-selector' | 'dashboard' | 'collaborative'>('welcome');
  const [currentPartnerId, setCurrentPartnerId] = useState<string | null>(null);

  // Check URL for session parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    const partnerId = urlParams.get('partner');
    
    // Check if this is a collaborative session
    if (sessionId && partnerId) {
      // Check if it's a collaborative session (starts with 'collab-')
      if (sessionId.startsWith('collab-')) {
        setCurrentStep('collaborative');
        return;
      }
      
      // Check if it's a regular couple session
      if (couple && couple.id === sessionId && (partnerId === 'partner1' || partnerId === 'partner2')) {
        setCurrentPartnerId(partnerId);
        setCurrentStep('dashboard');
        return;
      }
    }

    // Normal flow
    if (couple) {
      if (couple.mode === 'individual' && !couple.currentPartnerId) {
        setCurrentStep('individual-selector');
      } else {
        setCurrentStep('dashboard');
        if (couple.mode === 'individual') {
          setCurrentPartnerId(couple.currentPartnerId || null);
        }
      }
    } else {
      // Always ensure we start at welcome if no couple exists
      setCurrentStep('welcome');
    }
  }, [couple]);

  const handleCreateCouple = (partner1Name: string, partner2Name: string, mode: 'together' | 'individual' | 'collaborative') => {
    if (mode === 'collaborative') {
      setCurrentStep('collaborative');
      return;
    }
    const newCouple: Couple = {
      id: `couple-${Date.now()}`,
      partner1: {
        id: 'partner1',
        name: partner1Name,
        email: '',
      },
      partner2: {
        id: 'partner2',
        name: partner2Name,
        email: '',
      },
      mode,
      createdAt: new Date(),
      cards: [],
      bills: [],
      checkIns: [],
    };
    
    setCouple(newCouple);
    
    if (mode === 'individual') {
      setCurrentStep('individual-selector');
    } else {
      setCurrentStep('dashboard');
    }
  };

  const handlePartnerSelection = (partnerId: string) => {
    if (couple) {
      const updatedCouple = {
        ...couple,
        currentPartnerId: partnerId,
      };
      setCouple(updatedCouple);
      setCurrentPartnerId(partnerId);
      setCurrentStep('dashboard');

      // Update URL for individual mode
      if (couple.mode === 'individual') {
        const newUrl = `${window.location.origin}${window.location.pathname}?session=${couple.id}&partner=${partnerId}`;
        window.history.replaceState({}, '', newUrl);
      }
    }
  };

  const handleUpdateCards = (cards: InsamaCard[]) => {
    if (couple) {
      setCouple({
        ...couple,
        cards,
      });
    }
  };

  const handleUpdateBills = (bills: HouseholdBill[]) => {
    if (couple) {
      setCouple({
        ...couple,
        bills,
      });
    }
  };

  const handleSaveCheckIn = (session: Omit<CheckInSession, 'id' | 'date'>) => {
    if (couple) {
      const newCheckIn: CheckInSession = {
        ...session,
        id: `checkin-${Date.now()}`,
        date: new Date(),
      };
      
      setCouple({
        ...couple,
        checkIns: [...(couple.checkIns || []), newCheckIn],
        lastCheckIn: new Date(),
      });
    }
  };

  const getHeaderProps = () => {
    if (!couple) return {};
    
    const isIndividualMode = couple.mode === 'individual';
    const currentPartnerName = currentPartnerId === 'partner1' ? couple.partner1.name : couple.partner2.name;
    
    return {
      currentStep: currentStep === 'dashboard' ? 
        (isIndividualMode ? `${currentPartnerName}'s Insama Session` : 'Insama Dashboard') : 
        undefined,
      partnerNames: [couple.partner1.name, couple.partner2.name] as [string, string],
      mode: couple.mode,
      currentPartnerId: isIndividualMode ? currentPartnerId : undefined,
    };
  };

  const resetToPartnerSelection = () => {
    if (couple) {
      setCouple({
        ...couple,
        currentPartnerId: undefined,
      });
      setCurrentPartnerId(null);
      setCurrentStep('individual-selector');
      
      // Clear URL parameters
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleStartOver = () => {
    setCouple(null);
    setCurrentPartnerId(null);
    setCurrentStep('welcome');
    
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
  };

  const generatePartnerLink = (partnerId: string) => {
    if (!couple) return '';
    return `${window.location.origin}${window.location.pathname}?session=${couple.id}&partner=${partnerId}`;
  };

  const handleCollaborativeSessionComplete = (session: CollaborativeSession) => {
    // Convert collaborative session to regular couple data
    const newCouple: Couple = {
      id: session.coupleId,
      partner1: session.partner1,
      partner2: session.partner2,
      mode: 'together',
      createdAt: session.createdAt,
      cards: session.mergedData?.cards || [],
      bills: session.mergedData?.bills || [],
      checkIns: [],
    };
    
    setCouple(newCouple);
    setCurrentStep('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {couple && (
        <Header 
          {...getHeaderProps()} 
          onSwitchPartner={couple.mode === 'individual' ? resetToPartnerSelection : undefined}
          onStartOver={handleStartOver}
        />
      )}
      
      {currentStep === 'welcome' && (
        <Welcome onContinue={handleCreateCouple} />
      )}
      
      {currentStep === 'individual-selector' && couple && (
        <IndividualModeSelector
          partner1={couple.partner1}
          partner2={couple.partner2}
          onSelectPartner={handlePartnerSelection}
          generatePartnerLink={generatePartnerLink}
        />
      )}
      
      {currentStep === 'dashboard' && couple && (
        <Dashboard
          partner1={couple.partner1}
          partner2={couple.partner2}
          cards={couple.cards || []}
          bills={couple.bills || []}
          checkIns={couple.checkIns || []}
          mode={couple.mode}
          currentPartnerId={currentPartnerId}
          onUpdateCards={handleUpdateCards}
          onUpdateBills={handleUpdateBills}
          onSaveCheckIn={handleSaveCheckIn}
        />
      )}

      {currentStep === 'collaborative' && (
        <CollaborativeSessionManager
          partner1={{ id: 'partner1', name: 'Partner 1', email: '' }}
          partner2={{ id: 'partner2', name: 'Partner 2', email: '' }}
          onSessionComplete={handleCollaborativeSessionComplete}
        />
      )}
    </div>
  );
}

export default App;