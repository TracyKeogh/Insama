import React, { useState, useMemo } from 'react';
import { MessageCircle, Heart, ArrowRight, Calendar, CheckCircle, Eye, EyeOff, Users, UserCheck, Clock } from 'lucide-react';
import { CheckInSession, InsamaCard, CheckInResponse } from '../types';
import { BalanceSummary } from './BalanceSummary';

interface CheckInRitualProps {
  cards: InsamaCard[];
  partnerNames: [string, string];
  lastCheckIn?: Date;
  mode: 'together' | 'individual';
  currentPartnerId?: string | null;
  checkIns: CheckInSession[];
  onSaveCheckIn: (session: Omit<CheckInSession, 'id' | 'date'>) => void;
}

const checkInPrompts = [
  {
    question: "What felt unfair this week?",
    key: 'unfairThisWeek' as const,
    placeholder: "Share what felt unbalanced or overwhelming...",
    type: 'textarea' as const,
  },
  {
    question: "What's one card you'd like to pass to your partner?",
    key: 'cardsToPass' as const,
    placeholder: "Which responsibility would you like help with?",
    type: 'card-selection' as const,
  },
  {
    question: "What did your partner do well this week?",
    key: 'appreciations' as const,
    placeholder: "Express gratitude and appreciation...",
    type: 'textarea' as const,
  },
  {
    question: "What's your focus for next week?",
    key: 'nextWeekFocus' as const,
    placeholder: "What will you prioritize or improve?",
    type: 'textarea' as const,
  },
];

const groundRules = [
  "No scorekeeping - focus on solutions, not blame",
  "Assume positive intent from your partner",
  "Listen to understand, not to defend",
  "Be specific about what you need",
  "Celebrate progress, however small",
];

export const CheckInRitual: React.FC<CheckInRitualProps> = ({ 
  cards, 
  partnerNames, 
  lastCheckIn,
  mode,
  currentPartnerId,
  checkIns,
  onSaveCheckIn 
}) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'questions' | 'waiting' | 'results' | 'summary' | 'complete'>('intro');
  const [responses, setResponses] = useState<CheckInResponse>({
    unfairThisWeek: [''],
    cardsToPass: [{ cardId: '', reason: '' }],
    appreciations: [''],
    nextWeekFocus: [''],
  });
  const [notes, setNotes] = useState('');

  // Check if there's a pending individual check-in
  const pendingCheckIn = useMemo(() => {
    if (mode === 'individual') {
      return checkIns.find(checkIn => 
        checkIn.mode === 'individual' && 
        !checkIn.isComplete &&
        checkIn.completedBy?.includes(currentPartnerId || '')
      );
    }
    return null;
  }, [checkIns, mode, currentPartnerId]);

  // Check if partner has completed their check-in
  const partnerCompleted = useMemo(() => {
    if (mode === 'individual' && pendingCheckIn) {
      const otherPartnerId = currentPartnerId === 'partner1' ? 'partner2' : 'partner1';
      return pendingCheckIn.completedBy?.includes(otherPartnerId) || false;
    }
    return false;
  }, [pendingCheckIn, currentPartnerId, mode]);

  const daysSinceLastCheckIn = lastCheckIn 
    ? Math.floor((Date.now() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handleResponseChange = (key: keyof CheckInResponse, index: number, value: string) => {
    setResponses(prev => ({
      ...prev,
      [key]: prev[key].map((item, i) => i === index ? value : item)
    }));
  };

  const handleCardPassChange = (index: number, field: 'cardId' | 'reason', value: string) => {
    setResponses(prev => ({
      ...prev,
      cardsToPass: prev.cardsToPass.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addResponse = (key: keyof CheckInResponse) => {
    setResponses(prev => ({
      ...prev,
      [key]: [...prev[key], key === 'cardsToPass' ? { cardId: '', reason: '' } : '']
    }));
  };

  const handleSave = () => {
    const cleanedResponses: CheckInResponse = {
      unfairThisWeek: responses.unfairThisWeek.filter(r => r.trim()),
      cardsToPass: responses.cardsToPass.filter(r => r.cardId && r.reason.trim()),
      appreciations: responses.appreciations.filter(r => r.trim()),
      nextWeekFocus: responses.nextWeekFocus.filter(r => r.trim()),
    };

    if (mode === 'together') {
      const session = {
        mode: 'together' as const,
        responses: cleanedResponses,
        notes,
        isComplete: true,
      };
      onSaveCheckIn(session);
      setCurrentStep('summary');
    } else {
      // Individual mode
      const otherPartnerId = currentPartnerId === 'partner1' ? 'partner2' : 'partner1';
      const isPartnerComplete = partnerCompleted;
      
      if (pendingCheckIn && typeof pendingCheckIn.responses === 'object' && 'partner1' in pendingCheckIn.responses) {
        // Update existing check-in
        const updatedResponses = {
          ...pendingCheckIn.responses,
          [currentPartnerId!]: cleanedResponses,
        };
        
        const session = {
          mode: 'individual' as const,
          responses: updatedResponses,
          notes: pendingCheckIn.notes + (notes ? `\n\n${partnerNames[currentPartnerId === 'partner1' ? 0 : 1]}: ${notes}` : ''),
          isComplete: isPartnerComplete,
          completedBy: [...(pendingCheckIn.completedBy || []), currentPartnerId!],
        };
        onSaveCheckIn(session);
      } else {
        // Create new check-in
        const session = {
          mode: 'individual' as const,
          responses: {
            partner1: currentPartnerId === 'partner1' ? cleanedResponses : { unfairThisWeek: [], cardsToPass: [], appreciations: [], nextWeekFocus: [] },
            partner2: currentPartnerId === 'partner2' ? cleanedResponses : { unfairThisWeek: [], cardsToPass: [], appreciations: [], nextWeekFocus: [] },
          },
          notes: notes ? `${partnerNames[currentPartnerId === 'partner1' ? 0 : 1]}: ${notes}` : '',
          isComplete: false,
          completedBy: [currentPartnerId!],
        };
        onSaveCheckIn(session);
      }
      
      if (isPartnerComplete) {
        setCurrentStep('results');
      } else {
        setCurrentStep('waiting');
      }
    }
  };

  const resetForm = () => {
    setCurrentStep('intro');
    setResponses({
      unfairThisWeek: [''],
      cardsToPass: [{ cardId: '', reason: '' }],
      appreciations: [''],
      nextWeekFocus: [''],
    });
    setNotes('');
  };

  const handleContinueFromSummary = () => {
    setCurrentStep('complete');
  };

  // Show balance summary after together mode save
  if (currentStep === 'summary') {
    return (
      <BalanceSummary
        cards={cards}
        partnerNames={partnerNames}
        checkIns={checkIns}
        onContinue={handleContinueFromSummary}
      />
    );
  }

  // Show results if both partners have completed in individual mode
  if (currentStep === 'results' && mode === 'individual' && pendingCheckIn) {
    const bothResponses = pendingCheckIn.responses as { partner1: CheckInResponse; partner2: CheckInResponse };
    
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Check-In Results</h1>
            <p className="text-gray-600">
              Both partners have completed their individual responses. Here's what you both shared:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Partner 1 Results */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{partnerNames[0].charAt(0)}</span>
                </div>
                <h2 className="text-xl font-bold text-blue-600">{partnerNames[0]}'s Responses</h2>
              </div>
              
              {checkInPrompts.map((prompt) => (
                <div key={prompt.key} className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">{prompt.question}</h3>
                  {prompt.type === 'textarea' ? (
                    <div className="space-y-2">
                      {bothResponses.partner1[prompt.key].map((response, index) => (
                        <p key={index} className="text-blue-800 text-sm">{response}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {bothResponses.partner1.cardsToPass.map((cardPass, index) => {
                        const card = cards.find(c => c.id === cardPass.cardId);
                        return (
                          <div key={index} className="text-blue-800 text-sm">
                            <strong>{card?.title || 'Unknown card'}:</strong> {cardPass.reason}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Partner 2 Results */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{partnerNames[1].charAt(0)}</span>
                </div>
                <h2 className="text-xl font-bold text-green-600">{partnerNames[1]}'s Responses</h2>
              </div>
              
              {checkInPrompts.map((prompt) => (
                <div key={prompt.key} className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">{prompt.question}</h3>
                  {prompt.type === 'textarea' ? (
                    <div className="space-y-2">
                      {bothResponses.partner2[prompt.key].map((response, index) => (
                        <p key={index} className="text-green-800 text-sm">{response}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {bothResponses.partner2.cardsToPass.map((cardPass, index) => {
                        const card = cards.find(c => c.id === cardPass.cardId);
                        return (
                          <div key={index} className="text-green-800 text-sm">
                            <strong>{card?.title || 'Unknown card'}:</strong> {cardPass.reason}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentStep('summary')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              View Balance Summary
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Start New Check-In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show waiting screen for individual mode
  if (currentStep === 'waiting' && mode === 'individual') {
    const otherPartnerName = currentPartnerId === 'partner1' ? partnerNames[1] : partnerNames[0];
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Waiting for {otherPartnerName}</h1>
          <p className="text-gray-600 mb-8">
            Your responses have been saved privately. Once {otherPartnerName} completes their check-in, 
            you'll both be able to see each other's responses and discuss them together.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800">
              <strong>Privacy Note:</strong> Your responses are completely private until {otherPartnerName} finishes their check-in.
            </p>
          </div>
          
          <button
            onClick={resetForm}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'intro') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {mode === 'individual' ? (
                <UserCheck className="h-8 w-8 text-purple-600" />
              ) : (
                <MessageCircle className="h-8 w-8 text-purple-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {mode === 'individual' ? 'Individual Check-In' : 'Weekly Check-In Ritual'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {mode === 'individual' 
                ? `Complete your private check-in. Your responses will remain hidden until ${currentPartnerId === 'partner1' ? partnerNames[1] : partnerNames[0]} completes their session too.`
                : 'Take time to reflect on your Insama journey, celebrate progress, and realign for the week ahead.'
              }
            </p>
            {daysSinceLastCheckIn !== null && (
              <p className="text-sm text-gray-500 mt-2">
                Last check-in was {daysSinceLastCheckIn} days ago
              </p>
            )}
          </div>

          {mode === 'individual' && (
            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <div className="flex items-center space-x-3 mb-3">
                <EyeOff className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-green-900">Individual Mode Privacy</h2>
              </div>
              <ul className="space-y-2 text-green-800">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                  <span className="text-sm">Your responses are completely private until both partners finish</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                  <span className="text-sm">Answer honestly without influence from your partner's responses</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                  <span className="text-sm">Results will be revealed simultaneously for discussion</span>
                </li>
              </ul>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Ground Rules for Your Check-In
            </h2>
            <ul className="space-y-2">
              {groundRules.map((rule, index) => (
                <li key={index} className="flex items-start space-x-2 text-blue-800">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600" />
                  <span className="text-sm">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentStep('questions')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
            >
              <span>Begin Check-In</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'complete') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Check-In Complete!</h1>
          <p className="text-gray-600 mb-8">
            Great job taking time to connect and realign. Your responses have been saved and your balance summary has been updated.
          </p>
          <button
            onClick={resetForm}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Check-In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-8">
          {mode === 'individual' ? (
            <UserCheck className="h-6 w-6 text-purple-600" />
          ) : (
            <MessageCircle className="h-6 w-6 text-purple-600" />
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'individual' ? 'Your Private Check-In' : 'Weekly Check-In Questions'}
          </h1>
          {mode === 'individual' && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
              Private Session
            </span>
          )}
        </div>

        <div className="space-y-8">
          {checkInPrompts.map((prompt, index) => (
            <div key={prompt.key} className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{prompt.question}</h3>
              
              {prompt.type === 'textarea' && (
                <div className="space-y-3">
                  {responses[prompt.key].map((response, responseIndex) => (
                    <textarea
                      key={responseIndex}
                      value={response}
                      onChange={(e) => handleResponseChange(prompt.key, responseIndex, e.target.value)}
                      placeholder={prompt.placeholder}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  ))}
                  <button
                    onClick={() => addResponse(prompt.key)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    + Add another response
                  </button>
                </div>
              )}

              {prompt.type === 'card-selection' && (
                <div className="space-y-4">
                  {responses.cardsToPass.map((cardPass, responseIndex) => (
                    <div key={responseIndex} className="grid md:grid-cols-2 gap-4">
                      <select
                        value={cardPass.cardId}
                        onChange={(e) => handleCardPassChange(responseIndex, 'cardId', e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select a card...</option>
                        {cards.filter(c => c.holder).map(card => (
                          <option key={card.id} value={card.id}>
                            {card.title} ({card.holder === 'partner1' ? partnerNames[0] : partnerNames[1]})
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={cardPass.reason}
                        onChange={(e) => handleCardPassChange(responseIndex, 'reason', e.target.value)}
                        placeholder="Why would you like to pass this card?"
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addResponse('cardsToPass')}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    + Add another card
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other thoughts, concerns, or celebrations to share..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <span>{mode === 'individual' ? 'Save My Responses' : 'Save Check-In'}</span>
            <Calendar className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};