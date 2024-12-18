<?php

namespace App\Factory;

use App\Entity\Projet;
use App\Entity\User;
use App\Entity\Entreprise;
use App\Entity\Contact;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

use Doctrine\Common\Collections\ArrayCollection;



/**
 * @extends PersistentProxyObjectFactory<User>
 */
final class UserFactory extends PersistentProxyObjectFactory
{

    
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct(private UserPasswordHasherInterface $hasher)
    {
        parent::__construct();
        $this->hasher = $hasher;
        
      
    }

    public static function class(): string
    {
        return User::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        $roles = [
            User::ROLE_USER,
            User::ROLE_CLIENT,
        ];

        return [
           
            
            'password' => $this->hasher->hashPassword(new User(), 'password'),
            'roles' => [self::faker()->randomElement($roles)],
            // Génère un contact associé automatiquement
            
            'projets' => new ArrayCollection(), // Aucun projet par défaut
        ];
    }

    

   

   



    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(User $user): void {})
        ;
    }
}