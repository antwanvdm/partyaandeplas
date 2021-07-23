<?php namespace System;

/**
 * Class PlayerValidation
 * @package System
 */
class PlayerValidation
{
    private array $errors = [];
    private Player $player;

    /**
     * PlayerValidation constructor.
     * @param $data
     */
    public function __construct($data)
    {
        $this->player = new Player();
        $this->player->name = $data['name'];
        $this->validate();
    }

    /**
     * Validate all fields
     */
    private function validate(): void
    {
        if ($this->player->name == "") {
            $this->errors['name'] = true;
        }
    }

    /**
     * @return array
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * @return Player
     */
    public function getPlayer(): Player
    {
        return $this->player;
    }
}
