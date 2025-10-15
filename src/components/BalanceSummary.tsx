import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus, Heart, Users, Clock, CheckCircle, AlertTriangle, Target, Award, Calendar } from 'lucide-react';
import { InsamaCard, CheckInSession } from '../types';

interface BalanceSummaryProps {
  cards: InsamaCard[];
  partnerNames: [string, string];
  checkIns: CheckInSession[];
  onContinue: () => void;
}

export const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  cards,
  partnerNames,
  checkIns,
  onContinue,
}) => {
  const analysis = useMemo(() => {
    // Only consider applicable cards for balance calculations
    const applicableCards = cards.filter(c => !c.isNotApplicable);
    
    const partner1Cards = applicableCards.filter(c => c.holder === 'partner1');
    const partner2Cards = applicableCards.filter(c => c.holder === 'partner2');
    
    const partner1Time = partner1Cards.reduce((sum, card) => sum + card.timeEstimate, 0);
    const partner2Time = partner2Cards.reduce((sum, card) => sum + card.timeEstimate, 0);
    
    const totalTime = partner1Time + partner2Time;
    const partner1Percentage = totalTime > 0 ? Math.round((partner1Time / totalTime) * 100) : 0;
    const partner2Percentage = totalTime > 0 ? Math.round((partner2Time / totalTime) * 100) : 0;
    
    const balanceDifference = Math.abs(partner1Percentage - partner2Percentage);
    const isBalanced = balanceDifference <= 15;
    const isVeryBalanced = balanceDifference <= 5;
    
    // Think → Plan → Do analysis (only applicable cards)
    const thinkPlanDoAnalysis = {
      partner1: {
        think: applicableCards.filter(c => c.ownership.think === 'partner1').length,
        plan: applicableCards.filter(c => c.ownership.plan === 'partner1').length,
        do: applicableCards.filter(c => c.ownership.do === 'partner1').length,
      },
      partner2: {
        think: applicableCards.filter(c => c.ownership.think === 'partner2').length,
        plan: applicableCards.filter(c => c.ownership.plan === 'partner2').length,
        do: applicableCards.filter(c => c.ownership.do === 'partner2').length,
      },
    };
    
    // Progress tracking
    const totalCheckIns = checkIns.length;
    const recentCheckIns = checkIns.slice(-3); // Last 3 check-ins
    
    // Balance score (0-100)
    const balanceScore = Math.max(0, 100 - balanceDifference * 2);
    
    return {
      partner1Cards: partner1Cards.length,
      partner2Cards: partner2Cards.length,
      partner1Time,
      partner2Time,
      partner1Percentage,
      partner2Percentage,
      balanceDifference,
      isBalanced,
      isVeryBalanced,
      thinkPlanDoAnalysis,
      totalCheckIns,
      balanceScore,
      totalCards: cards.length,
      applicableCards: applicableCards.length,
      notApplicableCards: cards.filter(c => c.isNotApplicable).length,
      assignedCards: partner1Cards.length + partner2Cards.length,
    };
  }, [cards, checkIns]);

  const getBalanceStatus = () => {
    if (analysis.isVeryBalanced) {
      return {
        icon: Award,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        title: 'Excellent Balance!',
        message: 'Your workload distribution is nearly perfect. Keep up the great work!',
      };
    } else if (analysis.isBalanced) {
      return {
        icon: CheckCircle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        title: 'Good Balance',
        message: 'Your workload is fairly distributed with room for minor adjustments.',
      };
    } else {
      return {
        icon: AlertTriangle,
        color: 'text-amber-600',
        bgColor: 'bg-amber-100',
        title: 'Needs Rebalancing',
        message: `Consider redistributing tasks - there's a ${analysis.balanceDifference}% difference in workload.`,
      };
    }
  };

  const balanceStatus = getBalanceStatus();
  const StatusIcon = balanceStatus.icon;

  const getTrendIcon = () => {
    if (analysis.balanceScore >= 80) return TrendingUp;
    if (analysis.balanceScore >= 60) return Minus;
    return TrendingDown;
  };

  const TrendIcon = getTrendIcon();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Relationship Balance</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Here's how your household responsibilities are currently distributed and what it means for your relationship equilibrium.
        </p>
      </div>

      {/* Balance Score Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className={`w-24 h-24 ${balanceStatus.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <StatusIcon className={`h-12 w-12 ${balanceStatus.color}`} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{balanceStatus.title}</h2>
          <p className="text-gray-600 text-lg">{balanceStatus.message}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Balance Score */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke={analysis.balanceScore >= 80 ? '#10b981' : analysis.balanceScore >= 60 ? '#3b82f6' : '#f59e0b'}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(analysis.balanceScore / 100) * 314} 314`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{analysis.balanceScore}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Balance Score</h3>
            <p className="text-sm text-gray-600">Out of 100 points</p>
          </div>

          {/* Workload Distribution */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-32 h-32 rounded-full border-8 border-gray-200 relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 w-full bg-blue-500 transition-all duration-1000 ease-out"
                  style={{ height: `${analysis.partner1Percentage}%` }}
                ></div>
                <div 
                  className="absolute bottom-0 left-0 w-full bg-green-500 transition-all duration-1000 ease-out"
                  style={{ height: `${analysis.partner2Percentage}%` }}
                ></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendIcon className={`h-8 w-8 ${
                  analysis.balanceScore >= 80 ? 'text-green-600' : 
                  analysis.balanceScore >= 60 ? 'text-blue-600' : 'text-amber-600'
                }`} />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Distribution</h3>
            <p className="text-sm text-gray-600">{analysis.partner1Percentage}% / {analysis.partner2Percentage}%</p>
          </div>

          {/* Total Cards */}
          <div className="text-center">
            <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{analysis.assignedCards}</div>
                <div className="text-sm text-purple-600">of {analysis.applicableCards}</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cards Assigned</h3>
            <p className="text-sm text-gray-600">Applicable responsibilities</p>
          </div>
        </div>

        {analysis.notApplicableCards > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Note:</strong> {analysis.notApplicableCards} cards marked as "not applicable" are excluded from balance calculations.
            </p>
          </div>
        )}
      </div>

      {/* Detailed Breakdown */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Partner Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Users className="h-6 w-6 mr-2 text-blue-600" />
            Partner Comparison
          </h3>
          
          <div className="space-y-6">
            {/* Partner 1 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{partnerNames[0].charAt(0)}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{partnerNames[0]}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{analysis.partner1Percentage}%</div>
                  <div className="text-sm text-gray-500">{analysis.partner1Cards} cards</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${analysis.partner1Percentage}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                ~{Math.round(analysis.partner1Time / 60)} hours per week
              </div>
            </div>

            {/* Partner 2 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{partnerNames[1].charAt(0)}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{partnerNames[1]}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{analysis.partner2Percentage}%</div>
                  <div className="text-sm text-gray-500">{analysis.partner2Cards} cards</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${analysis.partner2Percentage}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                ~{Math.round(analysis.partner2Time / 60)} hours per week
              </div>
            </div>
          </div>
        </div>

        {/* Think → Plan → Do Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="h-6 w-6 mr-2 text-purple-600" />
            Mental Load Distribution
          </h3>
          
          <div className="space-y-4">
            {(['think', 'plan', 'do'] as const).map((type, index) => {
              const partner1Count = analysis.thinkPlanDoAnalysis.partner1[type];
              const partner2Count = analysis.thinkPlanDoAnalysis.partner2[type];
              const total = partner1Count + partner2Count;
              const partner1Percent = total > 0 ? Math.round((partner1Count / total) * 100) : 0;
              const partner2Percent = total > 0 ? Math.round((partner2Count / total) * 100) : 0;
              
              const icons = [
                { icon: '🧠', label: 'Think', description: 'Notice & initiate' },
                { icon: '📅', label: 'Plan', description: 'Organize & prepare' },
                { icon: '✅', label: 'Do', description: 'Execute & complete' },
              ];
              
              return (
                <div key={type} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{icons[index].icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{icons[index].label}</div>
                        <div className="text-xs text-gray-600">{icons[index].description}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {partner1Count + partner2Count} tasks
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mb-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{partnerNames[0]}</span>
                        <span>{partner1Count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${partner1Percent}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{partnerNames[1]}</span>
                        <span>{partner2Count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${partner2Percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Heart className="h-7 w-7 mr-3 text-rose-500" />
          Insights & Recommendations
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg">What's Working Well:</h4>
            <ul className="space-y-2">
              {analysis.isVeryBalanced && (
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700">Excellent workload balance between partners</span>
                </li>
              )}
              {analysis.assignedCards > analysis.applicableCards * 0.8 && (
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700">Most applicable responsibilities have clear ownership</span>
                </li>
              )}
              {analysis.totalCheckIns >= 3 && (
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700">Consistent check-in routine established</span>
                </li>
              )}
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span className="text-gray-700">Using structured approach to household management</span>
              </li>
              {analysis.notApplicableCards > 0 && (
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <span className="text-gray-700">Customized deck to match your household needs</span>
                </li>
              )}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg">Areas for Growth:</h4>
            <ul className="space-y-2">
              {!analysis.isBalanced && (
                <li className="flex items-start space-x-2">
                  <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                  <span className="text-gray-700">Consider redistributing some tasks for better balance</span>
                </li>
              )}
              {analysis.assignedCards < analysis.applicableCards * 0.8 && (
                <li className="flex items-start space-x-2">
                  <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                  <span className="text-gray-700">Assign ownership to remaining unassigned cards</span>
                </li>
              )}
              <li className="flex items-start space-x-2">
                <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                <span className="text-gray-700">Continue regular check-ins to maintain progress</span>
              </li>
              <li className="flex items-start space-x-2">
                <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                <span className="text-gray-700">Celebrate small wins and acknowledge efforts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Progress Tracking */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-green-600" />
          Your Insama Journey
        </h3>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">{analysis.totalCheckIns}</div>
            <div className="text-sm text-blue-800 font-medium">Check-ins Completed</div>
            <div className="text-xs text-blue-600 mt-1">Building healthy habits</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">{analysis.assignedCards}</div>
            <div className="text-sm text-green-800 font-medium">Cards Assigned</div>
            <div className="text-xs text-green-600 mt-1">Clear responsibility ownership</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">{analysis.balanceScore}%</div>
            <div className="text-sm text-purple-800 font-medium">Balance Achievement</div>
            <div className="text-xs text-purple-600 mt-1">Relationship equilibrium</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-600 mb-2">{analysis.applicableCards}</div>
            <div className="text-sm text-gray-800 font-medium">Applicable Cards</div>
            <div className="text-xs text-gray-600 mt-1">Customized to your needs</div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
};