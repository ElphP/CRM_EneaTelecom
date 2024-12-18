<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpKernel\Event\ResponseEvent;


class JWTResponseListener
{
    public function onKernelResponse(ResponseEvent $event): void
    {
        $response = $event->getResponse();
        $request = $event->getRequest();

        // Vérifiez si la réponse contient un JWT
        if (!$response->isSuccessful() || !$request->attributes->get('_route')) {
            return;
        }

        // Récupérer le JWT depuis le body de la réponse JSON (ajustez en fonction de votre implémentation)
        $content = json_decode($response->getContent(), true);
        if (!isset($content['token'])) {
            return; // Pas de JWT à ajouter au cookie
        }
        $jwt = $content['token'];

        // Créer un cookie sécurisé contenant le JWT
        $cookie = Cookie::create('jwt', $jwt)
            ->withHttpOnly(true)
            ->withSecure(true)
            ->withSameSite(Cookie::SAMESITE_NONE)
            ->withPath('/')
            ->withExpires(new \DateTime('+1 hour'));

        // Ajouter le cookie à la réponse
        $response->headers->setCookie($cookie);
    }

}