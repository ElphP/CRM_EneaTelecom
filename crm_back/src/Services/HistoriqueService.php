<?php

namespace App\Services;

use App\Entity\Entreprise;
use App\Entity\Contact;
use App\Entity\Historique;
use Doctrine\ORM\EntityManagerInterface;

class HistoriqueService
{
    public function __construct(  private EntityManagerInterface $entityManager)
    {
        
        $this->entityManager = $entityManager;
    }


    public function populateHistorique($entity)
    {
        // *cas de suppression d'une entreprise (qui va supprimer aussi des contacts liés et ses projets)
        if ($entity instanceof Entreprise) {
            // Historiser les contacts liés
            $contacts = $entity->getContact();
            foreach ($contacts as $contact) {
                $historiqueContact = $this->creerHistorique(
                    'contact',
                    $contact->getId(),
                    'delete',
                    [
                        'nom' => $contact->getNom(),
                        'prenom' => $contact->getPrenom(),
                        'entreprise' => $contact->getEntreprise()->getNom(),
                        'fonction' => $contact->getFonction(),
                        'tel1' => $contact->getTel1(),
                        'tel2' => $contact->getTel2(),
                        'mail1' => $contact->getMail1(),
                        'mail2' => $contact->getMail2(),
                        'adresse' => $contact->getAdresse(),
                        'CP' => $contact->getCp(),
                        'ville' => $contact->getVille(),
                        'antenne_enea' => $contact->getAntenneEnea(),
                    ]
                );
                $this->entityManager->persist($historiqueContact);
            }

            // Historiser les projets liés
            $projets = $entity->getProjets();
            foreach ($projets as $projet) {
                $historiqueProjet = $this->creerHistorique(
                    'projet',
                    $projet->getId(),
                    'delete',
                    [
                        'nom' => $projet->getNom(),
                        'statut' => $projet->getStatut(),
                        'entreprise' => $projet->getEntreprise()->getNom(),
                        'DateEtape' => $projet->getDateEtape(),
                        'type' => $projet->getType(),
                        'numeroContrat' => $projet->getNumeroContrat(),
                        'objectif' => $projet->getObjectif(),
                        'description' => $projet->getDescription(),
                        'dateCreation' => $projet->getDateCreation(),
                        'ateDebPrev' => $projet->getDateDebPrev(),
                        'dateFinPrev' => $projet->getDateFinPrev(),
                        'dateDebReel' => $projet->getDateDebReel(),
                        'dateFinReel' => $projet->getDateFinReel(),
                    ]
                );
                $this->entityManager->persist($historiqueProjet);
            }

            // Historiser l'entreprise elle-même
            $historiqueEntreprise = $this->creerHistorique(
                'entreprise',
                $entity->getId(),
                'delete',
                [
                    'nom' => $entity->getNom(),
                    'adresse' => $entity->getAdresse(),
                    'CP' => $entity->getCp(),
                    'ville' => $entity->getVille(),
                    'antenne_enea' => $entity->getAntenneEnea(),
                    'categorie' => $entity->getCategorie(),
                ]
            );
            $this->entityManager->persist($historiqueEntreprise);

            // Sauvegarder tous les historiques
            $this->entityManager->flush();
        }

        //*Cas de la suppression d'un contact
         if ($entity instanceof Contact) {
            
            $historiqueContact = $this->creerHistorique(
                'contact',
                $entity->getId(),
                'delete',
                [
                    'nom' => $entity->getNom(),
                    'prenom' => $entity->getPrenom(),
                    'entreprise' => $entity->getEntreprise()->getNom(),
                    'fonction' => $entity->getFonction(),
                    'tel1' => $entity->getTel1(),
                    'tel2' => $entity->getTel2(),
                    'mail1' => $entity->getMail1(),
                    'mail2' => $entity->getMail2(),
                    'adresse' => $entity->getAdresse(),
                    'CP' => $entity->getCp(),
                    'ville' => $entity->getVille(),
                    'antenne_enea' => $entity->getAntenneEnea(),
                ]
            );
            $this->entityManager->persist($historiqueContact);
           
            
         }
    }

    private function creerHistorique(string $typeEntite, int $entiteId, string $action, array $donnees): Historique
    {
        $historique = new Historique();
        $historique->setTypeEntite($typeEntite);
        $historique->setEntiteId($entiteId);
        $historique->setAction($action);
        $historique->setDonnees(json_encode($donnees));
        $historique->setDate(new \DateTime());
        return $historique;
    }
}