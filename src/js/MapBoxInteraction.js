import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import settings from './application.config';

const MapBoxInteraction = function (loadedCallback) {
    this.map = false;
    this.accessToken = settings.mapBoxAccessToken;
    this.currentLocation = [0, 0];
    this.questionMarkers = {};

    this.init = () => {
        mapboxgl.accessToken = this.accessToken;

        this.map = new mapboxgl.Map({
            container: 'maps',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [5.104480, 52.092876],
            zoom: 6
        });

        this.map.on('load', loadedCallback);
    }

    this.addCurrentLocation = (lat, lng) => {
        this.currentLocation = [lng, lat];

        let marker = new mapboxgl.Marker()
            .setLngLat(this.currentLocation)
            .addTo(this.map);
        this.map.setCenter(this.currentLocation);
        this.map.setZoom(16);
    }

    this.addQuestionsLocations = (questions) => {
        for (let question of questions) {
            this.questionMarkers[question.id] = {};
            this.questionMarkers[question.id].question = question;
            this.questionMarkers[question.id].marker = new mapboxgl.Marker({"color": "#FF0000"})
                .setLngLat([question.lon, question.lat])
                .addTo(this.map);
        }
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
