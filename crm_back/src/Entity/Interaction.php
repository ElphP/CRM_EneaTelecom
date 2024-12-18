<?php

namespace App\Entity;

use App\Repository\InteractionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InteractionRepository::class)]
class Interaction
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $type = null;

    #[ORM\Column(length: 255)]
    private ?string $sujet = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $date_heure = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 70)]
    private ?string $statut = null;

    /**
     * @var Collection<int, Contact>
     */
    #[ORM\ManyToMany(targetEntity: Contact::class, mappedBy: 'interactions')]
    private Collection $contacts;

    #[ORM\ManyToOne(targetEntity: Projet::class, inversedBy: 'interactions')]
    #[ORM\JoinColumn(name: 'projet_id', referencedColumnName: 'id', nullable: false)]
    private ?Projet $projet = null;

    public function __construct()
    {
        $this->contacts = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getSujet(): ?string
    {
        return $this->sujet;
    }

    public function setSujet(string $sujet): static
    {
        $this->sujet = $sujet;

        return $this;
    }

    public function getDateHeure(): ?\DateTimeInterface
    {
        return $this->date_heure;
    }

    public function setDateHeure(\DateTimeInterface $date_heure): static
    {
        $this->date_heure = $date_heure;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(string $statut): static
    {
        $this->statut = $statut;

        return $this;
    }

    /**
     * @return Collection<int, Contact>
     */
    public function getInteractionContact(): Collection
    {
        return $this->contacts;
    }

    public function addContact(Contact $Contact): static
    {
        if (!$this->contacts->contains($Contact)) {
            $this->contacts->add($Contact);
            $Contact->addInteraction($this);
        }

        return $this;
    }

    public function removeContact(Contact $Contact): static
    {
        if ($this->contacts->removeElement($Contact)) {
            $Contact->removeInteraction($this);
        }

        return $this;
    }

    public function getProjet(): ?Projet
    {
        return $this->projet;
    }

    public function setProjet(?Projet $projet): static
    {
        $this->projet = $projet;

        return $this;
    }
}