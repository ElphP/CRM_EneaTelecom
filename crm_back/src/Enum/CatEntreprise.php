<?php

namespace App\Enum;

enum CatEntreprise: string
{
    case P = 'Prospect';
    case C = 'Client';
    case F = 'Fournisseur';
    case ET = 'EneaTelecom';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}