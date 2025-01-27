import React, { useState, useEffect } from "react";
import styled from "styled-components";
import colors from "../../utils/style/colors";

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
    width: ${({ content }) => (content === "suppr" ? "500px" : "750px")};
    height: ${({ content }) => (content === "suppr" ? "300px" : "500px")};
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
    .nameSuppr {
        color: ${colors.tertiary};
        font-size: 1.6rem;
        font-weight: bold;
    }
    .warning {
        color: ${colors.primary};
        font-weight: bold;
        font-size: 1.4rem;
    }
    .error {
        color: red;
        font-weight: bold;
        font-size: 1.4rem;
    }
    .underlined  {
        text-decoration: underline;
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
        text-align: left;
        width: 100px;
        padding-right: 10px;

        display: flex;
        justify-content: space-around;
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

const ModalContact = ({
    content,
    handleClose,
    contact,
    setRefreshFlag,
    listeEnt,
}) => {
    const [dataContact, setDataContact] = useState({
        antenne_enea: "All",
        nom: "",
        prenom: "",
        sexe:"",
        entreprise: "",
        fonction: "",
        tel1: "",
        tel2: "",
        mail1: "",
        mail2: "",
        adresse: "",
        CP: "",
        ville: "",
    });

const [messageError, setMessageError] = useState("");

    useEffect(() => {
        if (contact) {
            setDataContact(contact);
        }
        
    }, [contact]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataContact((prevData) => ({
            ...prevData,
            [name]: value || "",
        }));
    };

    const handleDelete = async () => {
        const fetchDeleteContact = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL;
                const response = await fetch(
                    `${apiUrl}/api/admin/contact/delete`,
                    {
                        method: "DELETE",
                        credentials: "include",
                        body: JSON.stringify({
                            contact_id: contact.id,
                        }),
                    }
                );
                const deletedContact = await response.json();
                
                
                if (!response.ok) {
                 
                  
                    
                    if (deletedContact.error_code === "CONTACT_HAS_PROJECTS") {
                        setMessageError(deletedContact.message);
                    } else {
                        console.error(
                            "Erreur de l'effacement du contact " +
                                deletedContact.error
                        );
                    }
                } else {
                    
                    setRefreshFlag((prev) => !prev);
                    handleClose("suppr");
                   
                }
            } catch (error) {
                console.error("Erreur lors de l'effacement du contact", error);
            }
        };
        fetchDeleteContact();
    };

    const Formdata = () => {
        const formData = new FormData();
        formData.append("antenne", dataContact.antenne_enea);
        formData.append("sexe", dataContact.sexe);
        formData.append("nom", dataContact.nom);
        formData.append("prenom", dataContact.prenom);
        formData.append("entreprise", dataContact.entreprise);
        formData.append("fonction", dataContact.fonction);
        formData.append("tel1", dataContact.tel1);
        formData.append("tel2", dataContact.tel2);
        formData.append("mail1", dataContact.mail1);
        formData.append("mail2", dataContact.mail2);
        formData.append("adresse", dataContact.adresse);
        formData.append("CP", dataContact.CP);
        formData.append("ville", dataContact.ville);
        return formData;
    };

    const handleUpdate = async () => {
        const formData = Formdata();
        formData.append("_method", "PUT");
        formData.append("id", contact.id);
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/admin/contact/update`, {
                method: "POST",
                credentials: "include",
                body: formData, // Envoi du FormData
            });

            const data = await response.json();
            if (!response.ok) {
               
                
                console.error(data.error);
            } else {
               
                setRefreshFlag((prev) => !prev);
                handleClose("update");
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const handleAdd = async () => {
        const formData = Formdata(); 
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/admin/contact/create`, {
                method: "POST",
                credentials: "include",
                body: formData, // Envoi du FormData
            });

            const data = await response.json();
            if (!response.ok) {
                console.error(data.error);
            } else {
               
                setRefreshFlag((prev) => !prev);
                handleClose("add");
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    return (
        <Modal>
            <ModalContainer content={content}>
                {content === "suppr" && (
                    <div>
                        <h2>Supprimer un contact</h2>
                        <p>Voulez-vous supprimer le contact</p>
                        <p className="nameSuppr">
                            {contact.nom.toUpperCase()} {contact.prenom}?
                        </p>
                        {messageError===""? <span className="warning">
                            (<span className="underlined">Attention:</span> ce contact ne pourra plus accéder au CRM!)
                        </span>
                       :
                        <span className="error">{messageError}</span>}
                    </div>
                )}
                {content === "update" && <h2>Modifier un contact</h2>}
                {content === "add" && <h2>Ajouter un contact</h2>}
                {(content === "add" || content === "update") && (
                    <Formulaire>
                        <div className="row">
                            {/* <label htmlFor="antenne_enea">
                                Antenne EneaTelecom
                            </label>
                            <select
                                name="antenne_enea"
                                id="antenne_enea"
                                value={dataContact.antenne_enea || "All"}
                                onChange={handleChange}
                            >
                                <option value="All">Toutes</option>
                                <option value="CI">Côte d'Ivoire</option>
                                <option value="To">Togo</option>
                                <option value="Be">Bénin</option>
                            </select> */}
                            <div>
                                <input
                                    type="radio"
                                    id="M"
                                    name="sexe"
                                    value="M"
                                    onChange={handleChange}
                                    checked={
                                        dataContact.sexe === "M" ? true : false
                                    }
                                    required
                                />
                                <label htmlFor="M"> Homme</label>
                            </div>

                            <div>
                                <input
                                    type="radio"
                                    id="F"
                                    name="sexe"
                                    value="F"
                                    onChange={handleChange}
                                    checked={
                                        dataContact.sexe === "F" ? true : false
                                    }
                                    required
                                />
                                <label htmlFor="F"> Femme</label>
                            </div>
                        </div>
                        <div className="row">
                            <label htmlFor="nom">Nom</label>
                            <input
                                type="text"
                                name="nom"
                                id="nom"
                                value={dataContact.nom}
                                onChange={handleChange}
                                required
                            />

                            <label htmlFor="prenom">Prénom</label>
                            <input
                                type="text"
                                name="prenom"
                                id="prenom"
                                value={dataContact.prenom}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="row">
                            <label htmlFor="entreprise">Entreprise</label>

                            <select
                                name="entreprise"
                                id="entreprise"
                                onChange={handleChange}
                                required
                            >
                                <option value=""></option>
                                {listeEnt.map((element, index) =>
                                    element === dataContact.entreprise ? (
                                        <option
                                            key={index}
                                            value={element}
                                            selected
                                        >
                                            {element}
                                        </option>
                                    ) : (
                                        <option key={index} value={element}>
                                            {element}
                                        </option>
                                    )
                                )}
                            </select>

                            <label htmlFor="fonction">Fonction</label>
                            <input
                                type="text"
                                name="fonction"
                                id="fonction"
                                value={dataContact.fonction}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="row">
                            <label htmlFor="tel1">Téléphone 1</label>
                            <input
                                type="text"
                                name="tel1"
                                id="tel1"
                                value={dataContact.tel1}
                                onChange={handleChange}
                            />

                            <label htmlFor="tel2">Téléphone 2</label>
                            <input
                                type="text"
                                name="tel2"
                                id="tel2"
                                value={dataContact.tel2}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="row">
                            <label htmlFor="mail1">Mail 1</label>
                            <input
                                type="email"
                                name="mail1"
                                id="mail1"
                                value={dataContact.mail1}
                                onChange={handleChange}
                            />

                            <label htmlFor="mail2">Mail 2</label>
                            <input
                                type="email"
                                name="mail2"
                                id="mail2"
                                value={dataContact.mail2}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="doubleRow row">
                            <label htmlFor="adresse">Adresse</label>
                            <input
                                type="text"
                                name="adresse"
                                id="adresse"
                                value={dataContact.adresse}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="row">
                            <label htmlFor="CP">CP</label>
                            <input
                                type="text"
                                name="CP"
                                id="CP"
                                value={dataContact.CP}
                                onChange={handleChange}
                            />

                            <label htmlFor="ville">Ville</label>
                            <input
                                type="text"
                                name="ville"
                                id="ville"
                                value={dataContact.ville}
                                onChange={handleChange}
                            />
                        </div>
                    </Formulaire>
                )}

                <ChoiceButtons>
                    {content === "suppr" && (
                        <button
                            onClick={handleDelete}
                            className="btnModal btnModal1"
                        >
                            Oui
                        </button>
                    )}
                    {content === "update" && (
                        <button
                            onClick={handleUpdate}
                            className="btnModal btnModal1"
                        >
                            Valider
                        </button>
                    )}
                    {content === "add" && (
                        <button
                            onClick={handleAdd}
                            className="btnModal btnModal1"
                        >
                            Valider
                        </button>
                    )}

                    {content === "suppr" && (
                        <button
                            onClick={() => handleClose("suppr")}
                            className="btnModal btnModal2"
                        >
                            Non
                        </button>
                    )}
                    {content === "update" && (
                        <button
                            onClick={() => handleClose("update")}
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
                </ChoiceButtons>
            </ModalContainer>
        </Modal>
    );
};

export default ModalContact;
