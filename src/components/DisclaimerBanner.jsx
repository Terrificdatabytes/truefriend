import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { getDisclaimer } from '../constants/disclaimers';

const DisclaimerBanner = ({ language = 'english', variant = 'full' }) => {
  const disclaimer = getDisclaimer(language, variant === 'landing' || variant === 'results' ? 'full' : 'short');

  if (variant === 'quiz') {
    // Small footer disclaimer for quiz screens
    return (
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{getDisclaimer(language, 'short')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-md">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-yellow-800 mb-2 text-lg">
            {language === 'english' ? 'Important Disclaimer' : 'Important Disclaimer'}
          </h3>
          <p className="text-yellow-800 whitespace-pre-line leading-relaxed">
            {disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
