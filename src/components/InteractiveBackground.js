'use client';

import { useState, useEffect } from 'react';

export default function InteractiveBackground() {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    // Set initial window height
    setWindowHeight(window.innerHeight);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate scroll progress (0 to 1)
  const scrollProgress = Math.min(scrollY / (windowHeight * 2), 1);
  
  // Calculate different animation values based on scroll
  const opacity1 = Math.max(0.3, 0.8 - scrollProgress * 0.5);
  const opacity2 = Math.max(0.2, 0.6 - scrollProgress * 0.4);
  const opacity3 = Math.max(0.1, 0.4 - scrollProgress * 0.3);
  
  const translateY1 = scrollY * 0.3;
  const translateY2 = scrollY * 0.5;
  const translateY3 = scrollY * 0.7;
  
  const rotate1 = scrollY * 0.1;
  const rotate2 = scrollY * 0.15;
  
  const scale1 = 1 + scrollProgress * 0.5;
  const scale2 = 1 + scrollProgress * 0.3;

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {/* Base gradient background that changes with scroll */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: `linear-gradient(135deg, 
            rgba(59, 130, 246, ${0.1 + scrollProgress * 0.05}) 0%, 
            rgba(147, 197, 253, ${0.05 + scrollProgress * 0.03}) 25%,
            rgba(255, 255, 255, ${0.9 - scrollProgress * 0.1}) 50%,
            rgba(199, 210, 254, ${0.05 + scrollProgress * 0.03}) 75%,
            rgba(129, 140, 248, ${0.1 + scrollProgress * 0.05}) 100%)`
        }}
      />

      {/* Floating animated orbs */}
      <div 
        className="absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-xl"
        style={{
          background: `radial-gradient(circle, rgba(59, 130, 246, ${opacity1}) 0%, transparent 70%)`,
          transform: `translate(${-100 + translateY1}px, ${100 + translateY1}px) rotate(${rotate1}deg) scale(${scale1})`,
          left: '10%',
          top: '20%',
        }}
      />
      
      <div 
        className="absolute w-80 h-80 rounded-full mix-blend-multiply filter blur-xl"
        style={{
          background: `radial-gradient(circle, rgba(99, 102, 241, ${opacity2}) 0%, transparent 70%)`,
          transform: `translate(${200 - translateY2}px, ${-50 + translateY2}px) rotate(${-rotate2}deg) scale(${scale2})`,
          right: '15%',
          top: '10%',
        }}
      />
      
      <div 
        className="absolute w-72 h-72 rounded-full mix-blend-multiply filter blur-xl"
        style={{
          background: `radial-gradient(circle, rgba(168, 85, 247, ${opacity3}) 0%, transparent 70%)`,
          transform: `translate(${-150 + translateY3}px, ${300 - translateY3}px) rotate(${rotate1 * 0.5}deg)`,
          left: '50%',
          top: '60%',
        }}
      />

      {/* Geometric shapes that move with scroll */}
      <div 
        className="absolute w-4 h-4 bg-blue-400 rounded-full opacity-20"
        style={{
          transform: `translate(${scrollY * 0.2}px, ${scrollY * 0.1}px)`,
          left: '20%',
          top: '30%',
        }}
      />
      
      <div 
        className="absolute w-6 h-6 bg-indigo-400 rounded-full opacity-15"
        style={{
          transform: `translate(${-scrollY * 0.15}px, ${scrollY * 0.25}px)`,
          right: '25%',
          top: '45%',
        }}
      />
      
      <div 
        className="absolute w-3 h-3 bg-purple-400 rounded-full opacity-25"
        style={{
          transform: `translate(${scrollY * 0.3}px, ${-scrollY * 0.2}px)`,
          left: '70%',
          top: '70%',
        }}
      />

      {/* Subtle grid pattern that fades with scroll */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          opacity: Math.max(0, 0.05 - scrollProgress * 0.03),
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
          backgroundSize: '50px 50px',
          transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.1}px)`,
        }}
      />

      {/* Animated lines that move with scroll */}
      <svg 
        className="absolute inset-0 w-full h-full"
        style={{ opacity: Math.max(0, 0.1 - scrollProgress * 0.05) }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.1)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.2)" />
          </linearGradient>
        </defs>
        
        <path
          d={`M 0,${200 + scrollY * 0.1} Q ${400 + scrollY * 0.2},${100 + scrollY * 0.15} ${800 + scrollY * 0.1},${250 + scrollY * 0.1}`}
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        />
        
        <path
          d={`M ${1200 - scrollY * 0.15},${300 + scrollY * 0.2} Q ${800 - scrollY * 0.1},${150 + scrollY * 0.1} ${400 - scrollY * 0.05},${400 + scrollY * 0.25}`}
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.2"
        />
      </svg>

      {/* Particle-like dots that float */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-blue-300 rounded-full"
          style={{
            left: `${10 + (i * 8)}%`,
            top: `${20 + (i * 5)}%`,
            opacity: Math.max(0, 0.3 - scrollProgress * 0.2),
            transform: `translate(${scrollY * (0.1 + i * 0.02)}px, ${scrollY * (0.05 + i * 0.01)}px)`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}
