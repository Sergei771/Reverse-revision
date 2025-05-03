import { fetchHtml, highlightSyntax } from '../utils/helpers.js';

/**
 * Handles loading page content and templates into the DOM.
 */
export class ContentLoader {
    /**
     * Creates an instance of ContentLoader.
     * @param {string} contentTargetId - The ID of the element to load main page content into.
     * @param {string} navbarTargetId - The ID of the element to load the navbar into.
     * @param {string} footerTargetId - The ID of the element to load the footer into.
     */
    constructor(contentTargetId, navbarTargetId, footerTargetId) {
        this.contentTarget = document.getElementById(contentTargetId);
        this.navbarTarget = document.getElementById(navbarTargetId);
        this.footerTarget = document.getElementById(footerTargetId);

        if (!this.contentTarget || !this.navbarTarget || !this.footerTarget) {
            console.error('ContentLoader: One or more target elements not found.');
        }
    }

    /**
     * Loads the main application layout (navbar, footer).
     */
    async loadLayout() {
        if (!this.navbarTarget || !this.footerTarget) return;

        try {
            const [navbarHtml, footerHtml] = await Promise.all([
                fetchHtml('src/templates/navbar.html'),
                fetchHtml('src/templates/footer.html')
            ]);
            console.log('Navbar HTML fetched:', navbarHtml);
            this.navbarTarget.innerHTML = navbarHtml;
            console.log('Footer HTML fetched:', footerHtml);
            this.footerTarget.innerHTML = footerHtml;
        } catch (error) {
            console.error('Failed to load layout templates:', error);
            // Optionally display an error message in the layout targets
            this.navbarTarget.innerHTML = '<p class="text-red-500 p-4">Error loading navbar.</p>';
            this.footerTarget.innerHTML = '<p class="text-red-500 p-4 text-center">Error loading footer.</p>';
        }
    }

    /**
     * Loads the content for a specific page/route.
     * @param {string} pageName - The name of the page to load (e.g., 'introduction', 'c-basics').
     * @returns {Promise<boolean>} True if loading was successful, false otherwise.
     */
    async loadPage(pageName) {
        if (!this.contentTarget) return false;

        // Simple mapping from page name to file path
        const filePath = `src/pages/${pageName}.html`;

        this.contentTarget.innerHTML = '<p>Loading...</p>'; // Show loading indicator

        try {
            const pageHtml = await fetchHtml(filePath);
            console.log(`Page HTML fetched for ${pageName}:`, pageHtml);
            this.contentTarget.innerHTML = pageHtml;
            highlightSyntax(this.contentTarget); // Apply syntax highlighting to the new content
            return true;
        } catch (error) {
            console.error(`Failed to load page ${pageName}:`, error);
            this.contentTarget.innerHTML = '<p class="text-red-500">Error loading page content.</p>';
            return false;
        }
    }
} 