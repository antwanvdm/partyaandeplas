import jsQR from "jsqr";

const QRScan = function () {
    this.video = document.createElement("video");
    this.canvasElement = document.getElementById("scan-canvas");
    this.canvas = this.canvasElement.getContext("2d");
    this.animationFrameId = 0;
    this.videoStream = null;

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

    this.tick = () => {
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            // console.log(this.canvasElement.width);
            // console.log(this.video.videoWidth);
            // console.log(this.video.videoHeight);
            // this.canvasElement.width = this.video.videoWidth;
            this.canvas.drawImage(this.video, 0, 0, this.canvasElement.width, this.canvasElement.height);
            let imageData = this.canvas.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
            let code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                //TODO: Give callback to Application with data so we can move on and show question

                //Make sure we exit the function
                this.close();
                return;
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
