'use client';

import { useState, useEffect, useRef } from 'react';

interface CloudCharacterProps {
  message?: string;
}

export default function CloudCharacter({ message = "How can I help you today?" }: CloudCharacterProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cloudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getEyePosition = (eyeCenterX: number, eyeCenterY: number) => {
    if (!cloudRef.current) return { x: eyeCenterX, y: eyeCenterY };
    
    const rect = cloudRef.current.getBoundingClientRect();
    const cloudCenterX = rect.left + rect.width / 2;
    const cloudCenterY = rect.top + rect.height / 2;
    
    const deltaX = mousePosition.x - cloudCenterX;
    const deltaY = mousePosition.y - cloudCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Maximum movement range within the cloud body
    const maxMovement = 6; // Reduced for better control
    
    if (distance === 0) return { x: eyeCenterX, y: eyeCenterY };
    
    // Normalize direction and apply consistent scaling
    const normalizedX = deltaX / distance;
    const normalizedY = deltaY / distance;
    
    // Apply consistent movement regardless of distance
    const moveX = normalizedX * maxMovement;
    const moveY = normalizedY * maxMovement;
    
    return { 
      x: eyeCenterX + moveX, 
      y: eyeCenterY + moveY 
    };
  };

  const leftEyePosition = getEyePosition(25, 15); // Adjusted for new cloud shape
  const rightEyePosition = getEyePosition(55, 15); // Adjusted for new cloud shape

  return (
    <div className="flex flex-col items-center mt-6 mb-4">
      {/* Speech Bubble - moved higher */}
      <div className="relative mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 shadow-sm">
          <p className="text-gray-700 dark:text-gray-300 text-sm font-medium whitespace-nowrap">
            {message}
          </p>
        </div>
        {/* Speech bubble arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-200 dark:border-t-gray-700"></div>
          <div className="absolute top-[-1px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
        </div>
      </div>

      {/* Minimalist Cloud Character */}
      <div ref={cloudRef} className="relative cursor-pointer transition-transform duration-300 hover:scale-105">
        {/* Simple Cloud Shape */}
        <div className="w-16 h-10 bg-blue-200 dark:bg-blue-300 rounded-full relative">
          {/* Cloud bumps for simple cloud effect */}
          <div className="absolute -top-1 left-2 w-6 h-6 bg-blue-200 dark:bg-blue-300 rounded-full"></div>
          <div className="absolute -top-2 left-6 w-8 h-8 bg-blue-200 dark:bg-blue-300 rounded-full"></div>
          <div className="absolute -top-1 right-2 w-6 h-6 bg-blue-200 dark:bg-blue-300 rounded-full"></div>
        </div>

        {/* Eyes that move within the cloud body */}
        <div className="absolute inset-0">
          {/* Left Eye */}
          <div 
            className="absolute w-3 h-3 bg-white rounded-full transition-all duration-100"
            style={{ 
              left: `${leftEyePosition.x}px`, 
              top: `${leftEyePosition.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          />

          {/* Right Eye */}
          <div 
            className="absolute w-3 h-3 bg-white rounded-full transition-all duration-100"
            style={{ 
              left: `${rightEyePosition.x}px`, 
              top: `${rightEyePosition.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
