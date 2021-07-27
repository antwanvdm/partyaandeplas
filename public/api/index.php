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
switch($_GET['r']){
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
}

//Give succes/error message to client
header("Content-Type: application/json");
echo json_encode($bootstrap->getResponseData());
exit;
