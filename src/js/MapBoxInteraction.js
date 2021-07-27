import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import settings from './application.config';

const MapBoxInteraction = function (loadedCallback) {
    this.map = false;
    this.accessToken = settings.mapBoxAccessToken;
    this.currentLocation = [0, 0];
    this.currentLocationMarker = null;
    this.questionMarkers = {};

    this.init = () => {
        mapboxgl.accessToken = this.accessToken;

        this.map = new mapboxgl.Map({
            container: 'maps',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [4.506952506774258, 51.937534184423896],
            zoom: 10,
            minZoom: 12,
            maxZoom: 18
        });

        this.map.on('load', loadedCallback);
    }

    this.addCurrentLocation = (lat, lng) => {
        this.currentLocation = [lng, lat];

        let markerEl = document.createElement('div');
        markerEl.classList.add('marker-current-location');
        this.currentLocationMarker = new mapboxgl.Marker(markerEl)
            .setLngLat(this.currentLocation)
            .addTo(this.map);
        this.map.setCenter(this.currentLocation);
        this.map.setZoom(16);
    }

    this.updateCurrentLocation = (lat, lng) => {
        this.currentLocation = [lng, lat];
        this.currentLocationMarker.setLngLat(this.currentLocation);
        this.map.setCenter(this.currentLocation);
    }

    this.addQuestionsLocations = (questions) => {
        let answeredLocalStorage = localStorage.getItem('answered');
        let answeredQuestions = answeredLocalStorage !== null ? JSON.parse(answeredLocalStorage) : [];

        for (let question of questions) {
            this.questionMarkers[question.id] = {};
            this.questionMarkers[question.id].question = question;
            if (typeof this.questionMarkers[question.id].answered !== "undefined" || !question.hidden) {
                let color = "#FF0000";
                if (answeredQuestions.indexOf(question.id) > -1) {
                    this.questionMarkers[question.id].answered = true;
                    color = "#00FF00";
                }
                this.questionMarkers[question.id].marker = new mapboxgl.Marker({"color": color})
                    .setLngLat([question.lon, question.lat])
                    .addTo(this.map);
            }
        }
    }

    this.markLocationAsDone = (id) => {
        if (typeof this.questionMarkers[id].marker !== "undefined") {
            this.questionMarkers[id].marker.remove();
        }

        let question = this.questionMarkers[id].question;
        this.questionMarkers[id].answered = true;
        this.questionMarkers[question.id].marker = new mapboxgl.Marker({"color": "#00FF00"})
            .setLngLat([question.lon, question.lat])
            .addTo(this.map);
    }

    this.metersToPixelsAtMaxZoom = (meters, latitude) => {
        return meters / 0.075 / Math.cos(latitude * Math.PI / 180);
    }

    this.disable = () => {
        this.map.boxZoom.disable();
        this.map.scrollZoom.disable();
        this.map.dragPan.disable();
        this.map.dragRotate.disable();
        this.map.keyboard.disable();
        this.map.doubleClickZoom.disable();
        this.map.touchZoomRotate.disable();
    }

    this.init();
};

export default MapBoxInteraction;
