import { ContentLoader } from './controllers/ContentLoader.js';
import { Router } from './controllers/Router.js';
import { NavController } from './controllers/NavController.js';
import { QuizController } from './controllers/QuizController.js';
import { ElfVisualizer } from './components/ElfVisualizer.js';
import { PeVisualizer } from './components/PeVisualizer.js';

/**
 * Main application class.
 */
class App {
    constructor() {
        // Configuration for element IDs
        this.config = {
            contentTargetId: 'app-content',
            navbarTargetId: 'navbar-container',
            footerTargetId: 'footer-container',
            mobileMenuButtonId: 'mobile-menu-button',
            mobileMenuId: 'mobile-menu',
            quizContainerId: 'quiz-container' // ID of the div *inside* quiz.html
        };

        this.contentLoader = new ContentLoader(
            this.config.contentTargetId,
            this.config.navbarTargetId,
            this.config.footerTargetId
        );

        this.navController = new NavController(
            this.config.navbarTargetId, // NavController needs the container where the nav will be loaded
            this.config.mobileMenuButtonId,
            this.config.mobileMenuId
        );

        this.router = new Router(this.contentLoader);
        this.quizController = null; // Initialize QuizController only when on the quiz page
        this.elfVisualizer = null;  // Initialisé conditionnellement
        this.peVisualizer = null;   // Initialisé conditionnellement

        // Link router and nav controller
        this.router.setNavController(this.navController);

        // Provide the App instance to the Router for callbacks
        this.router.setApp(this);

        // Setup callback for when quiz page is loaded
        // this.router.onQuizPageLoad = () => this.initializeQuiz(); // Supprimé - mauvaise approche
    }

    // Restore the loadLayout method
    async loadLayout() {
        try {
            // Call the ContentLoader's loadLayout method directly
            if (this.contentLoader) {
                await this.contentLoader.loadLayout();
                console.log("App.js: Layout loaded via ContentLoader.");
            } else {
                 console.error("App.js: ContentLoader not initialized before calling loadLayout.");
            }
        } catch (error) {
            console.error("App.js: Failed to load layout:", error);
        }
    }

    async initialize() {
        // Load common layout elements
        await this.loadLayout(); // Call the restored loadLayout
        this.navController.initializeNavEvents();

        // Initial routing based on hash
        const initialRoute = window.location.hash.substring(1) || 'introduction';
        this.handleRouteChange(initialRoute); // Use the new handleRouteChange

        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            const newRoute = window.location.hash.substring(1);
            this.handleRouteChange(newRoute); // Use the new handleRouteChange
        });

        this.initGlobalListeners(); // Initialize scroll-to-top listener
    }

    /**
     * Initializes the QuizController.
     * This should be called AFTER the quiz page content has been loaded into the DOM.
     */
    initializeQuiz() {
        // Clean up previous quiz instance if it exists
        if (this.quizController) {
            this.quizController.cleanup();
        }
        console.log('Attempting to initialize QuizController...');
        // Utiliser l'ID SANS le #, car on utilise getElementById dans le contrôleur
        this.quizController = new QuizController(this.config.quizContainerId); 
        // The initQuiz method will find elements *within* the loaded quiz content
        this.quizController.initQuiz();
    }

    // The CORRECT, new handleRouteChange (added in previous steps)
    handleRouteChange(route) {
        this.cleanupPageSpecificComponents(); // Clean up components from the previous page
        this.router.navigateTo(route);
        this.navController.updateActiveLink(route);

        // --- Nouvelle Logique --- 
        // Le Router (ou ContentLoader) doit maintenant nous dire quand le contenu est prêt
        // pour que nous puissions appeler les initialisations spécifiques.
        // Pour l'instant, nous attendons la modification du Router/ContentLoader.
        // Exemple hypothétique:
        // this.router.getCurrentContentLoadedPromise().then(() => {
        //    this.initializePageSpecificComponents(route);
        // });
    }

    /**
     * Initialize components specific to the loaded route AFTER content is in DOM.
     * This method should be called by the router/loader callback/promise.
     */
    initializePageSpecificComponents(route) {
        console.log(`Initializing components for route: ${route}`);
        if (route === 'quiz') {
            this.initializeQuiz();
        } else if (route === 'executable-formats') {
            console.log("Initializing ELF and PE Visualizers...");
            this.elfVisualizer = new ElfVisualizer('elf-header-visualizer');
            if (this.elfVisualizer.container) {
                this.elfVisualizer.render();
            }
            this.peVisualizer = new PeVisualizer('pe-header-visualizer');
            if (this.peVisualizer.container) {
                this.peVisualizer.render();
            }
        }
        // Add other routes and their component initializations here
    }

    // The CORRECT, new cleanupPageSpecificComponents (added in previous steps)
    cleanupPageSpecificComponents() {
        console.log("Cleaning up page-specific components...");
        if (this.quizController) {
            console.log("Cleaning up QuizController...");
            this.quizController.cleanup();
            this.quizController = null;
        }
        if (this.elfVisualizer) {
            console.log("Cleaning up ElfVisualizer...");
            // Future cleanup logic if needed (e.g., removing event listeners)
             if (this.elfVisualizer.container) this.elfVisualizer.container.innerHTML = ''; // Clear content
            this.elfVisualizer = null;
        }
        if (this.peVisualizer) {
            console.log("Cleaning up PeVisualizer...");
            // Future cleanup logic if needed
            if (this.peVisualizer.container) this.peVisualizer.container.innerHTML = ''; // Clear content
            this.peVisualizer = null;
        }
    }

    initGlobalListeners() {
        const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
        const scrollThreshold = 300; // Show button after scrolling 300px

        if (!scrollToTopBtn) {
            console.warn('Scroll-to-top button not found.');
            return;
        }

        // Show/hide button based on scroll position
        const handleScroll = () => {
            if (window.scrollY > scrollThreshold) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        };

        // Attach scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true }); // Use passive for performance

        // Attach click listener for scrolling action
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Smooth scroll animation
            });
        });

        console.log("Scroll-to-top listener initialized.");

        // TODO: Add cleanup logic if App class instance can be destroyed/recreated
        // Example: Store listener references and remove them in a cleanup() method
        // this.scrollListener = handleScroll;
        // window.removeEventListener('scroll', this.scrollListener);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.initialize();
}); 