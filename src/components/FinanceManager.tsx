import React, { useState, useMemo } from 'react';
import { DollarSign, Plus, Search, Filter, PieChart, TrendingUp, Calendar, CreditCard, Users, AlertCircle, CheckCircle, Edit3, Save, X, Trash2 } from 'lucide-react';
import { HouseholdBill, BillCategory } from '../types';

interface FinanceManagerProps {
  bills: HouseholdBill[];
  partnerNames: [string, string];
  onUpdateBill: (billId: string, updates: Partial<HouseholdBill>) => void;
  onAddBill: (bill: Omit<HouseholdBill, 'id' | 'createdAt'>) => void;
  onDeleteBill: (billId: string) => void;
  onLoadSampleBills?: () => void;
}

const categoryInfo = {
  'housing': { label: 'Housing', color: 'bg-blue-100 text-blue-800', icon: '🏠' },
  'utilities': { label: 'Utilities', color: 'bg-green-100 text-green-800', icon: '⚡' },
  'insurance': { label: 'Insurance', color: 'bg-purple-100 text-purple-800', icon: '🛡️' },
  'transportation': { label: 'Transportation', color: 'bg-yellow-100 text-yellow-800', icon: '🚗' },
  'food': { label: 'Food', color: 'bg-orange-100 text-orange-800', icon: '🍽️' },
  'healthcare': { label: 'Healthcare', color: 'bg-red-100 text-red-800', icon: '🏥' },
  'childcare': { label: 'Childcare', color: 'bg-pink-100 text-pink-800', icon: '👶' },
  'entertainment': { label: 'Entertainment', color: 'bg-indigo-100 text-indigo-800', icon: '🎬' },
  'debt': { label: 'Debt', color: 'bg-gray-100 text-gray-800', icon: '💳' },
  'savings': { label: 'Savings', color: 'bg-emerald-100 text-emerald-800', icon: '💰' },
  'other': { label: 'Other', color: 'bg-slate-100 text-slate-800', icon: '📋' },
};

export const FinanceManager: React.FC<FinanceManagerProps> = ({
  bills,
  partnerNames,
  onUpdateBill,
  onAddBill,
  onDeleteBill,
  onLoadSampleBills,
}) => {
  const [filter, setFilter] = useState<'all' | BillCategory | 'unassigned' | 'shared'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBill, setEditingBill] = useState<string | null>(null);
  const [newBill, setNewBill] = useState<Omit<HouseholdBill, 'id' | 'createdAt'>>({
    name: '',
    category: 'other',
    amount: 0,
    frequency: 'monthly',
    dueDate: '1st',
    paymentMethod: 'online',
    isActive: true,
  });

  const categories: Array<{ value: BillCategory | 'all' | 'unassigned' | 'shared', label: string }> = [
    { value: 'all', label: 'All Bills' },
    { value: 'unassigned', label: 'Unassigned' },
    { value: 'shared', label: 'Shared Bills' },
    { value: 'housing', label: 'Housing' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'food', label: 'Food' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'childcare', label: 'Childcare' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'debt', label: 'Debt' },
    { value: 'savings', label: 'Savings' },
    { value: 'other', label: 'Other' },
  ];

  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      if (!bill.isActive) return false;
      
      const matchesFilter = filter === 'all' || 
                           (filter === 'unassigned' && !bill.responsiblePartner && !bill.isShared) ||
                           (filter === 'shared' && bill.isShared) ||
                           bill.category === filter;
      const matchesSearch = bill.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  }, [bills, filter, searchTerm]);

  const analysis = useMemo(() => {
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
    const partner1Percentage = assignedTotal > 0 ? Math.round(((partner1Total + sharedTotal/2) / assignedTotal) * 100) : 0;
    const partner2Percentage = assignedTotal > 0 ? Math.round(((partner2Total + sharedTotal/2) / assignedTotal) * 100) : 0;

    // Category breakdown
    const categoryTotals = Object.keys(categoryInfo).reduce((acc, category) => {
      const categoryBills = activeBills.filter(b => b.category === category);
      const total = categoryBills.reduce((sum, bill) => {
        let monthlyAmount = bill.amount;
        if (bill.frequency === 'weekly') monthlyAmount *= 4.33;
        else if (bill.frequency === 'quarterly') monthlyAmount /= 3;
        else if (bill.frequency === 'annually') monthlyAmount /= 12;
        return sum + monthlyAmount;
      }, 0);
      acc[category as BillCategory] = { count: categoryBills.length, total };
      return acc;
    }, {} as Record<BillCategory, { count: number; total: number }>);

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
      partner1Percentage,
      partner2Percentage,
      categoryTotals,
    };
  }, [bills]);

  const handleAddBill = () => {
    if (newBill.name && newBill.amount > 0) {
      onAddBill(newBill);
      setNewBill({
        name: '',
        category: 'other',
        amount: 0,
        frequency: 'monthly',
        dueDate: '1st',
        paymentMethod: 'online',
        isActive: true,
      });
      setShowAddForm(false);
    }
  };

  const handleResponsibilityChange = (billId: string, type: 'partner1' | 'partner2' | 'shared' | 'unassign') => {
    if (type === 'unassign') {
      onUpdateBill(billId, { 
        responsiblePartner: undefined, 
        isShared: false,
        splitPercentage: undefined 
      });
    } else if (type === 'shared') {
      onUpdateBill(billId, { 
        responsiblePartner: undefined, 
        isShared: true,
        splitPercentage: { partner1: 50, partner2: 50 }
      });
    } else {
      onUpdateBill(billId, { 
        responsiblePartner: type, 
        isShared: false,
        splitPercentage: undefined 
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatFrequency = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  return (
    <div className="space-y-8">
      {/* Financial Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <DollarSign className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600">{formatCurrency(analysis.monthlyTotal)}</div>
            <div className="text-sm text-green-800">Monthly Total</div>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600">{analysis.totalBills}</div>
            <div className="text-sm text-blue-800">Active Bills</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600">{analysis.sharedBills}</div>
            <div className="text-sm text-purple-800">Shared Bills</div>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-orange-600">{analysis.unassignedBills}</div>
            <div className="text-sm text-orange-800">Unassigned</div>
          </div>
        </div>

        {/* Partner Responsibility Breakdown */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-blue-600">{partnerNames[0]}</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{analysis.partner1Percentage}%</div>
                <div className="text-sm text-blue-600">{formatCurrency(analysis.partner1Total)}/month</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${analysis.partner1Percentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600">{analysis.partner1Bills} bills assigned</div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-green-600">{partnerNames[1]}</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{analysis.partner2Percentage}%</div>
                <div className="text-sm text-green-600">{formatCurrency(analysis.partner2Total)}/month</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${analysis.partner2Percentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600">{analysis.partner2Bills} bills assigned</div>
          </div>
        </div>

        {analysis.sharedTotal > 0 && (
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-purple-900">Shared Bills</span>
              <span className="text-lg font-bold text-purple-600">{formatCurrency(analysis.sharedTotal)}/month</span>
            </div>
            <div className="text-sm text-purple-700 mt-1">Split equally between both partners</div>
          </div>
        )}
      </div>

      {/* Filters and Add Bill */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-3">
            {onLoadSampleBills && (
              <button
                onClick={onLoadSampleBills}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <DollarSign className="h-4 w-4" />
                <span>Load Sample Bills</span>
              </button>
            )}
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Bill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Bill Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Bill</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bill Name</label>
              <input
                type="text"
                value={newBill.name}
                onChange={(e) => setNewBill(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Electric Bill"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newBill.category}
                onChange={(e) => setNewBill(prev => ({ ...prev, category: e.target.value as BillCategory }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {Object.entries(categoryInfo).map(([key, info]) => (
                  <option key={key} value={key}>{info.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                value={newBill.amount}
                onChange={(e) => setNewBill(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                value={newBill.frequency}
                onChange={(e) => setNewBill(prev => ({ ...prev, frequency: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="text"
                value={newBill.dueDate}
                onChange={(e) => setNewBill(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 1st, 15th, variable"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={newBill.paymentMethod}
                onChange={(e) => setNewBill(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="auto-pay">Auto-pay</option>
                <option value="online">Online</option>
                <option value="manual">Manual</option>
                <option value="check">Check</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleAddBill}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Add Bill</span>
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Bills List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBills.map(bill => (
          <div key={bill.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl">{categoryInfo[bill.category].icon}</span>
                  <h3 className="font-semibold text-gray-900">{bill.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo[bill.category].color}`}>
                    {categoryInfo[bill.category].label}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold text-lg text-gray-900">{formatCurrency(bill.amount)}</span>
                    <span>/ {formatFrequency(bill.frequency)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {bill.dueDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>{bill.paymentMethod.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onDeleteBill(bill.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {bill.isShared ? 'Shared (50/50)' : 
                     bill.responsiblePartner ? 
                       `Paid by ${bill.responsiblePartner === 'partner1' ? partnerNames[0] : partnerNames[1]}` : 
                       'Unassigned'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleResponsibilityChange(bill.id, 'partner1')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    bill.responsiblePartner === 'partner1' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {partnerNames[0]}
                </button>
                <button
                  onClick={() => handleResponsibilityChange(bill.id, 'partner2')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    bill.responsiblePartner === 'partner2' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {partnerNames[1]}
                </button>
                <button
                  onClick={() => handleResponsibilityChange(bill.id, 'shared')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    bill.isShared 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  Shared
                </button>
                {(bill.responsiblePartner || bill.isShared) && (
                  <button
                    onClick={() => handleResponsibilityChange(bill.id, 'unassign')}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Unassign
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBills.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
          <p className="text-gray-600">Try adjusting your filters or add a new bill.</p>
        </div>
      )}
    </div>
  );
};