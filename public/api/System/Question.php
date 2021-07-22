<?php
namespace System;

/**
 * Class Question
 * @package System
 */
class Question
{
    public ?int $id = null;
    public string $title;
    public string $answer1;
    public string $answer2;
    public string $answer3;
    public string $answer4;
    public string $correct;
    public string $fact;
    public string $location;
    public bool $hidden;

    /**
     * @param int $id
     * @return Question
     * @throws \Exception
     */
    public static function getQuestionById(int $id): Question
    {
        $db = Database::getInstance();
        $statement = $db->prepare(
            "SELECT * FROM players AS p
                            WHERE id = :id"
        );

        $statement->execute(
            [
                ":id" => $id
            ]
        );

        return $statement->fetchObject("System\\Question");
    }

    /**
     * @param Question $question
     * @return bool
     * @throws \Exception
     */
    public static function add(Question $question): bool
    {
        $db = Database::getInstance();
        $statement = $db->prepare(
            "INSERT INTO questions
                                    (title, answer1, answer2, answer3, answer4, correct, fact, location, hidden)
                                    VALUES(:title, :answer1, :answer2, :answer3, :answer4, :correct, :fact, POINT(:point), :hidden)"
        );

        return $statement->execute(
            [
                ':name' => $question->title,
                ':answer1' => $question->answer1,
                ':answer2' => $question->answer2,
                ':answer3' => $question->answer3,
                ':answer4' => $question->answer4,
                ':correct' => $question->correct,
                ':fact' => $question->fact,
                ':location' => $question->location,
                ':hidden' => $question->hidden,
            ]
        );
    }
}
