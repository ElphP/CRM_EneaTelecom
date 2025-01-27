<?php

namespace App\Controller;


use App\Repository\ProjetRepository;
use App\Repository\DocumentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpFoundation\Response;
use App\Service\FileUpLoader;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

class DocumentController extends AbstractController
{
    private $projetRepository;
    private $documentRepository;
    private $entityManager;

    private $FileUpLoader;

    public function __construct(ProjetRepository $projetRepository, DocumentRepository $documentRepository, EntityManagerInterface
    $entityManager, FileUpLoader $FileUpLoader)
    {
        $this->projetRepository = $projetRepository;
        $this->documentRepository = $documentRepository;
        $this->entityManager = $entityManager;
        $this->FileUpLoader = $FileUpLoader;
    }

    // #[Route('api/addDocumentToProjet', name: 'api_addDocumentToProjet', methods: ['POST'])]
    // #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour ajouter des fichiers aux utilisateurs')]
    // public function addDocumentToProjet(Request $request): JsonResponse
    // {
    //     $data = json_decode($request->getContent(), true);
    //     $projetId = $data['projet_id'] ?? null;
    //     $fileId = $data['file_id'] ?? null;

    //     if (!$projetId || !$fileId) {
    //         return new JsonResponse(
    //             ['error' => 'L\'ID du projet concerné et l\'ID du fichier sont requis!'],
    //             400
    //         );
    //     }

    //     $projet = $this->projetRepository->find($projetId);
    //     $file = $this->documentRepository->find($fileId);

    //     if (!$projet) {
    //         return new JsonResponse(['error' => 'Utilisateur non trouvé!'], 404);
    //     }

    //     if (!$file) {
    //         return new JsonResponse(['error' => 'Fichier non trouvé!'], 404);
    //     }

    //     // Ajouter le fichier à l'utilisateur
    //     $projet->addDocument($file);


    //     $this->entityManager->persist($projet);
    //     $this->entityManager->flush();

    //     return new JsonResponse(['status' => 'Fichier ajouté à l\'utilisateur avec succès'], 200);
    // }

    // #[Route('drive_API/removeFileToUser', name: 'drive_API_removeFileToUser', methods: ['DELETE'])]
    // #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour enlever des fichiers aux utilisateurs')]
    // public function removeFileToUser(Request $request): JsonResponse
    // {

    //     $data = json_decode($request->getContent(), true);
    //     $userId = $data['user_id'] ?? null;
    //     $fileId = $data['file_id'] ?? null;


    //     if (!$userId || !$fileId) {
    //         return new JsonResponse(
    //             ['error' => 'L\'ID de l\'utilisateur et l\'ID du fichier sont requis!'],
    //             JsonResponse::HTTP_BAD_REQUEST
    //         );
    //     }

    //     $user = $this->userRepository->find($userId);
    //     $file = $this->documentRepository->find($fileId);

    //     if (!$user) {
    //         return new JsonResponse(['error' => 'Utilisateur non trouvé!'], JsonResponse::HTTP_NOT_FOUND);
    //     }

    //     if (!$file) {
    //         return new JsonResponse(['error' => 'Fichier non trouvé!'], JsonResponse::HTTP_NOT_FOUND);
    //     }


    //     $user->removeFile($file);


    //     $this->entityManager->persist($user);
    //     $this->entityManager->flush();

    //     return new JsonResponse(['status' => 'Fichier enlevé à l\'utilisateur avec succès'], JsonResponse::HTTP_OK);
    // }


    // route pour l'upload de fichiers
    #[Route('api/upload', name: 'api_upLoadFile', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour télécharger des fichiers')]

    public function uploadPrivateFile(Request $request): JsonResponse
    {
        
        
        $nom = $request->request->get('nom');
        $file = $request->files->get('file');
        if (!$file) {
            return new JsonResponse(['error' => 'Aucun fichier fourni'], 400);
        }

        if (!$nom) {
            return new JsonResponse(['error' => 'Le nom du fichier est manquant'], 400);
        }
        // if(!$projetId)  {
        //     return new JsonResponse(['error' => 'L\'Id du projet est manquant'], 400);
        // }
        //vérifiaction d'un doublon sur le nom pour un projet donné
        $existingFileNamesList = $this->documentRepository->findDocumentNamesByProjetId($projetId);
        if (in_array($nom, $existingFileNamesList)) {
            return new JsonResponse(['error' => 'Un fichier du même nom existe déjà dans la Base de données pour ce projet!'], 409);
        }
        try {
            $fileName = $this->FileUpLoader->upload($file, $nom);
           
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors du téléchargement' . $e->getMessage()], 500);
        }
        return new JsonResponse(['status' => 'Le fichier '.$fileName.'a été uploadé et chargé avec succès'], 201);
    }

    // route pour supprimer un fichier
    #[Route('api/deleteFile', name: 'api_deleteFile', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour supprimer des fichiers')]

    public function deletePrivateFile(Request $request): JsonResponse
    {
        // avec la méthode delete, voici la manière de récupérer le JSON dans le body
        $data = json_decode($request->getContent(), true);

        
        $docId = $data['docId'] ?? null;;

        // Vérification des paramètres
        if (
         !$docId
        ) {
            return new JsonResponse(['error' => 'L\'ID du document à effacer est manquant'], 400);
        }
        // recherche du fichier
        $existingFile = $this->documentRepository->findOneBy(['id' => $docId]);
        if (!$existingFile) {
            return new JsonResponse(['error' => 'Ce fichier n\'existe pas dans notre base de donnée'], 404);
        }



        try {
            $removedFileName = $this->FileUpLoader->removeUpLoadedFile($existingFile);
            if (!$removedFileName) {
                return new JsonResponse(['error' => 'Le chemin n\'a pas pu être trouvé pour supprimer le fichier'], Response::HTTP_NOT_FOUND);
            }
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors de la suppression' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(['status' => 'Le document a été supprimé avec succès'], Response::HTTP_OK);
    }

    // // route pour télécharger un fichier depuis l'interface User
    // #[Route('drive_API/downloadFile', name: 'drive_API_downloadFile', methods: ['POST'])]
    // #[IsGranted('ROLE_USER', message: 'Vous n\'avez pas les droits suffisants pour télécharger des fichiers')]
    // public function download(Request $request)
    // {
    //     $data = json_decode($request->getContent(), true);

    //     // Accédez aux valeurs
    //     $nom = $data['nom'] ?? null;
    //     $doc_id = $data['id'] ?? null;

    //     // Vérification des paramètres
    //     if (
    //         !$nom || !$doc_id
    //     ) {
    //         return new JsonResponse(['error' => 'Le nom du fichier et/ou son ID sont manquants'], Response::HTTP_BAD_REQUEST);
    //     }
    //     // recherche du fichier
    //     $existingFile = $this->documentRepository->findOneBy(['nom' => $nom, 'id' => $doc_id]);
    //     if (!$existingFile) {
    //         return new JsonResponse(['error' => 'Ce fichier n\'est pas répertorié dans notre base de donnée'], Response::HTTP_NOT_FOUND);
    //     }
    //     $filePath = $existingFile->getPath();

    //     // Récupérer le paramètre
    //     $privateDirectory = $this->getParameter('upload_directory_private');

    //     $filePathComplete = $privateDirectory . DIRECTORY_SEPARATOR . $filePath;


    //     // Vérification si le fichier existe
    //     if (!file_exists($filePathComplete)) {
    //         return new JsonResponse(['error' => 'Ce fichier n\'existe pas sur notre serveur'], Response::HTTP_NOT_FOUND);
    //     }

    //     // Créer une réponse binaire
    //     $response = new BinaryFileResponse($filePathComplete);

    //     // Configurer les en-têtes de la réponse
    //     $response->headers->set('Content-Type', 'application/pdf');
    //     $response->setContentDisposition(
    //         ResponseHeaderBag::DISPOSITION_ATTACHMENT,
    //         $existingFile->getNom()
    //     );

    //     return $response;
    // }
}