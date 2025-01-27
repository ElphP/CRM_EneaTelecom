<?php

namespace App\Services;

use Doctrine\ORM\EntityManagerInterface;
class UserService
{
  

    public function __construct(
       
        private EntityManagerInterface $entityManager,
       

    ) {
       
        $this->entityManager = $entityManager;
       
    }
    public function findIdentityUser(string $mail)
    {
        $contact = $this->entityManager->createQueryBuilder();

        return $contact->select('c')
            ->from('App\Entity\Contact', 'c')
            ->join('App\Entity\User', 'u', 'WITH', 'u.contact = c') // Jointure avec l'entité Users
            ->where('u.email = :mail')
            ->setParameter('mail', $mail)
            ->getQuery()
            ->getOneOrNullResult();
    }
}