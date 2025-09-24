import React, { createContext, useState, useMemo, useCallback, useEffect, useContext } from 'react';
import { useNews as useRssNews } from '../hooks/useNews';
import { useUI } from './UIContext';
import { NewsMode, AiNewsItem, DisasterWarning } from '../types';

// --- Context Type Definition ---
interface NewsContextType {
    newsMode: NewsMode;
    lastSpecialMode: 'breaking' | 'disaster' | null;
    displayNewsString: string;
    isRssFetching: boolean;
    refetchRssNews: () => void;
    // Custom News
    customNews: string[];
    addCustomNews: (news: string) => void;
    removeCustomNews: (index: number) => void;
    clearCustomNews: () => void;
    setCustomNewsAsSource: () => void;
    // Breaking News
    breakingNews: string[];
    breakingNewsTag: string;
    setCustomBreakingNews: (tag: string, content: string) => void;
    setBreakingNewsFromSelection: (items: AiNewsItem[], tag: string) => void;
    // Disaster Warning
    disasterWarning: DisasterWarning | null;
    setDisasterWarningAsSource: (tag: string, content: string, displayLocation: 'ticker' | 'weather') => void;
    // General
    setRssAsSource: () => void;
    switchToRssMode: () => void;
    reactivateSpecialNews: () => void;
    clearSpecialNewsData: () => void;
}

const NewsContext = createContext<NewsContextType | null>(null);

// --- Helper Functions ---
const formatNewsString = (titles: string[], error?: string | null): string => {
    if (error) return error;
    if (titles.length === 0) return 'Đang tải tin tức...';
    const NBSP = '\u00A0';
    // Increased spacing for better readability
    const SEPARATOR = `${NBSP.repeat(12)}•${NBSP.repeat(12)}`;
    return titles.map(title => `${title.trim().replace(/\.$/, '')}`).join(SEPARATOR);
};

// --- Provider Component ---
export const NewsProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const { newsTitles: rssTitles, error: rssError, isFetching: isRssFetching, refetchNews: refetchRssNews } = useRssNews();
    const { closeModal, resetUIMode } = useUI();
    
    // --- State Initialization ---
    const [newsMode, setNewsMode] = useState<NewsMode>(() => (localStorage.getItem('newsMode') as NewsMode) || 'rss');
    const [lastSpecialMode, setLastSpecialMode] = useState<'breaking' | 'disaster' | null>(
        () => localStorage.getItem('lastSpecialMode') as 'breaking' | 'disaster' | null
    );
    const [breakingNews, setBreakingNews] = useState<string[]>(() => {
        const saved = localStorage.getItem('breakingNews');
        return saved ? JSON.parse(saved) : [];
    });
    const [breakingNewsTag, setBreakingNewsTag] = useState<string>(() => localStorage.getItem('breakingNewsTag') || 'TIN KHẨN');
    const [customNews, setCustomNews] = useState<string[]>([]);
    const [disasterWarning, setDisasterWarning] = useState<DisasterWarning | null>(() => {
        const saved = localStorage.getItem('disasterWarning');
        return saved ? JSON.parse(saved) : null;
    });

    // --- LocalStorage Effects ---
    useEffect(() => {
        localStorage.setItem('newsMode', newsMode);
    }, [newsMode]);

    useEffect(() => {
        if (lastSpecialMode) {
            localStorage.setItem('lastSpecialMode', lastSpecialMode);
        } else {
            localStorage.removeItem('lastSpecialMode');
        }
    }, [lastSpecialMode]);

    useEffect(() => {
        localStorage.setItem('breakingNews', JSON.stringify(breakingNews));
    }, [breakingNews]);

    useEffect(() => {
        localStorage.setItem('breakingNewsTag', breakingNewsTag);
    }, [breakingNewsTag]);

    useEffect(() => {
        if (disasterWarning) {
            localStorage.setItem('disasterWarning', JSON.stringify(disasterWarning));
        } else {
            localStorage.removeItem('disasterWarning');
        }
    }, [disasterWarning]);

    // --- Custom News Functions ---
    const addCustomNews = useCallback((news: string) => {
        setCustomNews(prev => [...prev, news]);
    }, []);
    
    const removeCustomNews = useCallback((indexToRemove: number) => {
        setCustomNews(prev => prev.filter((_, index) => index !== indexToRemove));
    }, []);

    const clearCustomNews = useCallback(() => {
        setCustomNews([]);
    }, []);

    const setCustomNewsAsSource = useCallback(() => {
        if (customNews.length > 0) {
            setNewsMode('custom');
            closeModal();
        }
    }, [customNews, closeModal]);

    // --- Breaking News Functions ---
    const setBreakingNewsFromSelection = useCallback((items: AiNewsItem[], tag: string) => {
        if (items.length > 0 && tag.trim()) {
            const summaries = items.map(item => item.summary);
            setBreakingNewsTag(tag.trim());
            setBreakingNews(summaries);
            setNewsMode('breaking');
            setLastSpecialMode('breaking');
            closeModal();
        }
    }, [closeModal]);

    const setCustomBreakingNews = useCallback((tag: string, content: string) => {
        if (tag.trim() && content.trim()) {
            setBreakingNewsTag(tag.trim());
            setBreakingNews([content.trim()]);
            setNewsMode('breaking');
            setLastSpecialMode('breaking');
            closeModal();
        }
    }, [closeModal]);

    // --- Disaster Warning Functions ---
    const setDisasterWarningAsSource = useCallback((tag: string, content: string, displayLocation: 'ticker' | 'weather') => {
        if (tag.trim() && content.trim()) {
            setDisasterWarning({ tag, content, displayLocation });
            setNewsMode('disaster');
            setLastSpecialMode('disaster');
            closeModal();
        }
    }, [closeModal]);
    
    // --- General Functions ---
    const clearSpecialNewsData = useCallback(() => {
        setNewsMode('rss');
        setBreakingNews([]);
        setBreakingNewsTag('TIN KHẨN');
        setDisasterWarning(null);
        setLastSpecialMode(null);
        localStorage.removeItem('newsMode');
        localStorage.removeItem('breakingNews');
        localStorage.removeItem('breakingNewsTag');
        localStorage.removeItem('disasterWarning');
        localStorage.removeItem('lastSpecialMode');
    }, []);
    
    const switchToRssMode = useCallback(() => {
        setNewsMode('rss');
    }, []);
    
    const reactivateSpecialNews = useCallback(() => {
        if (lastSpecialMode) {
            setNewsMode(lastSpecialMode);
        }
    }, [lastSpecialMode]);

    const setRssAsSource = useCallback(() => {
        setNewsMode('rss');
        resetUIMode();
        closeModal();
    }, [closeModal, resetUIMode]);


    // --- Memoized Display String ---
    const displayNewsString = useMemo(() => {
        if (newsMode === 'custom') {
            return formatNewsString(customNews);
        }
        if (newsMode === 'breaking') {
            return formatNewsString(breakingNews);
        }
        if (newsMode === 'disaster' && disasterWarning?.displayLocation === 'ticker') {
            return formatNewsString([disasterWarning.content]);
        }
        // For 'rss' mode or 'disaster' on weather bar, show RSS.
        return formatNewsString(rssTitles, rssError);
    }, [newsMode, rssTitles, customNews, breakingNews, rssError, disasterWarning]);

    // --- Context Value ---
    const value: NewsContextType = {
        newsMode,
        lastSpecialMode,
        displayNewsString,
        isRssFetching,
        refetchRssNews,
        customNews,
        addCustomNews,
        removeCustomNews,
        clearCustomNews,
        setCustomNewsAsSource,
        breakingNews,
        breakingNewsTag,
        setCustomBreakingNews,
        setBreakingNewsFromSelection,
        disasterWarning,
        setDisasterWarningAsSource,
        setRssAsSource,
        switchToRssMode,
        reactivateSpecialNews,
        clearSpecialNewsData,
    };

    return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};

// --- Custom Hook ---
export const useNews = (): NewsContextType => {
    const context = useContext(NewsContext);
    if (!context) {
        throw new Error('useNews must be used within a NewsProvider');
    }
    return context;
};