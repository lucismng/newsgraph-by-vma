import React from 'react';

interface IconProps {
  className?: string;
}

export const PartlyCloudyIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M41.5 21.5A14.5 14.5 0 0027 7a14.5 14.5 0 00-14.45 12.63C5.17 20.69 0 26.07 0 32.5 0 39.95 5.05 45 12.5 45h31.1C51.36 45 56 40.54 56 34.5c0-5.8-4.22-10.73-9.8-12.28zM49 17a9 9 0 11-18 0 9 9 0 0118 0z" transform="translate(4 4) scale(0.8)"/>
  </svg>
);