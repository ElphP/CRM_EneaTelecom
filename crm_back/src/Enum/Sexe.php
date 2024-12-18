<?php

namespace App\Enum;

enum Sexe: string
{
    case M = 'M';
    case F = 'F';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}