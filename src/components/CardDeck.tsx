import React, { useState, useMemo } from 'react';
import { Search, Filter, Users, Clock, AlertCircle, Sparkles, X, Frown, Meh, Smile } from 'lucide-react';
import { InsamaCard, CardCategory } from '../types';
import { InsamaCardComponent } from './InsamaCardComponent';

interface CardDeckProps {
  cards: InsamaCard[];
  partnerNames: [string, string];
  onUpdateCard: (cardId: string, updates: Partial<InsamaCard>) => void;
}

const categoryInfo = {
  'home-cleaning': { 
    label: 'Home & Cleaning', 
    color: 'bg-blue-100 text-blue-800',
    icon: '🏠'
  },
  'children': { 
    label: 'Children', 
    color: 'bg-pink-100 text-pink-800',
    icon: '👶'
  },
  'adult-relationships': { 
    label: 'Adult Relationships', 
    color: 'bg-purple-100 text-purple-800',
    icon: '💕'
  },
  'magic': { 
    label: 'Magic', 
    color: 'bg-yellow-100 text-yellow-800',
    icon: '✨'
  },
  'wild-cards': { 
    label: 'Wild Cards', 
    color: 'bg-red-100 text-red-800',
    icon: '🃏'
  },
};

export const CardDeck: React.FC<CardDeckProps> = ({ 
  cards, 
  partnerNames, 
  onUpdateCard 
}) => {
  const [filter, setFilter] = useState<'all' | CardCategory | 'unassigned' | 'not-applicable' | 'preference-mismatch'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyHeld, setShowOnlyHeld] = useState(false);

  const categories: Array<{ value: CardCategory | 'all' | 'unassigned' | 'not-applicable' | 'preference-mismatch', label: string }> = [
    { value: 'all', label: 'All Cards' },
    { value: 'unassigned', label: 'Unassigned' },
    { value: 'not-applicable', label: 'Not Applicable' },
    { value: 'preference-mismatch', label: 'Preference Conflicts' },
    { value: 'home-cleaning', label: 'Home & Cleaning' },
    { value: 'children', label: 'Children' },
    { value: 'adult-relationships', label: 'Adult Relationships' },
    { value: 'magic', label: 'Magic' },
    { value: 'wild-cards', label: 'Wild Cards' },
  ];

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchesFilter = filter === 'all' || 
                           (filter === 'unassigned' && !card.holder && !card.isNotApplicable) ||
                           (filter === 'not-applicable' && card.isNotApplicable) ||
                           (filter === 'preference-mismatch' && 
                            card.preferences?.partner1 && 
                            card.preferences?.partner2 && 
                            card.preferences.partner1 !== card.preferences.partner2) ||
                           card.category === filter;
      const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesHeld = !showOnlyHeld || card.holder;
      
      return matchesFilter && matchesSearch && matchesHeld;
    });
  }, [cards, filter, searchTerm, showOnlyHeld]);

  const stats = useMemo(() => {
    const applicableCards = cards.filter(c => !c.isNotApplicable);
    const totalCards = cards.length;
    const heldCards = applicableCards.filter(c => c.holder).length;
    const partner1Cards = applicableCards.filter(c => c.holder === 'partner1').length;
    const partner2Cards = applicableCards.filter(c => c.holder === 'partner2').length;
    const unassignedCards = applicableCards.filter(c => !c.holder).length;
    const notApplicableCards = cards.filter(c => c.isNotApplicable).length;
    
    // Preference stats
    const cardsWithPreferences = cards.filter(c => c.preferences?.partner1 || c.preferences?.partner2).length;
    const preferenceMismatches = cards.filter(c => 
      c.preferences?.partner1 && 
      c.preferences?.partner2 && 
      c.preferences.partner1 !== c.preferences.partner2
    ).length;
    
    // Satisfaction analysis
    const partner1Hates = cards.filter(c => c.preferences?.partner1 === 'hate' && c.holder === 'partner1').length;
    const partner2Hates = cards.filter(c => c.preferences?.partner2 === 'hate' && c.holder === 'partner2').length;
    const partner1Enjoys = cards.filter(c => c.preferences?.partner1 === 'enjoy' && c.holder === 'partner1').length;
    const partner2Enjoys = cards.filter(c => c.preferences?.partner2 === 'enjoy' && c.holder === 'partner2').length;
    
    return {
      totalCards,
      heldCards,
      partner1Cards,
      partner2Cards,
      unassignedCards,
      notApplicableCards,
      applicableCards: applicableCards.length,
      cardsWithPreferences,
      preferenceMismatches,
      partner1Hates,
      partner2Hates,
      partner1Enjoys,
      partner2Enjoys,
    };
  }, [cards]);

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cards</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCards}</p>
            </div>
            <div className="text-2xl">🃏</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Applicable</p>
              <p className="text-2xl font-bold text-blue-600">{stats.applicableCards}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{partnerNames[0]}</p>
              <p className="text-2xl font-bold text-blue-600">{stats.partner1Cards}</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {partnerNames[0].charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{partnerNames[1]}</p>
              <p className="text-2xl font-bold text-green-600">{stats.partner2Cards}</p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {partnerNames[1].charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-orange-600">{stats.unassignedCards}</p>
            </div>
            <Sparkles className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Not Applicable</p>
              <p className="text-2xl font-bold text-gray-600">{stats.notApplicableCards}</p>
            </div>
            <X className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Preference Insights */}
      {stats.cardsWithPreferences > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Smile className="h-5 w-5 text-purple-600" />
            <span>Task Preference Insights</span>
          </h3>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.cardsWithPreferences}</div>
              <div className="text-sm text-purple-800">Cards with Preferences</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{stats.preferenceMismatches}</div>
              <div className="text-sm text-red-800">Preference Conflicts</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.partner1Hates + stats.partner2Hates}</div>
              <div className="text-sm text-orange-800">Tasks People Hate</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{stats.partner1Enjoys + stats.partner2Enjoys}</div>
              <div className="text-sm text-green-800">Tasks People Enjoy</div>
            </div>
          </div>

          {(stats.partner1Hates > 0 || stats.partner2Hates > 0) && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                <strong>⚠️ Satisfaction Alert:</strong> Some partners are assigned tasks they hate. 
                Consider redistributing for better satisfaction.
              </p>
            </div>
          )}

          {stats.preferenceMismatches > 0 && (
            <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>💡 Opportunity:</strong> {stats.preferenceMismatches} tasks have conflicting preferences. 
                These might be good candidates for discussion or trade-offs.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showOnlyHeld}
                onChange={(e) => setShowOnlyHeld(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show only held cards</span>
            </label>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCards.map(card => (
          <InsamaCardComponent
            key={card.id}
            card={card}
            partnerNames={partnerNames}
            onUpdateCard={onUpdateCard}
            categoryInfo={categoryInfo[card.category]}
          />
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};