# Party aan de Plas

todo..

## Getting started

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
