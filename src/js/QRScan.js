import jsQR from "jsqr";

/**
 * Class to interact with external QR code library and stream camera to canvas for user while scanning a QR code
 *
 * @param callback
 * @constructor
 */
const QRScan = function (callback) {
    this.video = document.createElement("video");
    this.canvasElement = document.getElementById("scan-canvas");
    this.canvas = this.canvasElement.getContext("2d");
    this.animationFrameId = 0;
    this.videoStream = null;
    this.callback = callback;

    this.init = () => {
        //Use facingMode: environment to attempt to get the front camera on phones
        navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}})
            .then((stream) => {
                this.videoStream = stream.getTracks()[0];
                this.video.srcObject = stream;
                this.video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                this.video.play();
                this.animationFrameId = requestAnimationFrame(this.tick);
            });
    }

    /**
     * Update the video with realtime webcam data
     */
    this.tick = () => {
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.canvas.drawImage(this.video, 0, 0, this.canvasElement.width, this.canvasElement.height);
            let imageData = this.canvas.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
            let code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            //If data is found, we can move on with the data from the QR code
            if (code) {
                let parsedData = JSON.parse(code.data);

                if (typeof parsedData.id !== "undefined") {
                    this.callback(parsedData.id);
                    this.close();
                    return;
                }
            }
        }
        this.animationFrameId = requestAnimationFrame(this.tick);
    }

    /**
     * Close all & cancel camera & canvas for performance
     */
    this.close = () => {
        cancelAnimationFrame(this.animationFrameId);
        this.videoStream.stop();
        this.video = null;
        this.canvas.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.animationFrameId = 0;
    }

    this.init();
}

export default QRScan;
