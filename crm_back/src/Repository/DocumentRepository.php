<?php

namespace App\Repository;

use App\Entity\Document;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Document>
 */
class DocumentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Document::class);
    }

    /**
     * Récupérer uniquement l'ID et le nom de tous les fichiers
     */
    public function findAllDocumentProperties()
    {
        // Utilisation du QueryBuilder pour sélectionner seulement deux colonnes
        return $this->createQueryBuilder('d')
            ->select('d.id, d.nom')
            ->orderBy('d.nom', 'ASC')
            ->getQuery()
            ->getArrayResult();
    }
    public function findDocumentNamesByProjetId($projetId)
    {
        return $this->createQueryBuilder('d')
            ->select('d.nom')
            ->where('d.projet_id = :projetId')  // Supposons que vous ayez une colonne projetId
            ->setParameter('projetId', $projetId)
            ->getQuery()
            ->getScalarResult();  // Retourne un tableau simple avec les résultats
    }
    //    /**
    //     * @return Document[] Returns an array of Document objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('d')
    //            ->andWhere('d.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('d.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Document
    //    {
    //        return $this->createQueryBuilder('d')
    //            ->andWhere('d.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}