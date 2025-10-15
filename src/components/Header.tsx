import React, { useState } from 'react';
import { Heart, Users, Calendar, UserCheck, RefreshCw, Home, Share, Copy, Check } from 'lucide-react';

interface HeaderProps {
  currentStep?: string;
  partnerNames?: [string, string];
  mode?: 'together' | 'individual';
  currentPartnerId?: string | null;
  onSwitchPartner?: () => void;
  onStartOver?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentStep, 
  partnerNames, 
  mode, 
  currentPartnerId,
  onSwitchPartner,
  onStartOver
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const getCurrentPartnerName = () => {
    if (!partnerNames || !currentPartnerId) return null;
    return currentPartnerId === 'partner1' ? partnerNames[0] : partnerNames[1];
  };

  const getPartnerLink = () => {
    if (mode !== 'individual' || !currentPartnerId) return '';
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    if (!sessionId) return '';
    
    const otherPartnerId = currentPartnerId === 'partner1' ? 'partner2' : 'partner1';
    return `${window.location.origin}${window.location.pathname}?session=${sessionId}&partner=${otherPartnerId}`;
  };

  const copyPartnerLink = async () => {
    const link = getPartnerLink();
    if (!link) return;
    
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getOtherPartnerName = () => {
    if (!partnerNames || !currentPartnerId) return '';
    return currentPartnerId === 'partner1' ? partnerNames[1] : partnerNames[0];
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Logo clicked!', { onStartOver: !!onStartOver });
              if (onStartOver) {
                console.log('Calling onStartOver...');
                onStartOver();
              }
            }}
            className={`flex items-center space-x-3 transition-opacity ${
              onStartOver ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'
            } group relative z-50`}
            title={onStartOver ? "Go to home" : "Insama"}
          >
            <div className="relative">
              <Heart className="h-8 w-8 text-rose-500 group-hover:text-rose-600 transition-colors" fill="currentColor" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                {mode === 'individual' ? (
                  <UserCheck className="h-2.5 w-2.5 text-white" />
                ) : (
                  <Users className="h-2.5 w-2.5 text-white" />
                )}
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors">Insama</h1>
              {currentStep && (
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500">{currentStep}</p>
                  {mode === 'individual' && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Individual Mode
                    </span>
                  )}
                  {mode === 'together' && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      Together Mode
                    </span>
                  )}
                </div>
              )}
            </div>
          </button>
          
          <div className="flex items-center space-x-4">
            {partnerNames && (
              <>
                {mode === 'individual' && currentPartnerId ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentPartnerId === 'partner1' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        <span className="text-white text-sm font-medium">
                          {getCurrentPartnerName()?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {getCurrentPartnerName()}
                      </span>
                    </div>
                    
                    {/* Share Partner Link */}
                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Share partner link"
                      >
                        <Share className="h-4 w-4" />
                      </button>
                      
                      {showShareMenu && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                          <div className="mb-3">
                            <h4 className="font-medium text-gray-900 mb-1">Share with {getOtherPartnerName()}</h4>
                            <p className="text-xs text-gray-600">Send this link so they can access their private session</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={getPartnerLink()}
                              readOnly
                              className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded text-gray-600"
                            />
                            <button
                              onClick={copyPartnerLink}
                              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center space-x-1"
                            >
                              {copiedLink ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  <span className="text-xs">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span className="text-xs">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <button
                            onClick={() => setShowShareMenu(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {onSwitchPartner && (
                      <button
                        onClick={onSwitchPartner}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Switch partner"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ) : mode === 'together' ? (
                  <div className="hidden sm:flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {partnerNames[0].charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{partnerNames[0]}</span>
                    </div>
                    <Heart className="h-4 w-4 text-rose-400" />
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {partnerNames[1].charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{partnerNames[1]}</span>
                    </div>
                  </div>
                ) : null}
              </>
            )}
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Calendar className="h-5 w-5" />
              </button>
              
              {onStartOver && (
                <button
                  onClick={onStartOver}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Start over"
                >
                  <Home className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay to close share menu */}
      {showShareMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </header>
  );
};