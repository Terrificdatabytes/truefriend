import React, { useState, useEffect } from 'react';
import { Heart, AlertTriangle, Share2, Download, BarChart3, Eye, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUESTIONS, DIMENSIONS, getScoreCategory } from '../constants/questions';
import { getDisclaimer } from '../constants/disclaimers';
import { saveAssessment, saveSettings, getSettings } from '../utils/storage';
import DisclaimerBanner from './DisclaimerBanner';
import ViewCounter from './ViewCounter';
import ShareModal from './ShareModal';
import ReportGenerator from './ReportGenerator';
import FeedbackWidget from './FeedbackWidget';

const FriendshipHealthCheckup = () => {
  const [language, setLanguage] = useState('english');
  const [step, setStep] = useState('landing'); // landing, quiz, results
  const [friendName, setFriendName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);

  useEffect(() => {
    const settings = getSettings();
    if (settings.language) {
      setLanguage(settings.language);
    }
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    saveSettings({ language: lang });
  };

  const handleStartQuiz = () => {
    if (friendName.trim()) {
      setStep('quiz');
      setCurrentQuestion(0);
      setAnswers({});
    }
  };

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < QUESTIONS[language].length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Quiz completed, calculate results
        calculateResults(newAnswers);
      }
    }, 300);
  };

  const calculateResults = (finalAnswers) => {
    const questions = QUESTIONS[language];
    
    // Calculate scores by dimension
    const dimensionScores = {};
    const directionScores = { them: 0, me: 0 };
    let totalScore = 0;
    let answeredCount = 0;

    DIMENSIONS.forEach(dim => {
      dimensionScores[dim.id] = { them: 0, me: 0, total: 0, count: 0 };
    });

    questions.forEach(q => {
      const answer = finalAnswers[q.id];
      if (answer !== undefined) {
        const scoreValue = answer * 25; // 1-4 scale to 0-100
        dimensionScores[q.dimension].count++;
        dimensionScores[q.dimension][q.direction] += scoreValue;
        dimensionScores[q.dimension].total += scoreValue;
        directionScores[q.direction] += scoreValue;
        totalScore += scoreValue;
        answeredCount++;
      }
    });

    // Average scores
    Object.keys(dimensionScores).forEach(dim => {
      if (dimensionScores[dim].count > 0) {
        dimensionScores[dim].them = dimensionScores[dim].them / (dimensionScores[dim].count / 2);
        dimensionScores[dim].me = dimensionScores[dim].me / (dimensionScores[dim].count / 2);
        dimensionScores[dim].total = dimensionScores[dim].total / dimensionScores[dim].count;
      }
    });

    const overallScore = answeredCount > 0 ? totalScore / answeredCount : 0;
    
    // Calculate reciprocity balance
    const themTotal = directionScores.them / (answeredCount / 2);
    const meTotal = directionScores.me / (answeredCount / 2);
    const reciprocityBalance = Math.abs(themTotal - meTotal);
    
    // Detect self-centered behavior
    const selfCenteredDetected = meTotal < themTotal - 20;

    // Get top 3 strengths and areas for improvement
    const dimensionArray = Object.entries(dimensionScores).map(([id, scores]) => ({
      id,
      name: DIMENSIONS.find(d => d.id === id)?.name || id,
      icon: DIMENSIONS.find(d => d.id === id)?.icon || '📊',
      score: scores.total
    }));

    dimensionArray.sort((a, b) => b.score - a.score);
    const strengths = dimensionArray.slice(0, 3);
    const improvements = dimensionArray.slice(-3).reverse();

    const resultsData = {
      friendName,
      language,
      overallScore,
      category: getScoreCategory(overallScore),
      dimensionScores,
      directionScores: { them: themTotal, me: meTotal },
      reciprocityBalance,
      selfCenteredDetected,
      strengths,
      improvements,
      answers: finalAnswers,
      completedAt: new Date().toISOString()
    };

    setResults(resultsData);
    setStep('results');

    // Save to localStorage
    saveAssessment(resultsData);

    // Celebrate completion with confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const renderLanding = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <DisclaimerBanner language={language} variant="landing" />
          
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
            <div className="text-center mb-8">
              <Heart className="w-16 h-16 mx-auto mb-4 text-pink-500" />
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {language === 'english' ? 'Friendship Health Checkup' : 'Friendship Health Checkup'}
              </h1>
              <p className="text-gray-600 text-lg">
                {language === 'english' 
                  ? 'Assess your friendship across 10 psychological dimensions'
                  : 'Unga friendship-a 10 psychological dimensions-la assess pannunga'}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'english' ? 'Choose Language' : 'Language Select Pannunga'}
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleLanguageChange('english')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      language === 'english'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('tanglish')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      language === 'tanglish'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tanglish
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'english' ? "Your Friend's Name (Optional)" : "Unga Friend-oda Peru (Optional)"}
                </label>
                <input
                  type="text"
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  placeholder={language === 'english' ? 'Enter name...' : 'Peru enter pannunga...'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleStartQuiz}
                disabled={!friendName.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {language === 'english' ? 'Start Assessment' : 'Assessment Start Pannunga'}
              </button>

              <div className="text-center text-sm text-gray-500">
                {language === 'english' ? '150 questions • Takes about 10-15 minutes' : '150 questions • 10-15 minutes aagum'}
              </div>
            </div>
          </div>

          <ViewCounter language={language} />
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    const questions = QUESTIONS[language];
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{language === 'english' ? 'Question' : 'Question'} {currentQuestion + 1}/{questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                {DIMENSIONS.find(d => d.id === question.dimension)?.icon} {DIMENSIONS.find(d => d.id === question.dimension)?.name}
              </span>
              <h2 className="text-2xl font-bold text-gray-800">
                {question.text}
              </h2>
            </div>

            <div className="space-y-3">
              {[
                { value: 4, label: language === 'english' ? 'Strongly Agree' : 'Romba Agree' },
                { value: 3, label: language === 'english' ? 'Agree' : 'Agree' },
                { value: 2, label: language === 'english' ? 'Disagree' : 'Disagree' },
                { value: 1, label: language === 'english' ? 'Strongly Disagree' : 'Romba Disagree' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className="w-full text-left px-6 py-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all font-medium"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <DisclaimerBanner language={language} variant="quiz" />
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return null;

    const { category } = results;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto pt-8 pb-16">
          <DisclaimerBanner language={language} variant="results" />

          {/* Overall Score */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{category.emoji}</div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: category.color }}>
                {category.label}
              </h2>
              <div className="text-5xl font-bold text-gray-800 mb-2">
                {Math.round(results.overallScore)}%
              </div>
              <p className="text-gray-600">
                {language === 'english' ? `Friendship with ${friendName}` : `${friendName}-oda Friendship`}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              >
                <Share2 className="w-5 h-5" />
                {language === 'english' ? 'Share Results' : 'Results Share Pannunga'}
              </button>
              <button
                onClick={() => setShowReportGenerator(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-all shadow-lg"
              >
                <Download className="w-5 h-5" />
                {language === 'english' ? 'Download Report' : 'Report Download Pannunga'}
              </button>
            </div>
          </div>

          {/* Dimension Scores */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              {language === 'english' ? 'Dimensional Breakdown' : 'Dimension Breakdown'}
            </h3>
            <div className="space-y-4">
              {DIMENSIONS.map(dim => {
                const score = results.dimensionScores[dim.id]?.total || 0;
                const dimCategory = getScoreCategory(score);
                return (
                  <div key={dim.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">
                        {dim.icon} {dim.name}
                      </span>
                      <span className="font-bold" style={{ color: dimCategory.color }}>
                        {Math.round(score)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{ 
                          width: `${score}%`,
                          backgroundColor: dimCategory.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reciprocity Balance */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {language === 'english' ? 'Reciprocity Balance' : 'Reciprocity Balance'}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">
                  {language === 'english' ? 'What They Give' : 'Avanga Kudukkuranga'}
                </div>
                <div className="text-4xl font-bold text-blue-600">
                  {Math.round(results.directionScores.them)}%
                </div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">
                  {language === 'english' ? 'What You Give' : 'Neenga Kudukkureenga'}
                </div>
                <div className="text-4xl font-bold text-purple-600">
                  {Math.round(results.directionScores.me)}%
                </div>
              </div>
            </div>
            {results.reciprocityBalance > 15 && (
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-yellow-800">
                  {language === 'english'
                    ? 'There seems to be an imbalance in this friendship. Consider discussing this with your friend.'
                    : 'Indha friendship-la imbalance irukku. Unga friend-oda discuss pannunga.'}
                </p>
              </div>
            )}
          </div>

          {/* Strengths and Improvements */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {language === 'english' ? 'Top Strengths' : 'Top Strengths'}
              </h3>
              <div className="space-y-3">
                {results.strengths.map((strength, idx) => (
                  <div key={strength.id} className="flex items-center gap-3">
                    <div className="text-2xl">{strength.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-700">{strength.name}</div>
                      <div className="text-sm text-green-600 font-semibold">
                        {Math.round(strength.score)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {language === 'english' ? 'Areas for Growth' : 'Grow Panna Vendiya Areas'}
              </h3>
              <div className="space-y-3">
                {results.improvements.map((improvement, idx) => (
                  <div key={improvement.id} className="flex items-center gap-3">
                    <div className="text-2xl">{improvement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-700">{improvement.name}</div>
                      <div className="text-sm text-orange-600 font-semibold">
                        {Math.round(improvement.score)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <FeedbackWidget results={results} language={language} />

          <DisclaimerBanner language={language} variant="results" />

          <div className="text-center mt-8">
            <button
              onClick={() => {
                setStep('landing');
                setFriendName('');
                setCurrentQuestion(0);
                setAnswers({});
                setResults(null);
              }}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
            >
              {language === 'english' ? 'Start New Assessment' : 'Pudhu Assessment Start Pannunga'}
            </button>
          </div>
        </div>

        {showShareModal && (
          <ShareModal
            results={results}
            language={language}
            onClose={() => setShowShareModal(false)}
          />
        )}

        {showReportGenerator && (
          <ReportGenerator
            results={results}
            language={language}
            onClose={() => setShowReportGenerator(false)}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {step === 'landing' && renderLanding()}
      {step === 'quiz' && renderQuiz()}
      {step === 'results' && renderResults()}
    </>
  );
};

export default FriendshipHealthCheckup;
