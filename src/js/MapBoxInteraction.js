import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import settings from './application.config';

const MapBoxInteraction = function (loadedCallback) {
    this.map = false;
    this.accessToken = settings.mapBoxAccessToken;
    this.currentLocation = [0, 0];

    this.init = () => {
        mapboxgl.accessToken = this.accessToken;
        document.querySelector("#maps").classList.remove('hide');

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
        this.map.setZoom(15);
    }

    this.addQuestionsLocations = (questions) => {
        //TODO add questions as red markers (they will be green once done)
        console.log(questions);
    }

    this.metersToPixelsAtMaxZoom = (meters, latitude) => {
        return meters / 0.075 / Math.cos(latitude * Math.PI / 180);
    }

    this.disable = () =>{
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
