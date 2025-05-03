/**
 * Fetches HTML content from a given URL.
 * @param {string} url - The URL to fetch HTML from.
 * @returns {Promise<string>} A promise that resolves with the HTML content as text.
 */
export async function fetchHtml(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Provide a more specific error for common cases like 404
            if (response.status === 404) {
                 console.error(`Could not fetch HTML from ${url}: Not Found (404)`);
                 return '<p class="text-red-500">Error: Content not found.</p>';
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Could not fetch HTML from ${url}:`, error);
        // More generic error message for other fetch issues (network error, etc.)
        return '<p class="text-red-500">Error loading content. Please check the console.</p>';
    }
}

/**
 * Triggers Prism syntax highlighting on the entire document or a specific element.
 * Checks if Prism is available before attempting to highlight.
 * @param {Element} [element=document] - The element to highlight within. Defaults to document.
 */
export function highlightSyntax(element = document) {
    if (typeof Prism !== 'undefined' && Prism.highlightAllUnder) {
        Prism.highlightAllUnder(element);
    } else {
        console.warn('Prism.js not found or highlightAllUnder method is missing.');
    }
} 