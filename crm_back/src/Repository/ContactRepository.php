<?php

namespace App\Repository;

use App\Entity\Contact;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use App\Enum\Sexe;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Contact>
 */
class ContactRepository extends ServiceEntityRepository
{
  
    public function __construct(private EntityManagerInterface $entityManager, ManagerRegistry $registry)
    {
        $this->entityManager = $entityManager;
        parent::__construct($registry, Contact::class);
    }

    //    /**
    //     * @return Contact[] Returns an array of Contact objects
    //     */

    public function findContactsByOffreId(int $projetId): array
    {    
        $listContacts=[]; 
        $qb = $this->entityManager->createQueryBuilder();

        $qb->select('contact')
        ->from('App\Entity\Contact', 'contact')
        ->join('contact.entreprise', 'entreprise') // Relation Contact -> Entreprise
        ->join('entreprise.projets', 'projets')      // Relation Entreprise -> Offre
        ->where('projets.id = :offreId')            // Filtrer par l'id de l'offre
        ->setParameter('offreId', $projetId);

        $contacts= $qb->getQuery()->getResult();
        foreach($contacts as $contact)  {

           
            $identity =  ($contact->getSexe() === Sexe::F ? "Mme " : "Mr ").
            $contact->getNom() . " " . $contact->getPrenom();
            
            $listContacts[] = [
                'id' => $contact->getId(),
                'identity' => $identity,
            ];
        }
        return $listContacts; 
    }
    
    public function findContactsByEntrepriseId(int $entrepriseId): array
    {    
        $listContacts=[]; 
        $qb = $this->entityManager->createQueryBuilder();

        $qb->select('contact')
        ->from('App\Entity\Contact', 'contact')
        ->join('contact.entreprise', 'entreprise') // Relation Contact -> Entreprise
              // Relation Entreprise -> Offre
        ->where('entreprise.id = :entrepriseId')            // Filtrer par l'id de l'offre
        ->setParameter('entrepriseId', $entrepriseId);

        $contacts= $qb->getQuery()->getResult();
        foreach($contacts as $contact)  {

           
            $identity =  ($contact->getSexe() === Sexe::F ? "Mme " : "Mr ").
            $contact->getNom() . " " . $contact->getPrenom();
            
            $listContacts[] = [
                'id' => $contact->getId(),
                'identity' => $identity,
            ];
        }
        return $listContacts; 
    }

    
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Contact
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}