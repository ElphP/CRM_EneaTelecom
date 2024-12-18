import React, { useState } from "react";
import styled from "styled-components";
import ContactCard from "../../components/ContactCard";
import imgPlus from "../../assets/images/icones/plus.png";
import colors from "../../utils/style/colors";
import ModalContact from "../Modales/ModalContact";

const ContactDiv = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    h1 {
        padding: 10px 80px;
    }
`;
const StyledContactCard = styled.div`
    width: 80%;
    margin: 10px auto;

    border: 1px solid black;
    border-radius: 10px;
`;

const StyledFilters = styled.div`
    height: 80px;
    display: flex;
    justify-content: space-start;
    gap: 80px;
    align-items: center;
    background-color: ${colors.dark};
    padding: 10px;
    margin: 0 0 20px 0;
    color: white;
    label {
        color: ${colors.primary};
        font-size: 1.4rem;
        padding: 0 10px;
    }
    h2 {
        padding-left: 50px;
        font-weight: bold;
    }
    select  {
        width: 200px;
        padding: 5px;
    }
`;
const ContactAdd = styled.div`
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

const Contacts = ({ dataObjects, setSelectedEnt, setSelectedAnt, listeEnt, setRefreshFlag }) => {
 
    
    dataObjects = Object.values(dataObjects || {});
    // const  [changeDB, setChangeDB] = useState(false);

    //booléen d'affichage des modales
    const [showModalSuppr, setShowModalSuppr] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);

    const [contact, setContact] = useState({});


    const handleClose = (content) => {
        const actions = {
            suppr: () => setShowModalSuppr(false),
            update: () => setShowModalUpdate(false),
            add: () => setShowModalAdd(false),
        };
        // Exécuter l'action correspondant à "content", s'il existe ?. : opérateur d'accès optionnel , n'agit que si cela existe
        actions[content]?.(); 
    };

    const contactModal = (content, contact) => {
        const actions = {
            suppr: () => setShowModalSuppr(true),
            update: () => setShowModalUpdate(true),
            add: () => setShowModalAdd(true),
        };
        // Exécuter l'action correspondant à "content", s'il existe ?. : opérateur d'accès optionnel , n'agit que si cela existe
        actions[content]?.();
        setContact(contact);
    };

    const changeAnt= (event) =>{
        setSelectedAnt(event.target.value);
    }  
    const changeEnt= (event) =>{
        setSelectedEnt(event.target.value);
    }  
    
    
    return (
        <>
            <ContactDiv>
                <h1>Liste des contacts</h1>

                <ContactAdd>
                    <button onClick={() => contactModal("add")}>
                        <img
                            className="addContact"
                            src={imgPlus}
                            alt="addContact"
                            height="32px"
                        />
                    </button>
                    <h2>Ajouter un contact</h2>
                </ContactAdd>
                <StyledFilters>
                    <h2>Filtres</h2>
                    <div>
                        <label htmlFor="selectEnt">Entreprises</label>
                        <select
                            name="selectEnt"
                            id="selectEnt"
                            onChange={(event) => changeEnt(event)}
                        >
                            <option value="All">Toutes</option>
                            {listeEnt.map((element,index) => (
                                <option key={index} value={element}>
                                    {element}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="selectAnt">Antennes</label>
                        <select
                            name="selectAnt"
                            id="selectAnt"
                            onChange={(event) => changeAnt(event)}
                        >
                            <option value="All">Toutes</option>
                            <option value="CI">Côte d'Ivoire</option>
                            <option value="To">Togo</option>
                            <option value="Be">Bénin</option>
                        </select>
                    </div>
                </StyledFilters>

                {dataObjects.map((dataObject, index) => (
                    <StyledContactCard key={index}>
                        <ContactCard
                            dataObject={dataObject}
                            // changeOnDB={changeOnDB}
                            contactModal={contactModal}
                        />
                    </StyledContactCard>
                ))}
            </ContactDiv>
            {showModalSuppr && (
                <ModalContact
                    content="suppr"
                    handleClose={(content) => handleClose(content)}
                    contact={contact}
                    setRefreshFlag={setRefreshFlag}
                ></ModalContact>
            )}
            {showModalUpdate && (
                <ModalContact
                    content="update"
                    handleClose={(content) => handleClose(content)}
                    contact={contact}
                    setRefreshFlag={setRefreshFlag}
                    listeEnt={listeEnt}
                ></ModalContact>
            )}
            {showModalAdd && (
                <ModalContact
                    content="add"
                    handleClose={(content) => handleClose(content)}
                    setRefreshFlag={setRefreshFlag}
                    listeEnt={listeEnt}
                ></ModalContact>
            )}
        </>
    );
};

export default Contacts;
