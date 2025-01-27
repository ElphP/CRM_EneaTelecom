<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use App\Entity\Document;
use App\Entity\Projet;


use Doctrine\ORM\EntityManagerInterface;
use DateTime;

class FileUpLoader
{

    private $privateDirectory;
    private $entityManager;


    // Constante pour les extensions acceptées
    private const ALLOWED_EXTENSIONS = ['pdf'];


    public function __construct(string $privateDirectory, EntityManagerInterface $entityManager)
    {
        $this->privateDirectory = $privateDirectory;
        $this->entityManager = $entityManager;
    }



    public function upload(UploadedFile $file, Projet $projet): ?string
    {
        try {
            // Vérifier si le répertoire existe, sinon le créer
            if (!is_dir($this->privateDirectory)) {
                if (!mkdir($this->privateDirectory, 0777, true) && !is_dir($this->privateDirectory)) {
                    throw new \Exception('Impossible de créer le répertoire : ' . $this->privateDirectory);
                return false;
                }
               
            }

            // Vérification de la taille du fichier
            if ($file->getSize() > 5000000) { // Limite de 5 Mo
                throw new \Exception('Le fichier est trop volumineux.');
               return false;
            }

            // Vérification du type MIME
            $mimeType = $file->getMimeType();
            if (!in_array($mimeType, ['application/pdf'])) {
                throw new \Exception('Le fichier doit être un PDF.');
              return false;
            }

            // Configuration pour l'upload
            $uploadDirectory = $this->privateDirectory;
            $fileExtension = strtolower($file->guessExtension());
            $fileName = uniqid() . '.' . $fileExtension;

            // Vérification de l'extension
            if (!in_array($fileExtension, self::ALLOWED_EXTENSIONS)) {
                throw new \Exception('Extension de fichier non autorisée.');
                return false;
            }

            // Déplacement du fichier vers le répertoire d'upload
            $file->move($uploadDirectory, $fileName);

            // Création de l'entité Document
            $document = new Document();
            $document->setNom($file->getClientOriginalName());
            $document->setFormat($fileExtension);
            $document->setPath($fileName);
            $document->setprojet($projet);
            $document->setUploadDate(new DateTime());

            // Sauvegarde dans la base de données
            $this->entityManager->persist($document);
            $this->entityManager->flush();

            return true; // Succès, on retourne le nom du fichier
            // sinon lève et envoie l'exception au controller
        } catch (\Exception $e) {
         
           
            return false;
        }
    }

    public function removeUpLoadedFile($existingFile): bool
    {
        // on supprime le fichier
        $path = $existingFile->getPath();
        if (!$path) {
            return false;
        }
        // Construction du chemin complet
        $filePath = $this->privateDirectory . DIRECTORY_SEPARATOR . $path;

        // Vérification et suppression: unlink
        if (unlink($filePath)) {
            // Suppression de l'entrée dans la BDD
            $this->entityManager->remove($existingFile);
            $this->entityManager->flush();
            return true;
        } else return false;
    }



    public function getPrivateDirectory(): string
    {
        return $this->privateDirectory;
    }
}