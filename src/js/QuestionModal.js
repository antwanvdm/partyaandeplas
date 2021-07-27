import settings from "./application.config";

/**
 * Class to handle the Question modal and it's data (form, API call)
 *
 * @param answerCallback
 * @constructor
 */
const QuestionModal = function (answerCallback) {
    this.modal = document.querySelector("#question-modal");
    this.form = document.querySelector("#question-form");

    this.init = () => {
        this.form.addEventListener('submit', (e) => this.formSubmitHandler(e));
    }

    /**
     * Open the modal with the question & answers
     *
     * @param {Object} question
     * @param {boolean} answered
     * @param {number} playerId
     */
    this.open = (question, answered, playerId) => {
        this.modal.classList.remove("hide");
        this.modal.classList.remove('pointer-events-none');
        document.querySelector('body').classList.add('modal-active');

        if (answered) {
            this.alreadyAnswered();
            return;
        }

        this.modal.querySelector('.modal-title').innerHTML = question.title;
        this.modal.querySelector('.question-answers').innerHTML = `
            <div id="answers">
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <input type="radio" id="answer-1" name="answer" value="1" required/>
                        <label for="answer-1">${question.answer1}</label>
                    </div>
                    <div>
                        <input type="radio" id="answer-2" name="answer" value="2"/>
                        <label for="answer-2">${question.answer2}</label>
                    </div>
                    <div>
                        <input type="radio" id="answer-3" name="answer" value="3"/>
                        <label for="answer-3">${question.answer3}</label>
                    </div>
                    <div>
                        <input type="radio" id="answer-4" name="answer" value="4"/>
                        <label for="answer-4">${question.answer4}</label>
                    </div>
                </div>
                <input type="hidden" name="player-id" value="${playerId}"/>
                <input type="hidden" name="question-id" value="${question.id}"/>
                <input class="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md mt-3 py-2 pl-3 bg-green-500"
                   type="submit" value="Kies je antwoord!"/>
            </div>
        `;
    }

    /**
     * Show alternative information when someone tries to access an already answered question
     */
    this.alreadyAnswered = () => {
        this.modal.querySelector('.modal-title').innerHTML = "Koekoek!";
        this.modal.querySelector('.question-answers').innerHTML = `
            <p class="bg-gray-200 text-red-500 p-3">Leuk geprobeerd, maar deze vraag heb je al beantwoord :)</p>
            <a id="question-close" class="block w-full text-sm text-black border border-gray-200 rounded-md mt-3 py-2 pl-3 bg-green-500 text-center">Terug naar de kaart</a>
        `;

        this.modal.querySelector('#question-close').addEventListener('click', (e) => this.closeHandler(e));
    }

    /**
     * Perform API call to store given answer
     *
     * @param e
     */
    this.formSubmitHandler = (e) => {
        e.preventDefault();

        fetch(`${settings.apiURL}?r=answer-question`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playerId: document.querySelector("input[name='player-id']").value,
                questionId: document.querySelector("input[name='question-id']").value,
                answer: document.querySelector("input[name='answer']:checked").value
            })
        }).then((response) => {
            return response.json();
        }).then((data) => this.answerSavedHandler(data));
    }

    /**
     * Present the result of the given answer and ability to close the modal
     *
     * @param data
     */
    this.answerSavedHandler = (data) => {
        if (typeof data.error !== 'undefined') {
            return;
        }

        this.modal.querySelector('.question-answers').innerHTML = `
            ${data.correct
            ? `<p class="bg-gray-200 text-green-500 p-3">Je hebt het juiste antwoord gegeven!</p>`
            : `<p class="bg-gray-200 text-red-500 p-3">Helaas is je antwoord niet correct, het juiste antwoord was "${data.answer}"</p>`}
            <p class="mt-2">${data.fact}</p>
            <a id="question-close" class="block w-full text-sm text-black border border-gray-200 rounded-md mt-3 py-2 pl-3 bg-green-500 text-center">Terug naar de kaart</a>
        `;

        this.modal.querySelector('#question-close').addEventListener('click', (e) => this.closeHandler(e));
        answerCallback(data.questionId);
    }

    /**
     * @param e
     */
    this.closeHandler = (e) => {
        e.preventDefault();
        this.modal.classList.add("hide");
        this.modal.classList.add('pointer-events-none');
        document.querySelector('body').classList.remove('modal-active');
    }

    this.init();
}

export default QuestionModal;
