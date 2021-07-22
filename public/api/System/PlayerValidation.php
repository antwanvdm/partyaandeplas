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
        $this->player->email = $data['email'];
        $this->player->date_time = strtotime($data['dateTime']);
        $this->player->handicap = (int)$data['handicap'];
        $this->player->km_range = (int)$data['kmRange'];
        $this->player->lng = (float)$data['location'][0];
        $this->player->lat = (float)$data['location'][1];
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

        if ($this->player->email == "" || filter_var($this->player->email, FILTER_VALIDATE_EMAIL) === false) {
            $this->errors['email'] = true;
        }

        if ($this->player->date_time === false || $this->player->date_time === 0) {
            $this->errors['dateTime'] = true;
        }

        if ($this->player->handicap < 1) {
            $this->errors['handicap'] = true;
        }

        if ($this->player->km_range < 5) {
            $this->errors['kmRange'] = true;
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
