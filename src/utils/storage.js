// Client-side storage utilities using localStorage
// All data stays in browser - 100% private

export const STORAGE_KEYS = {
  ASSESSMENTS: 'friendshipAssessments',
  SETTINGS: 'friendshipSettings',
  VIEW_COUNT: 'localViewCount'
};

export const saveAssessment = (data) => {
  try {
    const assessments = getAssessments();
    const newAssessment = {
      id: Date.now(),
      ...data,
      savedAt: new Date().toISOString()
    };
    assessments.push(newAssessment);
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
    return newAssessment;
  } catch (error) {
    console.error('Error saving assessment:', error);
    return null;
  }
};

export const getAssessments = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading assessments:', error);
    return [];
  }
};

export const deleteAssessment = (id) => {
  try {
    const assessments = getAssessments();
    const filtered = assessments.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return false;
  }
};

export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

export const exportData = () => {
  try {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      assessments: getAssessments(),
      settings: getSettings()
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.assessments) {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(data.assessments));
    }
    if (data.settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    }
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

export const getSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { language: 'english' };
  } catch (error) {
    return { language: 'english' };
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

export const downloadFile = (content, filename, mimeType = 'application/json') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
