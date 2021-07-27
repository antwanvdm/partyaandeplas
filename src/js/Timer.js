const Timer = function (doneCallback) {
    this.timerElement = document.querySelector('#timer');
    let addedHour = new Date().getTime() + (60 * 60 * 1000);
    // let addedHour = new Date().getTime() + (60 * 1000);
    this.countDownDate = new Date().setTime(addedHour);
    this.interval = null;

    this.init = () => {
        //Make sure we reset time to the saved value in local storage
        let countDownDateLocalStorage = localStorage.getItem('timer');
        if (countDownDateLocalStorage !== null) {
            this.countDownDate = parseInt(countDownDateLocalStorage);
        } else {
            //Save it the first time only
            localStorage.setItem('timer', this.countDownDate.toString());
        }

        this.start();
        this.interval = setInterval(() => this.start(), 1000);
    }

    this.start = () => {
        //Current time to measure difference with initial time
        let now = new Date().getTime();
        let distance = this.countDownDate - now;

        //Time calculations for minutes and seconds
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        //Change color to red once the danger zone arrives
        if (minutes <= 5 || distance < 0) {
        // if (seconds <= 10 || distance < 0) {
            this.timerElement.classList.remove('text-green-500');
            this.timerElement.classList.add('text-red-500');
        }

        //Update HTML
        minutes = (minutes < 10 ? '0' : '') + minutes;
        seconds = (seconds < 10 ? '0' : '') + seconds;
        this.timerElement.innerHTML = `${minutes}:${seconds}`;

        //Stop the timer
        if (distance < 0) {
            this.end();
        }
    }

    this.end = () => {
        clearInterval(this.interval);
        this.timerElement.innerHTML = "00:00";
        doneCallback();
    }

    this.init();
}

export default Timer;
