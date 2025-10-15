import React, { useState } from 'react';
import { Clock, User, AlertCircle, ChevronDown, ChevronUp, Brain, Calendar, CheckSquare, Edit3, Save, X, MessageSquare, XCircle, RotateCcw, Frown, Meh, Smile } from 'lucide-react';
import { InsamaCard } from '../types';

interface InsamaCardProps {
  card: InsamaCard;
  partnerNames: [string, string];
  onUpdateCard: (cardId: string, updates: Partial<InsamaCard>) => void;
  categoryInfo: {
    label: string;
    color: string;
    icon: string;
  };
}

const priorityColors = {
  low: 'border-l-gray-300',
  medium: 'border-l-yellow-400',
  high: 'border-l-red-400',
};

const preferenceConfig = {
  hate: { icon: Frown, color: 'text-red-500', bg: 'bg-red-100', label: 'Hate' },
  meh: { icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Meh' },
  enjoy: { icon: Smile, color: 'text-green-500', bg: 'bg-green-100', label: 'Enjoy' },
};

export const InsamaCardComponent: React.FC<InsamaCardProps> = ({ 
  card, 
  partnerNames, 
  onUpdateCard,
  categoryInfo
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [tempTimeEstimate, setTempTimeEstimate] = useState(card.timeEstimate.toString());
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState({
    partner1: card.notes?.partner1 || '',
    partner2: card.notes?.partner2 || '',
  });

  const formatFrequency = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1).replace('-', ' ');
  };

  const getHolderName = () => {
    if (!card.holder) return null;
    return card.holder === 'partner1' ? partnerNames[0] : partnerNames[1];
  };

  const handleHolderChange = (partnerId: string) => {
    onUpdateCard(card.id, {
      holder: card.holder === partnerId ? undefined : partnerId,
      ownership: {
        think: card.holder === partnerId ? null : partnerId,
        plan: card.holder === partnerId ? null : partnerId,
        do: card.holder === partnerId ? null : partnerId,
      }
    });
  };

  const handleOwnershipChange = (type: 'think' | 'plan' | 'do', partnerId: string | null) => {
    onUpdateCard(card.id, {
      ownership: {
        ...card.ownership,
        [type]: card.ownership[type] === partnerId ? null : partnerId,
      }
    });
  };

  const handlePreferenceChange = (partnerId: 'partner1' | 'partner2', preference: 'hate' | 'meh' | 'enjoy') => {
    const currentPreference = card.preferences?.[partnerId];
    const newPreference = currentPreference === preference ? null : preference;
    
    onUpdateCard(card.id, {
      preferences: {
        ...card.preferences,
        [partnerId]: newPreference,
      }
    });
  };

  const handleNotApplicableToggle = () => {
    onUpdateCard(card.id, {
      isNotApplicable: !card.isNotApplicable,
      // Clear ownership when marking as not applicable
      holder: card.isNotApplicable ? card.holder : undefined,
      ownership: card.isNotApplicable ? card.ownership : {
        think: null,
        plan: null,
        do: null,
      }
    });
  };

  const handleTimeUpdate = () => {
    const newTime = parseInt(tempTimeEstimate);
    if (!isNaN(newTime) && newTime > 0) {
      onUpdateCard(card.id, { timeEstimate: newTime });
    } else {
      setTempTimeEstimate(card.timeEstimate.toString());
    }
    setIsEditingTime(false);
  };

  const handleNotesUpdate = () => {
    onUpdateCard(card.id, {
      notes: {
        partner1: tempNotes.partner1.trim(),
        partner2: tempNotes.partner2.trim(),
      }
    });
    setIsEditingNotes(false);
  };

  const cancelTimeEdit = () => {
    setTempTimeEstimate(card.timeEstimate.toString());
    setIsEditingTime(false);
  };

  const cancelNotesEdit = () => {
    setTempNotes({
      partner1: card.notes?.partner1 || '',
      partner2: card.notes?.partner2 || '',
    });
    setIsEditingNotes(false);
  };

  const getOwnershipIcon = (type: 'think' | 'plan' | 'do') => {
    switch (type) {
      case 'think': return <Brain className="h-3 w-3" />;
      case 'plan': return <Calendar className="h-3 w-3" />;
      case 'do': return <CheckSquare className="h-3 w-3" />;
    }
  };

  const getOwnershipLabel = (type: 'think' | 'plan' | 'do') => {
    switch (type) {
      case 'think': return 'Think';
      case 'plan': return 'Plan';
      case 'do': return 'Do';
    }
  };

  const getOwnershipDescription = (type: 'think' | 'plan' | 'do') => {
    switch (type) {
      case 'think': return 'Notice when it needs to be done';
      case 'plan': return 'Organize and prepare';
      case 'do': return 'Execute the task';
    }
  };

  const hasNotes = card.notes?.partner1 || card.notes?.partner2;
  const hasPreferences = card.preferences?.partner1 || card.preferences?.partner2;

  // If card is marked as not applicable, show simplified view
  if (card.isNotApplicable) {
    return (
      <div className="bg-gray-50 rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-6 opacity-75">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl opacity-50">{categoryInfo.icon}</span>
              <h3 className="font-semibold text-gray-600 text-lg line-through">{card.title}</h3>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                Not Applicable
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-3">{card.description}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">This card doesn't apply to your household</span>
            </div>
            
            <button
              onClick={handleNotApplicableToggle}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors flex items-center space-x-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Make Applicable</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${priorityColors[card.priority]} border-l-4`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">{categoryInfo.icon}</span>
            <h3 className="font-semibold text-gray-900 text-lg">{card.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
              {categoryInfo.label}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{card.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              {isEditingTime ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={tempTimeEstimate}
                    onChange={(e) => setTempTimeEstimate(e.target.value)}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="999"
                  />
                  <span className="text-xs">min</span>
                  <button
                    onClick={handleTimeUpdate}
                    className="p-1 text-green-600 hover:text-green-700"
                  >
                    <Save className="h-3 w-3" />
                  </button>
                  <button
                    onClick={cancelTimeEdit}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <span>{card.timeEstimate} min</span>
                  <button
                    onClick={() => setIsEditingTime(true)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
            <span>•</span>
            <span>{formatFrequency(card.frequency)}</span>
            {card.priority === 'high' && (
              <>
                <span>•</span>
                <div className="flex items-center space-x-1 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>High Priority</span>
                </div>
              </>
            )}
            {hasNotes && (
              <>
                <span>•</span>
                <div className="flex items-center space-x-1 text-blue-600">
                  <MessageSquare className="h-4 w-4" />
                  <span>Has Notes</span>
                </div>
              </>
            )}
            {hasPreferences && (
              <>
                <span>•</span>
                <div className="flex items-center space-x-1 text-purple-600">
                  <Smile className="h-4 w-4" />
                  <span>Preferences Set</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleNotApplicableToggle}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Mark as not applicable"
          >
            <XCircle className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 pt-4 mb-4 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Mental Load Breakdown:</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {card.mentalLoad}
            </p>
          </div>

          {/* Task Preferences Section */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <Smile className="h-4 w-4" />
              <span>How do you feel about this task?</span>
            </h4>
            
            <div className="space-y-4">
              {/* Partner 1 Preferences */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-blue-900">{partnerNames[0]}'s feelings:</span>
                  {card.preferences?.partner1 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${preferenceConfig[card.preferences.partner1].bg} ${preferenceConfig[card.preferences.partner1].color}`}>
                      {preferenceConfig[card.preferences.partner1].label}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  {Object.entries(preferenceConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    const isSelected = card.preferences?.partner1 === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handlePreferenceChange('partner1', key as 'hate' | 'meh' | 'enjoy')}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isSelected 
                            ? `${config.bg} ${config.color} border-2 border-current` 
                            : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{config.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Partner 2 Preferences */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-green-900">{partnerNames[1]}'s feelings:</span>
                  {card.preferences?.partner2 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${preferenceConfig[card.preferences.partner2].bg} ${preferenceConfig[card.preferences.partner2].color}`}>
                      {preferenceConfig[card.preferences.partner2].label}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  {Object.entries(preferenceConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    const isSelected = card.preferences?.partner2 === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handlePreferenceChange('partner2', key as 'hate' | 'meh' | 'enjoy')}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isSelected 
                            ? `${config.bg} ${config.color} border-2 border-current` 
                            : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{config.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Preference Insights */}
            {card.preferences?.partner1 && card.preferences?.partner2 && (
              <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                <div className="text-sm">
                  {card.preferences.partner1 === card.preferences.partner2 ? (
                    <span className="text-purple-800">
                      <strong>Aligned:</strong> Both partners feel {card.preferences.partner1} about this task
                    </span>
                  ) : (
                    <span className="text-purple-800">
                      <strong>Different feelings:</strong> {partnerNames[0]} feels {card.preferences.partner1}, {partnerNames[1]} feels {card.preferences.partner2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Partner Notes Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Partner Notes</span>
              </h4>
              {!isEditingNotes && (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Edit Notes</span>
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    {partnerNames[0]}'s Notes:
                  </label>
                  <textarea
                    value={tempNotes.partner1}
                    onChange={(e) => setTempNotes(prev => ({ ...prev, partner1: e.target.value }))}
                    placeholder={`Add notes from ${partnerNames[0]}...`}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    {partnerNames[1]}'s Notes:
                  </label>
                  <textarea
                    value={tempNotes.partner2}
                    onChange={(e) => setTempNotes(prev => ({ ...prev, partner2: e.target.value }))}
                    placeholder={`Add notes from ${partnerNames[1]}...`}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows={2}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleNotesUpdate}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center space-x-1"
                  >
                    <Save className="h-3 w-3" />
                    <span>Save Notes</span>
                  </button>
                  <button
                    onClick={cancelNotesEdit}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 flex items-center space-x-1"
                  >
                    <X className="h-3 w-3" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {card.notes?.partner1 ? (
                  <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-200">
                    <div className="text-sm font-medium text-blue-800 mb-1">{partnerNames[0]}:</div>
                    <div className="text-sm text-blue-700">{card.notes.partner1}</div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-500 italic">
                    No notes from {partnerNames[0]} yet
                  </div>
                )}
                
                {card.notes?.partner2 ? (
                  <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-200">
                    <div className="text-sm font-medium text-green-800 mb-1">{partnerNames[1]}:</div>
                    <div className="text-sm text-green-700">{card.notes.partner2}</div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-500 italic">
                    No notes from {partnerNames[1]} yet
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {getHolderName() ? `Primary owner: ${getHolderName()}` : 'No primary owner'}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleHolderChange('partner1')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                card.holder === 'partner1' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {partnerNames[0]}
            </button>
            <button
              onClick={() => handleHolderChange('partner2')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                card.holder === 'partner2' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {partnerNames[1]}
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Think → Plan → Do Ownership</h5>
          <div className="space-y-3">
            {(['think', 'plan', 'do'] as const).map((type) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  {getOwnershipIcon(type)}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{getOwnershipLabel(type)}</div>
                    <div className="text-xs text-gray-600">{getOwnershipDescription(type)}</div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleOwnershipChange(type, 'partner1')}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                      card.ownership[type] === 'partner1'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {partnerNames[0].charAt(0)}
                  </button>
                  <button
                    onClick={() => handleOwnershipChange(type, 'partner2')}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                      card.ownership[type] === 'partner2'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {partnerNames[1].charAt(0)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};