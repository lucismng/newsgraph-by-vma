import React from 'react';

interface IconProps {
  className?: string;
}

export const SnowIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.95 10.76A8.5 8.5 0 0012 4a8.5 8.5 0 00-8.45 7.44C1.55 12.23 0 14.43 0 17a7 7 0 007 7h10a7 7 0 007-7c0-2.5-1.5-4.66-3.05-6.24zM12 22.5l-1.5-1.5h3L12 22.5zm-3.5-2.5l-1.5-1.5 1.5-1.5.75.75L8.5 19.5l.75.75zm7 0l1.5-1.5-1.5-1.5-.75.75.75.75-.75.75zm-3.5-3l.75-.75L12 16.5l-1.25.75.75.75z"/>
  </svg>
);