'use client';

import React, { useState } from 'react';
import { Target, ChevronDown, ChevronUp } from 'lucide-react';

export default function EyeConditions({ 
  eyeConditions, 
  onConditionClick 
}) {
  const [showAll, setShowAll] = useState(false);
  
  // Convert to array for easier manipulation
  const conditionsArray = Object.entries(eyeConditions);
  
  // Show only first 6 conditions on mobile when collapsed, all on desktop or when expanded
  const visibleConditions = showAll ? conditionsArray : conditionsArray.slice(0, 6);
  const hasMore = conditionsArray.length > 6;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
        <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-600" />
        <span className="truncate">Detectable Retinal Conditions</span>
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
        {conditionsArray.map(([key, condition], index) => (
          <button
            key={key}
            onClick={() => onConditionClick(condition)}
            className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 hover:scale-105 ${condition.borderColor} ${condition.bgColor} group ${
              index >= 6 && !showAll ? 'hidden sm:block' : ''
            }`}
          >
            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
              {React.createElement(condition.icon, {
                className: `w-5 h-5 sm:w-6 sm:h-6 ${condition.color} group-hover:scale-110 transition-transform`
              })}
              <div className="text-center">
                <h4 className={`font-semibold text-xs ${condition.color} leading-tight`}>
                  {condition.label}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {condition.riskLevel}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* View More Button - Only show on mobile when there are more conditions */}
      {hasMore && (
        <div className="mt-4 sm:mt-6 text-center sm:hidden">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium text-sm"
          >
            <span>
              {showAll ? `Show Less` : `View More (${conditionsArray.length - 6} more)`}
            </span>
            {showAll ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
      
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
          Click on any condition to view detailed information
        </p>
        <p className="text-xs text-blue-600 font-medium">
          All 19 retinal conditions are detectable with our AI model
        </p>
      </div>
    </div>
  );
}
