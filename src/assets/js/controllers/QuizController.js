import { QuizModel } from '../models/QuizModel.js';
import { QuizComponent } from '../components/QuizComponent.js';

const QUESTIONS_PER_QUIZ = 15; // Nombre de questions par quiz
const TIME_PER_QUESTION = 45; // Secondes par question

/**
 * Manages the state and interactions of the Quiz section.
 */
export class QuizController {
    /**
     * Creates an instance of QuizController.
     * @param {string} quizContainerId - ID of the main quiz container element within the currently loaded page content.
     */
    constructor(quizContainerId) {
        this.quizContainerId = quizContainerId;
        this.containerElement = null;
        this.feedbackElement = null; // Ajouté pour les explications

        this.quizModel = new QuizModel();
        this.quizComponent = new QuizComponent();

        // Quiz State
        this.questions = [];
        this.totalQuestions = QUESTIONS_PER_QUIZ; // Utilisé pour l'initialisation
        this.currentQuestionIndex = 0;
        this.score = 0;
        //this.answeredQuestions = 0; // Remplacé par le suivi direct des questions répondues
        this.timerInterval = null;
        this.secondsRemaining = 0;
        this.quizActive = false;
        this.questionsAnsweredCount = 0; // Nouveau compteur pour la progression

        // References to dynamically found elements
        this.questionPlaceholder = null;
        this.resultContainer = null;
        this.prevButton = null;
        this.nextButton = null;
        this.checkButton = null;
        this.restartButton = null;
        this.timerDisplay = null;
        this.progressBar = null;
        this.countDisplay = null;
        this.totalDisplay = null;

        // Bind methods
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        //this.prevQuestion = this.prevQuestion.bind(this); // Désactivé pour l'instant
        this.restartQuiz = this.restartQuiz.bind(this);
        this.handleContainerClick = this.handleContainerClick.bind(this);
        this.cleanup = this.cleanup.bind(this);
    }

    /**
     * Initializes the quiz.
     */
    initQuiz() {
        this.containerElement = document.getElementById(this.quizContainerId);
        if (!this.containerElement) {
            console.error(`QuizController: Quiz container #${this.quizContainerId} not found.`);
            return;
        }

        console.log('Initializing Quiz...');
        this.questions = this.quizModel.getRandomizedQuestions(QUESTIONS_PER_QUIZ); // *** Utilise la randomisation ***
        this.totalQuestions = this.questions.length; // Met à jour si moins de questions sont disponibles
        if (this.totalQuestions === 0) {
            console.error("Aucune question n'a été chargée pour le quiz.");
            this.questionPlaceholder = this.containerElement.querySelector('.quiz-question-placeholder');
            if(this.questionPlaceholder) this.questionPlaceholder.innerHTML = "<p class='text-red-500'>Erreur : Impossible de charger les questions du quiz.</p>";
            return;
        }

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.questionsAnsweredCount = 0;
        this.quizActive = true;

        // Get references to UI elements
        this.questionPlaceholder = this.containerElement.querySelector('.quiz-question-placeholder');
        this.resultContainer = this.containerElement.querySelector('#quiz-result');
        this.feedbackElement = this.containerElement.querySelector('#quiz-feedback'); // Zone pour l'explication
        //this.prevButton = this.containerElement.querySelector('#prev-question'); // Désactivé
        this.nextButton = this.containerElement.querySelector('#next-question-btn');
        this.checkButton = this.containerElement.querySelector('#check-answer');
        // this.restartButton = this.containerElement.querySelector('#restart-quiz'); // Plus nécessaire de le stocker ici

        // Global elements
        this.timerDisplay = document.getElementById('timer-display');
        this.progressBar = document.getElementById('quiz-progress');
        this.countDisplay = document.getElementById('quiz-count');
        this.totalDisplay = document.getElementById('quiz-total');

        if (!this.questionPlaceholder || !this.resultContainer || !this.nextButton || !this.checkButton) {
            console.error('QuizController: Could not find all required elements within the quiz container.');
            // Try to provide a more graceful fallback if possible
            if (this.questionPlaceholder) this.questionPlaceholder.innerHTML = "<p class='text-red-500'>Erreur : Structure HTML du quiz incomplète.</p>";
            return;
        }

        // Clear previous state
        this.resultContainer.style.display = 'none';
        this.feedbackElement.style.display = 'none'; // Cacher l'explication
        this.feedbackElement.innerHTML = '';
        this.stopTimer();
        this.questions.forEach(q => { delete q.answered; delete q.selectedIndices; delete q.isCorrect; }); // Reset state if re-init

        // Reset visual progress
        this.quizComponent.updateProgress(this.progressBar, this.countDisplay, this.totalDisplay, 0, this.totalQuestions);
        const totalTime = this.totalQuestions * TIME_PER_QUESTION;
        if (this.timerDisplay) this.quizComponent.updateTimerDisplay(this.timerDisplay, totalTime);

        // Render first question
        this.displayQuestion(this.currentQuestionIndex);

        // Setup event listeners
        this.addQuizListeners();

        // Start timer
        this.startTimer(totalTime);
    }

    /**
     * Adds event listeners for quiz interactions.
     */
    addQuizListeners() {
        //if(this.prevButton) this.prevButton.addEventListener('click', this.prevQuestion); // Désactivé
        if (this.nextButton) this.nextButton.addEventListener('click', this.nextQuestion);
        if (this.checkButton) this.checkButton.addEventListener('click', this.checkAnswer);
        // if (this.restartButton) this.restartButton.addEventListener('click', this.restartQuiz); // Supprimé
        if (this.containerElement) {
            // Utiliser un seul écouteur sur le conteneur
            this.containerElement.addEventListener('click', this.handleContainerClick);
        }
    }

    /**
     * Removes event listeners added by this controller.
     */
    removeQuizListeners() {
        //if(this.prevButton) this.prevButton.removeEventListener('click', this.prevQuestion); // Désactivé
        if (this.nextButton) this.nextButton.removeEventListener('click', this.nextQuestion);
        if (this.checkButton) this.checkButton.removeEventListener('click', this.checkAnswer);
        // if (this.restartButton) this.restartButton.removeEventListener('click', this.restartQuiz); // Supprimé
        if (this.containerElement) {
            this.containerElement.removeEventListener('click', this.handleContainerClick);
        }
        console.log('Quiz listeners removed.');
    }

    /**
     * Handles clicks within the quiz container using event delegation.
     * @param {Event} event
     */
    handleContainerClick(event) {
        const optionElement = event.target.closest('.quiz-option');
        const restartButton = event.target.closest('#restart-quiz-btn');

        if (optionElement) {
            this.handleOptionClick(event); // Appeler l'ancienne logique pour les options
        } else if (restartButton) {
            this.restartQuiz(); // Appeler la logique de redémarrage
        }
    }

    /**
     * Handles clicks on quiz options using event delegation.
     */
    handleOptionClick(event) {
        const optionElement = event.target.closest('.quiz-option');
        if (!optionElement || !this.quizActive) return;

        const currentQuestionElement = this.containerElement?.querySelector('.quiz-question');
        // *** Vérifier si la question a déjà été répondue (classe 'answered') ***
        if (!currentQuestionElement || currentQuestionElement.classList.contains('answered')) {
            console.log('Question already answered, selection ignored.');
            return; // Ne pas permettre la sélection si déjà répondu
        }

        const allowMultiple = currentQuestionElement.getAttribute('data-multiple') === 'true';

        if (!allowMultiple) {
            currentQuestionElement.querySelectorAll('.quiz-option').forEach(op => {
                if (op !== optionElement) {
                    op.classList.remove('selected', 'border-purple-500');
                    op.classList.add('border-gray-700');
                    // Ensure aria-checked is false for others
                    op.setAttribute('aria-checked', 'false');
                }
            });
        }

        // Toggle selection state
        optionElement.classList.toggle('selected');
        optionElement.classList.toggle('border-purple-500', optionElement.classList.contains('selected'));
        optionElement.classList.toggle('border-gray-700', !optionElement.classList.contains('selected'));
        // Update aria-checked state
        optionElement.setAttribute('aria-checked', optionElement.classList.contains('selected').toString());
    }

    /**
     * Displays a specific question by index.
     */
    displayQuestion(index) {
        if (index < 0 || index >= this.totalQuestions || !this.questionPlaceholder) {
             // Si l'index dépasse, c'est la fin du quiz
            if (index >= this.totalQuestions) {
                this.endQuiz();
            } else {
                console.warn(`Invalid question index or placeholder missing: ${index}`);
            }
            return;
        }

        const questionData = this.questions[index];
        const questionHtml = this.quizComponent.renderQuestion(questionData, index, this.totalQuestions);
        this.questionPlaceholder.innerHTML = questionHtml;
        this.currentQuestionIndex = index;
        this.feedbackElement.style.display = 'none'; // Cacher le feedback précédent

        // Update button states
        //if(this.prevButton) { /* Désactivé */ }
        if (this.nextButton) {
             // Activer seulement après réponse ? Ou toujours sauf dernière ? Pour l'instant toujours sauf fin.
            this.nextButton.disabled = false; // Sera désactivé à la fin du quiz
            this.nextButton.classList.remove('opacity-50');
            this.nextButton.textContent = (index === this.totalQuestions - 1) ? 'Terminer' : 'Suivant';
        }
        if (this.checkButton) {
            // Activer si la question n'a pas été répondue
            const isAnswered = this.questions[this.currentQuestionIndex]?.answered ?? false;
            this.checkButton.disabled = isAnswered;
            this.checkButton.classList.toggle('opacity-50', isAnswered);
        }

        // Note: No need to restore visual state here, checkAnswer handles showing feedback
    }

    /**
     * Checks the selected answer(s) for the current question.
     */
    checkAnswer() {
        if (!this.quizActive || !this.containerElement) return;

        const currentQuestionElement = this.containerElement.querySelector('.quiz-question');
        if (!currentQuestionElement || currentQuestionElement.classList.contains('answered')) {
            console.log('Attempted to check an already answered question.');
            return; // Already answered
        }

        const selectedOptions = currentQuestionElement.querySelectorAll('.quiz-option.selected');
        if (selectedOptions.length === 0) {
            // Maybe show a less intrusive message?
            this.quizComponent.showTemporaryFeedback(this.feedbackElement, 'Veuillez sélectionner au moins une réponse.', 'error');
            return;
        }

        const questionData = this.questions[this.currentQuestionIndex];
        const correctOptionElements = currentQuestionElement.querySelectorAll('.quiz-option[data-correct="true"]');
        const selectedIndices = Array.from(selectedOptions).map(opt => parseInt(opt.dataset.index));

        let isCorrect = false;
        if (selectedOptions.length === correctOptionElements.length) {
            isCorrect = Array.from(selectedOptions).every(opt => opt.getAttribute('data-correct') === 'true');
        }

        // Mark question as answered and store state IN THE MODEL
        questionData.answered = true;
        questionData.selectedIndices = selectedIndices; // Store user's selections
        questionData.isCorrect = isCorrect;
        this.questionsAnsweredCount++; // Incrémenter le compteur

        // Update score
        if (isCorrect) {
            this.score++;
        }

        // *** Show Feedback UI ***
        this.quizComponent.showFeedback(currentQuestionElement, questionData, selectedIndices, isCorrect, this.feedbackElement);

        // *** Update Progress Bar ***
        this.quizComponent.updateProgress(this.progressBar, this.countDisplay, this.totalDisplay, this.questionsAnsweredCount, this.totalQuestions);

        // Disable check button, enable next button
        if (this.checkButton) {
            this.checkButton.disabled = true;
            this.checkButton.classList.add('opacity-50');
        }
        if (this.nextButton) {
            this.nextButton.disabled = false;
            this.nextButton.classList.remove('opacity-50');
        }

         // Automatically advance to next question after a short delay?
         // Or require user to click next?
         // Let's require clicking 'Next' for now.

        // If it was the last question, update 'Next' button text
        if (this.currentQuestionIndex === this.totalQuestions - 1) {
             if (this.nextButton) this.nextButton.textContent = 'Terminer';
        }
    }

    /**
     * Shows feedback on the options based on correctness.
     * MOVED TO QuizComponent.showFeedback - This controller method is no longer needed.
     */
    // showFeedback(questionElement, selectedIndices, isCorrect) { ... }

    /**
     * Moves to the next question or ends the quiz.
     */
    nextQuestion() {
        if (!this.quizActive) return;

        // Ensure current question is answered before proceeding
        const currentQuestionData = this.questions[this.currentQuestionIndex];
        if (!currentQuestionData || !currentQuestionData.answered) {
            // Optionally provide feedback that answer needs checking first
             this.quizComponent.showTemporaryFeedback(this.feedbackElement, 'Veuillez vérifier votre réponse avant de continuer.', 'warning');
            console.log('Cannot proceed to next question before answering.');
            return;
        }

        if (this.currentQuestionIndex < this.totalQuestions - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion(this.currentQuestionIndex);
        } else {
            // This was the last question
            this.endQuiz();
        }
    }

    /**
     * Moves to the previous question. (Currently disabled)
     */
    // prevQuestion() { ... }

    /**
     * Starts the quiz timer.
     * @param {number} totalSeconds - Total time allowed for the quiz.
     */
    startTimer(totalSeconds) {
        this.stopTimer(); // Ensure no previous timer is running
        this.secondsRemaining = totalSeconds;
        if (!this.timerDisplay || this.secondsRemaining <= 0) return; // No timer if no display or no time

        this.quizComponent.updateTimerDisplay(this.timerDisplay, this.secondsRemaining);

        this.timerInterval = setInterval(() => {
            this.secondsRemaining--;
            this.quizComponent.updateTimerDisplay(this.timerDisplay, this.secondsRemaining);

            if (this.secondsRemaining <= 0) {
                this.endQuiz(true); // End quiz due to time out
            }
        }, 1000);
    }

    /**
     * Stops the quiz timer.
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Ends the quiz, displays the final score.
     * @param {boolean} [timedOut=false] - Indicates if the quiz ended due to time running out.
     */
    endQuiz(timedOut = false) {
        if (!this.quizActive) return; // Prevent multiple calls

        console.log('Quiz ended.');
        this.quizActive = false;
        this.stopTimer();

        // Hide question area, show results container
        if (this.questionPlaceholder) this.questionPlaceholder.innerHTML = ''; // Clear last question
        if (this.feedbackElement) this.feedbackElement.style.display = 'none'; // Hide last feedback
        if (this.resultContainer) {
            this.resultContainer.style.display = 'block';
            // Render final score using QuizComponent
            this.quizComponent.renderFinalScore(this.resultContainer, this.score, this.totalQuestions, timedOut);
        }

        // Disable/hide navigation buttons except restart
        //if(this.prevButton) this.prevButton.style.display = 'none';
        if(this.nextButton) this.nextButton.disabled = true; this.nextButton.classList.add('opacity-50');
        if(this.checkButton) this.checkButton.disabled = true; this.checkButton.classList.add('opacity-50');
        if(this.restartButton) this.restartButton.style.display = 'inline-block'; // Ensure restart is visible

    }

    /**
     * Restarts the quiz from the beginning.
     */
    restartQuiz() {
        console.log('Restarting Quiz...');
        this.stopTimer(); // Stop any existing timer
        this.quizActive = false; // Mark as inactive during re-init
        // No need to remove listeners if we re-initialize immediately,
        // initQuiz will handle resetting state and rendering.
        this.initQuiz();
    }

    /**
     * Cleans up resources like timers and event listeners.
     * Crucial for SPAs to prevent memory leaks when the quiz page is unloaded.
     */
     cleanup() {
        console.log('Cleaning up QuizController...');
        this.stopTimer();
        this.removeQuizListeners();
        // Nullify DOM element references to help GC
        this.containerElement = null;
        this.questionPlaceholder = null;
        this.resultContainer = null;
        this.feedbackElement = null;
        this.prevButton = null;
        this.nextButton = null;
        this.checkButton = null;
        this.restartButton = null;
        this.timerDisplay = null;
        this.progressBar = null;
        this.countDisplay = null;
        this.totalDisplay = null;
        // Reset state just in case
        this.questions = [];
        this.quizActive = false;
     }
} 