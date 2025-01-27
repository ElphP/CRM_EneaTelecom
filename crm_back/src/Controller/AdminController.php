<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Repository\ContactRepository;
use App\Repository\UserRepository;
use App\Repository\EntrepriseRepository;
use Doctrine\ORM\EntityManagerInterface;

use App\Repository\ProjetRepository;
use Symfony\Component\HttpFoundation\Request;
use App\Services\AdminService;
use App\Service\FileUpLoader;
use App\Repository\DocumentRepository;

class AdminController extends AbstractController
{



    // Injections dans le constructeur
    public function __construct(
        private ContactRepository $contactRepository,
        private UserRepository $userRepository,
        private EntrepriseRepository $entrepriseRepository,
        private AdminService $adminService,
        private ProjetRepository $projetRepository,
        private FileUpLoader $FileUpLoader,
        private DocumentRepository $documentRepository,
        private EntityManagerInterface $entityManager,

    ) {
        $this->contactRepository = $contactRepository;
        $this->userRepository = $userRepository;
        $this->entrepriseRepository = $entrepriseRepository;
        $this->adminService = $adminService;
        $this->projetRepository = $projetRepository;
        $this->documentRepository = $documentRepository;
        $this->FileUpLoader = $FileUpLoader;
        $this->entityManager = $entityManager;
    }


    #[Route('api/admin/{content}', name: 'app_admin_content', methods: ['GET'])]
    #[isGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits pour accéder à cette page')]
    public function getAdminData(string $content, Request $request): JsonResponse
    {

        if ($content === "dashboard") {
            $data = [
                'offresOut' => $this->projetRepository->countAllProjetsByStatuts(["OA", "OP"]),
                'offresIn' => $this->projetRepository->countAllProjetsByStatuts(["EC", "AR"]),
                'projetsIn' => $this->projetRepository->countAllProjetsByStatuts(["OG", "PR"]),
                'projetsOut' => $this->projetRepository->countAllProjetsByStatuts(["PA"]),
                'nbreDERetard' => $this->projetRepository->countProjetsRetard(),
                'listProjetsRetard' => $this->projetRepository->listProjetsRetard(),
            ];
            return new JsonResponse([
                $data,

            ], 200);
        }

        // *contenu entreprises
        else if ($content === "entreprise") {
            try {
                $entreprises = $this->entrepriseRepository->findBy([], ['nom' => 'ASC']);


                $data = [];
                foreach ($entreprises as $entreprise) {
                    $data[] = [
                        'id' => $entreprise->getId(),
                        'nom' => $entreprise->getNom(),
                        'cat' => $entreprise->getCategorie(),
                        'antenne_enea' => $entreprise->getAntenneEnea(),

                        'adresse' => $entreprise->getAdresse(),
                        'CP' => $entreprise->getCp(),
                        'ville' => $entreprise->getVille(),
                        'nbrContact' => count($entreprise->getContact()),
                        'nbrOffre' => $this->projetRepository->countProjetsByStatut($entreprise, ["EC", "OA", "OP", "AR"]),
                        'nbrProjet' =>
                        $this->projetRepository->countProjetsByStatut($entreprise, ["OG", "PR", "PA"]),
                        'nbrUser' => count($entreprise->getUser()),
                    ];
                }
            } catch (\Exception $e) {
                return new JsonResponse([
                    'success' => false,
                    'error' => $e->getMessage()
                ], 500);
            }
            return new JsonResponse($data, 200);
        }

        // * Contenu Contacts
        else if ($content === "contact") {

            try {
                $ent = $request->query->get('ent', 'All');
                $ant = $request->query->get('ant', 'All');

                // Récupérer  les entrées de la table 'contact'
                if ($ent === "All" && $ant === "All") {
                    $contacts = $this->contactRepository->findBy([], ['nom' => 'ASC']);
                } else if ($ent === 'All' && $ant !== 'All') {
                    $contacts = $this->adminService->findAllAntenneEnea($ant);
                } else if ($ent !== 'All' && $ant === 'All') {
                    $contacts = $this->adminService->findAllEntreprise($ent);
                } else {
                    $contacts = $this->adminService->findEntrepriseAntenneEnea($ant, $ent);
                }


                // Convertir les objets Contact en un tableau associatif
                $data = [];

                // ?à changer par une jointure si besoin (->permettrait de récupérer le mail de connexion) 
                foreach ($contacts as $contact) {



                    $data[] = [
                        'id' => $contact->getId(),
                        'entreprise' => $contact->getEntreprise()->getNom(),
                        'nom' => $contact->getNom(),
                        'prenom' => $contact->getPrenom(),
                        'sexe' => $contact->getSexe(),
                        'fonction' => $contact->getFonction(),
                        'antenne_enea' => $contact->getAntenneEnea(),
                        'tel1' => $contact->getTel1(),
                        'tel2' => $contact->getTel2(),

                        'mail1' => $contact->getMail1(),
                        'mail2' => $contact->getMail2(),

                        'adresse' => $contact->getAdresse(),
                        'CP' => $contact->getCp(),
                        'ville' => $contact->getVille(),
                    ];
                }
            } catch (\Exception $e) {
                return new JsonResponse([
                    'success' => false,
                    'error' => $e->getMessage()
                ], 500);
            }
            // Retourner la réponse  avec un code HTTP 200
            return new JsonResponse($data, 200);
        }

        //* Contenu Offres
        // !projets et offres sont la même entité, mais avec seulement des statuts différents -> refactorisation à envisager...
        else if ($content === "offre") {

            try {
                $statuts =  ['EC', 'OA', 'OP', 'AR']; // Récupérer les statuts depuis la requête
                $orderBy = $request->query->get('order', 'id');                   // Colonne de tri par défaut
                $direction = $request->query->get('direction', 'ASC');

                $offres = $this->projetRepository->projetsByStatuts($statuts, $orderBy, $direction);
            } catch (\Exception $e) {
                return new JsonResponse([
                    'success' => false,
                    'error' => $e->getMessage()
                ], 500);
            }
            $data = [];

            foreach ($offres as $offre) {

                $data[] = [
                    'id' => $offre->getid(),
                    'nom' => $offre->getNom(),
                    'statut' => $offre->getStatut(),
                    'entreprise' => $offre->getEntreprise()->getNom(),
                    'contactNom' => $offre->getcontact()->getNom(),
                    'contactPrenom' => $offre->getcontact()->getPrenom(),
                    'contactId' => $offre->getContact()->getId(),
                    'contactSexe' => $offre->getcontact()->getSexe(),
                    'dateEtape' => $offre->getDateEtape()
                ];
            }
            return new JsonResponse($data, 200);
        } else if ($content === "projet") {

            try {
                $statuts =  ['OG', 'PR', 'PA']; // Récupérer les statuts depuis la requête
                $orderBy = $request->query->get('order', 'id');                   // Colonne de tri par défaut
                $direction = $request->query->get('direction', 'ASC');

                $projets = $this->projetRepository->projetsByStatuts($statuts, $orderBy, $direction);
            } catch (\Exception $e) {
                return new JsonResponse([
                    'success' => false,
                    'error' => $e->getMessage()
                ], 500);
            }
            $data = [];

            foreach ($projets as $projet) {

                $data[] = [
                    'id' => $projet->getid(),
                    'nom' => $projet->getNom(),
                    'statut' => $projet->getStatut(),
                    'entreprise' => $projet->getEntreprise()->getNom(),
                    'contactNom' => $projet->getcontact()->getNom(),
                    'contactPrenom' => $projet->getcontact()->getPrenom(),
                    'contactId' => $projet->getContact()->getId(),
                    'contactSexe' => $projet->getcontact()->getSexe(),
                    'dateEtape' => $projet->getDateEtape()
                ];
            }
            return new JsonResponse($data, 200);
        }
    }

    #[Route('api/admin/offre/fetchContactByOffre', name: 'app_admin_contactByoffre', methods: ['POST'])]
    #[isGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits pour accéder à cette page')]
    public function getContactByOfffre(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $listContact = $this->contactRepository->findContactsByOffreId((int)$data["projet_id"]);


        return new JsonResponse(
            [
                'message' => 'Liste de contacts de l\'entreprise concernée par l\'offre',
                'content' => $listContact,
            ],
            200
        );
    }

    #[Route('api/admin/{content}/delete', name: 'app_admin_delete', methods: ['DELETE'])]
    #[isGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits pour accéder à cette page')]
    public function delete(string $content, Request $request): JsonResponse
    {
        if ($content === "contact") {
            $data = json_decode($request->getContent(), true);
            // si undefined force à null
            $contact_id = $data['contact_id'] ?? null;

            if (!$contact_id) {
                return new JsonResponse(['message' => 'Cet id Contact n\'existe pas.'], 404);
            }
            // Vérifier le nombre de projets associés au contact en utilisant l'id du contact
            $projectCount = $this->projetRepository->count(['contact' => $contact_id]);

            if ($projectCount > 0) {
                // Si des projets sont liés à ce contact, renvoyer un message d'erreur explicite
                return new JsonResponse([
                    'message' => 'Ce contact est référent dans ' . $projectCount . " offre(s)/projet(s). Vous ne pouvez pas le supprimer!",
                    'error_code' => 'CONTACT_HAS_PROJECTS'
                ], 400);
            }


            $contactBool = $this->adminService->deleteContact($contact_id);

            if (!$contactBool) {
                return new JsonResponse(['message' => 'Ce contact n\'existe pas'], 404);
            }
            return new JsonResponse(['status' => 'Le contact a bien été supprimé.'], 200);
        }
        if ($content === "entreprise") {

            $data = json_decode($request->getContent(), true);
            // si undefined force à null
            $entreprise_id = $data['entreprise_id'] ?? null;


            if (!$entreprise_id) {
                return new JsonResponse(['message' => 'Cet id Entreprise  n\'existe pas.'], 404);
            }
            $entrepriseBool = $this->adminService->deleteEntreprise($entreprise_id);

            if (!$entrepriseBool) {
                return new JsonResponse(['message' => 'Cette  entreprise n\'existe pas.'], 404);
            }
            return new JsonResponse(['status' => 'L\'entreprise a bien été supprimée.'], 200);
        }
    }
    #[Route('api/admin/{content}/create', name: 'app_admin_create', methods: ['POST'])]
    #[isGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits pour accéder à cette page')]
    public function create(string $content, Request $request): JsonResponse
    {
        if ($content === "contact") {
            $data = $request->request->all();
            // return new JsonResponse(['message' => $data], 200);
            if (!$data) {
                return new JsonResponse(['message' => 'Requête non correcte'], 400);
            }
            $contact = $this->adminService->createContact($data);

            if (!$contact) {
                return new JsonResponse(['message' => 'Le contact n\'a pas pu être créé.'], 500);
            }
            return new JsonResponse(['message' => 'Le contact a bien été créé'], 200);
        }
        if ($content === "entreprise") {
            $data = $request->request->all();

            if (!$data) {
                return new JsonResponse(['message' => 'Requête non correcte'], 400);
            }
            $entreprise = $this->adminService->createEntreprise($data);

            if (!$entreprise) {
                return new JsonResponse(['message' => 'L\'entreprise n\'a pas pu être créé.'], 500);
            }
            return new JsonResponse(['message' => 'L\'entreprise a bien été créée'], 200);
        }
    }


    #[Route('api/admin/{content}/update', name: 'app_admin_update', methods: ['POST'])]
    #[isGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits pour accéder à cette page')]
    public function update(string $content, Request $request): JsonResponse
    {
        if ($content === "contact") {
            $data = $request->request->all();


            if (!$data) {
                return new JsonResponse(['message' => 'Mauvaise requête'], 400);
            }
            $contact = $this->adminService->updateContact($data);

            if (!$contact) {
                return new JsonResponse(['message' => 'Le contact n\'a pas pu être modifié.'], 500);
            }
            return new JsonResponse(['message' => 'Le contact a bien été modifié'], 200);
        }

        if ($content === "entreprise") {
            $data = $request->request->all();


            if (!$data) {
                return new JsonResponse(['message' => 'Mauvaise requête'], 400);
            }
            $entreprise = $this->adminService->updateEntreprise($data);

            if (!$entreprise) {
                return new JsonResponse(['message' => 'L\'entreprise n\'a pas pu être modifié.'], 500);
            }
            return new JsonResponse(['message' => 'L\'entreprise a bien été modifiée.'], 200);
        }

        if ($content === "offre" || $content === "projet") {
            $data = $request->getContent();
            $data = json_decode($data, true);
            if (!$data) {
                return new JsonResponse(['message' => 'Mauvaise requête'], 400);
            }
            if ($data['content'] === "updateReferent") {
                if (!$this->adminService->changeContact($data['projet_id'], $data['data'])) {

                    return new JsonResponse(['message' => 'Le contact n\'a pas pu être modifié pour le projet.'], 500);
                }
                return new JsonResponse(['message' => 'Le contact a bien été modifié pour le projet.'], 200);
            } elseif ($data['content'] === "updateStatut") {
                if (!$this->adminService->changeStatut($data['projet_id'], $data['data'])) {

                    return new JsonResponse(['message' => 'Le statut n\'a pas pu être modifié pour le projet.'], 500);
                }
                return new JsonResponse(['message' => 'Le statut a bien été modifié pour le projet.'], 200);
            } elseif ($data['content'] === "updateDateEtape") {

                if (!$this->adminService->changeDateEtape($data['projet_id'], $data['data'])) {
                    return new JsonResponse(['message' => 'La DateEtape n\'a pas pu être modifié pour le projet.'], 500);
                }
                return new JsonResponse(['message' => 'La DateEtape a bien été modifiée pour le projet.'], 200);
            }
        }
    }

    #[Route('api/admin/infosProjet/{id}', name: 'app_admin_infosProjet', methods: ['GET'])]
    #[isGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits pour accéder à cette page')]
    public function retrieveInfosProjet(int $id): JsonResponse
    {
        
        $projet = $this->projetRepository->findInfosProjet($id);
        $dataInfosProjet = [
            'id' => $projet->getId(),
            'nom' => $projet->getNom(),
            'statut' => $projet->getStatut(),
            'date_etape' => $projet->getDateEtape(),
            'objectif' => $projet->getObjectif(),
            'numero_contrat' => $projet->getNumeroContrat(),
            'description' => $projet->getDescription(),
            'dateCreation' => $projet->getDateCreation(),
            'dateDebPrev' => $projet->getDateDebPrev(),
            'dateFinPrev' => $projet->getDateFinPrev(),
            'dateDebReel' => $projet->getDateDebReel(),
            'dateFinReel' => $projet->getDateFinReel(),
            'entreprise' => $projet->getEntreprise()->getNom(),
            'antenneEnea' =>
            $projet->getEntreprise()->getAntenneEnea(),
            'documents'=>$projet->getDocuments(),
            'contact' => [
                'id' => $projet->getContact()->getId(),
                'nom' => $projet->getContact()->getNom(),
                'prenom' => $projet->getContact()->getPrenom(),
                'sexe' => $projet->getContact()->getSexe(),
                'fonction' => $projet->getContact()->getFonction(),
                'tel' => $projet->getContact()->getTel1(),
                'mail' => $projet->getContact()->getMail1(),
                'adresse' => $projet->getContact()->getAdresse(),
                'CP' => $projet->getContact()->getCP(),
                'ville' => $projet->getContact()->getVille(),
            ],
            'CRMUsers' => array_map(function ($user) {
                return [

                    'nom' => $user->getContact()->getNom(),
                    'prenom' => $user->getContact()->getPrenom(),
                    'role' => $user->getRoles(),
                ];
            }
            ,
             $projet->getUser()->toArray()),
            'documents' => array_map(function ($documents) {
                return [
                    'nom' => $documents->getNom(),                
                ];
            }
            ,
             $projet->getDocuments()->toArray()),

        ];

        if (!$id) {
            return new JsonResponse(['message' => 'Requête non correcte'], 400);
        } else {

            return new JsonResponse($dataInfosProjet, 200);;
        }
    }

    #[Route('/api/admin/contactsByEntrepriseId/{id}', name: 'app_admin_contactsByEntrepiseId', methods: ['GET'])]
    #[isGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits pour accéder à cette page')]
    public function retrieveContactsByEntrerpriseId($id): JsonResponse
    {
        if (!$id) {
            return new JsonResponse(['message' => 'Requête non correcte'], 400);
        } else {

            $contacts = $this->contactRepository->findContactsByEntrepriseId($id);
            return new JsonResponse($contacts, 200);
        }
    }

    // route pour la création d'une offre (admin)
    #[Route('api/createOffre', name: 'api_createOffre', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour télécharger des fichiers')]

    public function uploadCreateoffre(Request $request): JsonResponse
    {

        $user = $this->getUser();
        $nom = $request->request->get('nom');
        $file = $request->files->get('file');
        $typeCreate =
            $request->request->get('type');

        $date_etape =
            $request->request->get('date_etape');

        if (!$file) {
            return new JsonResponse(['error' => 'Un premier document est obligatoire pour créer une offre (devis, offre commerciale...)'], 400);
        }

        if (!$nom) {
            return new JsonResponse(['error' => 'Le nom de l\'offre à créer est manquant.'], 400);
        }
        if ($typeCreate !== "form1"  && $typeCreate !== "form2") {
            return new JsonResponse(['error' => 'Vous devez choisir entre "Entreprise déjà enregistrée?" et "Nouvelle entreprise?"'], 400);
        }
        if ($typeCreate === "form1") {
            $entrepriseId =
                $request->request->get('entrepriseId');
            $contactId =
                $request->request->get('contactId');
            if ($contactId === "" || $contactId === "choix" || $entrepriseId === "" || $entrepriseId === "choix") {
                return new JsonResponse(['error' => 'Pour créer l\'offre à l\'aide de ce formulaire vous devez choisir une entreprise et un contact associé existants!'], 400);
            }

            try {
                $projet = $this->projetRepository->createOffre($nom, $date_etape, $this->entrepriseRepository->find($entrepriseId), $this->contactRepository->find($contactId), $user);
                
                if(!$this->FileUpLoader->upload($file, $projet))  {
                    // Si le fichier ne peut être uploader : Supprimer le projet
                    $this->entityManager->remove($projet);
                    // Appliquer la suppression
                    $this->entityManager->flush();
                };
            } catch (\Exception $e) {
                return new JsonResponse(['error' => 'Erreur lors de la création de l\'offre: ' . $e->getMessage()], 500);
            }
            return new JsonResponse(['status' => 'Le fichier  a été uploadé et chargé avec succès. L\'offre a bien été créée'], 200);
        }
        //vérifiaction d'un doublon sur le nom pour un projet donné
        // $existingFileNamesList = $this->documentRepository->findDocumentNamesByProjetId($projetId);
        // if (in_array($nom, $existingFileNamesList)) {
        //     return new JsonResponse(['error' => 'Un fichier du même nom existe déjà dans la Base de données pour ce projet!'], 409);
        // }

    }
}