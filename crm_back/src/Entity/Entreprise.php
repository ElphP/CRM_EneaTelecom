<?php

namespace App\Entity;

use App\Enum\CatEntreprise;
use App\Repository\EntrepriseRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EntrepriseRepository::class)]
class Entreprise
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $adresse = null;

    #[ORM\Column(length: 10, nullable: true)]
    private ?string $cp = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $ville = null;

    #[ORM\Column(length:10, nullable: true)]
    private ?string $antenne_enea = null;

    #[ORM\Column(type: Types::STRING, enumType: CatEntreprise::class)]
    private ?CatEntreprise $categorie = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\OneToMany(targetEntity: User::class, mappedBy: 'entreprise', cascade: ["remove"])]
    private Collection $users;

    /**
     * @var Collection<int, Contact>
     */
    #[ORM\OneToMany(targetEntity: Contact::class, mappedBy: 'entreprise', cascade:["remove"])]
    private Collection $contacts;

    /**
     * @var Collection<int, Projet>
     */
    #[ORM\OneToMany(targetEntity: Projet::class, mappedBy: 'entreprise', cascade: ["remove"])]
    private Collection $projets;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->contacts = new ArrayCollection();
        $this->projets = new ArrayCollection();
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

    public function getAntenneEnea(): ?string
    {
        return $this->antenne_enea;
    }

    public function setAntenneEnea(string $antenne_enea): static
    {
        $this->antenne_enea = $antenne_enea;

        return $this;
    }

    /**
     * @return CatEntreprise[]
     */
    public function getCategorie(): ?CatEntreprise
    {
        return $this->categorie;
    }

    public function setCategorie(CatEntreprise $categorie): self
    {
        $this->categorie = $categorie;

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
            $User->setEntreprise($this);
        }

        return $this;
    }

    public function removeUser(User $User): static
    {
        if ($this->users->removeElement($User)) {
            // set the owning side to null (unless already changed)
            if ($User->getEntreprise() === $this) {
                $User->setEntreprise(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Contact>
     */
    public function getContact(): Collection
    {
        return $this->contacts;
    }

    public function addContact(Contact $Contact): static
    {
        if (!$this->contacts->contains($Contact)) {
            $this->contacts->add($Contact);
            $Contact->setEntreprise($this);
        }

        return $this;
    }

    public function removeContact(Contact $Contact): static
    {
        if ($this->contacts->removeElement($Contact)) {
            // set the owning side to null (unless already changed)
            if ($Contact->getEntreprise() === $this) {
                $Contact->setEntreprise(null);
            }
        }

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
            $Projet->setEntreprise($this);
        }

        return $this;
    }

    public function removeProjet(Projet $Projet): static
    {
        if ($this->projets->removeElement($Projet)) {
            // set the owning side to null (unless already changed)
            if ($Projet->getEntreprise() === $this) {
                $Projet->setEntreprise(null);
            }
        }

        return $this;
    }
}