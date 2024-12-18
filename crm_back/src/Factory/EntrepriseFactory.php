<?php

namespace App\Factory;

use App\Entity\Entreprise;
use App\Enum\CatEntreprise;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<Entreprise>
 */
final class EntrepriseFactory extends PersistentProxyObjectFactory
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
        return Entreprise::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
      
        return [
            // 'categorie' => CatEntreprise::P,
            "antenne_enea" => self::faker()->randomElement(["CI", "To", "Be"]),
            'nom' => self::faker()->unique()->company(),
        ];
    }

    // public function asClient(): self
    // {
    //     return $this->with(['categorie' => CatEntreprise::C, "antenne_enea"=> self::faker()->randomElement(["CI", "To", "Be"])]);
    // }

    // // Méthode pour forcer la catégorie "Prospect"
    // public function asProspect(): self
    // {
    //     return $this->with(['categorie' => CatEntreprise::P,"antenne_enea" => self::faker()->randomElement(["CI", "To", "Be"]) ]);
    // }

    // // Méthode pour forcer la catégorie "Prospect"
    // public function asFournisseur(): self
    // {
    //     return $this->with(['categorie' => CatEntreprise::F, 'antenne_enea'=>"All"]);
    // }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Entreprise $entreprise): void {})
        ;
    }
}