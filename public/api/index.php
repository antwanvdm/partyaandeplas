<?php

require_once "../../settings.php";
require_once "vendor/autoload.php";

//Important for external requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

//Import for readability
use System\Player;
use System\PlayerValidation;

//Relevant variables to use
$response = [];
$data = json_decode(file_get_contents('php://input'), true);

//Make sure no bad requests pass and mess up our DB/queries
if ($data === null || empty($data)) {
    $response['error'] = "Er is helaas iets fout gegaan.";
} else {
    //First validate the actual data
    $playerValidation = new PlayerValidation($data);
    $errors = $playerValidation->getErrors();
    if (!empty($errors)) {
        $response['error'] = "De ingevulde data is niet compleet of corrupt";
        $response['errorDetail'] = $errors;
    } else {
        $newPlayer = $playerValidation->getPlayer();

        //Store in DB
        if (($id = Player::add($newPlayer)) === false) {
            $response['error'] = "Het opslaan is mislukt.";
        } else {
            $response['id'] = $id;
        }
    }
}

//Give succes/error message to client
header("Content-Type: application/json");
echo json_encode($response);
exit;
