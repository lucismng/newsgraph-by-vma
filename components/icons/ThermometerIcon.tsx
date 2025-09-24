import React from 'react';

interface IconProps {
  className?: string;
}

export const ThermometerIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M14 14.25V5a3 3 0 00-6 0v9.25a5 5 0 106 0zm-3-11.25a1 1 0 011 1v8.05a5.002 5.002 0 00-2 0V5a1 1 0 011-1zM12 21a3 3 0 110-6 3 3 0 010 6z" clipRule="evenodd" />
  </svg>
);
