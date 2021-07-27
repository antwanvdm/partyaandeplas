import settings from "./application.config";
import MapBoxInteraction from "./MapBoxInteraction";
import QRScan from "./QRScan";
import Timer from "./Timer";

const Application = function () {
    this.mapBoxInteraction = null;
    this.nameForm = document.querySelector("#name-form");
    this.applicationWrapper = document.querySelector("#application-wrapper");
    this.loaderOverlay = document.querySelector(".loader-overlay");
    this.scanButton = document.querySelector("#scan");
    this.scanClose = document.querySelector("#scan-close");
    this.scanModal = document.querySelector("#scan-modal");
    this.questionModal = document.querySelector("#question-modal");
    this.questionForm = document.querySelector("#question-form");
    this.endModal = document.querySelector("#end-modal");
    this.playerId = null;
    this.qrScan = null;

    this.init = () => {
        document.querySelector("body").classList.add('loaded');
        if (document.location.pathname !== "/") {
            return;
        }

        this.nameForm.addEventListener('submit', (e) => this.playerFormSubmitHandler(e));
        this.scanButton.addEventListener('click', (e) => this.scanOpenClickHandler(e));
        this.scanClose.addEventListener('click', (e) => this.scanCloseClickHandler(e));
        this.questionForm.addEventListener('submit', (e) => this.questionFormSubmitHandler(e));

        let playerIdLocalStorage = localStorage.getItem('playerId');
        if (playerIdLocalStorage !== null) {
            this.loadApplicationWrapper(playerIdLocalStorage);
        }
    }

    this.playerFormSubmitHandler = (e) => {
        e.preventDefault();

        document.querySelector("#name").classList.remove("error");

        fetch(`${settings.apiURL}?r=newplayer`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: document.querySelector("#name").value
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (typeof data.error !== 'undefined') {
                if (typeof data.errorDetail !== "undefined") {
                    for (const [key, value] of Object.entries(data.errorDetail)) {
                        document.querySelector("#" + key).classList.add("error");
                    }
                }
            } else {
                this.loadApplicationWrapper(data.id);
                localStorage.setItem('playerId', this.playerId);
            }
        });
    }

    this.loadApplicationWrapper = (playerId) => {
        window.scroll(0, 0);
        this.applicationWrapper.classList.remove("hide");
        this.mapBoxInteraction = new MapBoxInteraction(this.getCurrentLocation);
        this.playerId = playerId;
    }

    this.getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            this.mapBoxInteraction.addCurrentLocation(position.coords.latitude, position.coords.longitude);
            this.getQuestions();
            new Timer(() => this.done());
            this.loaderOverlay.classList.add("hide");
            document.querySelector("#intro").remove();
            navigator.geolocation.watchPosition((position) => this.mapBoxInteraction.updateCurrentLocation(position.coords.latitude, position.coords.longitude));
        }, () => {
            alert("Sorry, zonder je locatie kun je deze app niet gebruiken!");
        });
    }

    this.getQuestions = () => {
        fetch(`${settings.apiURL}?r=questions`, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (typeof data.questions !== 'undefined') {
                this.mapBoxInteraction.addQuestionsLocations(data.questions);
            }
        });
    }

    this.scanOpenClickHandler = (e) => {
        e.preventDefault();
        this.scanModal.classList.remove("hide");
        this.scanModal.classList.remove('pointer-events-none');
        document.querySelector('body').classList.add('modal-active');
        this.qrScan = new QRScan((id) => this.openQuestion(id));
    }

    this.scanCloseClickHandler = (e) => {
        e.preventDefault();
        this.scanModal.classList.add("hide");
        this.scanModal.classList.add('pointer-events-none');
        document.querySelector('body').classList.remove('modal-active');
        this.qrScan.close();
    }

    this.openQuestion = (id) => {
        let question = this.mapBoxInteraction.questionMarkers[id].question;
        this.scanClose.click();

        this.questionModal.classList.remove("hide");
        this.questionModal.classList.remove('pointer-events-none');
        document.querySelector('body').classList.add('modal-active');

        if (typeof this.mapBoxInteraction.questionMarkers[id].answered !== "undefined") {
            this.questionModal.querySelector('.modal-title').innerHTML = "Koekoek!";
            this.questionModal.querySelector('.question-answers').innerHTML = `
                <p class="bg-gray-200 text-red-500 p-3">Leuk geprobeerd, maar deze vraag heb je al beantwoord :)</p>
                <a id="question-close" class="block w-full text-sm text-black border border-gray-200 rounded-md mt-3 py-2 pl-3 bg-green-500 text-center">Terug naar de kaart</a>
            `;

            this.mapBoxInteraction.questionMarkers[id].answered = true;
            this.questionModal.querySelector('#question-close').addEventListener('click', (e) => this.questionCloseHandler(e));
            return;
        }

        this.questionModal.querySelector('.modal-title').innerHTML = question.title;
        this.questionModal.querySelector('.question-answers').innerHTML = `
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
                <input type="hidden" name="question-id" value="${question.id}"/>
                <input class="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md mt-3 py-2 pl-3 bg-green-500"
                   type="submit" value="Kies je antwoord!"/>
            </div>
        `;
    }

    this.questionFormSubmitHandler = (e) => {
        e.preventDefault();

        let questionId = document.querySelector("input[name='question-id']").value;
        fetch(`${settings.apiURL}?r=answer-question`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playerId: this.playerId,
                questionId: questionId,
                answer: document.querySelector("input[name='answer']:checked").value
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (typeof data.error === 'undefined') {
                this.questionModal.querySelector('.question-answers').innerHTML = `
                    ${data.correct
                    ? `<p class="bg-gray-200 text-green-500 p-3">Je hebt het juiste antwoord gegeven!</p>`
                    : `<p class="bg-gray-200 text-red-500 p-3">Helaas is je antwoord niet correct, het juiste antwoord was "${data.answer}"</p>`}
                    <p class="mt-2">${data.fact}</p>
                    <a id="question-close" class="block w-full text-sm text-black border border-gray-200 rounded-md mt-3 py-2 pl-3 bg-green-500 text-center">Terug naar de kaart</a>
                `;

                this.mapBoxInteraction.markLocationAsDone(questionId);
                this.questionModal.querySelector('#question-close').addEventListener('click', (e) => this.questionCloseHandler(e));
                this.saveAnsweredQuestionsToLocalStorage(questionId);
            }
        });
    }

    this.questionCloseHandler = (e) => {
        e.preventDefault();
        this.questionModal.classList.add("hide");
        this.questionModal.classList.add('pointer-events-none');
        document.querySelector('body').classList.remove('modal-active');
    }

    this.saveAnsweredQuestionsToLocalStorage = (questionId) => {
        let answeredLocalStorage = localStorage.getItem('answered');
        let currentAnswered = answeredLocalStorage === null ? [] : JSON.parse(answeredLocalStorage);

        if (currentAnswered.indexOf(questionId) === -1) {
            currentAnswered.push(parseInt(questionId));
            localStorage.setItem('answered', JSON.stringify(currentAnswered));
        }
    }

    this.done = () => {
        this.endModal.classList.remove("hide");
        this.endModal.classList.remove('pointer-events-none');
        document.querySelector('body').classList.add('modal-active');
    }

    this.init();
}

export default Application;
