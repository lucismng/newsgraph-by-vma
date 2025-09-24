import React from 'react';

interface IconProps {
  className?: string;
}

export const SunIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 4a1 1 0 011 1v1a1 1 0 11-2 0V5a1 1 0 011-1zm0 14a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM20 12a1 1 0 01-1-1h-1a1 1 0 110-2h1a1 1 0 011 1zm-14 0a1 1 0 011 1H5a1 1 0 110-2h1a1 1 0 011 1zM18.36 5.64a1 1 0 01.707.293l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 01.707-1.707zM7.05 15.536a1 1 0 01.707.293l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 01.707-1.707zM18.36 18.36a1 1 0 01-1.414-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-.707-.293zM7.05 8.464a1 1 0 01-1.414-1.414l.707-.707A1 1 0 017.05 5.64l.707.707a1 1 0 01-.707 1.707l-.707-.707z"/>
  </svg>
);