import React from 'react';
import { Clock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  partnerNames: [string, string];
  onAssign: (taskId: string, partnerId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const categoryColors = {
  home: 'bg-blue-100 text-blue-800',
  childcare: 'bg-pink-100 text-pink-800',
  cooking: 'bg-orange-100 text-orange-800',
  cleaning: 'bg-green-100 text-green-800',
  finance: 'bg-purple-100 text-purple-800',
  social: 'bg-yellow-100 text-yellow-800',
  health: 'bg-red-100 text-red-800',
  maintenance: 'bg-gray-100 text-gray-800',
  admin: 'bg-indigo-100 text-indigo-800',
};

const priorityColors = {
  low: 'border-l-gray-300',
  medium: 'border-l-yellow-400',
  high: 'border-l-red-400',
};

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  partnerNames, 
  onAssign, 
  onToggleComplete 
}) => {
  const formatFrequency = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1).replace('-', ' ');
  };

  const getAssignedPartnerName = () => {
    if (!task.assignedTo) return null;
    return task.assignedTo === 'partner1' ? partnerNames[0] : partnerNames[1];
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${priorityColors[task.priority]} border-l-4`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[task.category]}`}>
              {task.category}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{task.timeEstimate} min</span>
            </div>
            <span>•</span>
            <span>{formatFrequency(task.frequency)}</span>
            {task.priority === 'high' && (
              <>
                <span>•</span>
                <div className="flex items-center space-x-1 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>High Priority</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`p-2 rounded-full transition-colors ${
            task.completed 
              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          <CheckCircle2 className="h-5 w-5" />
        </button>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {getAssignedPartnerName() ? `Owned by ${getAssignedPartnerName()}` : 'Unassigned'}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onAssign(task.id, 'partner1')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                task.assignedTo === 'partner1' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {partnerNames[0]}
            </button>
            <button
              onClick={() => onAssign(task.id, 'partner2')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                task.assignedTo === 'partner2' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {partnerNames[1]}
            </button>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          <span className="font-medium">CPE Ownership:</span> Full responsibility for Conception, Planning & Execution
        </div>
      </div>
    </div>
  );
};