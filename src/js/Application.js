import settings from "./application.config";
import MapBoxInteraction from "./MapBoxInteraction";
import QRScan from "./QRScan";

const Application = function () {
    this.mapBoxInteraction = null;
    this.applicationWrapper = document.querySelector("#application-wrapper");
    this.loaderOverlay = document.querySelector(".loader-overlay");
    this.scanButton = document.querySelector("#scan");
    this.scanClose = document.querySelector("#scan-close");
    this.scanModal = document.querySelector("#scan-modal");
    this.playerId = null;
    this.qrScan = null;

    this.init = () => {
        document.querySelector("body").classList.add('loaded');
        if (document.location.pathname !== "/") {
            return;
        }

        document.querySelector("#name-form").addEventListener('submit', (e) => this.formSubmitHandler(e));
        this.scanButton.addEventListener('click', (e) => this.scanOpenClickHandler(e));
        this.scanClose.addEventListener('click', (e) => this.scanCloseClickHandler(e));
    }

    this.formSubmitHandler = (e) => {
        e.preventDefault();

        document.querySelector("#name").classList.remove("error");

        fetch(`${settings.apiURL}newplayer`, {
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
                this.applicationWrapper.classList.remove("hide");
                this.mapBoxInteraction = new MapBoxInteraction(this.getCurrentLocation);
                this.playerId = data.id;
            }
        });
    }

    this.getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            this.mapBoxInteraction.addCurrentLocation(position.coords.latitude, position.coords.longitude);
            this.getQuestions();
            this.loaderOverlay.classList.add("hide");
            document.querySelector("#intro").remove();
        }, () => {
            alert("Sorry, zonder je locatie kun je deze app niet gebruiken!");
        });
    }

    this.getQuestions = () => {
        fetch(`${settings.apiURL}questions`, {
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
        this.qrScan = new QRScan();
    }

    this.scanCloseClickHandler = (e) => {
        console.log("close");
        e.preventDefault();
        this.scanModal.classList.add("hide");
        this.scanModal.classList.add('pointer-events-none');
        document.querySelector('body').classList.remove('modal-active');
        this.qrScan.close();
    }

    this.init();
}

export default Application;
