import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { getDisclaimer } from '../constants/disclaimers';
import confetti from 'canvas-confetti';

const ShareModal = ({ results, language, onClose }) => {
  const [copied, setCopied] = useState(false);

  const appURL = window.location.origin + window.location.pathname;

  const getShareText = (platform) => {
    const score = Math.round(results.overallScore);
    const category = results.category.label;
    const disclaimer = getDisclaimer(language, 'short');

    switch (platform) {
      case 'whatsapp':
        return language === 'english'
          ? `🧠 I just assessed my friendship health!\n\nScore: ${score}% - ${category}\nReciprocity Balance: ${Math.abs(Math.round(results.directionScores.them - results.directionScores.me))}% difference\n\n⚠️ ${disclaimer}\n\nTry it yourself: ${appURL}`
          : `🧠 Naan en friendship health assess pannitten!\n\nScore: ${score}% - ${category}\nReciprocity Balance: ${Math.abs(Math.round(results.directionScores.them - results.directionScores.me))}% difference\n\n⚠️ ${disclaimer}\n\nNeenga try pannunga: ${appURL}`;

      case 'instagram':
        return language === 'english'
          ? `🧠💖 Friendship Health Checkup Results\n\nMy Score: ${score}% - ${category}!\n\n✨ This was such an insightful journey of self-reflection\n\n⚠️ Just for fun & entertainment - not professional advice!\n\nTake the assessment: ${appURL}\n\n#FriendshipGoals #SelfReflection #MentalHealth #Friendships #PersonalGrowth #Entertainment`
          : `🧠💖 Friendship Health Checkup Results\n\nEn Score: ${score}% - ${category}!\n\n✨ Romba insightful self-reflection experience\n\n⚠️ Entertainment mattum - professional advice illa!\n\nAssessment edunga: ${appURL}\n\n#FriendshipGoals #SelfReflection #MentalHealth #Friendships #PersonalGrowth`;

      case 'linkedin':
        return language === 'english'
          ? `I recently explored an interesting self-reflection tool assessing friendship dynamics across 10 psychological dimensions.\n\nKey insights:\n✅ Trust & Reliability: ${Math.round(results.dimensionScores.trust?.total || 0)}%\n✅ Reciprocity Balance: ${Math.abs(Math.round(results.directionScores.them - results.directionScores.me))}% difference\n⚡ Overall Score: ${score}%\n\nIt's fascinating to pause and reflect on our relationships.\n\n⚠️ Disclaimer: This is an entertainment tool, not professional psychological evaluation.\n\nTry it: ${appURL}\n\n#ProfessionalDevelopment #SelfAwareness #Relationships #PersonalGrowth`
          : `Naan recent-a oru interesting self-reflection tool try pannen - friendship dynamics-a 10 psychological dimensions-la assess pannudhu.\n\nKey insights:\n✅ Trust & Reliability: ${Math.round(results.dimensionScores.trust?.total || 0)}%\n✅ Reciprocity Balance: ${Math.abs(Math.round(results.directionScores.them - results.directionScores.me))}% difference\n⚡ Overall Score: ${score}%\n\nEnga relationships pathi reflect panna nalla irukkum.\n\n⚠️ Disclaimer: Idhu entertainment tool, professional evaluation illa.\n\n#PersonalDevelopment #SelfAwareness #Relationships`;

      default:
        return getShareText('whatsapp');
    }
  };

  const handleShare = async (platform) => {
    const shareText = getShareText(platform);

    // Try Web Share API first (mobile)
    if (navigator.share && platform === 'whatsapp') {
      try {
        await navigator.share({
          title: language === 'english' ? 'Friendship Health Checkup' : 'Friendship Health Checkup',
          text: shareText
        });
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
        return;
      } catch (err) {
        // Fallback to other methods
      }
    }

    // Platform-specific sharing
    if (platform === 'whatsapp') {
      const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            {language === 'english' ? 'Share Your Results' : 'Unga Results Share Pannunga'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* WhatsApp */}
          <button
            onClick={() => handleShare('whatsapp')}
            className="w-full flex items-center gap-4 p-4 border-2 border-green-500 hover:bg-green-50 rounded-lg transition-all group"
          >
            <div className="text-3xl">💬</div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-800 group-hover:text-green-600">
                {language === 'english' ? 'Share on WhatsApp' : 'WhatsApp-la Share Pannunga'}
              </div>
              <div className="text-sm text-gray-500">
                {language === 'english' ? 'Share with friends' : 'Friends-kku share pannunga'}
              </div>
            </div>
          </button>

          {/* Instagram */}
          <button
            onClick={() => handleShare('instagram')}
            className="w-full flex items-center gap-4 p-4 border-2 border-pink-500 hover:bg-pink-50 rounded-lg transition-all group"
          >
            <div className="text-3xl">📸</div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-800 group-hover:text-pink-600">
                {language === 'english' ? 'Instagram Caption' : 'Instagram Caption'}
              </div>
              <div className="text-sm text-gray-500">
                {language === 'english' ? 'Copy caption to clipboard' : 'Caption copy pannunga'}
              </div>
            </div>
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => handleShare('linkedin')}
            className="w-full flex items-center gap-4 p-4 border-2 border-blue-600 hover:bg-blue-50 rounded-lg transition-all group"
          >
            <div className="text-3xl">💼</div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-800 group-hover:text-blue-600">
                {language === 'english' ? 'LinkedIn Post' : 'LinkedIn Post'}
              </div>
              <div className="text-sm text-gray-500">
                {language === 'english' ? 'Professional format' : 'Professional format'}
              </div>
            </div>
          </button>

          {/* Copy to Clipboard */}
          <button
            onClick={() => handleShare('copy')}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-400 hover:bg-gray-50 rounded-lg transition-all group"
          >
            <div className="text-3xl">
              {copied ? <Check className="w-8 h-8 text-green-500" /> : <Copy className="w-8 h-8 text-gray-600" />}
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-800 group-hover:text-gray-900">
                {copied
                  ? (language === 'english' ? 'Copied!' : 'Copy Aachu!')
                  : (language === 'english' ? 'Copy to Clipboard' : 'Clipboard-kku Copy Pannunga')}
              </div>
              <div className="text-sm text-gray-500">
                {language === 'english' ? 'Copy text to share anywhere' : 'Text copy panni enga venumnaalum share pannunga'}
              </div>
            </div>
          </button>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm text-yellow-800">
            <strong>{language === 'english' ? 'Note:' : 'Note:'}</strong>{' '}
            {language === 'english'
              ? 'All shares include our disclaimer stating this is for entertainment purposes only.'
              : 'Ella shares-layum entertainment mattum-nu disclaimer irukkum.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
