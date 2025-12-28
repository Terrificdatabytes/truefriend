import React, { useState } from 'react';
import { X, Download, FileImage, FileText, FileJson, Loader } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { DIMENSIONS } from '../constants/questions';
import { getDisclaimer } from '../constants/disclaimers';
import confetti from 'canvas-confetti';

const ReportGenerator = ({ results, language, onClose }) => {
  const [generating, setGenerating] = useState(false);
  const [generatingType, setGeneratingType] = useState('');

  const generatePNG = async (size = 'instagram') => {
    setGenerating(true);
    setGeneratingType('PNG');

    try {
      const dimensions = {
        instagram: { width: 1080, height: 1080 },
        linkedin: { width: 1200, height: 627 },
        story: { width: 1080, height: 1920 }
      };

      const { width, height } = dimensions[size];

      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#9333ea');
      gradient.addColorStop(1, '#3b82f6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Semi-transparent overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(40, 40, width - 80, height - 80);

      // Title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Friendship Health Checkup', width / 2, 120);

      // Score
      const category = results.category;
      ctx.fillStyle = category.color;
      ctx.font = 'bold 96px Arial';
      ctx.fillText(`${Math.round(results.overallScore)}%`, width / 2, 240);

      ctx.fillStyle = category.color;
      ctx.font = 'bold 36px Arial';
      ctx.fillText(category.label, width / 2, 300);

      // Friend name
      if (results.friendName) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '28px Arial';
        ctx.fillText(`Friendship with ${results.friendName}`, width / 2, 350);
      }

      // Top 3 Strengths
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('💪 Top Strengths:', 80, 430);

      ctx.fillStyle = '#1f2937';
      ctx.font = '24px Arial';
      results.strengths.slice(0, 3).forEach((strength, idx) => {
        ctx.fillText(
          `${strength.icon} ${strength.name}: ${Math.round(strength.score)}%`,
          80,
          480 + idx * 40
        );
      });

      // Top 3 Improvements
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('🎯 Areas for Growth:', 80, 650);

      ctx.fillStyle = '#1f2937';
      ctx.font = '24px Arial';
      results.improvements.slice(0, 3).forEach((improvement, idx) => {
        ctx.fillText(
          `${improvement.icon} ${improvement.name}: ${Math.round(improvement.score)}%`,
          80,
          700 + idx * 40
        );
      });

      // Reciprocity
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Reciprocity Balance', width / 2, 860);

      ctx.font = '24px Arial';
      ctx.fillText(
        `Them: ${Math.round(results.directionScores.them)}% | You: ${Math.round(results.directionScores.me)}%`,
        width / 2,
        900
      );

      // Date
      const date = new Date().toLocaleDateString();
      ctx.fillStyle = '#9ca3af';
      ctx.font = '20px Arial';
      ctx.fillText(`Generated on ${date}`, width / 2, 960);

      // Disclaimer
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('⚠️ FOR ENTERTAINMENT ONLY', width / 2, 1000);

      ctx.font = '16px Arial';
      ctx.fillStyle = '#4b5563';
      ctx.fillText('Not professional advice • Visit app for full disclaimer', width / 2, 1030);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `FriendshipReport_${results.friendName || 'Assessment'}_${size}_${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(url);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        setGenerating(false);
        setGeneratingType('');
      });
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Error generating PNG. Please try again.');
      setGenerating(false);
      setGeneratingType('');
    }
  };

  const generatePDF = async () => {
    setGenerating(true);
    setGeneratingType('PDF');

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Page 1: Cover
      pdf.setFillColor(147, 51, 234);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(32);
      pdf.text('Friendship Health', pageWidth / 2, 80, { align: 'center' });
      pdf.text('Checkup Report', pageWidth / 2, 100, { align: 'center' });

      pdf.setFontSize(48);
      pdf.text(`${Math.round(results.overallScore)}%`, pageWidth / 2, 140, { align: 'center' });

      pdf.setFontSize(24);
      pdf.text(results.category.label, pageWidth / 2, 160, { align: 'center' });

      if (results.friendName) {
        pdf.setFontSize(16);
        pdf.text(`Friendship with ${results.friendName}`, pageWidth / 2, 180, { align: 'center' });
      }

      pdf.setFontSize(12);
      pdf.text(new Date().toLocaleDateString(), pageWidth / 2, 200, { align: 'center' });

      // Disclaimer on cover
      pdf.setFontSize(10);
      pdf.setTextColor(255, 200, 0);
      pdf.text('⚠️ FOR ENTERTAINMENT ONLY - NOT PROFESSIONAL ADVICE', pageWidth / 2, 250, { align: 'center' });

      // Page 2: Summary
      pdf.addPage();
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(20);
      pdf.text('Executive Summary', 20, 20);

      pdf.setFontSize(12);
      let y = 35;
      pdf.text(`Overall Score: ${Math.round(results.overallScore)}%`, 20, y);
      y += 10;
      pdf.text(`Category: ${results.category.label}`, 20, y);
      y += 10;
      pdf.text(`Reciprocity Balance: Them ${Math.round(results.directionScores.them)}% | You ${Math.round(results.directionScores.me)}%`, 20, y);
      y += 10;
      pdf.text(`Assessment Date: ${new Date(results.completedAt).toLocaleDateString()}`, 20, y);

      y += 20;
      pdf.setFontSize(16);
      pdf.text('Top Strengths:', 20, y);
      y += 10;
      pdf.setFontSize(12);
      results.strengths.forEach((strength, idx) => {
        pdf.text(`${idx + 1}. ${strength.name}: ${Math.round(strength.score)}%`, 25, y);
        y += 8;
      });

      y += 10;
      pdf.setFontSize(16);
      pdf.text('Areas for Growth:', 20, y);
      y += 10;
      pdf.setFontSize(12);
      results.improvements.forEach((improvement, idx) => {
        pdf.text(`${idx + 1}. ${improvement.name}: ${Math.round(improvement.score)}%`, 25, y);
        y += 8;
      });

      // Page 3: Dimensional Breakdown
      pdf.addPage();
      pdf.setFontSize(20);
      pdf.text('Dimensional Breakdown', 20, 20);

      y = 35;
      pdf.setFontSize(12);
      DIMENSIONS.forEach(dim => {
        const score = results.dimensionScores[dim.id]?.total || 0;
        pdf.text(`${dim.name}:`, 20, y);
        pdf.text(`${Math.round(score)}%`, 150, y);
        
        // Draw bar
        const barWidth = (score / 100) * 120;
        pdf.setFillColor(147, 51, 234);
        pdf.rect(20, y + 2, barWidth, 4, 'F');
        
        y += 12;
      });

      // Final page: Full Disclaimer
      pdf.addPage();
      pdf.setFontSize(20);
      pdf.text('Important Disclaimer', 20, 20);

      pdf.setFontSize(11);
      const disclaimerText = getDisclaimer(language, 'full');
      const splitDisclaimer = pdf.splitTextToSize(disclaimerText, pageWidth - 40);
      pdf.text(splitDisclaimer, 20, 35);

      y = 35 + (splitDisclaimer.length * 6) + 10;
      pdf.setFontSize(10);
      pdf.text('For serious relationship concerns, please consult a licensed', 20, y);
      pdf.text('mental health professional or relationship counselor.', 20, y + 6);

      // Save PDF
      pdf.save(`FriendshipReport_${results.friendName || 'Assessment'}_${Date.now()}.pdf`);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setGenerating(false);
      setGeneratingType('');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
      setGenerating(false);
      setGeneratingType('');
    }
  };

  const generateJSON = () => {
    setGenerating(true);
    setGeneratingType('JSON');

    try {
      const jsonData = {
        version: '1.0',
        generatedDate: new Date().toISOString(),
        disclaimer: getDisclaimer(language, 'full'),
        friendName: results.friendName,
        language: language,
        overallScore: results.overallScore,
        category: results.category.label,
        dimensionScores: results.dimensionScores,
        directionScores: results.directionScores,
        reciprocityBalance: results.reciprocityBalance,
        selfCenteredDetected: results.selfCenteredDetected,
        strengths: results.strengths,
        improvements: results.improvements,
        answers: results.answers,
        completedAt: results.completedAt
      };

      const jsonString = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `FriendshipReport_${results.friendName || 'Assessment'}_${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setGenerating(false);
      setGeneratingType('');
    } catch (error) {
      console.error('Error generating JSON:', error);
      alert('Error generating JSON. Please try again.');
      setGenerating(false);
      setGeneratingType('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Download className="w-5 h-5" />
            {language === 'english' ? 'Download Reports' : 'Reports Download Pannunga'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={generating}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* PNG Reports */}
          <div className="border-2 border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileImage className="w-5 h-5 text-purple-600" />
              {language === 'english' ? 'PNG Image Reports' : 'PNG Image Reports'}
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => generatePNG('instagram')}
                disabled={generating}
                className="w-full flex items-center justify-between p-3 border border-gray-300 hover:bg-purple-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📸</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">Instagram Post</div>
                    <div className="text-sm text-gray-500">1080x1080px</div>
                  </div>
                </div>
                {generating && generatingType === 'PNG' ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <button
                onClick={() => generatePNG('linkedin')}
                disabled={generating}
                className="w-full flex items-center justify-between p-3 border border-gray-300 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💼</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">LinkedIn Post</div>
                    <div className="text-sm text-gray-500">1200x627px</div>
                  </div>
                </div>
                {generating && generatingType === 'PNG' ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <button
                onClick={() => generatePNG('story')}
                disabled={generating}
                className="w-full flex items-center justify-between p-3 border border-gray-300 hover:bg-pink-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">Story Format</div>
                    <div className="text-sm text-gray-500">1080x1920px</div>
                  </div>
                </div>
                {generating && generatingType === 'PNG' ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* PDF Report */}
          <button
            onClick={generatePDF}
            disabled={generating}
            className="w-full flex items-center justify-between p-4 border-2 border-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-red-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-800">
                  {language === 'english' ? 'Detailed PDF Report' : 'Detailed PDF Report'}
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'english' ? 'Multi-page with charts and full analysis' : 'Charts-oda full analysis'}
                </div>
              </div>
            </div>
            {generating && generatingType === 'PDF' ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <Download className="w-6 h-6 text-red-600" />
            )}
          </button>

          {/* JSON Export */}
          <button
            onClick={generateJSON}
            disabled={generating}
            className="w-full flex items-center justify-between p-4 border-2 border-green-500 hover:bg-green-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <FileJson className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-800">
                  {language === 'english' ? 'JSON Export' : 'JSON Export'}
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'english' ? 'Raw data for developers' : 'Developers-kku raw data'}
                </div>
              </div>
            </div>
            {generating && generatingType === 'JSON' ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <Download className="w-6 h-6 text-green-600" />
            )}
          </button>

          {/* Note */}
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm text-yellow-800">
            <strong>{language === 'english' ? 'Note:' : 'Note:'}</strong>{' '}
            {language === 'english'
              ? 'All reports include disclaimers and are generated 100% in your browser. No data is sent to any server.'
              : 'Ella reports-layum disclaimer irukkum. 100% unga browser-la generate aaum. Data yaaru-kitta-yum send aagala.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
