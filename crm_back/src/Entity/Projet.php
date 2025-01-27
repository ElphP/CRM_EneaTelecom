<?php

namespace App\Entity;

use App\Repository\ProjetRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProjetRepository::class)]
class Projet
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 70)]
    private ?string $statut = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_etape = null;

    #[ORM\Column(length: 70, nullable: true)]
    private ?string $type = null;

    #[ORM\Column(length: 70, nullable: true)]
    private ?string $numero_contrat = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $objectif = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $date_creation = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_deb_prev = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_fin_prev = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_deb_reel = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_fin_reel = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'projets')]
    private Collection $users;

    #[ORM\ManyToOne( inversedBy: 'projets')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Entreprise $entreprise = null;

    /**
     * @var Collection<int, Interaction>
     */
    #[ORM\OneToMany(targetEntity: Interaction::class, mappedBy: 'projet', orphanRemoval: true)]
    private Collection $interactions;

    #[ORM\ManyToOne(targetEntity: Contact::class, inversedBy: 'projets')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Contact $contact = null;

    /**
     * @var Collection<int, Document>
     */
    #[ORM\OneToMany(targetEntity: Document::class, mappedBy: 'projet')]
    private Collection $documents;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->interactions = new ArrayCollection();
        $this->documents = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

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

    public function getDateEtape(): ?\DateTimeInterface
    {
        return $this->date_etape;
    }

    public function setDateEtape(?\DateTimeInterface $date_etape): static
    {
        $this->date_etape = $date_etape;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getNumeroContrat(): ?string
    {
        return $this->numero_contrat;
    }

    public function setNumeroContrat(?string $numero_contrat): static
    {
        $this->numero_contrat = $numero_contrat;

        return $this;
    }

    public function getObjectif(): ?string
    {
        return $this->objectif;
    }

    public function setObjectif(?string $objectif): static
    {
        $this->objectif = $objectif;

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

    public function getDateCreation(): ?\DateTimeInterface
    {
        return $this->date_creation;
    }

    public function setDateCreation(\DateTimeInterface $date_creation): static
    {
        $this->date_creation = $date_creation;

        return $this;
    }

    public function getDateDebPrev(): ?\DateTimeInterface
    {
        return $this->date_deb_prev;
    }

    public function setDateDebPrev(?\DateTimeInterface $date_deb_prev): static
    {
        $this->date_deb_prev = $date_deb_prev;

        return $this;
    }

    public function getDateFinPrev(): ?\DateTimeInterface
    {
        return $this->date_fin_prev;
    }

    public function setDateFinPrev(?\DateTimeInterface $date_fin_prev): static
    {
        $this->date_fin_prev = $date_fin_prev;

        return $this;
    }

    public function getDateDebReel(): ?\DateTimeInterface
    {
        return $this->date_deb_reel;
    }

    public function setDateDebReel(?\DateTimeInterface $date_deb_reel): static
    {
        $this->date_deb_reel = $date_deb_reel;

        return $this;
    }

    public function getDateFinReel(): ?\DateTimeInterface
    {
        return $this->date_fin_reel;
    }

    public function setDateFinReel(?\DateTimeInterface $date_fin_reel): static
    {
        $this->date_fin_reel = $date_fin_reel;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUser(): Collection
    {
        return $this->users;
    }

    public function addUser(User $User): static
    {
        if (!$this->users->contains($User)) {
            $this->users->add($User);
            $User->addProjets($this);
        }

        return $this;
    }

    public function removeUser(User $User): static
    {
        if ($this->users->removeElement($User)) {
            $User->removeProjets($this);
        }

        return $this;
    }

    public function getEntreprise(): ?Entreprise
    {
        return $this->entreprise;
    }

    public function setEntreprise(?Entreprise $entreprise): static
    {
        $this->entreprise = $entreprise;

        return $this;
    }

    /**
     * @return Collection<int, Interaction>
     */
    public function getInteractions(): Collection
    {
        return $this->interactions;
    }

    public function addInteraction(Interaction $Interaction): static
    {
        if (!$this->interactions->contains($Interaction)) {
            $this->interactions->add($Interaction);
            $Interaction->setProjet($this);
        }

        return $this;
    }

    public function removeInteraction(Interaction $Interaction): static
    {
        if ($this->interactions->removeElement($Interaction)) {
            // set the owning side to null (unless already changed)
            if ($Interaction->getProjet() === $this) {
                $Interaction->setProjet(null);
            }
        }

        return $this;
    }

    public function getContact(): ?Contact
    {
        return $this->contact;
    }

    public function setContact(?Contact $contact): static
    {
        $this->contact = $contact;

        return $this;
    }

    /**
     * @return Collection<int, Document>
     */
    public function getDocuments(): Collection
    {
        return $this->documents;
    }

    public function addDocument(Document $document): static
    {
        if (!$this->documents->contains($document)) {
            $this->documents->add($document);
            $document->setProjet($this);
        }

        return $this;
    }

    public function removeDocument(Document $document): static
    {
        if ($this->documents->removeElement($document)) {
            // set the owning side to null (unless already changed)
            if ($document->getProjet() === $this) {
                $document->setProjet(null);
            }
        }

        return $this;
    }
}