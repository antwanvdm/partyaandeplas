import settings from "./application.config";
import MapBoxInteraction from "./MapBoxInteraction";

const Application = function () {
    this.mapBoxInteraction = null;
    this.loaderOverlay = null;
    this.playerId = null;

    this.init = () => {
        document.querySelector("body").classList.add('loaded');
        this.loaderOverlay = document.querySelector(".loader-overlay");
        if (document.location.pathname !== "/") {
            return;
        }

        document.querySelector("#name-form").addEventListener('submit', this.formSubmitHandler);
    }

    this.formSubmitHandler = (e) => {
        e.preventDefault();

        document.querySelector("#name").classList.remove("error");

        fetch(settings.apiURL, {
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
                this.loaderOverlay.classList.remove("hide");
                this.mapBoxInteraction = new MapBoxInteraction(this.getCurrentLocation);
                this.playerId = data.id;
            }
        });
    }

    this.getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            this.mapBoxInteraction.addCurrentLocation(position.coords.latitude, position.coords.longitude);
            this.loaderOverlay.classList.add("hide");
            document.querySelector("#intro").remove();
        }, () => {
            alert("Sorry, zonder je locatie kun je deze app niet gebruiken!");
        });
    }

    this.init();
}

export default Application;
