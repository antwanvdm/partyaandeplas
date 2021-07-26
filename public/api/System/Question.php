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
    public bool $hidden;
    public float $lat;
    public float $lon;

    /**
     * @return Question[]
     */
    public static function getAll(): array
    {
        $db = Database::getInstance();
        $statement = $db->prepare("SELECT * FROM questions AS q");
        try {
            $statement->execute();
        } catch (\Throwable $e) {
            return [];
        }

        return $statement->fetchAll(\PDO::FETCH_CLASS, "System\\Question");
    }

    /**
     * @param int $id
     * @return Question
     * @throws \Exception
     */
    public static function getById(int $id): Question
    {
        $db = Database::getInstance();
        $statement = $db->prepare(
            "SELECT * FROM questions AS q
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
                ':hidden' => $question->hidden,
                ':lat' => $question->lat,
                ':lon' => $question->lon,
            ]
        );
    }
}
