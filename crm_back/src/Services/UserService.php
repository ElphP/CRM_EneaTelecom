<?php

namespace App\Services;

use App\Entity\Contact;
use App\Enum\Sexe;
use App\Repository\EntrepriseRepository;
use App\Repository\ContactRepository;
use Doctrine\ORM\EntityManagerInterface;


class UserService
{
    public function __construct(private ContactRepository $contactRepository, private EntrepriseRepository $entrepriseRepository, private EntityManagerInterface $entityManager)
    {
        $this->contactRepository = $contactRepository;
        $this->entrepriseRepository = $entrepriseRepository;
        $this->entityManager = $entityManager;
    }

    public function findAllAntenneEnea($ant)
    {
        $contacts = $this->contactRepository->findBy(
            ['antenne_enea' => $ant]
        );

        return $contacts;
    }

    public function findAllEntreprise($ent)
    {
        $entreprise = $this->entrepriseRepository->findOneBy(['nom' => $ent]);
        $contacts = $this->contactRepository->findBy(['entreprise' => $entreprise]);
        return $contacts;
    }

    public function findEntrepriseAntenneEnea($ant, $ent)
    {
        $qb = $this->entityManager->createQueryBuilder();

        return $qb->select('c')
            ->from('App\Entity\Contact', 'c')
            ->join('c.entreprise', 'e') // Jointure avec l'entité Entreprise
            ->where('c.antenne_enea = :antenne')
            ->andWhere('e.nom = :nom')
            ->setParameter('antenne', $ant)
            ->setParameter('nom', $ent)
            ->getQuery()
            ->getResult();
    }

    public function deleteContact($id)
    {

        $contact = $this->contactRepository->find($id);
        // Vérifier si la vairable id existe existe
        if (!$id) {
            return null;
        }

        $this->entityManager->remove($contact);
        $this->entityManager->flush();

        // Retourner une réponse de succès
        return true;
    }
    public function createContact($data)
    {

        $antenne = $data['antenne'];
        $sexe = ($data['sexe']==='M')? Sexe::M : Sexe::F ;
        $nom = $data['nom'];
        $prenom = $data['prenom'] ?? NULL;
        $entreprise = $this->entrepriseRepository->findOneby(['nom'=> trim($data['entreprise'])]) ;
        $fonction = $data['fonction'];
        $tel1 = $data['tel1'] ?? NULL;
        $tel2 = $data['tel2'] ?? NULL;
        $mail1 = $data['mail1'] ?? NULL;
        $mail2 = $data['mail2'] ?? NULL;
        $adresse = $data['adresse'] ?? NULL;
        $CP = $data['CP'] ?? NULL;
        $ville = $data['ville'] ?? NULL;

        $contact = new Contact();
        $contact->setAntenneEnea($antenne);
        $contact->setsexe($sexe);
        $contact->setNom($nom);
        $contact->setPrenom($prenom);
        $contact->setEntreprise($entreprise);
        $contact->setFonction($fonction);
        $contact->settel1($tel1);
        $contact->setTel2($tel2);
        $contact->setMail1($mail1);
        $contact->setMail2($mail2);
        $contact->setAdresse($adresse);
        $contact->setCp($CP);
        $contact->setVille($ville);

        $this->entityManager->persist($contact);
        $this->entityManager->flush();

        
        // Retourner une réponse de succès
        return true;
    }
    
    public function updateContact($data)
    {

        $antenne = $data['antenne'];
        $sexe = ($data['sexe']==='M')? Sexe::M : Sexe::F ;
        $nom = $data['nom'];
        $prenom = $data['prenom'] ?? NULL;
        $entreprise = $this->entrepriseRepository->findOneby(['nom'=> trim($data['entreprise'])]) ;
        $fonction = $data['fonction'];
        $tel1 = $data['tel1'] ?? NULL;
        $tel2 = $data['tel2'] ?? NULL;
        $mail1 = $data['mail1'] ?? NULL;
        $mail2 = $data['mail2'] ?? NULL;
        $adresse = $data['adresse'] ?? NULL;
        $CP = $data['cp'] ?? NULL;
        $ville = $data['ville'] ?? NULL;
        $id = $data['id'];

        $contact = $this->contactRepository->find($id);
        $contact->setAntenneEnea($antenne);
        $contact->setsexe($sexe);
        $contact->setNom($nom);
        $contact->setPrenom($prenom);
        $contact->setEntreprise($entreprise);
        $contact->setFonction($fonction);
        $contact->settel1($tel1);
        $contact->setTel2($tel2);
        $contact->setMail1($mail1);
        $contact->setMail2($mail2);
        $contact->setAdresse($adresse);
        $contact->setCp($CP);
        $contact->setVille($ville);

        $this->entityManager->persist($contact);
        $this->entityManager->flush();

        
        // Retourner une réponse de succès
        return true;
    }
}