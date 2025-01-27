import React, { useState } from "react";
import styled from "styled-components";
import EntrepriseCard from "../../Entreprise/EntrepriseCard";
import imgPlus from "../../../assets/images/icones/plus.png";
import colors from "../../../utils/style/colors";
import ModalEntreprise from "../../Modales/ModalEntreprise";

const EntrepriseDiv = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 30px;
    h1 {
        padding: 10px 80px;
    }
    .liste {
        display: flex;
        flex-wrap: wrap;
    }
`;

const StyledEntrepriseCard = styled.div`
    width: 45%;
    margin: 10px auto;
    border: 1px solid black;
    border-radius: 10px;
    max-width: 700px;
`;

const EntrepriseAdd = styled.div`
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
const Entreprises = ({ dataObjects, setRefreshFlag }) => {
    dataObjects = Object.values(dataObjects || {});

    //booléen d'affichage des modales
    const [showModalSuppr, setShowModalSuppr] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);

    const [entreprise, setEntreprise] = useState({});

    const handleClose = (content) => {
        const actions = {
            suppr: () => setShowModalSuppr(false),
            update: () => setShowModalUpdate(false),
            add: () => setShowModalAdd(false),
        };
        // Exécuter l'action correspondant à "content", s'il existe ?. : opérateur d'accès optionnel , n'agit que si cela existe
        actions[content]?.();
    };

    const entrepriseModal = (content, entreprise) => {
        const actions = {
            suppr: () => setShowModalSuppr(true),
            update: () => setShowModalUpdate(true),
            add: () => setShowModalAdd(true),
        };
        // Exécuter l'action correspondant à "content", s'il existe ?. : opérateur d'accès optionnel , n'agit que si cela existe
        actions[content]?.();
        setEntreprise(entreprise);
    };

    return (
        <>
            <EntrepriseDiv>
                <h1>Liste des entreprises</h1>

                <EntrepriseAdd>
                    <button onClick={() => entrepriseModal("add")}>
                        <img
                            className="addContact"
                            src={imgPlus}
                            alt="addContact"
                            height="32px"
                        />
                    </button>
                    <h2>Créer une fiche entreprise</h2>
                </EntrepriseAdd>

                <div className="liste">
                  {dataObjects.map((dataObject, index) => (
                    
                    
                      <StyledEntrepriseCard key={index}>
                          <EntrepriseCard
                              dataObject={dataObject}
                              entrepriseModal={entrepriseModal}
                          />
                      </StyledEntrepriseCard>
                  ))}
                </div>
            </EntrepriseDiv>
            {showModalSuppr && (
                <ModalEntreprise
                    content="suppr"
                    handleClose={(content) => handleClose(content)}
                    entreprise={entreprise}
                    setRefreshFlag={setRefreshFlag}
                ></ModalEntreprise>
            )}
            {showModalUpdate && (
                <ModalEntreprise
                    content="update"
                    handleClose={(content) => handleClose(content)}
                    entreprise={entreprise}
                    setRefreshFlag={setRefreshFlag}
                ></ModalEntreprise>
            )}
            {showModalAdd && (
                <ModalEntreprise
                    content="add"
                    handleClose={(content) => handleClose(content)}
                    setRefreshFlag={setRefreshFlag}
                ></ModalEntreprise>
            )}
        </>
    );
};

export default Entreprises;
