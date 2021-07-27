import jsQR from "jsqr";

const QRScan = function (callback) {
    this.video = document.createElement("video");
    this.canvasElement = document.getElementById("scan-canvas");
    this.canvas = this.canvasElement.getContext("2d");
    this.animationFrameId = 0;
    this.videoStream = null;
    this.callback = callback;

    this.init = (callback) => {
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

    this.tick = () => {
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.canvas.drawImage(this.video, 0, 0, this.canvasElement.width, this.canvasElement.height);
            let imageData = this.canvas.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
            let code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
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

    this.close = () => {
        //Reset shizzles
        cancelAnimationFrame(this.animationFrameId);
        this.videoStream.stop();
        this.video = null;
        this.canvas.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.animationFrameId = 0;
    }

    this.init();
}

export default QRScan;
