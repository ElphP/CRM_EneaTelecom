<?php

namespace App\Factory;

use App\Entity\Contact;

use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;
use App\Entity\Entreprise;
use App\Entity\User;
use App\Entity\Projet;
use App\Enum\Sexe;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\ArrayCollection;

use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * @extends PersistentProxyObjectFactory<Contact>
 */
final class ContactFactory extends PersistentProxyObjectFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct(private UserPasswordHasherInterface$hasher, private EntityManagerInterface $entityManager)
    {
        parent::__construct();
        $this->hasher = $hasher;
        $this->entityManager = $entityManager;
    }

    public static function class(): string
    {
        return Contact::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        $antenne = ["CI", "To", "Be"];
        return [
            'antenne_enea' => self::faker()->randomElement($antenne),
            'fonction' => self::faker()->jobTitle(),
            'nom' => self::faker()->lastName(),
            'prenom' => self::faker()->firstName(),
            'sexe' => self::faker()->randomElement(Sexe::cases()),
            'tel1' => self::faker()->unique()->regexify('06[0-9]{8}'),
            'tel2' => self::faker()->boolean(88) ? null : self::faker()->unique()->regexify('\+33 8[0-9]{8}'),
            'mail1' =>  self::faker()->unique()->email(),
            'mail2' => self::faker()->boolean(72) ? null : self::faker()->unique()->email(),
            'adresse' => self::faker()->address(),
            'cp' => self::faker()->postcode(),
            'ville' => self::faker()->city(),


        ];
    }


    public function asAdmin(Entreprise $entrepriseEnea): self
    {
        $email = 'admin@crm.com';
        
        // Création d'un contact associé à l'entreprise
        $contact = ContactFactory::createOne([
            'entreprise' => $entrepriseEnea,
            'mail1' => $email, // Exemple de mail pour le contact
        ]);

        
        // Créez l'utilisateur avec un mot de passe hashé
        $user = UserFactory::createOne([
            'contact' => $contact, // Associer l'utilisateur au contact
            'email' => $email, // Le mail du contact devient l'email de l'utilisateur
            'roles' => ['ROLE_ADMIN'], // Vous pouvez spécifier les rôles si nécessaire
            'password' => $this->hasher->hashPassword(new User(), 'password'), // Hash du mot de passe
            'entreprise' => $entrepriseEnea,
        ]);

        // Retourne un nouvel objet avec toutes les informations
        return self::new([
            'antenne_enea' => 'All',
            'nom' => 'Dji',
            'prenom' => 'Sylvie',
            'fonction' => 'Directrice Générale',
            'tel1' => '0621318171',
            'entreprise' => $entrepriseEnea,
            'user' => $user, // Associez l'utilisateur créé à l'entité principale
        ]);
    }

    
    public function asUser(Entreprise $entrepriseEnea): self
    {
        $antenne = self::faker()->randomElement(["CI", "To", "Be"]);
        // Trouve les projets de la même antenne aléatoire
        $projetsCollection = new Arraycollection($this->entityManager->getRepository(Projet::class)->findProjetsByAntenne($antenne));
       
        $email =  self::faker()->unique()->email(); 
         
        // Création d'un contact associé à l'entreprise
        $contact = ContactFactory::createOne([
            'entreprise' => $entrepriseEnea,
            'mail1' => $email,
        ]);
        // Créez l'utilisateur avec un mot de passe hashé
        $user = UserFactory::createOne([
            'contact' => $contact, // Associer l'utilisateur au contact
            'email' => $email, // Le mail du contact devient l'email de l'utilisateur
            'roles' => ['ROLE_USER'], // Vous pouvez spécifier les rôles si nécessaire
            'password' => $this->hasher->hashPassword(new User(), 'password'), // Hash du mot de passe
            'entreprise' => $entrepriseEnea,
            'projets' => $projetsCollection,  // Associe les projets récupérés par antenne
        ]);


        // Retourne un nouvel objet User avec tous les attributs nécessaires
        return self::new([
            'antenne_enea' => $antenne,
            'fonction' => self::faker()->jobTitle(),
            'nom' => self::faker()->lastName(),
            'prenom' => self::faker()->firstName(),
            'tel1' => self::faker()->unique()->regexify('06[0-9]{8}'),
            'entreprise' => $user->getEntreprise(),
            'user'=> $user,
           
        ]);
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Contact $contact): void {})
        ;
    }
}