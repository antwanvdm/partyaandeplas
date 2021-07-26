<?php

require_once "../../settings.php";
require_once "vendor/autoload.php";

//Important for external requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

//Initiate new bootstrap
$bootstrap = new \System\Bootstrap();

//Simplified route system
$uri_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
switch($uri_path){
    case "/newplayer":
        $bootstrap->postNewPlayerForm();
        break;

    case "/questions":
        $bootstrap->getQuestions();
        break;

    case "/answer-question":
        $bootstrap->postQuestionAnswer();
        break;
}

//Give succes/error message to client
header("Content-Type: application/json");
echo json_encode($bootstrap->getResponseData());
exit;
