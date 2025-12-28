import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const ViewCounter = ({ language = 'english' }) => {
  const [viewCount, setViewCount] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Try to fetch from CountAPI
    const namespace = 'truefriend-app';
    const key = 'page-views';

    fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
      .then(res => res.json())
      .then(data => {
        if (data.value) {
          setViewCount(data.value);
        } else {
          throw new Error('Invalid response');
        }
      })
      .catch(() => {
        // Fallback to localStorage
        setError(true);
        const localCount = parseInt(localStorage.getItem('localViewCount') || '0', 10);
        const newCount = localCount + 1;
        localStorage.setItem('localViewCount', newCount.toString());
        setViewCount(newCount);
      });
  }, []);

  if (!viewCount) return null;

  return (
    <div className="text-center py-6 text-gray-600">
      <div className="flex items-center justify-center gap-2">
        <Eye className="w-4 h-4" />
        <span className="text-sm">
          👁️ {viewCount.toLocaleString()} {language === 'english' ? 'people have assessed their friendships' : 'per avanga friendship-a assess pannirkanga'}
        </span>
      </div>
      {error && (
        <div className="text-xs text-gray-400 mt-1">
          ({language === 'english' ? 'Local count - browser only' : 'Local count - browser mattum'})
        </div>
      )}
    </div>
  );
};

export default ViewCounter;
