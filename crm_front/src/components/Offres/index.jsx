// !projets et offres sont la même entité, mais avec seulement des statuts différents -> code à refactoriser un peu

import React, { useState } from "react";
import styled from "styled-components";
import colors from "../../utils/style/colors";
import imgModify from "../../assets/images/icones/modify.png";
import imgCalend from "../../assets/images/icones/calendar.png";
import ModalProjet from "../Modales/ModalProjet";
import imgPlus from "../../assets/images/icones/plus.png";

const OffresContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 30px;
    h1 {
        padding: 10px 80px;
    }
`;

const StyledFilters = styled.div`
    height: 80px;
    display: flex;
    justify-content: space-start;
    gap: 0px;
    align-items: center;
    background-color: ${colors.dark};
    padding: 10px;
    margin: 10px 0 20px 0;
    color: white;
    label {
        color: ${colors.primary};
        font-size: 1.4rem;
        padding: 0 10px;
    }
    h2 {
        padding-left: 50px;
        font-weight: bold;
        margin-right: 25px;
    }
    select {
        width: 200px;
        padding: 5px;
    }
    .ordreTri {
        padding-left: 60px;
    }
`;

const StyledTable = styled.table`
    width: 100%;
    margin: 40px 0;
`;
const FirstTr = styled.tr`
    background-color: ${colors.dark};
    color: white;
    font-size: 1.5rem;
    height: 60px;
`;

const StyledTr = styled.tr`
    &:nth-child(odd) {
        background-color: #f0f8ff;
    }
    height: 40px;
    text-align: center;
    .vign {
        border-radius: 8px;
        margin: 5px;
        padding: 5px;
    }
    .EC {
        background-color: #fff8d6;
    }
    .OA {
        background-color: #dadada;
    }
    .OP {
        background-color: #ffd6d6;
    }
    .AR {
        background-color: #ffd1a6;
    }

    .statut {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .contact {
        display: flex;
        justify-content: space-between;
        padding-left: 15px;
    }

    .dateEtape {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button {
        border: none;
        margin-right: 10px;
        background-color: transparent;
        cursor: pointer;
    }

    button.nomProjet {
        border: 2px solid #e0e0e0;
        background-color: transparent;
        padding: 5px;
        color: ${colors.secondary};
        border-radius: 30px;
        padding: 15px;
        margin: 1px;
        font-weight: bold;

        &:hover {
            text-decoration: underline;
        }
    }

    /* code pour changer l'icone native des navigateurs pour l'input date.... from ChatGPT  */
    .custom-date-input {
        position: relative;
        display: inline-block;
    }

    .custom-date-input input[type="date"] {
        appearance: none; /* Supprime le style natif */
        -webkit-appearance: none; /* Supprime le style natif sur Safari */
        position: relative;
        padding: 10px;
        padding-right: 40px; /* Espace pour l'icône */
        font-size: 16px;
        border: none;
        background-color: transparent;
    }

    .custom-date-input input[type="date"]::-webkit-calendar-picker-indicator {
        position: absolute;
        top: 50%;
        right: 10px; /* Positionner à droite */
        transform: translateY(-50%);
        cursor: pointer;
        opacity: 0; /* Rendre l'icône native invisible */
        z-index: 2; /* S'assurer qu'elle est cliquable */
    }

    .custom-date-input .icon {
        position: absolute;
        top: 50%;
        right: 10px; /* Positionner à droite */
        transform: translateY(-50%);
        pointer-events: none; /* Empêcher les clics sur l'icône */
        color: #999;
        font-size: 20px;
    }

    .custom-date-input input[type="date"].empty {
        color: transparent; /* Cache le texte de l'input lorsqu'il est vide */
    }

    .custom-date-input .placeholder {
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
        color: black;
        font-size: 16px;
        pointer-events: none; /* Ne pas interférer avec les clics */
    }
`;

const OffreAdd = styled.div`
    display: flex;
    padding: 10px 0 10px 10%;
    justify-content: start;
    align-items: center;

    h2 {
        padding: 10px;
    }
    button {
        background-color: ${colors.primary};
        width: 50px;
        height: 50px;
        border-radius: 10px;
        border: none;
        margin: 0 5px 5px 5px;
        cursor: pointer;
    }
`;

const Offres = ({
    dataObjects,
    setSelectedTriOffres,
    selectedTriOffres,
    setDirectionTriOffres,
    directionTriOffres,
    setRefreshFlag,
    handleProjet
}) => {

    // fonction qui permet de remplir la colonne statut
    const renderStatutCell = (dataObject) => {
        const statutLabels = {
            EC: { className: "EC", label: "En cours/Bloquée" },
            OA: { className: "OA", label: "Offre annulée" },
            OP: { className: "OP", label: "Offre perdue" },
            AR: { className: "AR", label: "Offre à relancer" },
        };

        const content = statutLabels[dataObject.statut];
        if (!content) return null;

        return (
            <td className="statut">
                <p className={`vign ${content.className}`}>{content.label}</p>
                <button
                    onClick={() => offreModal("updateStatut", dataObject)}
                    id={dataObject.id}
                >
                    <img
                        className="modify"
                        src={imgModify}
                        alt="modification"
                        height="26px"
                    />
                </button>
            </td>
        );
    };
    
    // gestion des modales de changement des offres (Statut, dateEtape, )
    //booléen d'affichage des modales
    const [showModalUpdateRef, setShowModalUpdateRef] = useState(false);
    const [showModalUpdateStatut, setShowModalUpdateStatut] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
   
    const [offre, setOffre] = useState("");
    const [listContact, setListContact] = useState([[]]);
  

    const offreModal = (content, offre) => {
        const actions = {
            updateReferent: () => prepareUpdateRef(offre.id),
            updateStatut: () => setShowModalUpdateStatut(true),
            add: () => setShowModalAdd(true),
        };
        // Exécuter l'action correspondant à "content", s'il existe ?. : opérateur d'accès optionnel , n'agit que si cela existe
        actions[content]?.();
        setOffre(offre);
    };
    // fonction qui prépare le fetch des contacts puis l'ouverture de la modale pour updateRef (modale de mise à jour du contact référent de l'offre)
    const prepareUpdateRef = async (id) => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(
                `${apiUrl}/api/admin/offre/fetchContactByOffre`,
                {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({
                        projet_id: id,
                    }),
                }
            );
            const data = await response.json();
            // console.log(deletedEntreprise.status);

            if (!response.ok) {
                console.error("Erreur de chargement des contacts" + data);
            } else {
                setListContact(data["content"]);
                setShowModalUpdateRef(true);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des contacts", error);
        }
    };

    

    const handleChange = (event) => {
        if (event.target.name === "triOffres") {
            setSelectedTriOffres(event.target.value);
        } else if (event.target.name === "direction") {
            setDirectionTriOffres(event.target.value);
        }
        // setRefreshFlag((prev)=>!prev);
    };

    const handleCloseModale = (content) => {
        const actions = {
            updateReferent: () => setShowModalUpdateRef(false),
            updateStatut: () => setShowModalUpdateStatut(false),
            add: () => setShowModalAdd(false)
        };
        // Exécuter l'action correspondant à "content", s'il existe ?. : opérateur d'accès optionnel , n'agit que si cela existe
        actions[content]?.();
        setOffre("");
    };

    const convertToISODate = (datetime) => {
        if (!datetime) {
            // Si la date est null, undefined ou vide, retourne une chaîne vide
            return "";
        }
        // Convertir la chaîne datetime en objet Date
        const date = new Date(datetime);

        // Obtenir les composantes de la date
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Mois (1 à 12)
        const day = String(date.getDate()).padStart(2, "0"); // Jour (01 à 31)

        // Retourner la date au format YYYY-MM-DD
        return `${year}-${month}-${day}`;
    };

    const updateDateEtape = async (event, id) => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/admin/offre/update`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: "updateDateEtape",
                    data: event.target.value,
                    projet_id: id,
                }),
            });
            const dataResponse = await response.json();

            if (!response.ok) {
                console.error(
                    "Erreur de chargement des contacts" + dataResponse.error
                );
            } else {
                setRefreshFlag((prev) => !prev);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des contacts", error);
        }
    };



    return (
        <>
            <OffresContainer>
                <h1>Tableau des offres</h1>
                <OffreAdd>
                    <button onClick={() => offreModal("add", "")}>
                        <img
                            className="addContact"
                            src={imgPlus}
                            alt="addContact"
                            height="32px"
                        />
                    </button>
                    <h2>Ajouter une nouvelle offre</h2>
                </OffreAdd>
                <StyledFilters>
                    <h2>Trier par</h2>

                    <div>
                        <input
                            type="radio"
                            id="date_creation"
                            name="triOffres"
                            value="date_creation"
                            checked={selectedTriOffres === "date_creation"}
                            onChange={handleChange}
                        />

                        <label htmlFor="dateCreation">Date de création</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="nom"
                            name="triOffres"
                            value="nom"
                            checked={selectedTriOffres === "nom"}
                            onChange={handleChange}
                        />
                        <label htmlFor="nom_offre">Nom d'offre</label>
                    </div>

                    <div>
                        <input
                            type="radio"
                            id="statut"
                            name="triOffres"
                            value="statut"
                            checked={selectedTriOffres === "statut"}
                            onChange={handleChange}
                        />
                        <label htmlFor="statut">Statut</label>
                    </div>

                    <div>
                        <input
                            type="radio"
                            id="entreprise"
                            name="triOffres"
                            value="entreprise"
                            checked={selectedTriOffres === "entreprise"}
                            onChange={handleChange}
                        />
                        <label htmlFor="entreprise">Entreprise</label>
                    </div>

                    <div>
                        <input
                            type="radio"
                            id="date_etape"
                            name="triOffres"
                            value="date_etape"
                            checked={selectedTriOffres === "date_etape"}
                            onChange={handleChange}
                        />
                        <label htmlFor="dateEtape">Date Etape</label>
                    </div>
                    <div className="ordreTri">
                        <label htmlFor="dateCreation">Sens:</label>
                        <select
                            name="direction"
                            id="direction"
                            onChange={handleChange}
                            value={directionTriOffres}
                        >
                            <option value="ASC">Ascendant</option>
                            <option value="DESC">Descendant</option>
                        </select>
                    </div>
                </StyledFilters>

                <StyledTable>
                    <tbody>
                        <FirstTr>
                            <th>Nom de l'offre</th>
                            <th>Nom de l'entreprise</th>
                            <th>Contact référent</th>
                            <th>Statut</th>

                            <th>Date étape</th>
                        </FirstTr>
                        {dataObjects.map((dataObject, index) => (
                            <StyledTr key={index}>
                                <td><button className="nomProjet" onClick={()=>handleProjet(dataObject.id)}>{dataObject.nom}</button></td>
                                <td>{dataObject.entreprise}</td>
                                <td>
                                    <div className="contact">
                                        <div>
                                            {dataObject.contactSexe === "M"
                                                ? "Mr"
                                                : "Mme"}{" "}
                                            {dataObject.contactNom}{" "}
                                        </div>
                                        <button
                                            onClick={() =>
                                                offreModal(
                                                    "updateReferent",
                                                    dataObject
                                                )
                                            }
                                            id={dataObject.id}
                                        >
                                            {" "}
                                            <img
                                                className="modify"
                                                src={imgModify}
                                                alt="modification"
                                                height="26px"
                                            />
                                        </button>
                                    </div>
                                </td>

                                {/* Appel de la fonction pour générer le contenu du statut */}
                                {renderStatutCell(dataObject)}

                                <td className="dateSelector">
                                    {/* dateEtape */}
                                    <div className="custom-date-input">
                                        <input
                                            key={index}
                                            type="date"
                                            name="dateEtape"
                                            id="dateEtape"
                                            value={
                                                dataObject?.dateEtape?.date
                                                    ? convertToISODate(
                                                          dataObject.dateEtape
                                                              .date
                                                      )
                                                    : ""
                                            }
                                            className={
                                                dataObject?.dateEtape?.date
                                                    ? ""
                                                    : "empty"
                                            }
                                            onChange={(event) =>
                                                updateDateEtape(
                                                    event,
                                                    dataObject.id
                                                )
                                            }
                                        />
                                        {!dataObject?.dateEtape?.date && (
                                            <span className="placeholder">
                                                Aucune
                                            </span>
                                        )}
                                        <span className="icon">
                                            {" "}
                                            <img
                                                src={imgCalend}
                                                alt="calendrier"
                                                height="26px"
                                            />{" "}
                                        </span>{" "}
                                    </div>
                                </td>
                            </StyledTr>
                        ))}
                    </tbody>
                </StyledTable>
            </OffresContainer>
            {showModalUpdateRef && (
                <ModalProjet
                    content="updateReferent"
                    type="offre"
                    handleClose={(content) => handleCloseModale(content)}
                    listContact={listContact}
                    dataProjet={offre}
                    setRefreshFlag={setRefreshFlag}
                ></ModalProjet>
            )}
            {showModalUpdateStatut && (
                <ModalProjet
                    content="updateStatut"
                    type="offre"
                    handleClose={(content) => handleCloseModale(content)}
                    dataProjet={offre}
                    setRefreshFlag={setRefreshFlag}
                ></ModalProjet>
            )}
            {showModalAdd && (
                <ModalProjet
                    content="add"
                    type="offre"
                    handleClose={(content) => handleCloseModale(content)}
                    setRefreshFlag={setRefreshFlag}
                  
                ></ModalProjet>
            )}
        </>
    );
};

export default Offres;
