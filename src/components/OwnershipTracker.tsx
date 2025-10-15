import React, { useMemo } from 'react';
import { BarChart3, Users, AlertTriangle, CheckCircle, Brain, Calendar, CheckSquare, Clock, TrendingUp, Target, Award, Zap, PieChart, Frown, Meh, Smile, Heart, DollarSign, CreditCard, TrendingDown, Minus } from 'lucide-react';
import { InsamaCard, HouseholdBill } from '../types';

interface OwnershipTrackerProps {
  cards: InsamaCard[];
  bills: HouseholdBill[];
  partnerNames: [string, string];
}

export const OwnershipTracker: React.FC<OwnershipTrackerProps> = ({ 
  cards, 
  bills = [],
  partnerNames 
}) => {
  const taskAnalysis = useMemo(() => {
    // Only consider applicable cards for balance calculations
    const applicableCards = cards.filter(c => !c.isNotApplicable);
    
    const partner1Cards = applicableCards.filter(c => c.holder === 'partner1');
    const partner2Cards = applicableCards.filter(c => c.holder === 'partner2');
    
    const partner1Time = partner1Cards.reduce((sum, card) => sum + card.timeEstimate, 0);
    const partner2Time = partner2Cards.reduce((sum, card) => sum + card.timeEstimate, 0);
    
    const totalTime = partner1Time + partner2Time;
    const partner1Percentage = totalTime > 0 ? Math.round((partner1Time / totalTime) * 100) : 0;
    const partner2Percentage = totalTime > 0 ? Math.round((partner2Time / totalTime) * 100) : 0;
    
    const imbalanceThreshold = 15; // 15% difference indicates imbalance
    const isBalanced = Math.abs(partner1Percentage - partner2Percentage) <= imbalanceThreshold;
    
    // Think → Plan → Do breakdown (only applicable cards)
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

    // Mental load analysis
    const partner1MentalLoad = thinkPlanDoAnalysis.partner1.think + thinkPlanDoAnalysis.partner1.plan;
    const partner2MentalLoad = thinkPlanDoAnalysis.partner2.think + thinkPlanDoAnalysis.partner2.plan;
    const totalMentalLoad = partner1MentalLoad + partner2MentalLoad;
    const partner1MentalLoadPercentage = totalMentalLoad > 0 ? Math.round((partner1MentalLoad / totalMentalLoad) * 100) : 0;
    const partner2MentalLoadPercentage = totalMentalLoad > 0 ? Math.round((partner2MentalLoad / totalMentalLoad) * 100) : 0;
    
    return {
      partner1Cards: partner1Cards.length,
      partner2Cards: partner2Cards.length,
      partner1Time,
      partner2Time,
      partner1Percentage,
      partner2Percentage,
      isBalanced,
      thinkPlanDoAnalysis,
      partner1MentalLoad,
      partner2MentalLoad,
      partner1MentalLoadPercentage,
      partner2MentalLoadPercentage,
      totalCards: cards.length,
      applicableCards: applicableCards.length,
      notApplicableCards: cards.filter(c => c.isNotApplicable).length,
      assignedCards: partner1Cards.length + partner2Cards.length,
    };
  }, [cards, partnerNames]);

  const financeAnalysis = useMemo(() => {
    const activeBills = bills.filter(b => b.isActive);
    const totalBills = activeBills.length;
    
    // Calculate monthly totals
    const monthlyTotal = activeBills.reduce((sum, bill) => {
      let monthlyAmount = bill.amount;
      if (bill.frequency === 'weekly') monthlyAmount *= 4.33;
      else if (bill.frequency === 'quarterly') monthlyAmount /= 3;
      else if (bill.frequency === 'annually') monthlyAmount /= 12;
      return sum + monthlyAmount;
    }, 0);

    const partner1Bills = activeBills.filter(b => b.responsiblePartner === 'partner1');
    const partner2Bills = activeBills.filter(b => b.responsiblePartner === 'partner2');
    const sharedBills = activeBills.filter(b => b.isShared);
    const unassignedBills = activeBills.filter(b => !b.responsiblePartner && !b.isShared);

    const partner1Total = partner1Bills.reduce((sum, bill) => {
      let monthlyAmount = bill.amount;
      if (bill.frequency === 'weekly') monthlyAmount *= 4.33;
      else if (bill.frequency === 'quarterly') monthlyAmount /= 3;
      else if (bill.frequency === 'annually') monthlyAmount /= 12;
      return sum + monthlyAmount;
    }, 0);

    const partner2Total = partner2Bills.reduce((sum, bill) => {
      let monthlyAmount = bill.amount;
      if (bill.frequency === 'weekly') monthlyAmount *= 4.33;
      else if (bill.frequency === 'quarterly') monthlyAmount /= 3;
      else if (bill.frequency === 'annually') monthlyAmount /= 12;
      return sum + monthlyAmount;
    }, 0);

    const sharedTotal = sharedBills.reduce((sum, bill) => {
      let monthlyAmount = bill.amount;
      if (bill.frequency === 'weekly') monthlyAmount *= 4.33;
      else if (bill.frequency === 'quarterly') monthlyAmount /= 3;
      else if (bill.frequency === 'annually') monthlyAmount /= 12;
      return sum + monthlyAmount;
    }, 0);

    const assignedTotal = partner1Total + partner2Total + sharedTotal;
    const partner1FinancialPercentage = assignedTotal > 0 ? Math.round(((partner1Total + sharedTotal/2) / assignedTotal) * 100) : 0;
    const partner2FinancialPercentage = assignedTotal > 0 ? Math.round(((partner2Total + sharedTotal/2) / assignedTotal) * 100) : 0;

    const isFinanciallyBalanced = Math.abs(partner1FinancialPercentage - partner2FinancialPercentage) <= 15;

    return {
      totalBills,
      monthlyTotal,
      partner1Bills: partner1Bills.length,
      partner2Bills: partner2Bills.length,
      sharedBills: sharedBills.length,
      unassignedBills: unassignedBills.length,
      partner1Total,
      partner2Total,
      sharedTotal,
      partner1FinancialPercentage,
      partner2FinancialPercentage,
      isFinanciallyBalanced,
      assignedBills: partner1Bills.length + partner2Bills.length + sharedBills.length,
    };
  }, [bills]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getBalanceIcon = (isBalanced: boolean) => {
    if (isBalanced) return TrendingUp;
    return TrendingDown;
  };

  const getBalanceColor = (isBalanced: boolean) => {
    if (isBalanced) return 'text-green-600';
    return 'text-red-600';
  };

  const getBalanceBg = (isBalanced: boolean) => {
    if (isBalanced) return 'bg-green-50';
    return 'bg-red-50';
  };

  return (
    <div className="space-y-8">
      {/* Unified Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Household Ownership Summary</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Tasks Summary */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900">Task Responsibilities</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{taskAnalysis.assignedCards}</div>
                <div className="text-sm text-blue-800">Assigned Tasks</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(taskAnalysis.partner1Time / 60) + Math.round(taskAnalysis.partner2Time / 60)}</div>
                <div className="text-sm text-purple-800">Hours/Week</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-blue-600">{partnerNames[0]}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-blue-600">{taskAnalysis.partner1Percentage}%</span>
                  {React.createElement(getBalanceIcon(taskAnalysis.isBalanced), { 
                    className: `h-5 w-5 ${getBalanceColor(taskAnalysis.isBalanced)}` 
                  })}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${taskAnalysis.partner1Percentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {taskAnalysis.partner1Cards} tasks • {Math.round(taskAnalysis.partner1Time / 60)}h/week • {taskAnalysis.partner1MentalLoadPercentage}% mental load
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-green-600">{partnerNames[1]}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-green-600">{taskAnalysis.partner2Percentage}%</span>
                  {React.createElement(getBalanceIcon(taskAnalysis.isBalanced), { 
                    className: `h-5 w-5 ${getBalanceColor(taskAnalysis.isBalanced)}` 
                  })}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${taskAnalysis.partner2Percentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {taskAnalysis.partner2Cards} tasks • {Math.round(taskAnalysis.partner2Time / 60)}h/week • {taskAnalysis.partner2MentalLoadPercentage}% mental load
              </div>
            </div>

            <div className={`p-4 rounded-lg ${getBalanceBg(taskAnalysis.isBalanced)}`}>
              {taskAnalysis.isBalanced ? (
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Tasks are well balanced</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">
                    Task imbalance: {Math.abs(taskAnalysis.partner1Percentage - taskAnalysis.partner2Percentage)}% difference
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Finance Summary */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Financial Responsibilities</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{financeAnalysis.assignedBills}</div>
                <div className="text-sm text-green-800">Assigned Bills</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg text-center">
                <div className="text-lg font-bold text-emerald-600">{formatCurrency(financeAnalysis.monthlyTotal)}</div>
                <div className="text-sm text-emerald-800">Monthly Total</div>
              </div>
            </div>

            {financeAnalysis.totalBills > 0 ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-blue-600">{partnerNames[0]}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-blue-600">{financeAnalysis.partner1FinancialPercentage}%</span>
                      {React.createElement(getBalanceIcon(financeAnalysis.isFinanciallyBalanced), { 
                        className: `h-5 w-5 ${getBalanceColor(financeAnalysis.isFinanciallyBalanced)}` 
                      })}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${financeAnalysis.partner1FinancialPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {financeAnalysis.partner1Bills} bills • {formatCurrency(financeAnalysis.partner1Total + financeAnalysis.sharedTotal/2)}/month
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-green-600">{partnerNames[1]}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-green-600">{financeAnalysis.partner2FinancialPercentage}%</span>
                      {React.createElement(getBalanceIcon(financeAnalysis.isFinanciallyBalanced), { 
                        className: `h-5 w-5 ${getBalanceColor(financeAnalysis.isFinanciallyBalanced)}` 
                      })}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${financeAnalysis.partner2FinancialPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {financeAnalysis.partner2Bills} bills • {formatCurrency(financeAnalysis.partner2Total + financeAnalysis.sharedTotal/2)}/month
                  </div>
                </div>

                {financeAnalysis.sharedTotal > 0 && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-purple-900">Shared Bills</span>
                      <span className="text-sm font-bold text-purple-600">{formatCurrency(financeAnalysis.sharedTotal)}/month</span>
                    </div>
                    <div className="text-xs text-purple-700 mt-1">{financeAnalysis.sharedBills} bills split equally</div>
                  </div>
                )}

                <div className={`p-4 rounded-lg ${getBalanceBg(financeAnalysis.isFinanciallyBalanced)}`}>
                  {financeAnalysis.isFinanciallyBalanced ? (
                    <div className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Finances are well balanced</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-medium">
                        Financial imbalance: {Math.abs(financeAnalysis.partner1FinancialPercentage - financeAnalysis.partner2FinancialPercentage)}% difference
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No bills added yet</p>
                <p className="text-sm text-gray-500">Add bills to track financial responsibilities</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Combined Balance Score */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Overall Household Balance</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Task Balance Score */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  stroke={taskAnalysis.isBalanced ? '#10b981' : '#ef4444'}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${taskAnalysis.isBalanced ? 283 : 141} 283`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className={`h-8 w-8 ${taskAnalysis.isBalanced ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Task Balance</h3>
            <p className={`text-sm font-medium ${taskAnalysis.isBalanced ? 'text-green-600' : 'text-red-600'}`}>
              {taskAnalysis.isBalanced ? 'Balanced' : 'Needs Attention'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {Math.abs(taskAnalysis.partner1Percentage - taskAnalysis.partner2Percentage)}% difference
            </p>
          </div>

          {/* Financial Balance Score */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  stroke={financeAnalysis.totalBills === 0 ? '#9ca3af' : financeAnalysis.isFinanciallyBalanced ? '#10b981' : '#ef4444'}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${financeAnalysis.totalBills === 0 ? 0 : financeAnalysis.isFinanciallyBalanced ? 283 : 141} 283`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <DollarSign className={`h-8 w-8 ${
                  financeAnalysis.totalBills === 0 ? 'text-gray-400' : 
                  financeAnalysis.isFinanciallyBalanced ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Balance</h3>
            <p className={`text-sm font-medium ${
              financeAnalysis.totalBills === 0 ? 'text-gray-500' :
              financeAnalysis.isFinanciallyBalanced ? 'text-green-600' : 'text-red-600'
            }`}>
              {financeAnalysis.totalBills === 0 ? 'No Bills' : 
               financeAnalysis.isFinanciallyBalanced ? 'Balanced' : 'Needs Attention'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {financeAnalysis.totalBills === 0 ? 'Add bills to track' :
               `${Math.abs(financeAnalysis.partner1FinancialPercentage - financeAnalysis.partner2FinancialPercentage)}% difference`}
            </p>
          </div>

          {/* Overall Score */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  stroke={
                    (taskAnalysis.isBalanced && (financeAnalysis.isFinanciallyBalanced || financeAnalysis.totalBills === 0)) ? '#10b981' :
                    (!taskAnalysis.isBalanced && !financeAnalysis.isFinanciallyBalanced && financeAnalysis.totalBills > 0) ? '#ef4444' : '#f59e0b'
                  }
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${
                    (taskAnalysis.isBalanced && (financeAnalysis.isFinanciallyBalanced || financeAnalysis.totalBills === 0)) ? 283 :
                    (!taskAnalysis.isBalanced && !financeAnalysis.isFinanciallyBalanced && financeAnalysis.totalBills > 0) ? 94 : 188
                  } 283`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className={`h-8 w-8 ${
                  (taskAnalysis.isBalanced && (financeAnalysis.isFinanciallyBalanced || financeAnalysis.totalBills === 0)) ? 'text-green-600' :
                  (!taskAnalysis.isBalanced && !financeAnalysis.isFinanciallyBalanced && financeAnalysis.totalBills > 0) ? 'text-red-600' : 'text-yellow-600'
                }`} />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Balance</h3>
            <p className={`text-sm font-medium ${
              (taskAnalysis.isBalanced && (financeAnalysis.isFinanciallyBalanced || financeAnalysis.totalBills === 0)) ? 'text-green-600' :
              (!taskAnalysis.isBalanced && !financeAnalysis.isFinanciallyBalanced && financeAnalysis.totalBills > 0) ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {(taskAnalysis.isBalanced && (financeAnalysis.isFinanciallyBalanced || financeAnalysis.totalBills === 0)) ? 'Excellent' :
               (!taskAnalysis.isBalanced && !financeAnalysis.isFinanciallyBalanced && financeAnalysis.totalBills > 0) ? 'Needs Work' : 'Good Progress'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Household equilibrium
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Balance Insights:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {taskAnalysis.isBalanced && (
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                <span>Task responsibilities are fairly distributed</span>
              </li>
            )}
            {!taskAnalysis.isBalanced && (
              <li className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-red-600" />
                <span>Consider redistributing some tasks for better balance</span>
              </li>
            )}
            {financeAnalysis.totalBills > 0 && financeAnalysis.isFinanciallyBalanced && (
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                <span>Financial responsibilities are well balanced</span>
              </li>
            )}
            {financeAnalysis.totalBills > 0 && !financeAnalysis.isFinanciallyBalanced && (
              <li className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-red-600" />
                <span>Consider adjusting financial responsibilities for better balance</span>
              </li>
            )}
            {financeAnalysis.totalBills === 0 && (
              <li className="flex items-start space-x-2">
                <Target className="h-4 w-4 mt-0.5 text-blue-600" />
                <span>Add household bills to track financial balance</span>
              </li>
            )}
            <li className="flex items-start space-x-2">
              <Heart className="h-4 w-4 mt-0.5 text-purple-600" />
              <span>Regular check-ins help maintain balance over time</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Detailed Task Analysis (existing content) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Detailed Task Analysis</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">{partnerNames[0]} - Think → Plan → Do</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Think</span>
                </div>
                <div className="text-lg font-bold text-blue-600">{taskAnalysis.thinkPlanDoAnalysis.partner1.think}</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Plan</span>
                </div>
                <div className="text-lg font-bold text-blue-600">{taskAnalysis.thinkPlanDoAnalysis.partner1.plan}</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Do</span>
                </div>
                <div className="text-lg font-bold text-blue-600">{taskAnalysis.thinkPlanDoAnalysis.partner1.do}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600">{partnerNames[1]} - Think → Plan → Do</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Think</span>
                </div>
                <div className="text-lg font-bold text-green-600">{taskAnalysis.thinkPlanDoAnalysis.partner2.think}</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Plan</span>
                </div>
                <div className="text-lg font-bold text-green-600">{taskAnalysis.thinkPlanDoAnalysis.partner2.plan}</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Do</span>
                </div>
                <div className="text-lg font-bold text-green-600">{taskAnalysis.thinkPlanDoAnalysis.partner2.do}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Think:</strong> Notice when the task needs to be done and initiate the process (20% of time)<br/>
            <strong>Plan:</strong> Organize, schedule, and prepare everything needed (30% of time)<br/>
            <strong>Do:</strong> Execute the actual task and complete it (50% of time)
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{taskAnalysis.totalCards}</div>
          <div className="text-sm text-blue-800">Total Task Cards</div>
          <div className="text-xs text-gray-600 mt-1">{taskAnalysis.assignedCards} assigned</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{financeAnalysis.totalBills}</div>
          <div className="text-sm text-green-800">Total Bills</div>
          <div className="text-xs text-gray-600 mt-1">{financeAnalysis.assignedBills} assigned</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{Math.round((taskAnalysis.partner1Time + taskAnalysis.partner2Time) / 60)}</div>
          <div className="text-sm text-purple-800">Hours/Week</div>
          <div className="text-xs text-gray-600 mt-1">Task time total</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(financeAnalysis.monthlyTotal)}</div>
          <div className="text-sm text-emerald-800">Monthly Bills</div>
          <div className="text-xs text-gray-600 mt-1">Total expenses</div>
        </div>
      </div>
    </div>
  );
};