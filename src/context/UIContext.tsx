import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { NewsSource, AiNewsItem, ClockDisplayMode } from '../types';
import { useNews as useRssNewsHook } from '../hooks/useNews';

// --- Context Type Definition ---
interface UIContextType {
    isAppVisible: boolean;
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    // Interface Modes
    isMourningMode: boolean;
    setMourningMode: (active: boolean) => void;
    isTetMode: boolean;
    setTetMode: (active: boolean) => void;
    isWeatherBarVisible: boolean;
    setWeatherBarVisible: (visible: boolean) => void;
    resetUIMode: () => void;
    // Clock Display
    clockDisplayMode: ClockDisplayMode;
    setClockDisplayMode: (mode: ClockDisplayMode) => void;
    clockCustomText: string;
    setClockCustomText: (text: string) => void;
    clockAlternateDuration: number;
    setClockAlternateDuration: (duration: number) => void;
    customTextAlternateDuration: number;
    setCustomTextAlternateDuration: (duration: number) => void;
    // Headline Selection Modal
    isHeadlineModalOpen: boolean;
    itemsForSelection: AiNewsItem[];
    sourcesForSelection: NewsSource[];
    tagForSelection: string;
    openHeadlineModal: (items: AiNewsItem[], sources: NewsSource[], tag: string) => void;
    closeHeadlineModal: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

// --- Provider Component ---
// FIX: Using React.PropsWithChildren to correctly type components that accept children.
// This resolves an issue where TypeScript failed to recognize children passed via JSX.
export const UIProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const { newsTitles, error, isFetching } = useRssNewsHook();

    // --- State Initialization ---
    const [isAppVisible, setIsAppVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isMourningMode, setIsMourningMode] = useState(false);
    const [isTetMode, setIsTetMode] = useState(false);
    const [isWeatherBarVisible, setIsWeatherBarVisible] = useState(() => {
        const saved = localStorage.getItem('isWeatherBarVisible');
        // Default to true if not set
        return saved !== null ? JSON.parse(saved) : true;
    });
     const [clockDisplayMode, setClockDisplayMode] = useState<ClockDisplayMode>(
        () => (localStorage.getItem('clockDisplayMode') as ClockDisplayMode) || 'clock'
    );
    const [clockCustomText, setClockCustomText] = useState<string>(
        () => localStorage.getItem('clockCustomText') || ''
    );
    const [clockAlternateDuration, setClockAlternateDuration] = useState<number>(
       () => parseInt(localStorage.getItem('clockAlternateDuration') || '5', 10)
    );
    const [customTextAlternateDuration, setCustomTextAlternateDuration] = useState<number>(
        () => parseInt(localStorage.getItem('customTextAlternateDuration') || '5', 10)
    );
    
    // Headline Selection Modal State
    const [isHeadlineModalOpen, setIsHeadlineModalOpen] = useState(false);
    const [itemsForSelection, setItemsForSelection] = useState<AiNewsItem[]>([]);
    const [sourcesForSelection, setSourcesForSelection] = useState<NewsSource[]>([]);
    const [tagForSelection, setTagForSelection] = useState<string>('');
    
    // --- App Visibility Effect ---
    useEffect(() => {
        // Show the app once the initial RSS fetch is initiated or completed/failed
        if (newsTitles.length > 0 || error || isFetching) {
            setIsAppVisible(true);
        }
    }, [newsTitles, error, isFetching]);

    // --- LocalStorage Effects ---
    useEffect(() => {
        localStorage.setItem('isWeatherBarVisible', JSON.stringify(isWeatherBarVisible));
    }, [isWeatherBarVisible]);

    useEffect(() => {
        localStorage.setItem('clockDisplayMode', clockDisplayMode);
    }, [clockDisplayMode]);

    useEffect(() => {
        localStorage.setItem('clockCustomText', clockCustomText);
    }, [clockCustomText]);
    
    useEffect(() => {
        localStorage.setItem('clockAlternateDuration', String(clockAlternateDuration));
    }, [clockAlternateDuration]);

    useEffect(() => {
        localStorage.setItem('customTextAlternateDuration', String(customTextAlternateDuration));
    }, [customTextAlternateDuration]);


    // --- Modal Functions ---
    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        // Also ensure headline modal is closed if main modal is closed
        setIsHeadlineModalOpen(false);
    }, []);

    // --- Headline Selection Modal Functions ---
    const openHeadlineModal = useCallback((items: AiNewsItem[], sources: NewsSource[], tag: string) => {
        setItemsForSelection(items);
        setSourcesForSelection(sources);
        setTagForSelection(tag);
        setIsHeadlineModalOpen(true);
    }, []);
    
    const closeHeadlineModal = useCallback(() => {
        setIsHeadlineModalOpen(false);
        setItemsForSelection([]);
        setSourcesForSelection([]);
        setTagForSelection('');
    }, []);

    // --- Interface Mode Functions ---
    const setMourningMode = useCallback((active: boolean) => {
        setIsMourningMode(active);
        if (active) {
            setIsTetMode(false); // Ensure Tet mode is off if mourning mode is activated
        }
    }, []);

    const setTetMode = useCallback((active: boolean) => {
        setIsTetMode(active);
        if (active) {
            setIsMourningMode(false); // Ensure mourning mode is off if Tet mode is activated
        }
    }, []);
    
    const resetUIMode = useCallback(() => {
        setIsMourningMode(false);
        setIsTetMode(false);
        // Note: isWeatherBarVisible is a persistent user preference and is not reset here.
    }, []);

    const value: UIContextType = {
        isAppVisible,
        isModalOpen,
        openModal,
        closeModal,
        isMourningMode,
        setMourningMode,
        isTetMode,
        setTetMode,
        isWeatherBarVisible,
        setWeatherBarVisible: setIsWeatherBarVisible,
        resetUIMode,
        clockDisplayMode,
        setClockDisplayMode,
        clockCustomText,
        setClockCustomText,
        clockAlternateDuration,
        setClockAlternateDuration,
        customTextAlternateDuration,
        setCustomTextAlternateDuration,
        isHeadlineModalOpen,
        itemsForSelection,
        sourcesForSelection,
        tagForSelection,
        openHeadlineModal,
        closeHeadlineModal,
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

// --- Custom Hook ---
export const useUI = (): UIContextType => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};