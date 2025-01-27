import React, { useState, useEffect } from "react";
import styled from "styled-components";
import colors from "../../utils/style/colors";
import FormEntreprise from "../../components/Formulaires/FormEntreprise"

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
    height: ${({ content }) => (content === "suppr" ? "350px" : "500px")};
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

const ModalEntreprise = ({
    content,
    handleClose,
    entreprise,
    setRefreshFlag,
}) => {
    
    
     const [dataEntreprise, setDataEntreprise] = useState({
            antenne_enea: "All",
            nom: "",
            cat:"Prospect",
            adresse: "",
            CP: "",
            ville: "",
        });

          useEffect(() => {
                if (entreprise) {
                    setDataEntreprise(entreprise);
                }
                
            }, [entreprise]);

              const handleChange = (e) => {
                  const { name, value } = e.target;
                  setDataEntreprise((prevData) => ({
                      ...prevData,
                      [name]: value,
                  }));
              };


                const handleDelete = async () => {
                    const fetchDeleteEntreprise = async () => {
                        try {
                            const apiUrl = process.env.REACT_APP_API_URL;
                            const response = await fetch(
                                `${apiUrl}/api/admin/entreprise/delete`,
                                {
                                    method: "DELETE",
                                    credentials: "include",
                                    body: JSON.stringify({
                                        entreprise_id: entreprise.id,
                                    }),
                                }
                            );
                            const deletedEntreprise = await response.json();
                            // console.log(deletedEntreprise.status);
                            
                            if (!response.ok) {
                                console.error(
                                    "Erreur de l'effacement de l'entreprise" +
                                        deletedEntreprise.error
                                );
                            } else {
                                setRefreshFlag((prev) => !prev);
                                handleClose("suppr");
                            }
                        } catch (error) {
                            console.error(
                                "Erreur lors de l'effacement de l'entreprise",
                                error
                            );
                        }
                    };
                    fetchDeleteEntreprise();
                };

                 const handleUpdate = async () => {
                     const formData = Formdata();
                     formData.append("_method", "PUT");
                     formData.append("id", entreprise.id);
                     try {
                         const apiUrl = process.env.REACT_APP_API_URL;
                         const response = await fetch(
                             `${apiUrl}/api/admin/entreprise/update`,
                             {
                                 method: "POST",
                                 credentials: "include",
                                 body: formData, // Envoi du FormData
                             }
                         );

                         const data = await response.json();
                         console.log(data);
                         
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
                         const response = await fetch(
                             `${apiUrl}/api/admin/entreprise/create`,
                             {
                                 method: "POST",
                                 credentials: "include",
                                 body: formData, // Envoi du FormData
                             }
                         );

                         const data = await response.json();
                         if (!response.ok) {
                             console.error(data.error);
                         } else {
                            console.log(data.message);
                            
                             setRefreshFlag((prev) => !prev);
                             handleClose("add");
                         }
                     } catch (error) {
                         console.error("Erreur:", error);
                     }
                 };

                 
    const Formdata = () => {
        const formData = new FormData();
        formData.append("antenne", dataEntreprise.antenne_enea);      
        formData.append("nom", dataEntreprise.nom);
        formData.append("cat", dataEntreprise.cat);

        formData.append("adresse", dataEntreprise.adresse);
        formData.append("CP", dataEntreprise.CP);
        formData.append("ville", dataEntreprise.ville);
        return formData;
    };

    return (
        <Modal>
            <ModalContainer content={content}>
                {content === "suppr" && (
                    <div>
                        <h2>Retirer une entreprise</h2>
                        <p>Voulez-vous vraiment retirer l'entreprise</p>
                        <p className="nameSuppr">{entreprise.nom}</p>
                        <p>de la base de donnée? </p>
                        <p>
                            <span className="warning">
                                (Attention: tous les contacts, users et projets associés
                                seront également effacés!)
                            </span>
                        </p>
                    </div>
                )}
                {content === "update" && (
                    <h2>Modifier les informations d'une entreprise</h2>
                )}
                {content === "add" && <h2>Ajouter une entreprise</h2>}
                {(content === "add" || content === "update") && (
              
                    <FormEntreprise dataEntreprise={dataEntreprise} handleChange={handleChange}/>

                    
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

export default ModalEntreprise;
