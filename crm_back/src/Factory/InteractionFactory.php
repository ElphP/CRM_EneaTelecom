<?php

namespace App\Factory;

use App\Entity\Interaction;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<Interaction>
 */
final class InteractionFactory extends PersistentProxyObjectFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
    }

    public static function class(): string
    {
        return Interaction::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        $statut=["à traiter", "traitée","informative"];
        $type=["Appel téléphonique", "Email", "Réunion"];
        return [
            'date_heure' => self::faker()->dateTime(),
            'interaction_projet' => ProjetFactory::new(),
            'statut' => self::faker()->randomElement($statut),
            'sujet' => self::faker()->words(3, true),
            'type' => self::faker()->randomElement($type),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Interaction $interaction): void {})
        ;
    }
}