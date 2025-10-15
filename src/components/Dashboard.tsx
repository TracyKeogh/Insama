import React, { useState } from 'react';
import { Plus, BarChart3, MessageCircle, Users, DollarSign } from 'lucide-react';
import { InsamaCard, Partner, CheckInSession, HouseholdBill } from '../types';
import { CardDeck } from './CardDeck';
import { OwnershipTracker } from './OwnershipTracker';
import { CheckInRitual } from './CheckInRitual';
import { FinanceManager } from './FinanceManager';
import { insamaCards } from '../data/insamaCards';
import { defaultBills } from '../data/defaultBills';

interface DashboardProps {
  partner1: Partner;
  partner2: Partner;
  cards: InsamaCard[];
  bills: HouseholdBill[];
  checkIns: CheckInSession[];
  mode: 'together' | 'individual';
  currentPartnerId?: string | null;
  onUpdateCards: (cards: InsamaCard[]) => void;
  onUpdateBills: (bills: HouseholdBill[]) => void;
  onSaveCheckIn: (session: Omit<CheckInSession, 'id' | 'date'>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  partner1, 
  partner2, 
  cards, 
  bills = [],
  checkIns = [],
  mode,
  currentPartnerId,
  onUpdateCards,
  onUpdateBills,
  onSaveCheckIn
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'tracker' | 'finances' | 'checkin'>('cards');

  const handleUpdateCard = (cardId: string, updates: Partial<InsamaCard>) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, ...updates } : card
    );
    onUpdateCards(updatedCards);
  };

  const handleUpdateBill = (billId: string, updates: Partial<HouseholdBill>) => {
    const updatedBills = bills.map(bill => 
      bill.id === billId ? { ...bill, ...updates } : bill
    );
    onUpdateBills(updatedBills);
  };

  const handleAddBill = (newBill: Omit<HouseholdBill, 'id' | 'createdAt'>) => {
    const bill: HouseholdBill = {
      ...newBill,
      id: `bill-${Date.now()}`,
      createdAt: new Date(),
    };
    onUpdateBills([...bills, bill]);
  };

  const handleDeleteBill = (billId: string) => {
    const updatedBills = bills.map(bill => 
      bill.id === billId ? { ...bill, isActive: false } : bill
    );
    onUpdateBills(updatedBills);
  };

  const addDefaultCards = () => {
    const newCards = insamaCards.map((card, index) => ({
      ...card,
      id: `card-${Date.now()}-${index}`,
      ownership: { think: null, plan: null, do: null },
      createdAt: new Date(),
    }));
    onUpdateCards([...cards, ...newCards]);
  };

  const addDefaultBills = () => {
    const newBills = defaultBills.map((bill, index) => ({
      ...bill,
      id: `bill-${Date.now()}-${index}`,
      isActive: true,
      createdAt: new Date(),
    }));
    onUpdateBills([...bills, ...newBills]);
  };

  const lastCheckIn = checkIns.length > 0 ? checkIns[checkIns.length - 1].date : undefined;

  if (cards.length === 0 && bills.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100">
              <div className="text-6xl mb-6">🏠</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Insama Dashboard</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                Start organizing your household by adding task cards and financial bills. 
                Use the Think → Plan → Do framework to assign clear ownership.
              </p>
              
              {mode === 'individual' && (
                <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Individual Mode: You're setting up for both partners. Your partner will be able to access and modify these when they log in.
                  </p>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={addDefaultCards}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto text-lg"
                >
                  <Plus className="h-6 w-6" />
                  <span>Add Task Cards</span>
                </button>
                
                <button
                  onClick={addDefaultBills}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto text-lg"
                >
                  <DollarSign className="h-6 w-6" />
                  <span>Add Bills</span>
                </button>
              </div>
              
              <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <div className="text-3xl mb-3">🧠</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Think</h3>
                  <p className="text-sm text-gray-600">Notice when something needs to be done and initiate the process</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <div className="text-3xl mb-3">📅</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Plan</h3>
                  <p className="text-sm text-gray-600">Organize, schedule, and prepare everything needed</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl">
                  <div className="text-3xl mb-3">✅</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Do</h3>
                  <p className="text-sm text-gray-600">Execute the actual task and complete it</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'cards' as const, label: 'Task Cards', icon: Users },
    { id: 'finances' as const, label: 'Finances', icon: DollarSign },
    { id: 'tracker' as const, label: 'Ownership Tracker', icon: BarChart3 },
    { id: 'checkin' as const, label: 'Check-In Ritual', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-8">
          <div className="flex space-x-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'cards' && (
          <CardDeck
            cards={cards}
            partnerNames={[partner1.name, partner2.name]}
            onUpdateCard={handleUpdateCard}
          />
        )}

        {activeTab === 'finances' && (
          <FinanceManager
            bills={bills}
            partnerNames={[partner1.name, partner2.name]}
            onUpdateBill={handleUpdateBill}
            onAddBill={handleAddBill}
            onDeleteBill={handleDeleteBill}
            onLoadSampleBills={addDefaultBills}
          />
        )}

        {activeTab === 'tracker' && (
          <OwnershipTracker
            cards={cards}
            bills={bills}
            partnerNames={[partner1.name, partner2.name]}
          />
        )}

        {activeTab === 'checkin' && (
          <CheckInRitual
            cards={cards}
            partnerNames={[partner1.name, partner2.name]}
            lastCheckIn={lastCheckIn}
            mode={mode}
            currentPartnerId={currentPartnerId}
            checkIns={checkIns}
            onSaveCheckIn={onSaveCheckIn}
          />
        )}
      </div>
    </div>
  );
};