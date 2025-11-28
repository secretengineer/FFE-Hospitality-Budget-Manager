/**
 * AI Service Layer
 * Handles interactions with Google Gemini and Custom Search APIs.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent';
const SEARCH_API_URL = 'https://www.googleapis.com/customsearch/v1';

/**
 * Generates a detailed specification from an image using Gemini 1.5 Pro.
 * @param {string} base64Image - The image data in base64 format.
 * @param {string} apiKey - The user's Gemini API key.
 * @returns {Promise<string>} The generated description.
 */
export const generateSpecFromImage = async (base64Image, apiKey) => {
    if (!apiKey) throw new Error('Gemini API Key is missing');

    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const payload = {
        contents: [{
            parts: [
                { text: "Analyze this furniture or equipment item. Provide a detailed specification suitable for an interior design spec book. Include likely materials, finishes, dimensions (if estimable), and style. Format as a clean, professional description." },
                {
                    inline_data: {
                        mime_type: "image/jpeg", // Assuming JPEG for simplicity, but could be dynamic
                        data: cleanBase64
                    }
                }
            ]
        }]
    };

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to generate spec');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
};

/**
 * Finds pricing for an item using Google Custom Search API.
 * @param {string} query - The search query (e.g., "Herman Miller Aeron Chair price").
 * @param {string} apiKey - The user's Search API key.
 * @param {string} cx - The user's Search Engine ID.
 * @returns {Promise<Array>} Array of found items with title, link, and snippet.
 */
export const findPrice = async (query, apiKey, cx) => {
    if (!apiKey || !cx) throw new Error('Search API Key or Engine ID is missing');

    try {
        const url = `${SEARCH_API_URL}?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=5`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to search prices');
        }

        const data = await response.json();

        // Extract relevant data, looking for price metadata if available
        return (data.items || []).map(item => {
            // Try to extract price from rich snippets if available
            const price = item.pagemap?.offer?.[0]?.price ||
                item.pagemap?.product?.[0]?.price ||
                '';
            const currency = item.pagemap?.offer?.[0]?.pricecurrency || 'USD';

            return {
                title: item.title,
                link: item.link,
                snippet: item.snippet,
                price: price ? `${currency} ${price}` : null
            };
        });
    } catch (error) {
        console.error('Search API Error:', error);
        throw error;
    }
};
