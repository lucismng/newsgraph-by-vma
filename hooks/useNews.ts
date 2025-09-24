
import { useState, useEffect, useCallback } from 'react';
import { RssItem } from '../types';
import { RSS_FEEDS } from '../constants';

export const useNews = () => {
    const [newsTitles, setNewsTitles] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    const fetchNews = useCallback(async () => {
        setError(null);
        setIsFetching(true);
        // Clearing titles here will show the "loading" message in the ticker
        setNewsTitles([]); 
        
        try {
            const fetchPromises = RSS_FEEDS.map(feedUrl =>
                fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`)
                .then(res => {
                    if (!res.ok) return Promise.reject(new Error(`Lỗi ${res.status} từ ${feedUrl}`));
                    return res.json();
                })
            );
    
            const results = await Promise.allSettled(fetchPromises);
    
            let allItems: RssItem[] = [];
            results.forEach(result => {
                if (result.status === 'fulfilled' && result.value.status === 'ok' && Array.isArray(result.value.items)) {
                    allItems.push(...result.value.items);
                } else if (result.status === 'rejected') {
                    console.warn("Lỗi khi tải nguồn tin:", result.reason.message);
                }
            });
    
            if (allItems.length === 0) {
                throw new Error('Không thể tải tin tức từ bất kỳ nguồn nào.');
            }
            
            const uniqueItems = Array.from(new Map(allItems.map(item => [item.title, item])).values());
            const shuffled = uniqueItems.sort(() => 0.5 - Math.random());
            
            const stripHtml = (html: string) => {
                const tmp = document.createElement("DIV");
                tmp.innerHTML = html;
                return tmp.textContent || tmp.innerText || "";
            };

            const descriptions = shuffled.map(item => stripHtml(item.description).replace('(Dân trí) - ', '').trim());
            setNewsTitles(descriptions);

        } catch (e) {
            const message = e instanceof Error ? e.message : "Đã xảy ra lỗi không xác định.";
            console.error("Fetch error:", message);
            setError(`Lỗi khi tải tin: ${message}`);
        } finally {
            setIsFetching(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
        const intervalId = setInterval(fetchNews, 15 * 60 * 1000); // Fetch every 15 minutes
        return () => clearInterval(intervalId);
    }, [fetchNews]);

    return { newsTitles, error, isFetching, refetchNews: fetchNews };
};
