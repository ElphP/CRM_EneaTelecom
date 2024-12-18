<?php

namespace App\Entity;

use App\Enum\Sexe;
use App\Repository\ContactRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ContactRepository::class)]
class Contact
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $prenom = null;

    #[ORM\Column(type: Types::STRING, enumType: Sexe::class)]
    private ?Sexe $sexe = null;

    #[ORM\Column(length: 255)]
    private ?string $fonction = null;

    #[ORM\Column(length: 255)]
    private ?string $antenne_enea = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $tel1 = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $tel2 = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $mail1 = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $mail2 = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $adresse = null;

    #[ORM\Column(length: 10, nullable: true)]
    private ?string $cp = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $ville = null;

    #[ORM\OneToOne(mappedBy: "contact", targetEntity: User::class,cascade: ["persist", "remove"])]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'contacts')]
    #[ORM\JoinColumn(nullable: false)] // La relation est obligatoire
    private Entreprise $entreprise;

    /**
     * @var Collection<int, Interaction>
     */
    #[ORM\ManyToMany(targetEntity: Interaction::class, inversedBy: 'contacts')]
    #[ORM\JoinTable(name: 'contact_interaction')]  // Table d'association entre User et Projet
    #[ORM\JoinColumn(name: 'contact_id', referencedColumnName: 'id')]  // Référence à l'email de l'utilisateur
    #[ORM\InverseJoinColumn(name: 'interaction_id', referencedColumnName: 'id')]  // Référence à l'id du projet 
    private Collection $interactions;

    /**
     * @var Collection<int, Projet>
     */
    #[ORM\OneToMany(targetEntity: Projet::class, mappedBy: 'contact')]
    private Collection $projets;

    public function __construct()
    {
        $this->interactions = new ArrayCollection();
        $this->projets = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
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

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(?string $prenom): static
    {
        $this->prenom = $prenom;

        return $this;
    }

    /**
     * @return Sexe[]
     */
    public function getSexe(): ?Sexe
    {
        return $this->sexe;
    }

    public function setSexe(Sexe $sexe): self
    {
        $this->sexe = $sexe;

        return $this;
    }

    public function getFonction(): ?string
    {
        return $this->fonction;
    }

    public function setFonction(string $fonction): static
    {
        $this->fonction = $fonction;

        return $this;
    }

    public function getAntenneEnea(): ?string
    {
        return $this->antenne_enea;
    }

    public function setAntenneEnea(string $antenne_enea): static
    {
        $this->antenne_enea = $antenne_enea;

        return $this;
    }

    public function getTel1(): ?string
    {
        return $this->tel1;
    }

    public function setTel1(?string $tel1): static
    {
        $this->tel1 = $tel1;

        return $this;
    }

    public function getTel2(): ?string
    {
        return $this->tel2;
    }

    public function setTel2(?string $tel2): static
    {
        $this->tel2 = $tel2;

        return $this;
    }

    public function getMail1(): ?string
    {
        return $this->mail1;
    }

    public function setMail1(?string $mail1): static
    {
        $this->mail1 = $mail1;

        return $this;
    }

    public function getMail2(): ?string
    {
        return $this->mail2;
    }

    public function setMail2(?string $mail2): static
    {
        $this->mail2 = $mail2;

        return $this;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(?string $adresse): static
    {
        $this->adresse = $adresse;

        return $this;
    }

    public function getCp(): ?string
    {
        return $this->cp;
    }

    public function setCp(?string $cp): static
    {
        $this->cp = $cp;

        return $this;
    }

    public function getVille(): ?string
    {
        return $this->ville;
    }

    public function setVille(?string $ville): static
    {
        $this->ville = $ville;

        return $this;
    }

   

    public function setEmail(?User $user): static
    {
        $this->user = $user;

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
    public function getInteraction(): Collection
    {
        return $this->interactions;
    }

    public function addInteraction(Interaction $interaction): static
    {
        if (!$this->interactions->contains($interaction)) {
            $this->interactions->add($interaction);
        }

        return $this;
    }

    public function removeInteraction(Interaction $interaction): static
    {
        $this->interactions->removeElement($interaction);

        return $this;
    }

    /**
     * @return Collection<int, Projet>
     */
    public function getProjets(): Collection
    {
        return $this->projets;
    }

    public function addProjet(Projet $Projet): static
    {
        if (!$this->projets->contains($Projet)) {
            $this->projets->add($Projet);
            $Projet->setContact($this);
        }

        return $this;
    }

    public function removeProjet(Projet $Projet): static
    {
        if ($this->projets->removeElement($Projet)) {
            // set the owning side to null (unless already changed)
            if ($Projet->getContact() === $this) {
                $Projet->setContact(null);
            }
        }

        return $this;
    }
}