import settings from "./application.config";

/**
 * Class to handle the player form & data
 *
 * @param formSuccessCallback
 * @constructor
 */
const Player = function (formSuccessCallback) {
    this.nameForm = document.querySelector("#name-form");
    this.nameField = document.querySelector("#name");
    this.id = 0;

    this.init = () => {
        this.nameForm.addEventListener('submit', (e) => this.formSubmitHandler(e));
    }

    /**
     * Once the player name is entered, we can handle the request via the API
     *
     * @param e
     */
    this.formSubmitHandler = (e) => {
        e.preventDefault();
        this.nameField.classList.remove("error");

        fetch(`${settings.apiURL}?r=newplayer`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.nameField.value
            })
        }).then((response) => {
            return response.json();
        }).then((data) => this.savedHandler(data));
    }

    /**
     * If no error is returned from the server we can give a heads up to our main application
     *
     * @param data
     */
    this.savedHandler = (data) => {
        if (typeof data.error === 'undefined') {
            formSuccessCallback();
            this.id = data.id;
            localStorage.setItem('playerId', this.id);
        } else {
            this.nameField.classList.add("error");
        }
    }

    this.init();
}

export default Player;
