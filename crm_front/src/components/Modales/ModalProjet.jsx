import React, { useState, useEffect } from "react";
import styled from "styled-components";
import colors from "../../utils/style/colors";
import FormEntreprise from "../../components/Formulaires/FormEntreprise";
import FormContact from "../../components/Formulaires/FormContact";

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
    width: ${({ content }) => (content === "suppr" ? "500px" : "auto")};
    height: ${({ content }) => (content === "suppr" ? "350px" : "auto")};
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
        font-size: 1.4rem;
        margin: 30px;
        /* color: ${colors.tertiary} */
    }
    h2 {
        color: ${colors.primary};
        margin: 5px;
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

    .messUpLoad {
        color: rgb(249, 64, 64);
        padding-bottom: 15px;
    }
`;

const Formulaire = styled.form`
    display: flex;
    flex-direction: column;
    .row {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin: 10px;
    }
    .row > label {
        padding-left: 10px;

        display: flex;

        align-items: center;
    }
    input {
        padding: 5px;
    }
    select {
        padding: 0;
    }

    .doubleRow > input {
        width: 480px;
    }

    .radio {
        justify-content: center;
        margin-bottom: 40px;
        label {
            margin: 0 10px;
        }
    }
    .formCard {
        border: 1px solid ${colors.primary};
        padding: 20px;
        margin-top: 15px;
        border-radius: 10px;
    }
    .form2 {
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

const ModalProjet = ({
    content,
    type,
    handleClose,
    listContact,
    dataProjet,
    setRefreshFlag,
}) => {
    const statutLabels =
        type === "offre"
            ? {
                  EC: { statut: "EC", label: "En cours/Bloquée" },
                  AR: { statut: "AR", label: "Offre à relancer" },
                  OA: { statut: "OA", label: "Offre annulée" },
                  OP: { statut: "OP", label: "Offre perdue" },
                  OG: { statut: "OG", label: "Offre gagnée" },
              }
            : {
                  OG: { statut: "OG", label: "Offre gagnée" },
                  PR: { statut: "PR", label: "Phase de réalisation" },
                  PA: { statut: "PA", label: "Projet achevé" },
              };

    const [selectedReferent, setSelectedReferent] = useState(
        dataProjet?.contactId
    );
    const [selectedStatut, setSelectedStatut] = useState(dataProjet?.statut);

    const [messUpLoad, setMessUpLoad] = useState("");

    const [nouvelleOffre, setNouvelleOffre] = useState({
        nom: "",
        dateEtape: "",
        entrepriseId: "",
        contactId: "",
        file: {},
    });
    const [listEntreprise, setListEntreprise] = useState([]);

    const [listContactRef, setListContactRef] = useState([]);

    const [selectedForm, setSelectedForm] = useState("");
    const [dataEntreprise, setDataEntreprise] = useState({});
    const [dataContact, setDataContact] = useState({});

    const prepareListEntreprise = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/admin/entreprise`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();

            if (!response.ok) {
                console.error("Erreur de chargement des entreprises" + data);
            } else {
                setListEntreprise(data);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des contacts", error);
        }
    };

    useEffect(() => {
        prepareListEntreprise();
        setNouvelleOffre((prevState) => ({
            ...prevState, // Conservez les autres propriétés de l'objet
            contactId: "choix", // Mettez à jour uniquement `contactId`
        }));
    }, []);

    useEffect(() => {
        const prepareListContactByEnt = async () => {
           
            
            if (
                nouvelleOffre.entrepriseId !== "choix" &&
                nouvelleOffre.entrepriseId !== ""
            ) {
                try {
                    const apiUrl = process.env.REACT_APP_API_URL;
                    const response = await fetch(
                        `${apiUrl}/api/admin/contactsByEntrepriseId/${nouvelleOffre.entrepriseId}`,
                        {
                            method: "GET",
                            credentials: "include",
                        }
                    );
                    const data = await response.json();

                    if (!response.ok) {
                        console.error(
                            "Erreur de chargement des entreprises" + data
                        );
                    } else {
                        setListContactRef(data);
                    }
                } catch (error) {
                    console.error(
                        "Erreur lors de la récupération des contacts",
                        error
                    );
                }
            }
        };

        prepareListContactByEnt();
        setNouvelleOffre((prevState) => ({
            ...prevState, // Conservez les autres propriétés de l'objet
            contactId: "choix", // Mettez à jour uniquement `contactId`
        }));
    }, [nouvelleOffre.entrepriseId]);

    const handleUpdateOffre = async (content, data) => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/admin/offre/update`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: content,
                    data: data,
                    projet_id: dataProjet.id,
                }),
            });
            const dataResponse = await response.json();
            // console.log(deletedEntreprise.status);

            if (!response.ok) {
                console.error(
                    "Erreur de chargement des contacts" + dataResponse.error
                );
            } else {
                setRefreshFlag((prev) => !prev);
                handleClose("updateReferent");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des contacts", error);
        }
    };

    const handleChange = (content, event) => {
        switch (content) {
            case "updateRef":
                setSelectedReferent(event.target.value);
                break;
            case "updateStatut":
                setSelectedStatut(event.target.value);
                break;
            case "add":
                if (event.target.id === "fileSelector") {
                    setNouvelleOffre((prevState) => ({
                        ...prevState, // Conservez les autres propriétés de l'objet
                        file: event.target.files[0], // Mettez à jour uniquement `contactId`
                    }));
                   
                } else if (event.target.id === "nom")
                    setNouvelleOffre((prevState) => ({
                        ...prevState, // Conservez les autres propriétés de l'objet
                        nom: event.target.value, // Mettez à jour uniquement `contactId`
                    }));
                else if (event.target.id === "dateEtape")
                    setNouvelleOffre((prevState) => ({
                        ...prevState, // Conservez les autres propriétés de l'objet
                        dateEtape: event.target.value, // Mettez à jour uniquement `contactId`
                    }));
                else if (event.target.id === "selectEnt2")
                    setNouvelleOffre((prevState) => ({
                        ...prevState, // Conservez les autres propriétés de l'objet
                        entrepriseId: event.target.value, // Mettez à jour uniquement `contactId`
                    }));
                else if (event.target.id === "selectContactRef")
                    setNouvelleOffre((prevState) => ({
                        ...prevState, // Conservez les autres propriétés de l'objet
                        contactId: event.target.value, // Mettez à jour uniquement `contactId`
                    }));

                break;
            default:
                break;
        }
    };

    const handleChangeForm = (event) => {
        setSelectedForm(event.target.value);
    };

    const handleChangeEntreprise = (event) => {
        switch (event.target.id) {
            case "antenne_enea":
                setDataEntreprise((prevState) => ({
                    ...prevState, // Conservez les autres propriétés de l'objet
                    antenne_enea: event.target.value, // Mettez à jour uniquement `contactId`
                }));
                break;
            case "cat":
                setDataEntreprise((prevState) => ({
                    ...prevState, // Conservez les autres propriétés de l'objet
                    cat: event.target.value, // Mettez à jour uniquement `contactId`
                }));
                break;
            case "nom":
                 setDataEntreprise((prevState) => ({
                     ...prevState, // Conservez les autres propriétés de l'objet
                     nom: event.target.value, // Mettez à jour uniquement `contactId`
                 }));
                break;
            case "adresse":
                 setDataEntreprise((prevState) => ({
                     ...prevState, // Conservez les autres propriétés de l'objet
                     adresse: event.target.value, // Mettez à jour uniquement `contactId`
                 }));
                break;
            case "CP":
                 setDataEntreprise((prevState) => ({
                     ...prevState, // Conservez les autres propriétés de l'objet
                     CP: event.target.value, // Mettez à jour uniquement `contactId`
                 }));
                break;
            case "ville":
                 setDataEntreprise((prevState) => ({
                     ...prevState, // Conservez les autres propriétés de l'objet
                     ville: event.target.value, // Mettez à jour uniquement `contactId`
                 }));
                break;

            default:
                break;
        }
    };
    const handleChangeContact = (event) => {
        switch (event.target.id) {
            case "sexe":
                setDataContact((prevState) => ({
                    ...prevState, // Conservez les autres propriétés de l'objet
                    sexe: event.target.value, // Mettez à jour uniquement `contactId`
                }));
                break;
            case "nom":
                setDataContact((prevState) => ({
                    ...prevState, // Conservez les autres propriétés de l'objet
                    nom: event.target.value, // Mettez à jour uniquement `contactId`
                }));
                break;
            case "prenom":
                setDataContact((prevState) => ({
                    ...prevState, // Conservez les autres propriétés de l'objet
                    prenom: event.target.value, // Mettez à jour uniquement `contactId`
                }));
                break;
            case "fonction":
                 setDataContact((prevState) => ({
                     ...prevState, // Conservez les autres propriétés de l'objet
                     fonction: event.target.value, // Mettez à jour uniquement `contactId`
                 }));
                break;
            case "tel1":
                 setDataContact((prevState) => ({
                     ...prevState, // Conservez les autres propriétés de l'objet
                     tel1: event.target.value, // Mettez à jour uniquement `contactId`
                 }));
                break;
            case "tel2":
                setDataContact((prevState) => ({
                    ...prevState, // Conservez les autres propriétés de l'objet
                    tel2: event.target.value, // Mettez à jour uniquement `contactId`
                }));
                break;
            case "mail1":
                 setDataContact((prevState) => ({
                     ...prevState, // Conservez les autres propriétés de l'objet
                     mail1: event.target.value, // Mettez à jour uniquement `contactId`
                 }));
                break;
            case "mail2":
                 setDataContact((prevState) => ({
                     ...prevState, // Conservez les autres propriétés de l'objet
                     mail2: event.target.value, // Mettez à jour uniquement `contactId`
                 }));
                break;
            case "adresse":
                 setDataContact((prevState) => ({
                     ...prevState, // Conservez les autres propriétés de l'objet
                     adresse: event.target.value, // Mettez à jour uniquement `contactId`
                 }));
                break;
            case "CP":
                 setDataContact((prevState) => ({
                     ...prevState, // Conservez les autres propriétés de l'objet
                     CP: event.target.value, // Mettez à jour uniquement `contactId`
                 }));
                break;
            case "ville":
                 setDataContact((prevState) => ({
                     ...prevState, // Conservez les autres propriétés de l'objet
                     ville: event.target.value, // Mettez à jour uniquement `contactId`
                 }));
                break;

            default:
                break;
        }
    };

    // upload création d'une offre
    const handleUpload = async () => {
        // if (!nouvelleOffre.file) {
        //     setMessUpLoad(
        //         "Vous devez obligatoirement sélectionner un document (PDF)"
        //     );
        //     return;
        // } else if (nouvelleOffre.nom == null || nouvelleOffre.nom === "") {
        //     setMessUpLoad("Vous devez donner un nom à la nouvelle offre!");
        //     return;
        // } else if (
        //     (nouvelleOffre.entrepriseId === "" ||
        //         nouvelleOffre.entrepriseId === "choix") &&
        //     selectedForm === "form1"
        // ) {
        //     setMessUpLoad("Vous devez sélectionner une entreprise!");
        //     return;
        // } else if (
        //     (nouvelleOffre.contactId === "" ||
        //         nouvelleOffre.contactId === "choix") &&
        //     selectedForm === "form1"
        // ) {
        //     setMessUpLoad(
        //         "Vous devez sélectionner un contact reéferent dans cette entreprise!!"
        //     );
        //     return;
        // } else {
            const formData = new FormData();

            formData.append("file", nouvelleOffre.file);
            formData.append("nom", nouvelleOffre.nom)
            formData.append("type", selectedForm)

            if(selectedForm==="form1")  {
                formData.append("entrepriseId", nouvelleOffre.entrepriseId);
                formData.append("contactId", nouvelleOffre.contactId);
            }

            try {
                const apiUrl = process.env.REACT_APP_API_URL;
                // selectedEnt et selectedAnt dans les paramètres de la requête
                const url = new URL(`${apiUrl}/api/createOffre`);
                const response = await fetch(url, {
                    method: "POST",
                    credentials: "include",
                    body: formData, // Envoi du FormData
                });

                const data = await response.json();
                if (!response.ok) {
                    console.error(data.error);
                    setMessUpLoad(data.error);
                } else {
                    console.log("Réponse:", data);

                    handleClose("add");
                    setRefreshFlag(true);
                }
            } catch (error) {
                console.error("Erreur:", error);
            }
        // }
    };

    return (
        <Modal>
            <ModalContainer content={content}>
                {content === "updateReferent" && (
                    <>
                        <h2>Changer le contact référent pour l'offre: </h2>
                        <p>{dataProjet.nom}</p>
                        <select
                            name="selectRef"
                            id="selectRef"
                            value={selectedReferent}
                            onChange={(event) =>
                                handleChange("updateRef", event)
                            }
                        >
                            {listContact.map((element, index) => (
                                <option key={index} value={element.id}>
                                    {element.identity}
                                </option>
                            ))}
                        </select>
                    </>
                )}
                {content === "updateStatut" && (
                    <>
                        <h2>Changer le statut de l'offre:</h2>
                        <p>{dataProjet.nom}</p>
                        <select
                            name="selectStatut"
                            id="selectStatut"
                            value={selectedStatut}
                            onChange={(event) =>
                                handleChange("updateStatut", event)
                            }
                        >
                            {Object.values(statutLabels).map((element) => (
                                <option
                                    key={element.statut}
                                    value={element.statut}
                                >
                                    {element.label}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {content === "add" && (
                    <Formulaire>
                        <h2>Création d'une nouvelle offre</h2>
                        <div className="row">
                            <label htmlFor="nom">Nom de l'offre: </label>
                            <input
                                type="text"
                                name="nom"
                                id="nom"
                                value={nouvelleOffre.nom}
                                onChange={(event) => handleChange("add", event)}
                            />
                            <label htmlFor="dateEtape">Date Etape</label>
                            <input
                                type="date"
                                name="dateEtape"
                                id="dateEtape"
                                value={nouvelleOffre.dateEtape}
                                onChange={(event) => handleChange("add", event)}
                            />
                        </div>

                        <div className="row">
                            <label htmlFor="dateEtape">
                                Document offre commerciale
                            </label>
                            <input
                                type="file"
                                id="fileSelector"
                                onChange={(event) => handleChange("add", event)}
                                accept="application/pdf"
                            />
                            {/* <span className="fichierSelect">
                                        {selectedFile
                                            ? selectedFile.name
                                            : "Pas de fichier sélectionné"}
                                    </span> */}
                        </div>
                        <div className="row radio">
                            <div>
                                <input
                                    type="radio"
                                    name="choixForm"
                                    id="radioEE"
                                    value="form1"
                                    checked={selectedForm === "form1"}
                                    onChange={handleChangeForm}
                                />
                                <label htmlFor="radioEE">
                                    Entreprise déja enregistrée?
                                </label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name="choixForm"
                                    id="radioNE"
                                    value="form2"
                                    checked={selectedForm === "form2"}
                                    onChange={handleChangeForm}
                                />
                                <label htmlFor="radioNE">
                                    Nouvelle entreprise?
                                </label>
                            </div>
                        </div>
                        <hr />
                        {selectedForm === "form1" && (
                            <>
                                <div className="row">
                                    <label htmlFor="selectEnt2">
                                        Sélectionner l'entreprise:
                                    </label>
                                    <select
                                        name="selectEnt2"
                                        id="selectEnt2"
                                        value={nouvelleOffre.entrepriseId}
                                        onChange={(event) =>
                                            handleChange("add", event)
                                        }
                                    >
                                        <option value="choix">
                                            Entreprise?
                                        </option>
                                        {listEntreprise.map(
                                            (element, index) => (
                                                <option
                                                    key={index}
                                                    value={element.id}
                                                >
                                                    {element.nom}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                                <div className="row">
                                    <label htmlFor="selectContactRef">
                                        Sélectionner le contact référent:
                                    </label>
                                    <select
                                        name="selectContactRef"
                                        id="selectContactRef"
                                        value={nouvelleOffre.contactId}
                                        onChange={(event) =>
                                            handleChange("add", event)
                                        }
                                    >
                                        <option value="choix">Contact?</option>
                                        {listContactRef.map(
                                            (element, index) => (
                                                <option
                                                    key={index}
                                                    value={element.id}
                                                >
                                                    {element.identity}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </>
                        )}

                        {selectedForm === "form2" && (
                            <div className="form2">
                                <div className="formCard">
                                    <h2>Création de l'Entreprise</h2>
                                    <FormEntreprise
                                        dataEntreprise={dataEntreprise}
                                        handleChange={handleChangeEntreprise}
                                    />
                                </div>
                                <div className="formCard">
                                    <h2>Création du contact référent</h2>
                                    <FormContact
                                        dataContact={dataContact}
                                        handleChange={handleChangeContact}
                                    />
                                </div>
                            </div>
                        )}
                        <p className="messUpLoad">{messUpLoad}</p>
                    </Formulaire>
                )}

                <ChoiceButtons>
                    {content === "updateReferent" && (
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
                    )}
                    {content === "add" && (
                        <button
                            onClick={handleUpload}
                            className="btnModal btnModal1"
                        >
                            Valider
                        </button>
                    )}

                    {content === "updateReferent" && (
                        <button
                            onClick={() => handleClose("updateReferent")}
                            className="btnModal btnModal2"
                        >
                            Fermer
                        </button>
                    )}
                    {content === "updateStatut" && (
                        <button
                            onClick={() => handleClose("updateStatut")}
                            className="btnModal btnModal2"
                        >
                            Annuler
                        </button>
                    )}
                    {content === "add" && (
                        <button
                            onClick={() => handleClose("add")}
                            className="btnModal btnModal2"
                        >
                            Annuler
                        </button>
                    )}
                    {/* {content === "add" && (
                        <button
                            onClick={() => handleClose("add")}
                            className="btnModal btnModal2"
                        >
                            Annuler
                        </button>
                    )}  */}
                </ChoiceButtons>
            </ModalContainer>
        </Modal>
    );
};

export default ModalProjet;
