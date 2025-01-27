<?php

namespace App\Services;

use App\Entity\Contact;
use App\Entity\Entreprise;
use App\Enum\Sexe;
use App\Enum\CatEntreprise;
use App\Repository\EntrepriseRepository;
use App\Repository\ContactRepository;
use App\Repository\ProjetRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Services\HistoriqueService;
use \DateTime;

class AdminService
{
    public function __construct(
        private ContactRepository $contactRepository,
        private EntrepriseRepository $entrepriseRepository,
        private projetRepository $projetRepository,
        private EntityManagerInterface $entityManager,
        private HistoriqueService $historiqueService,

    ) {
        $this->contactRepository = $contactRepository;
        $this->entrepriseRepository = $entrepriseRepository;
        $this->projetRepository = $projetRepository;
        $this->entityManager = $entityManager;
        $this->historiqueService = $historiqueService;
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

        // Vérifier si la variable id existe 
        if (!$id) {
            return false;
        }
        $contact = $this->contactRepository->find($id);

        if (!$contact) {
            return false;
        }


        //créer un historique des suppressions à venir
        $this->historiqueService->populateHistorique($contact);

        $this->entityManager->remove($contact);
        $this->entityManager->flush();

        // Retourner une réponse de succès
        return true;
    }

    public function deleteEntreprise($id)
    {

        if (!$id) {
            return false;
        }
        $entreprise = $this->entrepriseRepository->find($id);

        if (!$entreprise) {
            return false;
        }
        //créer un historique des suppressions à venir
        $this->historiqueService->populateHistorique($entreprise);

        $this->entityManager->remove($entreprise);
        $this->entityManager->flush();

        // Retourner une réponse de succès      
        return true;
    }

    public function createContact($data)
    {

        
        $sexe = ($data['sexe'] === 'M') ? Sexe::M : Sexe::F;
        $nom = $data['nom'];
        $prenom = $data['prenom'] ?? NULL;
        $entreprise = $this->entrepriseRepository->findOneby(['nom' => trim($data['entreprise'])]);
        $fonction = $data['fonction'];
        $tel1 = $data['tel1'] ?? NULL;
        $tel2 = $data['tel2'] ?? NULL;
        $mail1 = $data['mail1'] ?? NULL;
        $mail2 = $data['mail2'] ?? NULL;
        $adresse = $data['adresse'] ?? NULL;
        $CP = $data['CP'] ?? NULL;
        $ville = $data['ville'] ?? NULL;

        $contact = new Contact();
        $contact->setAntenneEnea($entreprise->getAntenneEnea());
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
    public function createEntreprise($data)
    {

        $antenne = $data['antenne'];
        $nom = $data['nom'];
        $adresse = $data['adresse'] ?? NULL;
        $CP = $data['CP'] ?? NULL;
        $ville = $data['ville'] ?? NULL;

        $arrayCat = [
            'C' => CatEntreprise::C,
            'P' => CatEntreprise::P,
            'F' => CatEntreprise::F,
            'ET' => CatEntreprise::ET,

        ];

        $categorie = $arrayCat[$data['cat']];


        $entreprise = new Entreprise();
        $entreprise->setAntenneEnea($antenne);
        $entreprise->setNom($nom);
        $entreprise->setAdresse($adresse);
        $entreprise->setCp($CP);
        $entreprise->setVille($ville);
        $entreprise->setCategorie($categorie);


        $this->entityManager->persist($entreprise);
        $this->entityManager->flush();

        // Retourner une réponse de succès
        return true;
    }

    public function updateContact($data)
    {

       
        $sexe = ($data['sexe'] === 'M') ? Sexe::M : Sexe::F;
        $nom = $data['nom'];
        $prenom = ($data['prenom'] === "null" ? NULL : $data['prenom']);
        $entreprise = $this->entrepriseRepository->findOneby(['nom' => trim($data['entreprise'])]);
        $fonction = $data['fonction'];
        $tel1
            = ($data['tel1'] === "null" ? NULL : $data['tel1']);
        $tel2
            = ($data['tel2'] === "null" ? NULL : $data['tel2']);
        $mail1
            = ($data['mail1'] === "null" ? NULL : $data['mail1']);
        $mail2 = ($data['mail2'] === "null" ? NULL : $data['mail2']);
        $adresse = ($data['adresse'] === "null" ? NULL : $data['adresse']);
        $CP = ($data['CP'] === "null" ? NULL : $data['CP']);
        $ville = ($data['ville'] === "null" ? NULL : $data['ville']);
        $id = $data['id'];

        $contact = $this->contactRepository->find($id);
        $contact->setAntenneEnea($entreprise->getAntenneEnea());
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

    public function updateEntreprise($data)
    {

        $arrayCat = [
            'Client' => CatEntreprise::C,
            'Prospect' => CatEntreprise::P,
            'Fournisseur' => CatEntreprise::F,
            'EneaTelecom' => CatEntreprise::ET,

        ];

        $antenne = $data['antenne'];
        $nom = $data['nom'];
        $adresse =  $data['adresse'];
        $CP =  $data['CP'];
        $ville =  $data['ville'];

        $id = $data['id'];

        $entreprise = $this->entrepriseRepository->find($id);
        $entreprise->setAntenneEnea($antenne);
        $entreprise->setNom($nom);

        $entreprise->setCategorie($arrayCat[$data['cat']]);
        $entreprise->setAdresse($adresse);
        $entreprise->setCp($CP);
        $entreprise->setVille($ville);


        $this->entityManager->persist($entreprise);
        $this->entityManager->flush();


        // Retourner une réponse de succès
        return true;
    }




    public function changeContact(int $projet_id, int $contact_id): bool
    {
        $offre = $this->projetRepository->find($projet_id);
        $contact = $this->contactRepository->find($contact_id);

        if (!$offre) {
            return false; // L'entité n'existe pas
        }

        $offre->setContact($contact);

        try {
            $this->entityManager->persist($offre);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            return false; // Échec
        }
        return true;
    }

    public function changeStatut(int $projet_id, string $statut): bool
    {
        $offre = $this->projetRepository->find($projet_id);


        if (!$offre) {
            return false; // L'entité n'existe pas
        }

        $offre->setStatut($statut);

        try {
            $this->entityManager->persist($offre);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            return false; // Échec
        }
        return true;
    }
    public function changeDateEtape(int $projet_id, string $date): bool
    {
        $offre = $this->projetRepository->find($projet_id);


        if (!$offre) {
            return false; // L'entité n'existe pas
        }

        if (empty($date) || $date === "null") {
            $offre->setDateEtape(null);
        } else {
            $date = new DateTime($date);
            $offre->setDateEtape($date);
        }

        try {
            $this->entityManager->persist($offre);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            return false; // Échec
        }
        return true;
    }

  
}