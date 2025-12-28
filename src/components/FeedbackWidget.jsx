import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Star, Send, Check, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { encryptFeedback } from '../utils/encryption';

const FeedbackWidget = ({ results, language }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [accuracy, setAccuracy] = useState('');
  const [helpful, setHelpful] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const saveFeedback = async () => {
    try {
      // Get existing feedback from localStorage
      const existingFeedback = JSON.parse(localStorage.getItem('anonymousFeedback') || '[]');
      
      // Create anonymous feedback entry
      const feedback = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        // Store only aggregated/anonymous data
        overallScore: Math.round(results.overallScore),
        category: results.category.label,
        rating: rating,
        accuracy: accuracy,
        helpful: helpful,
        comments: comments,
        language: language,
        // No personal information (friend name, detailed answers, etc.)
      };

      existingFeedback.push(feedback);
      localStorage.setItem('anonymousFeedback', JSON.stringify(existingFeedback));

      // Also store encrypted version for GitHub export
      const encryptedFeedback = await encryptFeedback(feedback);
      const encryptedList = JSON.parse(localStorage.getItem('encryptedFeedback') || '[]');
      encryptedList.push({
        id: feedback.id,
        timestamp: feedback.timestamp,
        data: encryptedFeedback
      });
      localStorage.setItem('encryptedFeedback', JSON.stringify(encryptedList));

      return feedback;
    } catch (error) {
      console.error('Error saving feedback:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const feedback = await saveFeedback();
    
    if (feedback) {
      setSubmitted(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      // Reset form after 3 seconds and close
      setTimeout(() => {
        setShowFeedback(false);
        setSubmitted(false);
        setRating(0);
        setAccuracy('');
        setHelpful('');
        setComments('');
      }, 3000);
    }
  };

  if (!showFeedback) {
    return (
      <div className="mt-6">
        <button
          onClick={() => setShowFeedback(true)}
          className="flex items-center gap-2 mx-auto px-6 py-3 bg-white border-2 border-purple-500 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all shadow-md"
        >
          <MessageSquare className="w-5 h-5" />
          {language === 'english' ? 'Share Your Feedback' : 'Unga Feedback Kudunga'}
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {language === 'english' ? 'Thank You!' : 'Nandri!'}
          </h3>
          <p className="text-gray-600">
            {language === 'english'
              ? 'Your feedback helps us improve the assessment experience.'
              : 'Unga feedback assessment-a improve panna help pannudhu.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-purple-600" />
          {language === 'english' ? 'Share Your Feedback' : 'Unga Feedback Kudunga'}
        </h3>
        <button
          onClick={() => setShowFeedback(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        {language === 'english'
          ? 'Your feedback is stored anonymously and helps improve the assessment. No personal information is collected.'
          : 'Unga feedback anonymous-a store aaum. Personal information onnum collect pannala.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'english' ? 'Overall Experience' : 'Overall Experience'}
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Accuracy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'english'
              ? 'How accurate was the assessment?'
              : 'Assessment epdi accurate-a irundhuchu?'}
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setAccuracy('very_accurate')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${
                accuracy === 'very_accurate'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-green-300'
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
              <span className="font-medium">
                {language === 'english' ? 'Very Accurate' : 'Romba Accurate'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setAccuracy('somewhat_accurate')}
              className={`flex-1 p-3 border-2 rounded-lg transition-all ${
                accuracy === 'somewhat_accurate'
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                  : 'border-gray-300 hover:border-yellow-300'
              }`}
            >
              <span className="font-medium">
                {language === 'english' ? 'Somewhat' : 'Konjam'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setAccuracy('not_accurate')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${
                accuracy === 'not_accurate'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-red-300'
              }`}
            >
              <ThumbsDown className="w-5 h-5" />
              <span className="font-medium">
                {language === 'english' ? 'Not Accurate' : 'Accurate Illa'}
              </span>
            </button>
          </div>
        </div>

        {/* Helpful */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'english'
              ? 'Was this helpful for self-reflection?'
              : 'Idhu self-reflection-kku helpful-a irundhucha?'}
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setHelpful('yes')}
              className={`flex-1 p-3 border-2 rounded-lg font-medium transition-all ${
                helpful === 'yes'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-green-300'
              }`}
            >
              {language === 'english' ? 'Yes' : 'Aamam'}
            </button>
            <button
              type="button"
              onClick={() => setHelpful('neutral')}
              className={`flex-1 p-3 border-2 rounded-lg font-medium transition-all ${
                helpful === 'neutral'
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                  : 'border-gray-300 hover:border-yellow-300'
              }`}
            >
              {language === 'english' ? 'Neutral' : 'Normal'}
            </button>
            <button
              type="button"
              onClick={() => setHelpful('no')}
              className={`flex-1 p-3 border-2 rounded-lg font-medium transition-all ${
                helpful === 'no'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-red-300'
              }`}
            >
              {language === 'english' ? 'No' : 'Illa'}
            </button>
          </div>
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'english'
              ? 'Additional Comments (Optional)'
              : 'Additional Comments (Optional)'}
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={
              language === 'english'
                ? 'Share your thoughts...'
                : 'Unga thoughts share pannunga...'
            }
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!rating || !accuracy || !helpful}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Send className="w-5 h-5" />
          {language === 'english' ? 'Submit Feedback' : 'Feedback Submit Pannunga'}
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-sm text-blue-800">
        <strong>🔒 {language === 'english' ? 'Privacy:' : 'Privacy:'}</strong>{' '}
        {language === 'english'
          ? 'Feedback is stored anonymously in your browser. No identifying information is collected.'
          : 'Feedback anonymous-a unga browser-la store aaum. Personal info collect pannala.'}
      </div>
    </div>
  );
};

export default FeedbackWidget;
