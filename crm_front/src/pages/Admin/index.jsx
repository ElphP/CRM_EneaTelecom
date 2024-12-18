import Header from "../../components/Header";
import Nav from "../../components/Nav";
import Contacts from "../../components/Contacts";

import React, { useState, useEffect } from "react";
import styled from "styled-components";


const CRMContainer = styled.header`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
`;

const MainContainer = styled.div`
    display: flex;
    width: 100%;
    flex-grow: 1;
`;
const MainDiv = styled.main`
    display: flex;
    width: 100%;
`;

const fetchContent = 
        async (stringContent, filters = []) => {
           
    const apiUrl = process.env.REACT_APP_API_URL;
                // selectedEnt et selectedAnt dans les paramètres de la requête
                const url = new URL(`${apiUrl}/api/admin/${stringContent}`);
                if (stringContent === "contact") {
                    url.searchParams.append("ent", filters[0]);
                    url.searchParams.append("ant", filters[1]);
                }

                const response = await fetch(url, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error(`Erreur réseau: ${response.status}`);
                }
                const data = await response.json();
                return data;              
        }

const Admin = () => {
    const [stringContent, setStringContent] = useState("");
    const [dataObjects, setDataObjects] = useState(null);
    const [error, setError] = useState(null);
    const [refreshFlag, setRefreshFlag] = useState(false);

    // états spécifiques de la page contact
    const [selectedEnt, setSelectedEnt] = useState("All");
    const [selectedAnt, setSelectedAnt] = useState("All");
    const [listeEnt, setListeEnt] = useState([]);


    const handleButtonClick = async (event) => {
        setStringContent(event);
    };

    useEffect(() => {
        if (!stringContent) return; // Ne pas exécuter si stringContent est vide

        
        const fetchData = async () => {
            try {
                const data = await fetchContent(stringContent, [
                    selectedEnt,
                    selectedAnt,
                ]);
                setDataObjects(data);
                
                // Mettre à jour `listeEnt` de manière isolée
                Object.values(data).forEach((element) => {
                    setListeEnt((prevListeEnt) => {
                        // Ajoute uniquement si l'élément n'est pas déjà dans la liste
                        if (!prevListeEnt.includes(element.entreprise)) {
                            return [...prevListeEnt, element.entreprise];
                        }
                        return prevListeEnt;
                    });
                });

                setError(null);
            } catch (err) {
                setError(err.message);
                setDataObjects(null);
            }
        };

        fetchData();
        setRefreshFlag((prev) => {prev=!prev});
    }, [stringContent, selectedEnt, selectedAnt, refreshFlag]);

   

    return (
        <CRMContainer>
            <Header></Header>
            <MainContainer>
                <Nav handleClick={handleButtonClick}></Nav>
                <MainDiv>
                    {error && <p className="error-message"> {error}</p>}

                    {stringContent === "contact" && dataObjects && (
                        <Contacts
                            dataObjects={dataObjects}
                            setSelectedEnt={setSelectedEnt}
                            setSelectedAnt={setSelectedAnt}
                            listeEnt={listeEnt}
                            setRefreshFlag={setRefreshFlag}
                        />
                    )}
                </MainDiv>
            </MainContainer>
        </CRMContainer>
    );
};

export default Admin;
