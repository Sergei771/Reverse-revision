/**
 * Simple hash-based router.
 */
export class Router {
    /**
     * Creates an instance of Router.
     * @param {import('./ContentLoader.js').ContentLoader} contentLoader - Instance of ContentLoader to load pages.
     * @param {string} defaultRoute - The default route/page name if no hash is present.
     */
    constructor(contentLoader, defaultRoute = 'introduction') {
        this.contentLoader = contentLoader;
        this.defaultRoute = defaultRoute;
        this.routes = {}; // Placeholder for potential route-specific logic if needed later
        this.navController = null; // Will be set later
        this.appInstance = null; // Reference to the main App instance

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRouteChange());

        // Initial route handling needs to wait for layout load
        // We'll call handleRouteChange from App.js after layout is loaded.
    }

    /**
     * Sets the navigation controller instance.
     * @param {import('./NavController.js').NavController} navController
     */
    setNavController(navController) {
        this.navController = navController;
    }

    /**
     * Sets the main application instance.
     * @param {App} appInstance
     */
    setApp(appInstance) {
        this.appInstance = appInstance;
    }

    /**
     * Handles the logic when the URL hash changes.
     */
    handleRouteChange() {
        const hash = window.location.hash.substring(1); // Remove the #
        const routeName = hash || this.defaultRoute;

        console.log(`Router: Routing to: ${routeName}`);

        // Ensure previous page components are cleaned up *before* loading new content
        if (this.appInstance) {
             this.appInstance.cleanupPageSpecificComponents();
        } else {
             console.warn("Router: App instance not set, cannot cleanup components.");
        }

        this.contentLoader.loadPage(routeName).then(success => {
            if (success) {
                console.log(`Router: Content for ${routeName} loaded successfully.`);
                // Scroll to top
                window.scrollTo(0, 0);

                // Update active nav link state
                if (this.navController) {
                    this.navController.updateActiveLink(routeName);
                }

                // *** Initialize page-specific components AFTER content is loaded and in DOM ***
                if (this.appInstance) {
                    this.appInstance.initializePageSpecificComponents(routeName);
                } else {
                    console.warn("Router: App instance not set, cannot initialize components.");
                }

            } else {
                console.error(`Router: Failed to load content for route: ${routeName}`);
                // Optionally redirect to a default error page or the default route
                if (routeName !== this.defaultRoute) {
                     // Avoid infinite loop if default route fails
                    if (window.location.hash !== `#${this.defaultRoute}`) {
                        this.navigateTo(this.defaultRoute);
                    }
                }
            }
        });
    }

    /**
     * Navigates to a specific route.
     * @param {string} routeName - The name of the route to navigate to.
     */
    navigateTo(routeName) {
        // Only change hash if it's different to prevent redundant loads/history entries
        if (window.location.hash !== `#${routeName}`) {
            window.location.hash = `#${routeName}`;
        }
    }
} 