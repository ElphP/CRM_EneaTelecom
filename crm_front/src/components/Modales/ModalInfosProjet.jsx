// import React, { useState } from "react";
import styled from "styled-components";
import colors from "../../utils/style/colors";
import formatDate from "../../utils/functions/formatDate";

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
`;

const ModalContainer = styled.div`
    position: absolute;
    background: black;
    color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    /* width: 800px; */
    /* height: 650px; */
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
        font-size: 1.4rem;
    }
    h2 {
        color: ${colors.primary};
        margin: 10px;
    }
    select {
        font-size: 1.3rem;
        font-weight: bold;
        padding: 10px;
        margin: 10px;
        border-radius: 5px;
    }
    .nameSuppr {
        color: ${colors.tertiary};
        font-size: 1.6rem;
        font-weight: bold;
    }
    .warning {
        color: ${colors.primary};
        font-weight: bold;
    }
    span.yellow {
        color: ${colors.primary};
    }
    span.pink {
        color: ${colors.tertiary};
    }
    span.blue {
        color: ${colors.secondary};
    }
    .containerCRM_Doc {
        display: flex;
        gap: 10px;
    }
`;

const ChoiceButtons = styled.div`
    .btnModal {
        padding: 10px 15px;
        border-radius: 4px;
        border: none;
        margin: 20px;
        color: #fff;
        cursor: pointer;
    }
    .btnModal1 {
        background-color: #007bff;
        margin-top: 0;
    }
    .btnModal2 {
        background-color: rgb(249, 64, 64);
    }
`;

const InfosCard = styled.div`
    border: 1px solid ${colors.primary};
    padding: 20px;
    margin-top: 15px;
    border-radius: 10px;
    text-align: start;
    p {
        padding: 0;
    }
    h2 {
        margin: 0;
        text-decoration: underline;
    }
    li {
        list-style: none;
    }
`;

const ModalInfosProjet = ({ handleClose, infosProjet }) => {
    console.log(infosProjet);

    const tabAntenne = {
        Be: "Bénin",
        CI: "Côte d'Ivoire",
        To: "Togo",
        All: "Toutes",
    };

    const statutLabels = {
        OG: { className: "OG", label: "Offre gagnée" },
        PR: { className: "PR", label: "Phase de réalisation" },
        PA: { className: "PA", label: "Projet achevé" },
        EC: { className: "EC", label: "En cours/Bloquée" },
        OA: { className: "OA", label: "Offre annulée" },
        OP: { className: "OP", label: "Offre perdue" },
        AR: { className: "AR", label: "Offre à relancer" },
    };

    return (
        <Modal>
            <ModalContainer>
                <div>
                    <h2>Informations sur l'offre/le projet: </h2>
                    <p>
                        <span className="pink">{infosProjet.nom}</span>{" "}
                    </p>
                    <p>
                        <span className="yellow">Entreprise:</span>{" "}
                        {infosProjet.entreprise}{" "}
                        <span className="yellow">Antenne:</span>{" "}
                        <span className="pink">
                            {tabAntenne[infosProjet.antenneEnea]}
                        </span>
                    </p>
                    <InfosCard>
                        <h2 className="yellow">Informations générales:</h2>{" "}
                        <p>
                            <span className="yellow">
                                Date de création de l'offre:
                            </span>{" "}
                            {formatDate(infosProjet.dateCreation.date)}
                        </p>
                        <p>
                            <span className="yellow">Objectif:</span>{" "}
                            {infosProjet.objetcif ?? "Non renseigné"}
                        </p>
                        <p>
                            <span className="yellow">Description:</span>{" "}
                            {infosProjet.description ?? "Non renseigné"}
                        </p>
                        <p>
                            <span className="yellow">Statut:</span>{" "}
                            {statutLabels[infosProjet.statut].label}
                        </p>
                        <p>
                            <span className="yellow">Date Etape:</span>{" "}
                            {infosProjet.date_etape
                                ? formatDate(infosProjet.date_etape.date)
                                : "Non définie"}
                        </p>
                        <p>
                            {infosProjet.dateDebPrev?.date
                                ? (
                                      <span className="yellow">
                                          Date de début de chantier
                                          prévisionnelle:{" "}
                                      </span>
                                  ) +
                                  formatDate(infosProjet.dateDebPrev.date) +
                                  <br></br>
                                : null}{" "}
                            {infosProjet.dateFinPrev?.date
                                ? (
                                      <span className="yellow">
                                          Date de fin de chantier
                                          prévisionnelle:{" "}
                                      </span>
                                  ) +
                                  formatDate(infosProjet.dateFinPrev.date) +
                                  <br></br>
                                : null}{" "}
                            {/* ci-dessous dates de débuts et fin réelles si il y a lieu de l'afficher! */}
                            {infosProjet.statut === "PR" ||
                            infosProjet.statut === "PA" ||
                            infosProjet.statut === "OG" ? (
                                <>
                                    <span className="yellow">
                                        Numéro du contrat:{" "}
                                    </span>
                                    {infosProjet.numero_contrat
                                        ? formatDate(infosProjet.numero_contrat)
                                        : "Non renseigné"}
                                    <br></br>
                                </>
                            ) : null}
                            {infosProjet.statut === "PR" ||
                            infosProjet.statut === "PA" ? (
                                <>
                                    <span className="yellow">
                                        Date réelle de début de chantier:{" "}
                                    </span>
                                    {infosProjet.dateDebReel
                                        ? formatDate(
                                              infosProjet.dateDebReel.date
                                          )
                                        : "Non renseignée"}
                                    <br></br>
                                </>
                            ) : null}
                            {infosProjet.statut === "PA" ? (
                                <>
                                    <span className="yellow">
                                        Date réelle de fin de chantier:{" "}
                                    </span>
                                    {infosProjet.dateFinReel
                                        ? formatDate(
                                              infosProjet.dateFinReel.date
                                          )
                                        : "Non renseignée"}
                                    <br></br>
                                </>
                            ) : null}
                            {/* <span className="yellow">Date Etape:</span>{" "}
                            {infosProjet.date_etape
                                ? formatDate(infosProjet.date_etape.date)
                                : "Non définie"}
                            <span className="yellow">Date Etape:</span>{" "}
                            {infosProjet.date_etape
                                ? formatDate(infosProjet.date_etape.date)
                                : "Non définie"} */}
                        </p>
                    </InfosCard>
                    <InfosCard>
                        <h2 className="yellow">Contact référent:</h2>{" "}
                        <p>
                            {infosProjet.contact.nom}{" "}
                            {infosProjet.contact.prenom} (
                            {infosProjet.contact.sexe}){" "}
                            <span className="yellow">Fonction:</span>{" "}
                            {infosProjet.contact.fonction}
                        </p>
                        <p>
                            <span className="yellow">Téléphone:</span>{" "}
                            {infosProjet.contact.tel ??
                                "Téléphone non renseignée"}{" "}
                            <span className="yellow">Email:</span>{" "}
                            {infosProjet.contact.mail ?? "Mail non renseignée"}
                        </p>
                        <p>
                            <span className="yellow">Adresse:</span>{" "}
                            {infosProjet.contact.adresse ??
                                "Adresse non renseignée"}
                        </p>
                        <p>
                            {infosProjet.contact.CP ??
                                "Code Postal non renseigné"}{" "}
                            {infosProjet.contact.ville ??
                                "Ville non renseignée"}
                        </p>
                    </InfosCard>
                    <div className="containerCRM_Doc">
                        <InfosCard>
                            <p>
                                <span className="yellow">
                                    Liste des utilisateurs du CRM liés
                                </span>
                            </p>
                            <ul>
                                {infosProjet.CRMUsers.map((object, index) => {
                                    return (
                                        <li key={index}>
                                            {object.prenom +
                                                " " +
                                                object.nom.toUpperCase()}
                                        </li>
                                    );
                                })}
                            </ul>
                        </InfosCard>
                        <InfosCard>
                            <p>
                                <span className="yellow">Documents liés</span>
                                <ul>
                                    {infosProjet.documents.map(
                                        (object, index) => {
                                            return (
                                                <li key={index}>
                                                    {object.nom}
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            </p>
                        </InfosCard>
                    </div>
                </div>

                <ChoiceButtons>
                    {/* {content === "updateReferent" && (
                        <button
                            onClick={() =>
                                handleUpdateOffre(
                                    "updateReferent",
                                    selectedReferent
                                )
                            }
                            className="btnModal btnModal1"
                        >
                            Valider
                        </button>
                    )}
                    {content === "updateStatut" && (
                        <button
                            onClick={() =>
                                handleUpdateOffre(
                                    "updateStatut",
                                    selectedStatut
                                )
                            }
                            className="btnModal btnModal1"
                        >
                            Valider
                        </button>
                    )} */}

                    <button
                        onClick={() => handleClose()}
                        className="btnModal btnModal2"
                    >
                        Fermer
                    </button>
                </ChoiceButtons>
            </ModalContainer>
        </Modal>
    );
};

export default ModalInfosProjet;
