import React, { useState } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface HelpTooltipProps {
  content: string;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  trigger?: 'hover' | 'click';
  maxWidth?: string;
}

export default function HelpTooltip({
  content,
  title,
  position = 'top',
  size = 'md',
  trigger = 'hover',
  maxWidth = 'max-w-xs'
}: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 border-t-transparent border-b-transparent border-l-transparent'
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className={`text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors ${sizeClasses[size]}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        aria-label={title || "Help information"}
      >
        <QuestionMarkCircleIcon className="w-full h-full" />
      </button>

      {isVisible && (
        <>
          {/* Overlay for click-triggered tooltips */}
          {trigger === 'click' && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsVisible(false)}
            />
          )}
          
          {/* Tooltip */}
          <div
            className={`absolute z-20 ${positionClasses[position]} ${maxWidth}`}
            role="tooltip"
          >
            <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg">
              {title && (
                <div className="font-semibold mb-1 text-white">
                  {title}
                </div>
              )}
              <div className="text-gray-100">
                {content}
              </div>
            </div>
            
            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
            />
          </div>
        </>
      )}
    </div>
  );
}