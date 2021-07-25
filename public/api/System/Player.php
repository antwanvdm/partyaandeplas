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
    public static function getPlayers(Player $player): array
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
     * @param Player $player
     * @return bool|int
     */
    public static function add(Player $player): bool|int
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
}
