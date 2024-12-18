<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241216143230 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contact (id INT AUTO_INCREMENT NOT NULL, entreprise_id INT NOT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) DEFAULT NULL, sexe VARCHAR(255) NOT NULL, fonction VARCHAR(255) NOT NULL, antenne_enea VARCHAR(255) NOT NULL, tel1 VARCHAR(20) DEFAULT NULL, tel2 VARCHAR(20) DEFAULT NULL, mail1 VARCHAR(50) DEFAULT NULL, mail2 VARCHAR(50) DEFAULT NULL, adresse VARCHAR(255) DEFAULT NULL, cp VARCHAR(10) DEFAULT NULL, ville VARCHAR(50) DEFAULT NULL, INDEX IDX_4C62E638A4AEAFEA (entreprise_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE contact_interaction (contact_id INT NOT NULL, interaction_id INT NOT NULL, INDEX IDX_59214219E7A1254A (contact_id), INDEX IDX_59214219886DEE8F (interaction_id), PRIMARY KEY(contact_id, interaction_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE entreprise (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, adresse VARCHAR(255) DEFAULT NULL, cp VARCHAR(10) DEFAULT NULL, ville VARCHAR(50) DEFAULT NULL, antenne_enea VARCHAR(10) DEFAULT NULL, categorie VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE interaction (id INT AUTO_INCREMENT NOT NULL, projet_id INT NOT NULL, type VARCHAR(50) NOT NULL, sujet VARCHAR(255) NOT NULL, date_heure DATETIME NOT NULL, description VARCHAR(255) DEFAULT NULL, statut VARCHAR(70) NOT NULL, INDEX IDX_378DFDA7C18272 (projet_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE projet (id INT AUTO_INCREMENT NOT NULL, entreprise_id INT NOT NULL, contact_id INT NOT NULL, nom VARCHAR(255) NOT NULL, statut VARCHAR(70) NOT NULL, date_etape DATETIME DEFAULT NULL, type VARCHAR(70) DEFAULT NULL, numero_contrat VARCHAR(70) DEFAULT NULL, objectif VARCHAR(255) DEFAULT NULL, description VARCHAR(255) DEFAULT NULL, date_creation DATETIME NOT NULL, date_deb_prev DATETIME DEFAULT NULL, date_fin_prev DATETIME DEFAULT NULL, date_deb_reel DATETIME DEFAULT NULL, date_fin_reel DATETIME DEFAULT NULL, INDEX IDX_50159CA9A4AEAFEA (entreprise_id), INDEX IDX_50159CA9E7A1254A (contact_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE `user` (email VARCHAR(100) NOT NULL, contact_id INT NOT NULL, entreprise_id INT NOT NULL, roles JSON NOT NULL COMMENT \'(DC2Type:json)\', password VARCHAR(255) NOT NULL, last_login DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7A1254A (contact_id), INDEX IDX_8D93D649A4AEAFEA (entreprise_id), UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(email)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_projet (user_email VARCHAR(100) NOT NULL, projet_id INT NOT NULL, INDEX IDX_35478794550872C (user_email), INDEX IDX_35478794C18272 (projet_id), PRIMARY KEY(user_email, projet_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE contact ADD CONSTRAINT FK_4C62E638A4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id)');
        $this->addSql('ALTER TABLE contact_interaction ADD CONSTRAINT FK_59214219E7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
        $this->addSql('ALTER TABLE contact_interaction ADD CONSTRAINT FK_59214219886DEE8F FOREIGN KEY (interaction_id) REFERENCES interaction (id)');
        $this->addSql('ALTER TABLE interaction ADD CONSTRAINT FK_378DFDA7C18272 FOREIGN KEY (projet_id) REFERENCES projet (id)');
        $this->addSql('ALTER TABLE projet ADD CONSTRAINT FK_50159CA9A4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id)');
        $this->addSql('ALTER TABLE projet ADD CONSTRAINT FK_50159CA9E7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
        $this->addSql('ALTER TABLE `user` ADD CONSTRAINT FK_8D93D649E7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
        $this->addSql('ALTER TABLE `user` ADD CONSTRAINT FK_8D93D649A4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id)');
        $this->addSql('ALTER TABLE user_projet ADD CONSTRAINT FK_35478794550872C FOREIGN KEY (user_email) REFERENCES `user` (email)');
        $this->addSql('ALTER TABLE user_projet ADD CONSTRAINT FK_35478794C18272 FOREIGN KEY (projet_id) REFERENCES projet (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact DROP FOREIGN KEY FK_4C62E638A4AEAFEA');
        $this->addSql('ALTER TABLE contact_interaction DROP FOREIGN KEY FK_59214219E7A1254A');
        $this->addSql('ALTER TABLE contact_interaction DROP FOREIGN KEY FK_59214219886DEE8F');
        $this->addSql('ALTER TABLE interaction DROP FOREIGN KEY FK_378DFDA7C18272');
        $this->addSql('ALTER TABLE projet DROP FOREIGN KEY FK_50159CA9A4AEAFEA');
        $this->addSql('ALTER TABLE projet DROP FOREIGN KEY FK_50159CA9E7A1254A');
        $this->addSql('ALTER TABLE `user` DROP FOREIGN KEY FK_8D93D649E7A1254A');
        $this->addSql('ALTER TABLE `user` DROP FOREIGN KEY FK_8D93D649A4AEAFEA');
        $this->addSql('ALTER TABLE user_projet DROP FOREIGN KEY FK_35478794550872C');
        $this->addSql('ALTER TABLE user_projet DROP FOREIGN KEY FK_35478794C18272');
        $this->addSql('DROP TABLE contact');
        $this->addSql('DROP TABLE contact_interaction');
        $this->addSql('DROP TABLE entreprise');
        $this->addSql('DROP TABLE interaction');
        $this->addSql('DROP TABLE projet');
        $this->addSql('DROP TABLE `user`');
        $this->addSql('DROP TABLE user_projet');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
