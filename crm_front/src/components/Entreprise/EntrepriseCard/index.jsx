import React from "react";
import styled from "styled-components";
import imgTrash from "../../../assets/images/icones/trash.png";
import imgModify from "../../../assets/images/icones/modify.png";
import colors from "../../../utils/style/colors";

const StyledEntrepriseCard = styled.div`
    display: flex;
    padding: 20px;
    justify-content: space-between;
`;

const EntrepriseTrash = styled.div`
    button {
        background-color: rgb(249, 64, 64);
        width: 50px;
        height: 50px;
        border-radius: 10px;
        border: none;
        margin: 0 5px 5px 5px;
        cursor: pointer;
    }
`;
const EntrepriseModify = styled.div`
    button {
        background-color: #007bff;
        width: 50px;
        height: 50px;
        border-radius: 10px;
        border: none;
        margin: 0 5px 5px 5px;
        cursor: pointer;
    }
`;

const Buttons = styled.div`
    padding-left: 20px;
    width: 15%;
    display: flex;
    flex-direction: column;
`;
const Identity = styled.div`
    padding: 0 15px;
    width: 60%;
    display: flex;
    flex-direction: column;
    .nom {
        color: black;
        font-weight: bold;
        font-size: 1.4rem;
    }
    .cat {
        color: ${colors.secondary};
        font-size: 1.4rem;
        font-weight: bold;
    }
    .antenne {
        color: ${colors.tertiary};
        font-weight: bold;
        font-size: 1.4rem;
    }
    .intitule {
        font-weight: bold;
    }
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
   
    .gras {
        font-weight: bold;
    }

    .infoEnt {
        display: flex;
        justify-content: space-between;
        gap:5px;
    }
    
`;

const EntrepriseCard = ({ entrepriseModal, dataObject }) => {
    let antenne_enea = "";
    switch (dataObject.antenne_enea) {
        case "All":
            antenne_enea = "Siège et antennes";
            break;
        case "CI":
            antenne_enea = "Côte d'Ivoire";
            break;
        case "To":
            antenne_enea = "Togo";
            break;
        case "Be":
            antenne_enea = "Bénin";
            break;

        default:
            antenne_enea = "";
            break;
    }

    const nom = dataObject.nom?.toUpperCase() ?? "Nom indisponible";
    return (
        <StyledEntrepriseCard>
            <Buttons>
                <EntrepriseTrash>
                    <button
                        onClick={() => entrepriseModal("suppr", dataObject)}
                        id={dataObject.id}
                    >
                        <img
                            className="trash"
                            src={imgTrash}
                            alt="poubelle"
                            height="32px"
                        />
                    </button>
                </EntrepriseTrash>
                <EntrepriseModify>
                    <button
                        onClick={() => entrepriseModal("update", dataObject)}
                        id={dataObject.id}
                    >
                        <img
                            className="modify"
                            src={imgModify}
                            alt="modification"
                            height="32px"
                        />
                    </button>
                </EntrepriseModify>
            </Buttons>
            <Identity>
                <p className="nom">{nom}</p>
                <p className="cat">{dataObject.cat ?? "Non renseigné"}</p>
                <p>
                    <span className="intitule">Adresse: </span>
                    {dataObject.adresse === null || dataObject.adresse === ""
                        ? "Non renseigné"
                        : dataObject.adresse}
                </p>
                <p>
                    <span className="intitule">Code Postal: </span>
                    {dataObject.CP === null || dataObject.CP === ""
                        ? "Non renseigné"
                        : dataObject.CP}{" "}
                </p>
                <p>
                    <span className="intitule">Ville: </span>
                    {dataObject.ville === null || dataObject.ville === ""
                        ? "Non renseigné"
                        : dataObject.ville}
                </p>

                <p className="antenne">{antenne_enea ?? ""}</p>
            </Identity>
            <Info>
                <p className="infoEnt">
                    {dataObject.cat === "Client" ||
                    dataObject.cat === "Prospect" ? (
                        <>
                            <span>Nombre d'offres:</span>{" "}
                            <span className="gras">{dataObject.nbrOffre}</span>
                        </>
                    ) : (
                        ""
                    )}
                </p>
                <p className="infoEnt">
                    {dataObject.cat === "Client" ? (
                        <>
                            <span>Nombre de projets:</span>{" "}
                            <span className="gras">{dataObject.nbrProjet}</span>
                        </>
                    ) : (
                        ""
                    )}
                </p>
                <p className="infoEnt">
                    <span>Nombre de contacts:</span>
                    <span className="gras"> {dataObject.nbrContact}</span>
                </p>
                <p className="infoEnt">
                    <span>Utilisateurs CRM:</span>{" "}
                    <span className="gras">{dataObject.nbrUser}</span>
                </p>
            </Info>
        </StyledEntrepriseCard>
    );
};

export default EntrepriseCard;
