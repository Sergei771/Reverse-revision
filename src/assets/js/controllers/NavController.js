/**
 * Handles navigation logic, including mobile menu and active link states.
 */
export class NavController {
    /**
     * Creates an instance of NavController.
     * @param {string} navbarContainerId - ID of the element containing the navbar.
     * @param {string} mobileMenuButtonId - ID of the mobile menu toggle button.
     * @param {string} mobileMenuId - ID of the mobile menu element.
     */
    constructor(navbarContainerId, mobileMenuButtonId, mobileMenuId) {
        this.navbarContainerId = navbarContainerId;
        this.navbarContainer = null;
        this.mobileMenuButtonId = mobileMenuButtonId;
        this.mobileMenuId = mobileMenuId;
        this.activeLinkClass = 'text-purple-400'; // Class for active link
        this.inactiveLinkClass = 'hover:text-purple-400'; // Class for inactive link styling
        this.activeFontWeightClass = 'font-bold'; // Added for clarity
    }

    /**
     * Initializes navigation event listeners after the layout is loaded.
     * Should be called only *after* the navbar HTML has been loaded into the container.
     */
    initializeNavEvents() {
        this.navbarContainer = document.getElementById(this.navbarContainerId);

        if (!this.navbarContainer) {
            console.error('NavController: Navbar container not found at initialization.');
            return;
        }

        // Query elements *inside* the container
        const mobileMenuButton = this.navbarContainer.querySelector(`#${this.mobileMenuButtonId}`);
        const mobileMenu = this.navbarContainer.querySelector(`#${this.mobileMenuId}`);

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        } else {
            console.warn('Mobile menu button or menu element not found within navbar container.');
        }

        // Add listeners to close mobile menu on link click
        const navLinks = this.navbarContainer.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                // Navigation itself is handled by the hash change listener in Router
            });
        });
    }

    /**
     * Updates the visual state of navigation links based on the current route.
     * @param {string} currentRoute - The name of the currently active route.
     */
    updateActiveLink(currentRoute) {
        if (!this.navbarContainer) {
            this.navbarContainer = document.getElementById(this.navbarContainerId);
        }
        
        if (!this.navbarContainer) {
             console.warn('NavController: Navbar container not found for updating links.');
             return;
        }

        const navLinks = this.navbarContainer.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            // Extract route name from href (e.g., #introduction -> introduction)
            const linkRoute = link.getAttribute('href').substring(1);

            // Remove active styles first
            link.classList.remove(this.activeLinkClass, this.activeFontWeightClass);
            // Ensure default hover style is present (Tailwind might override, but good practice)
            link.classList.add(this.inactiveLinkClass);

            // Apply active styles if routes match
            if (linkRoute === currentRoute) {
                link.classList.add(this.activeLinkClass, this.activeFontWeightClass);
                link.classList.remove(this.inactiveLinkClass);
            }
        });
    }
} 