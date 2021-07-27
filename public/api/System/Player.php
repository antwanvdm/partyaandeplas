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
     * @param $questionId
     * @param $answer
     * @return bool
     */
    public function saveAnswer($questionId, $answer): bool
    {
        $db = Database::getInstance();
        $statement = $db->prepare(
            "INSERT INTO player_question
                   (player_id, question_id, answer, score)
                   VALUES(:playerId, :questionId, :answer, :score)"
        );

        try {
            return $statement->execute(
                [
                    ':playerId' => $this->id,
                    ':questionId' => $questionId,
                    ':answer' => $answer,
                    ':score' => 1,
                ]
            );
        } catch (\PDOException $e) {
            return false;
        }
    }
}
