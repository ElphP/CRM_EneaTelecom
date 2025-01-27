<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Repository\UserRepository;
use App\Services\UserService;
class UserController extends AbstractController
{

    // Injections dans le constructeur
    public function __construct(
       
        private UserRepository $userRepository,
        private UserService $userService,

    ) {
        
        $this->userRepository = $userRepository;
        $this->userService = $userService;
    }

    #[Route('/api/connexion/info', name: 'user_info', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits pour accéder à cette page')]
    public function userInfo(): JsonResponse
    {
        try {
            $data = [];
            $user = $this->getUser();
            $emailConnected = $this->userRepository->find($user)->getUserName();
            $contact = $this->userService->findIdentityUser($emailConnected);
            $data[] = [
                'nom' => $contact->getNom(),
                'prenom' => $contact->getPrenom(),
            ];
        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }

        return new JsonResponse(

            $data,
            200
        );
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