import Player from "./Player";
import QRScanModal from "./QRScanModal";
import QuestionModal from "./QuestionModal";
import MapWrapper from "./MapWrapper";

/**
 * CLass to initiate everything and interact with main objects
 *
 * @constructor
 */
const Application = function () {
    this.mapWrapper = null;
    this.player = null;
    this.qrScanModal = null;
    this.questionModal = null;

    this.init = () => {
        document.querySelector("body").classList.add('loaded');

        this.mapWrapper = new MapWrapper();
        this.player = new Player(() => this.mapWrapper.load());
        this.qrScanModal = new QRScanModal((id) => this.qrScanModalSuccess(id));
        this.questionModal = new QuestionModal((id) => this.questionModalSuccess(id));

        let playerIdLocalStorage = localStorage.getItem('playerId');
        if (playerIdLocalStorage !== null) {
            this.mapWrapper.load();
            this.player.id = playerIdLocalStorage;
        }
    }

    /**
     * @param questionId
     */
    this.qrScanModalSuccess = (questionId) => {
        this.qrScanModal.close();
        let questionData = this.mapWrapper.mapBoxInteraction.questionMarkers[questionId];
        let answered = typeof questionData.answered !== "undefined";
        this.questionModal.open(questionData.question, answered, this.player.id);
    }

    /**
     * @param questionId
     */
    this.questionModalSuccess = (questionId) => {
        this.mapWrapper.mapBoxInteraction.markLocationAsDone(questionId);
        this.saveAnsweredQuestionToLocalStorage(questionId);
    }

    /**
     * @param questionId
     */
    this.saveAnsweredQuestionToLocalStorage = (questionId) => {
        let answeredLocalStorage = localStorage.getItem('answered');
        let currentAnswered = answeredLocalStorage === null ? [] : JSON.parse(answeredLocalStorage);

        if (currentAnswered.indexOf(questionId) === -1) {
            currentAnswered.push(parseInt(questionId));
            localStorage.setItem('answered', JSON.stringify(currentAnswered));
        }
    }

    this.init();
}

export default Application;
