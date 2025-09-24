import React, { useRef, useLayoutEffect, useState } from 'react';

interface ScrollingNewsProps {
  text: string;
  textClassName?: string;
  loadingClassName?: string;
}

export const ScrollingNews = ({ 
  text, 
  textClassName = 'text-[#0056b3]', 
  loadingClassName = 'text-[#0056b3]/70'
}: ScrollingNewsProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [animationDuration, setAnimationDuration] = useState<number | null>(null);
  // Target a readable speed of approximately 12 characters per second.
  const CHARS_PER_SECOND = 12;

  useLayoutEffect(() => {
    // We base the duration on the number of characters to achieve a consistent
    // reading speed, regardless of pixel width which can vary.
    if (text && text.length > 0) {
      const duration = text.length / CHARS_PER_SECOND;
      // Set a minimum duration to prevent extremely fast scrolling for very short text.
      setAnimationDuration(duration > 1 ? duration : 1);
    } else {
      setAnimationDuration(null);
    }
  }, [text]);

  if (!text) {
    return (
      <div className="flex-1 overflow-hidden whitespace-nowrap">
        <div className="h-full flex items-center px-5">
          <p className={`${loadingClassName} leading-8`}>Đang tải tin tức...</p>
        </div>
      </div>
    );
  }
  
  const style = animationDuration ? { animationDuration: `${animationDuration}s` } : {};
  const animationClass = animationDuration ? 'animate-scroll-left' : '';

  return (
    <div className="flex-1 overflow-hidden relative h-full">
      <div
        ref={scrollerRef}
        className={`${animationClass} absolute top-0 left-0 flex h-full w-max`}
        style={style}
      >
        <p className={`${textClassName} font-bold uppercase px-8 text-lg leading-8`}>{text}</p>
        <p className={`${textClassName} font-bold uppercase px-8 text-lg leading-8`} aria-hidden="true">{text}</p>
      </div>
    </div>
  );
};