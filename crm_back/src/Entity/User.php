<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{

    // Définition des rôles comme constantes
    const ROLE_ADMIN = 'ROLE_ADMIN';
    const ROLE_USER = 'ROLE_USER';
    const ROLE_CLIENT = 'ROLE_CLIENT';

    #[ORM\Id]
    #[ORM\Column(type: "string", length: 100)]
    private string $email;

    #[ORM\OneToOne(inversedBy: "user", targetEntity: Contact::class, cascade: ["persist", "remove"])]
    #[ORM\JoinColumn(name: "contact_id", referencedColumnName: "id",  nullable:false)]   
    private ?Contact $contact = null;
    
    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $last_login = null;

    #[ORM\ManyToOne(inversedBy:'users')]
    #[ORM\JoinColumn(name: 'entreprise_id', referencedColumnName:'id', nullable: false)]
    private Entreprise $entreprise;

    /**
     * @var Collection<int, Projet>
      */
     #[ORM\ManyToMany(targetEntity: Projet::class, inversedBy: 'users')]
    #[ORM\JoinTable(name: 'user_projet')]  // Table d'association entre User et Projet
    #[ORM\JoinColumn(name: 'user_email', referencedColumnName: 'email')]  // Référence à l'email de l'utilisateur
    #[ORM\InverseJoinColumn(name: 'projet_id', referencedColumnName: 'id')]  // Référence à l'id du projet  
     private Collection $projets;
    
      
    
    public function __construct()
    {
        $this->projets = new ArrayCollection();
    }

    // public function getId(): ?int
    // {
    //     return $this->id;
    // }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }


    /**
     * Méthode getUsername qui permet de retourner le champ qui est utilisé pour l'authentification.
     *
     * @return string
     */
    public function getUsername(): string
    {
        return $this->getUserIdentifier();
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        // $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getLastLogin(): ?\DateTimeInterface
    {
        return $this->last_login;
    }

    public function setLastLogin(?\DateTimeInterface $last_login): static
    {
        $this->last_login = $last_login;

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

    public function getContact(): ?Contact
    {
        return $this->contact;
    }

    public function setContact(?Contact $contact): self
    {
        $this->contact = $contact;
        if ($contact !== null && $contact->getUser() !== $this) {
            $contact->setUser($this);
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

    public function addProjets(Projet $projet): static
    {
        if (!$this->projets->contains($projet)) {
            $this->projets->add($projet);
        }

        return $this;
    }

    public function removeProjets(Projet $projet): static
    {
        $this->projets->removeElement($projet);

        return $this;
    }

    public function setProjets(Collection $projets): static
    {
        $this->projets = $projets;
        return $this;
    }
}