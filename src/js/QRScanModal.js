import QRScan from "./QRScan";

/**
 * Class to handle the QR Scan Modal & interaction with the actual QRScan object
 *
 * @param scanSuccessCallback
 * @constructor
 */
const QRScanModal = function (scanSuccessCallback) {
    this.openButton = document.querySelector("#scan");
    this.closeButton = document.querySelector("#scan-close");
    this.modal = document.querySelector("#scan-modal");
    this.qrScan = null;

    this.init = () => {
        this.openButton.addEventListener('click', (e) => this.openClickHandler(e));
        this.closeButton.addEventListener('click', (e) => this.closeClickHandler(e));
    }

    /**
     * @param e
     */
    this.openClickHandler = (e) => {
        e.preventDefault();
        this.modal.classList.remove("hide");
        this.modal.classList.remove('pointer-events-none');
        document.querySelector('body').classList.add('modal-active');
        this.qrScan = new QRScan(scanSuccessCallback);
    }

    /**
     * @param e
     */
    this.closeClickHandler = (e) => {
        e.preventDefault();
        this.close();
    }

    /**
     * Close the modal & quit the QRScan webcam
     */
    this.close = () => {
        this.modal.classList.add("hide");
        this.modal.classList.add('pointer-events-none');
        document.querySelector('body').classList.remove('modal-active');
        this.qrScan.close();
    }

    this.init();
}

export default QRScanModal;
