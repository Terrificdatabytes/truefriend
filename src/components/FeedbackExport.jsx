import React, { useState } from 'react';
import { Download, Upload, FileText } from 'lucide-react';

const FeedbackExport = ({ language = 'english' }) => {
  const [exportStatus, setExportStatus] = useState('');

  const exportEncryptedFeedback = () => {
    try {
      const encryptedFeedback = localStorage.getItem('encryptedFeedback');
      if (!encryptedFeedback || encryptedFeedback === '[]') {
        setExportStatus(language === 'english' ? 'No feedback to export' : 'Export panna feedback illa');
        return;
      }

      const blob = new Blob([encryptedFeedback], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `feedback_encrypted_${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);

      setExportStatus(language === 'english' ? 'Exported successfully!' : 'Export aachu!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus(language === 'english' ? 'Export failed' : 'Export fail aachu');
    }
  };

  const getInstructions = () => {
    if (language === 'english') {
      return `To submit feedback to the repository:
1. Click 'Export Encrypted Feedback' to download the encrypted file
2. Go to the truefriend GitHub repository
3. Create an issue titled "Feedback Submission"
4. Attach the downloaded JSON file to the issue
5. The maintainers will process and add it to the feedback collection`;
    }
    return `Repository-kku feedback submit panna:
1. 'Export Encrypted Feedback' button press pannunga
2. truefriend GitHub repository-kku ponga
3. "Feedback Submission"-nu issue create pannunga
4. Download panna JSON file attach pannunga
5. Maintainers process panni feedback collection-la add pannuvaanga`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FileText className="w-6 h-6 text-purple-600" />
        {language === 'english' ? 'Export Feedback' : 'Feedback Export Pannunga'}
      </h3>

      <p className="text-gray-600 mb-6">
        {language === 'english'
          ? 'Export your encrypted feedback to submit it to the GitHub repository.'
          : 'Unga encrypted feedback-a export panni GitHub repository-kku submit pannunga.'}
      </p>

      <button
        onClick={exportEncryptedFeedback}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
      >
        <Download className="w-5 h-5" />
        {language === 'english' ? 'Export Encrypted Feedback' : 'Encrypted Feedback Export Pannunga'}
      </button>

      {exportStatus && (
        <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-400 rounded text-sm text-green-800">
          {exportStatus}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded text-sm text-blue-800">
        <strong>📝 {language === 'english' ? 'Instructions:' : 'Vazhikattal:'}</strong>
        <pre className="mt-2 whitespace-pre-wrap font-sans">{getInstructions()}</pre>
      </div>

      <div className="mt-4 p-4 bg-purple-50 border-l-4 border-purple-400 rounded text-sm text-purple-800">
        <strong>🔒 {language === 'english' ? 'Privacy & Security:' : 'Privacy & Security:'}</strong>{' '}
        {language === 'english'
          ? 'Feedback is encrypted using AES-256-GCM encryption. Only aggregated, anonymous data is included. No personal information is exported.'
          : 'Feedback AES-256-GCM encryption use panni encrypt pannirukku. Anonymous data mattum dhan include pannirukku. Personal information onnum export aagala.'}
      </div>
    </div>
  );
};

export default FeedbackExport;
