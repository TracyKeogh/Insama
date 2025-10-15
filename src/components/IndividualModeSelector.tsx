import React, { useState } from 'react';
import { UserCheck, Users, ArrowRight, Copy, Check, Share, Link } from 'lucide-react';
import { Partner } from '../types';

interface IndividualModeSelectorProps {
  partner1: Partner;
  partner2: Partner;
  onSelectPartner: (partnerId: string) => void;
  generatePartnerLink: (partnerId: string) => string;
}

export const IndividualModeSelector: React.FC<IndividualModeSelectorProps> = ({
  partner1,
  partner2,
  onSelectPartner,
  generatePartnerLink,
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const copyToClipboard = async (text: string, partnerId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(partnerId);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const partner1Link = generatePartnerLink('partner1');
  const partner2Link = generatePartnerLink('partner2');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <UserCheck className="h-16 w-16 text-green-500 mx-auto" />
            <Users className="h-8 w-8 text-blue-500 absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Individual Mode Setup</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Each partner gets their own unique link for private access. Choose your name to start, 
            or share the link with your partner so they can access their session.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-3xl mx-auto">
            <div className="flex items-center space-x-2 mb-2">
              <Share className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">How it works:</span>
            </div>
            <p className="text-blue-800 text-sm">
              Each partner uses their unique link to access their private session. Responses remain hidden 
              until both partners complete their check-ins, then results are revealed simultaneously.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Partner 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">
                  {partner1.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{partner1.name}</h3>
              <p className="text-gray-600 mb-6">
                Start your individual Insama session. Your responses will be kept private until {partner2.name} completes their session.
              </p>
            </div>

            {/* Unique Link Section */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Link className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Unique Link for {partner1.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={partner1Link}
                  readOnly
                  className="flex-1 px-3 py-2 text-xs bg-white border border-blue-200 rounded-lg text-gray-600"
                />
                <button
                  onClick={() => copyToClipboard(partner1Link, 'partner1')}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  {copiedLink === 'partner1' ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span className="text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                Share this link with {partner1.name} so they can access their private session
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => onSelectPartner('partner1')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Continue as {partner1.name}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Privacy:</strong> Your responses are completely private until both partners finish their check-ins.
                </p>
              </div>
            </div>
          </div>

          {/* Partner 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">
                  {partner2.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{partner2.name}</h3>
              <p className="text-gray-600 mb-6">
                Start your individual Insama session. Your responses will be kept private until {partner1.name} completes their session.
              </p>
            </div>

            {/* Unique Link Section */}
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Link className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Unique Link for {partner2.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={partner2Link}
                  readOnly
                  className="flex-1 px-3 py-2 text-xs bg-white border border-green-200 rounded-lg text-gray-600"
                />
                <button
                  onClick={() => copyToClipboard(partner2Link, 'partner2')}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                >
                  {copiedLink === 'partner2' ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span className="text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-green-700 mt-2">
                Share this link with {partner2.name} so they can access their private session
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => onSelectPartner('partner2')}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Continue as {partner2.name}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Privacy:</strong> Your responses are completely private until both partners finish their check-ins.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-3xl mx-auto">
            <h4 className="font-semibold text-yellow-900 mb-2">📱 Share Links Easily</h4>
            <p className="text-sm text-yellow-800 mb-4">
              Copy and send the unique links via text, email, or any messaging app. Each partner can bookmark 
              their link for easy access to their private session.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-3 rounded border border-yellow-200">
                <strong className="text-yellow-900">✅ What's Private:</strong>
                <ul className="text-yellow-800 mt-1 space-y-1">
                  <li>• Individual responses to check-in questions</li>
                  <li>• Task preferences and feelings</li>
                  <li>• Personal notes and concerns</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded border border-yellow-200">
                <strong className="text-yellow-900">👥 What's Shared:</strong>
                <ul className="text-yellow-800 mt-1 space-y-1">
                  <li>• Task and bill assignments</li>
                  <li>• Overall balance scores</li>
                  <li>• Results after both complete check-ins</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};