import React, { useState } from 'react';
import { Heart, ArrowRight, Users, CheckCircle, BarChart3, Calendar, UserCheck, UsersIcon, Play, Pause, Volume2, VolumeX, Zap } from 'lucide-react';

interface WelcomeProps {
  onContinue: (partner1: string, partner2: string, mode: 'together' | 'individual' | 'collaborative') => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onContinue }) => {
  const [step, setStep] = useState<'intro' | 'mode-selection' | 'together-form' | 'individual-form'>('intro');
  const [selectedMode, setSelectedMode] = useState<'together' | 'individual' | 'collaborative' | null>(null);
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [currentPartnerName, setCurrentPartnerName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleModeSelection = (mode: 'together' | 'individual' | 'collaborative') => {
    setSelectedMode(mode);
    if (mode === 'together') {
      setStep('together-form');
    } else if (mode === 'individual') {
      setStep('individual-form');
    } else {
      // Collaborative mode - go directly without forms
      onContinue('Partner 1', 'Partner 2', 'collaborative');
    }
  };

  const handleTogetherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (partner1.trim() && partner2.trim()) {
      onContinue(partner1.trim(), partner2.trim(), 'together');
    }
  };

  const handleIndividualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPartnerName.trim() && partnerName.trim()) {
      onContinue(currentPartnerName.trim(), partnerName.trim(), 'individual');
    }
  };

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (step === 'mode-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <Heart className="h-16 w-16 text-rose-500 mx-auto" fill="currentColor" />
              <Users className="h-8 w-8 text-blue-500 absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Insama Mode</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              How would you like to use Insama? Choose the approach that works best for your relationship.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Together Mode */}
            <div 
              onClick={() => handleModeSelection('together')}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-blue-200 cursor-pointer group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                  <UsersIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Together Mode</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Work on Insama as a team. Both partners can see and contribute to all responses, 
                  fostering open communication and shared decision-making.
                </p>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Shared visibility of all responses</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Real-time collaboration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Joint check-in sessions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Immediate discussion and resolution</span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">Best for: Open communicators who prefer transparency</p>
                </div>
              </div>
            </div>

            {/* Individual Mode */}
            <div 
              onClick={() => handleModeSelection('individual')}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-green-200 cursor-pointer group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Individual Mode</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Each partner completes responses privately first. Responses are revealed only after 
                  both partners have completed their check-ins.
                </p>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Private, honest responses</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">No influence from partner's answers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Structured reveal and discussion</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Reduces social pressure</span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">Best for: Those who want unbiased, independent input</p>
                </div>
              </div>
            </div>

            {/* Collaborative Mode */}
            <div 
              onClick={() => handleModeSelection('collaborative')}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-purple-200 cursor-pointer group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Collaborative Mode</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Each partner works independently on their own link. The app detects conflicts 
                  and creates a summary for you to resolve together.
                </p>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Work at your own pace</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Automatic conflict detection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Structured conflict resolution</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">No need to be together</span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800 font-medium">Best for: Remote couples or busy schedules</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setStep('intro')}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to Introduction
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'together-form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <Heart className="h-12 w-12 text-rose-500 mx-auto" fill="currentColor" />
                <UsersIcon className="h-6 w-6 text-blue-500 absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Together Mode Setup</h2>
              <p className="text-gray-600">Enter both partner names to begin your shared Insama journey</p>
            </div>

            <form onSubmit={handleTogetherSubmit} className="space-y-6">
              <div>
                <label htmlFor="partner1" className="block text-sm font-medium text-gray-700 mb-2">
                  Partner 1
                </label>
                <input
                  type="text"
                  id="partner1"
                  value={partner1}
                  onChange={(e) => setPartner1(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter first partner's name"
                  required
                />
              </div>

              <div>
                <label htmlFor="partner2" className="block text-sm font-medium text-gray-700 mb-2">
                  Partner 2
                </label>
                <input
                  type="text"
                  id="partner2"
                  value={partner2}
                  onChange={(e) => setPartner2(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter second partner's name"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Create Our Shared Insama</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => setStep('mode-selection')}
                className="text-gray-600 hover:text-gray-800 font-medium text-sm"
              >
                ← Choose Different Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'individual-form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <Heart className="h-12 w-12 text-rose-500 mx-auto" fill="currentColor" />
                <UserCheck className="h-6 w-6 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Individual Mode Setup</h2>
              <p className="text-gray-600">Set up your private Insama session</p>
            </div>

            <form onSubmit={handleIndividualSubmit} className="space-y-6">
              <div>
                <label htmlFor="currentPartner" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="currentPartner"
                  value={currentPartnerName}
                  onChange={(e) => setCurrentPartnerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Partner's Name
                </label>
                <input
                  type="text"
                  id="partnerName"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your partner's name"
                  required
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Note:</strong> Your partner will need to access this same link to complete their responses. 
                  Responses will be revealed only after both of you have completed the check-in.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Start My Individual Session</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => setStep('mode-selection')}
                className="text-gray-600 hover:text-gray-800 font-medium text-sm"
              >
                ← Choose Different Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <Heart className="h-20 w-20 text-rose-500 mx-auto" fill="currentColor" />
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Insama</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Clearly define who does what in your household. Assign tasks and bills using the Think → Plan → Do system 
            to ensure fair distribution and eliminate confusion.
          </p>
          <button
            onClick={() => setStep('mode-selection')}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-3 mx-auto"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Demo Video Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">See Insama in Action</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Watch how couples use Insama to transform their household management and achieve true partnership balance.
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* Video Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                {/* Simulated video content */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-green-600/20"></div>
                
                {/* Video overlay content */}
                <div className="relative z-10 text-center text-white">
                  <div className="mb-6">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <Heart className="h-12 w-12 text-white" fill="currentColor" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Demo: Sarah & Mike's Journey</h3>
                    <p className="text-white/80 max-w-md mx-auto">
                      See how this couple went from constant arguments about chores to a perfectly balanced household in just 2 weeks.
                    </p>
                  </div>
                  
                  {/* Simulated video timeline */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 max-w-lg mx-auto">
                    <div className="flex items-center space-x-4 text-sm">
                      <span>0:00</span>
                      <div className="flex-1 bg-white/20 rounded-full h-1">
                        <div className="bg-white rounded-full h-1 w-1/3"></div>
                      </div>
                      <span>3:45</span>
                    </div>
                  </div>
                </div>

                {/* Play button overlay */}
                <button
                  onClick={toggleVideo}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors shadow-lg">
                    {isVideoPlaying ? (
                      <Pause className="h-8 w-8 text-gray-900 ml-0.5" />
                    ) : (
                      <Play className="h-8 w-8 text-gray-900 ml-1" />
                    )}
                  </div>
                </button>

                {/* Video controls */}
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Video description */}
              <div className="bg-white p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">From Chaos to Harmony: A Real Couple's Transformation</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Watch Sarah and Mike discover how the Think → Plan → Do system eliminated their biggest relationship stressor. 
                      See the exact steps they took to achieve perfect household balance.
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>3:45 duration</span>
                      <span>•</span>
                      <span>Real couple testimonial</span>
                      <span>•</span>
                      <span>Step-by-step walkthrough</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Before: 80/20 split</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">After: 50/50 balance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video benefits */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Real Results</h5>
                <p className="text-sm text-gray-600">See actual before/after household balance scores</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Step-by-Step</h5>
                <p className="text-sm text-gray-600">Follow along with the exact process they used</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Relationship Impact</h5>
                <p className="text-sm text-gray-600">Hear how it improved their overall relationship</p>
              </div>
            </div>
          </div>
        </div>

        {/* What You'll Do */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">What You'll Do</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Think</h3>
              <p className="text-gray-600 text-sm">Who notices when something needs to be done and initiates the task?</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Plan</h3>
              <p className="text-gray-600 text-sm">Who organizes, schedules, and prepares everything needed?</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do</h3>
              <p className="text-gray-600 text-sm">Who actually executes and completes the task?</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-center">
              <strong>The key insight:</strong> Each phase can be owned by different partners, 
              creating true balance and eliminating the invisible mental load.
            </p>
          </div>
        </div>

        {/* Simple Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear Ownership</h3>
            <p className="text-gray-600">Assign each household task and bill to specific partners for each phase - no more confusion about who does what.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fair Balance</h3>
            <p className="text-gray-600">Track time and financial responsibilities to ensure both partners contribute equally to household management.</p>
          </div>
        </div>

        {/* Built with Bolt Badge */}
        <div className="text-center">
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Zap className="h-4 w-4" />
            <span>Built with Bolt</span>
          </a>
          <p className="text-xs text-gray-500 mt-2">
            Powered by AI-driven development
          </p>
        </div>
      </div>
    </div>
  );
};