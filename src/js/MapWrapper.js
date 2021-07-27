import MapBoxInteraction from "./MapBoxInteraction";
import Timer from "./Timer";
import settings from "./application.config";
import EndModal from "./EndModal";

/**
 * Class to interact with the elements on top of the map (overlay) and communicatie with the mapBoxInteraction
 *
 * @constructor
 */
const MapWrapper = function () {
    this.mapBoxInteraction = null;
    this.applicationWrapper = document.querySelector("#application-wrapper");
    this.loaderOverlay = document.querySelector(".loader-overlay");

    this.init = () => {

    }

    /**
     * Initialize the wrapper to be shown
     */
    this.load = () => {
        window.scroll(0, 0);
        this.applicationWrapper.classList.remove("hide");
        this.mapBoxInteraction = new MapBoxInteraction(this.getCurrentLocation);
    }

    /**
     * Ask the location from a user once the mapbox is loaded
     */
    this.getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => this.activate(position), () => {
            alert("Sorry, zonder je locatie kun je deze app niet gebruiken!");
        });
    }

    /**
     * Activate everything once a user agreed to sharing location
     *
     * @param position
     */
    this.activate = (position) => {
        this.mapBoxInteraction.addCurrentLocation(position.coords.latitude, position.coords.longitude);
        this.getQuestions();
        new Timer(() => new EndModal());
        this.loaderOverlay.classList.add("hide");
        document.querySelector("#intro").remove();
        navigator.geolocation.watchPosition((position) => this.mapBoxInteraction.updateCurrentLocation(position.coords.latitude, position.coords.longitude));
    }

    /**
     * Get the questions data from the API
     */
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
        }).then((data) => this.questionsLoadedCallback(data));
    }

    /**
     * Add the question to mapbox as markers
     *
     * @param data
     */
    this.questionsLoadedCallback = (data) => {
        if (typeof data.questions !== 'undefined') {
            this.mapBoxInteraction.addQuestionsLocations(data.questions);
        }
    }

    this.init();
}

export default MapWrapper;
