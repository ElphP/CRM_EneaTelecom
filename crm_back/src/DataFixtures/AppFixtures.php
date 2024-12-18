<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Entreprise;
use App\Entity\Projet;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Factory\UserFactory;
use App\Factory\ContactFactory;
use App\Factory\ProjetFactory;
use App\Factory\EntrepriseFactory;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Factory as FakerFactory;

use App\Enum\CatEntreprise;

class AppFixtures extends Fixture
{




    public function __construct(private UserPasswordHasherInterface $userPasswordHasher, private EntityManagerInterface $entityManager)
    {
        $this->userPasswordHasher = $userPasswordHasher;
        $this->entityManager = $entityManager;
    }
    public function load(ObjectManager $manager): void
    {

        // injection de faker
        $faker = FakerFactory::create();

        // Création des sociétés  Clients
        $entreprises = EntrepriseFactory::createMany(6, function () {
            return ['categorie' => CatEntreprise::C];
        });

        // Créez les projets et contacts associés aux entreprises existantes
        foreach ($entreprises as $entreprise) {

            $contacts = ContactFactory::createMany(rand(1, 5), [
                'entreprise' => $entreprise, // Associe chaque contact à l'entreprise existante
                'antenne_enea' => $entreprise->getAntenneEnea(),
            ]);
            $contact = $faker->randomElement($contacts);
            UserFactory::createOne(['contact' => $contact ,'email' => $contact->getMail1(), 'roles' => ['ROLE_CLIENT'], 'entreprise' => $entreprise ]);
            // Création des projets pour cette entreprise après avoir créer les contacts
            ProjetFactory::createMany(rand(1, 3), function () use ($entreprise, $contacts, $faker) {
                return [
                    'entreprise' => $entreprise, // Associe le projet à l'entreprise
                    'contact' => $faker->randomElement($contacts), // Associe un contact existant aléatoire
                ];
            });
        }

        // Création des société et offres (projets) Prospect
        $entreprises = EntrepriseFactory::createMany(3, function () {
            return ['categorie' => CatEntreprise::P];
        });

        // Créer les projets, contacts associés aux entreprises existantes
        foreach ($entreprises as $entreprise) {

            $contacts = ContactFactory::createMany(rand(1, 3), [
                'entreprise' => $entreprise, // Associe chaque contact à l'entreprise existante
                'antenne_enea' => $entreprise->getAntenneEnea(),
            ]);
            // Création des projets pour cette entreprise après avoir créer les contacts

            ProjetFactory::createMany(rand(1, 3), function () use ($entreprise, $contacts, $faker) {
                return [
                    'entreprise' => $entreprise, // Associe le projet à l'entreprise
                    'contact' => $faker->randomElement($contacts), // Associe un contact existant aléatoire
                ];
            });
        }

        // Création des sociétés Fournisseurs
        $entreprises = EntrepriseFactory::createMany(5, function () {
            return ['categorie' => CatEntreprise::F, 'antenne_enea' => 'All'];
        });
        foreach ($entreprises as $entreprise) {
            ContactFactory::createMany(rand(1, 2), [
                'entreprise' => $entreprise, // Associe chaque contact à l'entreprise existante
                'antenne_enea' => $entreprise->getAntenneEnea(),
            ]);
        }

      

      
        // Création du compte Admin et User
       
        $entrepriseEnea = EntrepriseFactory::createOne(['nom' => 'EneaTelecom', 'categorie' => CatEntreprise::ET, 'antenne_enea'=> 'All']);
        
        ContactFactory::new()->asAdmin($entrepriseEnea)->create();
        
        ContactFactory::new()->asUser($entrepriseEnea)->create();
        ContactFactory::new()->asUser($entrepriseEnea)->create();
        ContactFactory::new()->asUser($entrepriseEnea)->create();
        ContactFactory::new()->asUser($entrepriseEnea)->create();

        // $product = new Product();
        // $manager->persist($product);

        // $manager->flush();
    }
}