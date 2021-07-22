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
$sendgrid = new \SendGrid(SENDGRID_API_KEY);

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

        //Check is there is a match
        $players = Player::getPlayersByLocationRange($newPlayer);
        if (empty($players)) {
            $response['results'] = false;
        } else {
            $response['results'] = count($players);
            foreach ($players as $player) {
                $mail = new \System\Mail($sendgrid);
                $mail->setTemplate('mail-to-existing-player', [
                    'player' => $player,
                    'newPlayer' => $newPlayer
                ]);
                if ($mail->send($player->email) === false) {
                    $response['error'] = "Er is helaas iets fout gegaan. (2)";
                }
            }

            //Send email to the person that signed up
            $mail = new \System\Mail($sendgrid);
            $mail->setTemplate('mail-to-new-player', [
                'newPlayer' => $newPlayer,
                'players' => $players
            ]);
            if ($mail->send($newPlayer->email) === false) {
                $response['error'] = "Er is helaas iets fout gegaan. (2)";
            }
        }

        //Store in DB
        if (Player::add($newPlayer) === false) {
            $response['error'] = "Het opslaan is mislukt.";
        }
    }
}

//Give succes/error message to client
header("Content-Type: application/json");
echo json_encode($response);
exit;
