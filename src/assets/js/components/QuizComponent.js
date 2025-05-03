/**
 * Handles rendering of the quiz UI components.
 */
export class QuizComponent {
    /**
     * Renders a single quiz question.
     * @param {import('../models/QuizModel.js').QuizQuestion} questionData - The data for the question to render.
     * @param {number} questionIndex - The index of the current question (0-based).
     * @param {number} totalQuestions - The total number of questions.
     * @returns {string} HTML string representing the question.
     */
    renderQuestion(questionData, questionIndex, totalQuestions) {
        if (!questionData) {
            return '<p class="text-red-500">Error: Question data is missing.</p>';
        }

        const questionId = `q-${questionData.id}`;
        const questionTextId = `${questionId}-text`;
        const optionsGroupId = `${questionId}-options`;
        const explanationId = `${questionId}-explanation`;

        const optionsHtml = questionData.options.map((option, index) => {
            // Basic escaping for display - replace < and > to prevent HTML injection
            const safeOptionText = option.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const optionId = `${questionId}-opt-${index}`;
            const role = questionData.multipleCorrect ? 'checkbox' : 'radio';
            const prefix = String.fromCharCode(65 + index) + '. '; // Ajout du préfixe A., B., etc.

            return `
            <div id="${optionId}"
                 class="quiz-option border border-gray-700 p-3 rounded-md cursor-pointer transition-colors duration-150 ease-in-out hover:border-purple-500 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400 focus-within:ring-opacity-50 flex items-center space-x-3"
                 data-index="${index}"
                 data-correct="${option.correct}"
                 role="${role}"
                 aria-checked="false"
                 tabindex="0"> <!-- Make it focusable -->
                
                <span class="option-marker flex-shrink-0 w-5 h-5 border-2 rounded-full flex items-center justify-center ${questionData.multipleCorrect ? 'rounded' : 'rounded-full'} border-gray-500"></span>
                <label for="${optionId}" class="flex-grow cursor-pointer"> <!-- Label for better semantics -->
                    <span class="font-semibold mr-1">${prefix}</span>${safeOptionText} <!-- Ajout du préfixe à l'affichage -->
                </label>
            </div>
        `;
        }).join('');

        return `
            <div class="quiz-question mb-6" 
                 data-id="${questionData.id}" 
                 data-multiple="${questionData.multipleCorrect}" 
                 role="group" 
                 aria-labelledby="${questionTextId}">
                <h3 id="${questionTextId}" class="text-xl font-semibold mb-1">
                    <span class="text-purple-400">${questionData.category || 'General'}</span> - Question ${questionIndex + 1}/${totalQuestions}
                </h3>
                <p class="mb-4 text-lg">${questionData.questionText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                <div id="${optionsGroupId}" class="quiz-options space-y-2" role="${questionData.multipleCorrect ? 'group' : 'radiogroup'}" aria-labelledby="${questionTextId}">
                    ${optionsHtml}
                </div>
                <!-- Feedback area is now separate, defined in quiz.html -->
            </div>
        `;
    }

    /**
     * Shows feedback on the options and reveals the explanation.
     * @param {HTMLElement} questionElement - The DOM element containing the current question options.
     * @param {import('../models/QuizModel.js').QuizQuestion} questionData - The data for the current question.
     * @param {number[]} selectedIndices - Array of indices selected by the user.
     * @param {boolean} isCorrect - Whether the overall answer for the question was correct.
     * @param {HTMLElement} feedbackContainer - The DOM element where the explanation should be displayed.
     */
    showFeedback(questionElement, questionData, selectedIndices, isCorrect, feedbackContainer) {
        if (!questionElement || !feedbackContainer) return;

        const options = questionElement.querySelectorAll('.quiz-option');
        questionElement.classList.add('answered'); // Mark parent as answered

        options.forEach((option, index) => {
            const isSelected = selectedIndices.includes(index);
            const shouldBeCorrect = option.getAttribute('data-correct') === 'true';
            const marker = option.querySelector('.option-marker');

            // Disable interaction
            option.style.pointerEvents = 'none';
            option.setAttribute('tabindex', '-1'); // Remove from tab order

            // Reset visual cues
            option.classList.remove('selected', 'border-purple-500', 'hover:border-purple-500');
            option.classList.add('border-gray-700'); // Back to default border
            if (marker) marker.className = 'option-marker flex-shrink-0 w-5 h-5 border-2 rounded-full flex items-center justify-center text-white'; // Reset marker
            if(questionData.multipleCorrect && marker) marker.classList.add('rounded');
            else if (marker) marker.classList.add('rounded-full');

            // Apply feedback styles
            if (shouldBeCorrect) {
                option.classList.add('option-correct', 'border-green-500');
                 if(marker) marker.classList.add('border-green-500', 'bg-green-600');
                 if(marker) marker.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>'; // Check icon
                if (!isSelected) {
                    // Visually indicate correct answers the user missed (e.g., slightly different background or border style)
                    // option.classList.add('option-missed', 'opacity-75'); 
                }
            } else if (isSelected) {
                // Incorrectly selected answers
                option.classList.add('option-incorrect', 'border-red-500');
                 if(marker) marker.classList.add('border-red-500', 'bg-red-600');
                 if(marker) marker.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>'; // X icon
            } else {
                 // Options that were neither selected nor correct - reset border explicitly
                option.classList.remove('border-green-500', 'border-red-500');
                option.classList.add('border-gray-700');
                if(marker) marker.className = 'option-marker flex-shrink-0 w-5 h-5 border-2 rounded-full border-gray-500';
                if(questionData.multipleCorrect && marker) marker.classList.add('rounded');
                else if (marker) marker.classList.add('rounded-full');
            }
        });

        // Show explanation
        const feedbackText = isCorrect
            ? '<p class="font-bold text-green-400 mb-2">Correct !</p>'
            : '<p class="font-bold text-red-400 mb-2">Incorrect.</p>';

        feedbackContainer.innerHTML = feedbackText + `<p class="text-sm">${questionData.explanation}</p>`;
        feedbackContainer.style.display = 'block';
    }

    /**
     * Displays the final quiz score and message.
     * @param {HTMLElement | null} resultContainer - The container element for the results.
     * @param {number} score - The final score.
     * @param {number} totalQuestions - The total number of questions in the quiz.
     * @param {boolean} timedOut - Whether the quiz ended due to time running out.
     */
    renderFinalScore(resultContainer, score, totalQuestions, timedOut) {
        if (!resultContainer) return;

        const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
        let message = '';
        let messageColor = 'text-gray-300';

        if (timedOut) {
            message = 'Temps écoulé ! Votre score est calculé sur les réponses données.';
            messageColor = 'text-yellow-400';
        } else {
            if (percentage >= 90) {
                message = 'Excellent travail ! Vous maîtrisez le sujet.';
                messageColor = 'text-green-400';
            } else if (percentage >= 70) {
                message = 'Bon score ! Continuez comme ça.';
                messageColor = 'text-blue-400';
            } else if (percentage >= 50) {
                message = 'Pas mal, mais vous pouvez vous améliorer.';
                messageColor = 'text-orange-400';
            } else {
                message = 'Continuez à étudier et réessayez !';
                messageColor = 'text-red-400';
            }
        }

        resultContainer.innerHTML = `
            <h3 class="text-2xl font-bold mb-4 text-center">Quiz Terminé</h3>
            <p class="text-center text-lg mb-2">Votre score : 
                <span id="score" class="font-bold text-purple-400">${score}</span> / 
                <span class="quiz-total-final font-bold text-purple-400">${totalQuestions}</span> 
                (<span id="percentage" class="font-bold text-purple-400">${percentage}</span>%)
            </p>
            <p class="text-center ${messageColor} mt-4">${message}</p>
            <button id="restart-quiz-btn" class="btn btn-secondary">
                <i class="fas fa-redo mr-2"></i>Recommencer le Quiz
            </button>
        `;
        // Ensure the container is visible (might have been hidden)
        resultContainer.style.display = 'block';
        // Restart button is handled by the controller logic
    }

    /**
     * Shows a temporary feedback message.
     * @param {HTMLElement} feedbackContainer - The element where the message should appear.
     * @param {string} message - The message text.
     * @param {'info' | 'warning' | 'error'} type - The type of message for styling.
     * @param {number} duration - How long the message should stay visible (in ms).
     */
    showTemporaryFeedback(feedbackContainer, message, type = 'info', duration = 3000) {
        if (!feedbackContainer) return;

        let bgColor = 'bg-blue-600';
        if (type === 'warning') bgColor = 'bg-yellow-600';
        if (type === 'error') bgColor = 'bg-red-600';

        const messageId = `temp-feedback-${Date.now()}`;
        const messageDiv = document.createElement('div');
        messageDiv.id = messageId;
        messageDiv.className = `temporary-feedback p-2 rounded text-white text-sm ${bgColor} mb-2 transition-opacity duration-300 ease-in-out`;
        messageDiv.textContent = message;
        messageDiv.style.opacity = '1';

        // Prepend the message
        feedbackContainer.insertBefore(messageDiv, feedbackContainer.firstChild);
        feedbackContainer.style.display = 'block';

        // Remove the message after duration
        setTimeout(() => {
            const msgToRemove = document.getElementById(messageId);
            if (msgToRemove) {
                msgToRemove.style.opacity = '0';
                setTimeout(() => msgToRemove.remove(), 300); // Remove after fade out
                 // Hide container if no other persistent feedback is shown
                 // if (!feedbackContainer.querySelector(':not(.temporary-feedback)')) {
                 //     feedbackContainer.style.display = 'none';
                 // }
            }
        }, duration);
    }

    /**
     * Updates the timer display.
     * @param {HTMLElement | null} timerElement - The element displaying the timer.
     * @param {number} secondsRemaining - The number of seconds left.
     */
    updateTimerDisplay(timerElement, secondsRemaining) {
        if (!timerElement) return;
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    /**
     * Updates the quiz progress bar and count.
     * @param {HTMLElement | null} progressBar - The progress bar element.
     * @param {HTMLElement | null} countElement - The element showing the count (e.g., "5").
     * @param {HTMLElement | null} totalElement - The element showing the total (e.g., "10").
     * @param {number} answeredCount - Number of questions answered.
     * @param {number} totalQuestions - Total number of questions.
     */
    updateProgress(progressBar, countElement, totalElement, answeredCount, totalQuestions) {
        if (progressBar) {
            const percentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
            progressBar.style.width = `${percentage}%`;
        }
        if (countElement) {
            countElement.textContent = answeredCount.toString();
        }
        if (totalElement) {
             totalElement.textContent = totalQuestions.toString();
        }
    }
} 