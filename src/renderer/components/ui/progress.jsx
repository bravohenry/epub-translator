import React from 'react';

// 进度条组件
export const Progress = ({ value = 0, max = 100, className = '' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="progress-bar">
      <div 
        className="progress-bar-value"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}; 