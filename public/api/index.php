<?php

require_once "../../settings.php";
require_once "vendor/autoload.php";

//Important for external requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

//Initiate new bootstrap
$bootstrap = new \System\Bootstrap();

//Simplified route system
$route = $_GET['r'] ?? '';
switch($route){
    case "newplayer":
        $bootstrap->postNewPlayerForm();
        break;

    case "questions":
        $bootstrap->getQuestions();
        break;

    case "answer-question":
        $bootstrap->postQuestionAnswer();
        break;

    case "generate-qrcodes":
        $bootstrap->generateQRCodes();
        break;

    case "player-ranks":
        $bootstrap->getPlayerRankedByScore();
        //TEMP Ugliness as I didn't have the time to create a dashboard :)
        echo "<pre>";
        print_r($bootstrap->getResponseData());
        exit;
        break;
}

//Give succes/error message to client
header("Content-Type: application/json");
echo json_encode($bootstrap->getResponseData());
exit;
