<?php

namespace System;

/**
 * Class Player
 * @package System
 */
class Player
{
    public ?int $id = null;
    public string $name;

    /**
     * @param Player $player
     * @return Player[]
     * @throws \Exception
     */
    public static function getAll(Player $player): array
    {
        $db = Database::getInstance();
        $statement = $db->prepare(
            "SELECT * FROM players AS p
                   LEFT JOIN player_question AS pq ON p.id = pq.player_id"
        );

        $statement->execute();

        return $statement->fetchAll(\PDO::FETCH_CLASS, "System\\Player");
    }

    /**
     * @param int $id
     * @return Player
     * @throws \Exception
     */
    public static function getById(int $id): Player
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

        return $statement->fetchObject("System\\Player");
    }

    /**
     * @param Player $player
     * @return false|string
     */
    public static function add(Player $player)
    {
        $db = Database::getInstance();
        $statement = $db->prepare(
            "INSERT INTO players
                   (name)
                   VALUES(:name)"
        );

        try {
            $executed = $statement->execute(
                [
                    ':name' => $player->name
                ]
            );
        } catch (\PDOException $e) {
            $executed = false;
        }

        return $executed ? $db->lastInsertId() : false;
    }

    /**
     * @param Question $question
     * @param $answer
     * @param $seconds
     * @return bool
     */
    public function saveAnswer($question, $answer, $seconds): bool
    {
        $db = Database::getInstance();

        $statement = $db->prepare(
            "INSERT INTO player_question
                   (player_id, question_id, answer, score, seconds)
                   VALUES(:playerId, :questionId, :answer, :score, :seconds)"
        );

        try {
            return $statement->execute(
                [
                    ':playerId' => $this->id,
                    ':questionId' => $question->id,
                    ':answer' => $answer,
                    ':score' => $this->calculateScore($question->correct, $answer, $seconds),
                    ':seconds' => $seconds,
                ]
            );
        } catch (\PDOException $e) {
            return false;
        }
    }

    /**
     * @param int $correct
     * @param int $answer
     * @param $seconds
     * @return float
     */
    private function calculateScore(int $correct, int $answer, $seconds): float
    {
        if ($correct !== $answer) {
            return 0;
        }

        $maxScore = 4;
        $maxSecondsForBonus = 40;
        $score = $maxScore - (($seconds / $maxSecondsForBonus) * $maxScore);
        return $score < 1 ? 1 : $score;
    }
}
