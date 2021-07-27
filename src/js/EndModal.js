/**
 * Class for the end screen
 *
 * @constructor
 */
const EndModal = function () {
    this.modal = document.querySelector("#end-modal");

    this.init = () => {
        this.open();
    }

    /**
     * Open the modal and present users with the final screen
     */
    this.open = () => {
        this.modal.classList.remove("hide");
        this.modal.classList.remove('pointer-events-none');
        document.querySelector('body').classList.add('modal-active');
    }

    this.init();
}

export default EndModal;
