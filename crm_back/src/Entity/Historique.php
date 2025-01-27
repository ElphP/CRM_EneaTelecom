<?php

namespace App\Entity;

use App\Repository\HistoriqueRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: HistoriqueRepository::class)]
class Historique
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $typeEntite = null;

    #[ORM\Column]
    private ?int $EntiteId = null;

    #[ORM\Column(length: 50)]
    private ?string $action = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $donnees = null;

    #[ORM\Column(nullable: true)]
    private ?int $userId = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTypeEntite(): ?string
    {
        return $this->typeEntite;
    }

    public function setTypeEntite(string $typeEntite): static
    {
        $this->typeEntite = $typeEntite;

        return $this;
    }

    public function getEntiteId(): ?int
    {
        return $this->EntiteId;
    }

    public function setEntiteId(int $EntiteId): static
    {
        $this->EntiteId = $EntiteId;

        return $this;
    }

    public function getAction(): ?string
    {
        return $this->action;
    }

    public function setAction(string $action): static
    {
        $this->action = $action;

        return $this;
    }

    public function getDonnees(): ?string
    {
        return $this->donnees;
    }

    public function setDonnees(string $donnees): static
    {
        $this->donnees = $donnees;

        return $this;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(?int $userId): static
    {
        $this->userId = $userId;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }
}
