<?php

namespace App\Repository;

use App\Entity\Projet;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;


use DateTime;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @extends ServiceEntityRepository<Projet>
 */
class ProjetRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry, private EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        parent::__construct($registry, Projet::class);
    }

    public function findProjetsByAntenne(string $antenne): array
    {
        return $this->createQueryBuilder('p')
            ->join('p.entreprise', 'e')
            ->where('e.antenne_enea = :antenne')
            ->setParameter('antenne', $antenne)
            ->getQuery()
            ->getResult();
    }
    public function countProjetsByStatut($entreprise, array $statuts): int
    {
        return $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->join('p.entreprise', 'e')
            ->where('p.entreprise = :entreprise')
            ->andWhere('p.statut IN (:statuts)')
            ->setParameter('entreprise', $entreprise)
            ->setParameter('statuts', $statuts)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function countAllProjetsByStatuts(array $statuts): int
    {
        // Utilisation de QueryBuilder
        $qb = $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.statut IN (:statuts)')
            ->setParameter('statuts', $statuts);

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    public function countProjetsRetard(): int
    {
        $qb = $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.date_etape <= :currentDate') // Comparaison avec une date
            ->setParameter('currentDate', new \DateTime());

        return $qb->getQuery()->getSingleScalarResult();
    }
    public function listProjetsRetard(): array
    {
        $qb = $this->createQueryBuilder('p')
            ->select('p.id', 'p.nom','p.date_etape', 'p.statut','e.nom AS entreprise')
            ->join('p.entreprise', 'e')
            ->where('p.date_etape <= :currentDate') // Comparaison avec une date
            ->setParameter('currentDate', new \DateTime())
            ->orderBy("p.date_etape");

        return $qb->getQuery()->getResult();
    }

    public function projetsByStatuts($statuts, $orderBy, $direction)
    {
        if ($orderBy === "entreprise") {
            return $this->createQueryBuilder('p')
                ->join('p.entreprise', 'e')
                ->where('p.statut IN (:statuts)')
                ->setParameter('statuts', $statuts)
                ->orderBy("e.nom", $direction)
                ->getQuery()
                ->getResult();
        } else {
            if ($orderBy === 'date_creation') {
                $orderBy = 'id';
            }
            return $this->createQueryBuilder('p')
                ->where('p.statut IN (:statuts)')
                ->setParameter('statuts', $statuts)
                ->orderBy("p.$orderBy", $direction)
                ->getQuery()
                ->getResult();
        }
    }

    public function findInfosProjet(int $id): ?Projet
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.entreprise', 'e') 
            ->addSelect('e')         
            ->leftJoin('p.contact', 'c') 
            ->addSelect('c')                       
            ->leftJoin('p.users', 'u') 
            ->addSelect('u')                       
            ->where('p.id = :id')  
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult(); // Retourne le projet ou null si non trouvé
    }

    public function createOffre($nom, $date_etape, $entreprise, $contact, $user): ?Projet
    {

        
        $projet = new Projet();
        $projet->setNom($nom);
        $projet->setStatut("EC");
        $projet->setDateEtape(new DateTime($date_etape));
        $projet->setEntreprise($entreprise);
        $projet->setContact($contact);
        $projet->addUser($user);
        $projet->setDatecreation(new DateTime());
        

        $this->entityManager->persist($projet);
        $this->entityManager->flush();


        // Retourner une réponse de succès
        return $projet;
    }


    //    /**
    //     * @return Projet[] Returns an array of Projet objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Projet
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}