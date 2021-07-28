<?php

namespace System;

use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\ImagickImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

/**
 * Class Bootstrap
 * @package System
 */
class Bootstrap
{
    private ?array $postData = [];
    private array $response = [];

    /**
     * @throws \Exception
     */
    private function processPost()
    {
        $this->postData = json_decode(file_get_contents('php://input'), true);
        //Make sure no bad requests pass and mess up our DB/queries
        if ($this->postData === null || empty($this->postData)) {
            $this->response['error'] = "Er is helaas iets fout gegaan.";
            throw new \Exception("Bad form request");
        }
    }

    /**
     *
     */
    public function postNewPlayerForm(): void
    {
        try {
            $this->processPost();
        } catch (\Exception $e) {
            return;
        }

        //Check on error, else move forward
        if (!isset($this->postData['name'])) {
            $this->response['error'] = "De ingevulde data is niet compleet of corrupt";
        } else {
            $newPlayer = new Player();
            $newPlayer->name = $this->postData['name'];

            //Store in DB
            if (($id = Player::add($newPlayer)) === false) {
                $this->response['error'] = "Het opslaan is mislukt.";
            } else {
                $this->response['id'] = $id;
            }
        }
    }

    /**
     *
     */
    public function getQuestions()
    {
        $this->response['questions'] = Question::getAll();
    }

    /**
     *
     */
    public function postQuestionAnswer()
    {
        try {
            $this->processPost();

            //Get the data by the post IDs
            $player = Player::getById($this->postData['playerId']);
            $question = Question::getById($this->postData['questionId']);
        } catch (\Exception $e) {
            return;
        }

        //Store in DB
        if ($player->saveAnswer($question, $this->postData['answer'], $this->postData['seconds']) === false) {
            $this->response['error'] = "Het opslaan is mislukt.";
        } else {
            $this->response['correct'] = $question->correct == $this->postData['answer'];
            $this->response['answer'] = $question->{'answer' . $question->correct};
            $this->response['fact'] = $question->fact;
            $this->response['questionId'] = $question->id;
        }
    }

    /**
     * @return array
     */
    public function getResponseData(): array
    {
        return $this->response;
    }

    /**
     * Generate PNG files based on questions in DB
     */
    public function generateQRCodes()
    {
        $questions = Question::getAll();
        $renderer = new ImageRenderer(
            new RendererStyle(400),
            new ImagickImageBackEnd()
        );
        $writer = new Writer($renderer);

        foreach ($questions as $question) {
            $writer->writeFile(json_encode(["id" => $question->id, "application" => "padp"]), INCLUDES_PATH . "qrcodes/qrcode-{$question->id}.png");
        }
    }

    /**
     * @throws \Exception
     */
    public function getPlayerRankedByScore()
    {
        $this->response['data'] = Player::getAllRanked();
    }
}
