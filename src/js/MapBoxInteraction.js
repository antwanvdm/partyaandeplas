import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import settings from './application.config';

const MapBoxInteraction = function (loadedCallback) {
    this.map = false;
    this.accessToken = settings.mapBoxAccessToken;
    this.currentLocation = [0, 0];

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
        this.map.setZoom(10);
        document.querySelector(".loader-overlay").classList.add("hide");

        this.setRangeCircle();
    }

    this.setRangeCircle = () => {
        this.map.addSource('markers', {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": this.currentLocation
                    },
                    "properties": {
                        "modelId": 1,
                    },
                }]
            }
        });
        this.map.addLayer({
            "id": "kmRangeCircle",
            "source": "markers",
            "type": "circle",
            "paint": {
                "circle-radius": {
                    stops: [
                        [0, 0],
                        [20, this.metersToPixelsAtMaxZoom(5000, this.currentLocation[1])]
                    ],
                    base: 2
                },
                "circle-color": "#FF0000",
                "circle-opacity": 0.5,
                "circle-stroke-width": 0,
            },
            "filter": ["==", "modelId", 1],
        });
    }

    this.updateRangeCircle = (range) => {
        let radiusObject = {
            stops: [
                [0, 0],
                [20, this.metersToPixelsAtMaxZoom(range * 1000, this.currentLocation[1])]
            ],
            base: 2
        }
        this.map.setPaintProperty('kmRangeCircle', 'circle-radius', radiusObject);
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
