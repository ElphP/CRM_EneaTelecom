<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Repository\ContactRepository;
use App\Repository\UserRepository;
use App\Repository\EntrepriseRepository;
use App\Enum\Sexe;

use Symfony\Component\HttpFoundation\Request;
use App\Services\UserService;

class UserController extends AbstractController
{



    // Injections dans le constructeur
    public function __construct(private ContactRepository $contactRepository, private UserRepository $userRepository, private EntrepriseRepository $entrepriseRepository, private UserService $userService)
    {
        $this->contactRepository = $contactRepository;
        $this->userRepository = $userRepository;
        $this->entrepriseRepository = $entrepriseRepository;
        $this->userService = $userService;
    }


    #[Route('api/admin/{content}', name: 'app_admin_content', methods: ['GET'])]
    #[isGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits pour accéder à cette page')]
    public function getAdminData(string $content, Request $request): JsonResponse
    {
        if ($content === "dashboard") {
            return new JsonResponse(
                [
                    'message' => 'Bien arrivé!',
                    'content' => $content,
                ],
                200
            );
        } else if ($content === "societe") {
            return new JsonResponse(
                [
                    'message' => 'Bien arrivé!',
                    'content' => $content,
                ],
                200
            );
        }
        if ($content === "contact") {

            try {
                $ent = $request->query->get('ent', 'All');
                $ant = $request->query->get('ant', 'All');

                // Récupérer toutes les entrées de la table 'contact'
                if ($ent === "All" && $ant === "All") {
                    $contacts = $this->contactRepository->findBy([], ['nom' => 'ASC']);
                } else if ($ent === 'All' && $ant !== 'All') {
                    $contacts = $this->userService->findAllAntenneEnea($ant);
                } else if ($ent !== 'All' && $ant === 'All') {
                    $contacts = $this->userService->findAllEntreprise($ent);
                } else {
                    $contacts = $this->userService->findEntrepriseAntenneEnea($ant, $ent);
                }


                // Convertir les objets Contact en un tableau associatif
                $data = [];

                // ?à changer par une jointure si besoin (->permettrait de récupérer le mail de connexion) 
                foreach ($contacts as $contact) {

                    $entreprise = $contact->getEntreprise();
                    $entreprise = $entreprise ? $entreprise->getNom() : null;

                    $data[] = [
                        'id' => $contact->getId(),
                        'entreprise' => $entreprise,
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
            // Retourner la réponse en JSON avec un code HTTP 200
            return new JsonResponse($data, 200);
        }





        if ($content === "offres") {
            return new JsonResponse(
                [
                    'message' => 'Bien arrivé!',
                    'content' => $content,
                ],
                200
            );
        }

        if ($content === "projets") {
            return new JsonResponse(
                [
                    'message' => 'Bien arrivé!',
                    'content' => $content,
                ],
                200
            );
        }
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
                return new JsonResponse(['message' => 'Cet id n\'existe pas.'], 404);
            }
            $contact = $this->userService->deleteContact($contact_id);
            
            if(!$contact)  {
                return new JsonResponse(['message' => 'Ce contact n\'existe pas'], 404);
            }
            return new JsonResponse(['status' => 'Le contact a bien été supprimé'], 200);
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
            $contact = $this->userService->createContact($data);
            
            if(!$contact)  {
                return new JsonResponse(['message' => 'Le contact n\'a pas pu être créé.'], 500);
            }
            return new JsonResponse(['message' => 'Le contact a bien été créé'], 200);
        }
    }
    
    #[Route('api/admin/{content}/update', name: 'app_admin_update', methods: ['POST'])]
    #[isGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits pour accéder à cette page')]
    public function update(string $content, Request $request): JsonResponse
    {
        if ($content === "contact") {
            $data= $request->request->all();
            
            // return new JsonResponse(['message' => $data], 200);
            if (!$data) {
                return new JsonResponse(['message' => 'Requête non correcte'], 400);
            }
            $contact = $this->userService->updateContact($data);
            
            if(!$contact)  {
                return new JsonResponse(['message' => 'Le contact n\'a pas pu être modifié.'], 500);
            }
            return new JsonResponse(['message' => 'Le contact a bien été modifié'], 200);
        }
    }

    #[Route('api/user', name: 'app_user', methods: ['GET'])]
    #[isGranted('ROLE_USER', message: 'Vous n\'avez pas les doits pour accéder à cette page')]
    public function getUserData(): JsonResponse
    {
        /**
         * @var User $user
         */
        $user = $this->getUser();
        return new JsonResponse(['message' => 'Bien arrivé! ' . $user->getEmail()], 200);
    }
}