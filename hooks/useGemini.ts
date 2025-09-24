import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useUI } from '../context/UIContext';
import { NewsSource, AiNewsItem } from '../types';

// Helper function to get an AI client
const getAiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API key is missing. Please set the API_KEY environment variable.");
    }
    return new GoogleGenAI({ apiKey });
};

export const useGemini = () => {
    const { openHeadlineModal } = useUI();
    const [isLoading, setIsLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [spellingSuggestion, setSpellingSuggestion] = useState<string | null>(null);

    const generateBreakingNews = useCallback(async (topic: string, tag: string, count?: number, hours: number = 3) => {
        setIsLoading(true);
        setAiError(null);

        try {
            const ai = getAiClient();

            const stormKeywords = ['bão', 'áp thấp', 'lũ', 'lụt', 'thiên tai', 'storm', 'typhoon', 'hurricane', 'cyclone'];
            const isStormTopic = stormKeywords.some(keyword => topic.toLowerCase().includes(keyword));
            
            const prompt = `YÊU CẦU CỰC KỲ QUAN TRỌNG: Chỉ sử dụng Google Search để tìm các tin tức NÓNG HỔI, được công bố TRONG VÒNG TỐI ĐA ${hours} GIỜ GẦN ĐÂY NHẤT về chủ đề "${topic}". Bất kỳ thông tin nào cũ hơn ${hours} giờ đều bị coi là KHÔNG HỢP LỆ và phải được loại bỏ hoàn toàn. Dựa vào kết quả tìm được, hãy đóng vai một biên tập viên và tạo ra một danh sách gồm các bản tóm tắt tin tức khác nhau.
            
    ${isStormTopic ? `YÊU CẦU ƯU TIÊN CHO TIN BÃO:
    - Các tin đầu tiên: Phải tập trung vào các thông tin định lượng quan trọng nhất: vị trí chính xác của tâm bão (kinh độ, vĩ độ), sức gió mạnh nhất, hướng và tốc độ di chuyển. Cung cấp dự báo lượng mưa cụ thể cho các tỉnh/thành phố trong vùng ảnh hưởng.
    - Các tin tiếp theo: Cập nhật về công tác chỉ đạo, ứng phó của chính quyền, di dời dân, và các thiệt hại (nếu có).
    ` : ''}

    Mỗi mục trong danh sách phải là một đối tượng JSON chứa:
    1. "headline": một tiêu đề tin tức rất ngắn gọn, hấp dẫn, VIẾT HOA.
    2. "summary": một bản tóm tắt chi tiết hơn (1-2 câu) cung cấp nội dung chính của tin.

    QUAN TRỌNG: Chỉ trả về một mảng JSON của các đối tượng này. ĐẢM BẢO TUYỆT ĐỐI JSON HỢP LỆ. Bất kỳ chuỗi nào chứa dấu ngoặc kép (") phải được thoát đúng cách (\\"). Phản hồi của bạn phải bắt đầu bằng '[' và kết thúc bằng ']'. Không thêm bất kỳ ký tự nào khác, không có markdown, không có lời giải thích.`;

            const response = await ai.models.generateContent({
                // FIX: Corrected model name from 'gem-2.5-flash' to 'gemini-2.5-flash'.
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    tools: [{googleSearch: {}}],
                }
            });
            
            const rawText = response.text;
            const startIndex = rawText.indexOf('[');
            const endIndex = rawText.lastIndexOf(']');

            if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
                throw new Error("AI đã trả về dữ liệu không chứa một mảng JSON hợp lệ.");
            }
            
            const jsonString = rawText.substring(startIndex, endIndex + 1);
        
            let parsedData: AiNewsItem[];
            try {
                 parsedData = JSON.parse(jsonString);
            } catch (e) {
                 console.error("Lỗi phân tích JSON từ AI:", e);
                 console.error("Dữ liệu thô nhận được:", rawText);
                 throw new Error("AI đã trả về dữ liệu không hợp lệ. Vui lòng thử lại.");
            }
            
            if (!Array.isArray(parsedData) || parsedData.length === 0) {
              throw new Error("AI không thể tạo tóm tắt tin tức từ chủ đề được cung cấp.");
            }
            
            // FIX: Explicitly typing `sourcesRaw` as `NewsSource[]` resolves the type inference issue
            // where `uniqueSources` was being inferred as `unknown[]`, causing a type mismatch.
            const sourcesRaw: NewsSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
                ?.map((chunk: any) => chunk.web)
                .filter((source: any) => source && source.uri)
                .map((source: any): NewsSource => ({ uri: source.uri, title: source.title || new URL(source.uri).hostname })) || [];
            
            const uniqueSources = Array.from(new Map(sourcesRaw.map((s: NewsSource) => [s.uri, s])).values());
            
            // Open the selection modal with the fetched data
            openHeadlineModal(parsedData, uniqueSources, tag);

        } catch (err) {
            console.error("Lỗi khi tạo danh sách tin tức khẩn cấp:", err);
            const message = err instanceof Error ? err.message : JSON.stringify(err);
            setAiError(`Không thể tạo tin: ${message}. Vui lòng thử lại.`);
        } finally {
            setIsLoading(false);
        }
    }, [openHeadlineModal]);

    const checkSpelling = useCallback(async (text: string) => {
        if (!text) return;
        try {
            const ai = getAiClient();
            const prompt = `Correct any spelling or grammatical errors in the following Vietnamese phrase. If it is already correct, return the original phrase. Only return the corrected phrase, nothing else. Phrase: "${text}"`;
            
            const response = await ai.models.generateContent({
                // FIX: Corrected model name from 'gem-2.5-flash' to 'gemini-2.5-flash'.
                model: 'gemini-2.5-flash',
                contents: prompt,
                 config: {
                    temperature: 0,
                },
            });

            const correctedText = response.text.trim().replace(/"/g, '');
            
            if (correctedText.toLowerCase() !== text.toLowerCase() && correctedText.length > 0) {
                setSpellingSuggestion(correctedText);
            } else {
                setSpellingSuggestion(null);
            }
        } catch (err) {
            console.error("Spell check error:", err);
            setSpellingSuggestion(null);
        }
    }, []);

    const clearSpellingSuggestion = useCallback(() => {
        setSpellingSuggestion(null);
    }, []);

    return {
        isLoading,
        aiError,
        spellingSuggestion,
        generateBreakingNews,
        checkSpelling,
        clearSpellingSuggestion,
    };
};