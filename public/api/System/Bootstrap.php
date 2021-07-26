<?php

namespace System;

/**
 * Class Bootstrap
 * @package System
 */
class Bootstrap
{
    private array $postData = [];
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

        //First validate the actual data
        $playerValidation = new PlayerValidation($this->postData);
        $errors = $playerValidation->getErrors();
        if (!empty($errors)) {
            $this->response['error'] = "De ingevulde data is niet compleet of corrupt";
            $this->response['errorDetail'] = $errors;
        } else {
            $newPlayer = $playerValidation->getPlayer();

            //Store in DB
            if (($id = Player::add($newPlayer)) === false) {
                $this->response['error'] = "Het opslaan is mislukt.";
            } else {
                $this->response['id'] = $id;
            }
        }
    }

    public function getQuestions()
    {
        $this->response['questions'] = Question::getAll();
    }

    public function postQuestionAnswer()
    {
        try {
            $this->processPost();
        } catch (\Exception $e) {
            return;
        }

        //First validate the actual data
        $player = Player::getById($this->postData['playerId']);
        $question = Question::getById($this->postData['questionId']);

        //Store in DB
        if ($player->saveAnswer($question->id, $this->postData['answer']) === false) {
            $this->response['error'] = "Het opslaan is mislukt.";
        } else {
            $this->response['correct'] = $question->correct == $this->postData['answer'];
            $this->response['answer'] = $question->{'answer' . $question->correct};
            $this->response['fact'] = $question->fact;
        }
    }

    public function getResponseData(): array
    {
        return $this->response;
    }
}
