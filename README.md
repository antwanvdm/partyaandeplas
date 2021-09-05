# 🥳 Party aan de Plas

The application is built to host a 'scavenger hunt' based on QR codes for a private party.
(and yes, the party was a great success!) If you would like to see a demo, you can visit
[https://partyaandeplas.antwan.eu](https://partyaandeplas.antwan.eu). The QR codes for this hunt
are stored [here](public/api/qrcodes), so you are actually able to scan something. The map location
markers can be seen in the "Kralingse Plas, Rotterdam" but scanning works from anywhere (you just 
won't see the markers change from red to green after answering a question if the focus is somewhere 
else) Warning: Everything is in Dutch and the questions are about me and my family ;-)

My next step will be to create a standalone application with an actual 'login' dashboard. This
way I can create something pretty awesome for everyone hosting their own parties wit customised scavenger
hunts. Big shout out to [Mapbox GL](https://www.mapbox.com/mapbox-gljs), [jsQR](https://cozmo.github.io/jsQR)
and [Bacon QR Code](https://github.com/Bacon/BaconQrCode) as I used these libraries to make it happen. 

**NOTE**: During the party I did find 2 bugs on phones from guests:
* Some browsers seem to have issues requesting your location. Have to invest why older safaris are
  having issues. It simply doesn't ask for approval but immediately returns to the denied code while 
  they never received any question to accept location sharing.
* On 1 phone one some moment the application broke completely on the map view. Seemed to have something
  to do with zooming in the browser instead of on the map...

## Getting started (install guide)

To get started, you need:
- A mapbox GL account to get an access token;
- 2 config files;
  - /src/js/application.config.js
  - /settings.php
```javascript
export default {
    apiURL: "",
    mapBoxAccessToken: ""
}
```
```php
<?php
//Define DB credentials
const DB_HOST = "";
const DB_USER = "";
const DB_PASS = "";
const DB_NAME = "";

const INCLUDES_PATH = __DIR__ . "/public/api/";

```
- Server running for the PHP API side (double check this, else API will fail);
- Make sure you have a MYSQL Database (need in settings.php) and import the `_resources/sql` file;
- Run `npm install` & `composer install` (in the public/api folder);
- Run `npm run build:dev` (or watch to watch) to get a compiled JS file;
- Run `npm run serve` to get localhost up & running.
