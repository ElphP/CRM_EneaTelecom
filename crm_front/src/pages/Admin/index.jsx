import Nav from "../../components/Nav";
import Contacts from "../../components/Contact/Contacts";
import Entreprises from "../../components/Entreprise/Entreprises";
import Offres from "../../components/Offres";
import Projets from "../../components/Projets";
import DashBoard from "../../components/DashBoard";
import ModalInfoProjets from "../../components/Modales/ModalInfosProjet";

import React, { useState, useEffect } from "react";
import styled from "styled-components";

const CRMContainer = styled.div`
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

const fetchContent = async (stringContent, filters = []) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    // selectedEnt et selectedAnt dans les paramètres de la requête
    const url = new URL(`${apiUrl}/api/admin/${stringContent}`);
    if (stringContent === "contact") {
        url.searchParams.append("ent", filters[0]);
        url.searchParams.append("ant", filters[1]);
    }
    if (stringContent === "offre" || stringContent === "projet") {
        url.searchParams.append("order", filters[2]);
        url.searchParams.append("direction", filters[3]);
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
};
const fetchInfosProjet = async (id) => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const url = new URL(`${apiUrl}/api/admin/infosProjet/${id}`);

    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
    }
    const data = await response.json();
    return data;
};

const Admin = () => {
    const [stringContent, setStringContent] = useState("dashboard");
    const [dataObjects, setDataObjects] = useState(null);
    const [error, setError] = useState(null);
    const [refreshFlag, setRefreshFlag] = useState(false);

    // états spécifiques de la page contact
    const [selectedEnt, setSelectedEnt] = useState("All");
    const [selectedAnt, setSelectedAnt] = useState("All");
    const [listeEnt, setListeEnt] = useState([]);

    const [onLoad, setOnLoad] = useState(false);

    const [selectedTri, setSelectedTri] = useState("date_creation");
    const [directionTri, setDirectionTri] = useState("ASC");

    const [showModalInfosProjet, setShowModalInfosProjet] = useState(false);
    const [infosProjet, setInfosProjet] = useState([]);

    const handleButtonClick = async (event) => {
        setStringContent(event);
    };

    useEffect(() => {
        setOnLoad(true);
        const fetchData = async () => {
            setDataObjects(null);
            try {
                const data = await fetchContent(stringContent, [
                    selectedEnt,
                    selectedAnt,
                    selectedTri,
                    directionTri,
                ]);

                if (stringContent === "contact") {
                    if (selectedEnt === "All") {
                        setListeEnt([]);
                    }

                    // Mettre à jour `listeEnt` (listeEntreprises dans contact) de manière isolée
                    Object.values(data).forEach((element) => {
                        setListeEnt((prevListeEnt) => {
                            // Ajoute uniquement si l'élément n'est pas déjà dans la liste
                            if (!prevListeEnt.includes(element.entreprise)) {
                                return [...prevListeEnt, element.entreprise];
                            }
                            return prevListeEnt;
                        });
                    });
                }

                setDataObjects(data);
                setOnLoad(false);
                setError(null);
            } catch (err) {
                setError(err.message);
                setDataObjects(null);
            }
        };

        fetchData();
        setRefreshFlag((prev) => {
            prev = !prev;
        });
    }, [
        stringContent,
        selectedEnt,
        selectedAnt,
        selectedTri,
        directionTri,
        refreshFlag,
    ]);

    const handleProjet = async (id) => {
        // console.log(id);

        setInfosProjet(await fetchInfosProjet(id));


        setShowModalInfosProjet(true);
    };

    const handleClose = () => {
        setShowModalInfosProjet(false);
    };

    return (
        <CRMContainer>
            {/* <Header dataObjects={dataObjects}></Header> */}
            <MainContainer>
                <Nav handleClick={handleButtonClick}> </Nav>
                <MainDiv>
                    {error && <p className="error-message"> {error}</p>}
                    {onLoad && <p>Chargement en cours...</p>}
                    {stringContent === "contact" &&
                        Array.isArray(dataObjects) && (
                            <Contacts
                                dataObjects={dataObjects}
                                setSelectedEnt={setSelectedEnt}
                                setSelectedAnt={setSelectedAnt}
                                listeEnt={listeEnt}
                                setRefreshFlag={setRefreshFlag}
                                selectedAnt={selectedAnt}
                                selectedEnt={selectedEnt}
                            />
                        )}
                    {stringContent === "entreprise" && dataObjects && (
                        <Entreprises
                            dataObjects={dataObjects}
                            setRefreshFlag={setRefreshFlag}
                        />
                    )}
                    {stringContent === "offre" && dataObjects && (
                        <Offres
                            dataObjects={dataObjects}
                            setSelectedTriOffres={setSelectedTri}
                            setDirectionTriOffres={setDirectionTri}
                            selectedTriOffres={selectedTri}
                            directionTriOffres={directionTri}
                            setRefreshFlag={setRefreshFlag}
                            handleProjet={handleProjet}
                        />
                    )}
                    {stringContent === "projet" && dataObjects && (
                        <Projets
                            dataObjects={dataObjects}
                            setSelectedTriProjets={setSelectedTri}
                            setDirectionTriProjets={setDirectionTri}
                            selectedTriProjets={selectedTri}
                            directionTriProjets={directionTri}
                            setRefreshFlag={setRefreshFlag}
                            handleProjet={handleProjet}
                        />
                    )}
                    {stringContent === "dashboard" && dataObjects && (
                        <DashBoard
                            dataObject={dataObjects}
                            handleProjet={handleProjet}
                            set
                        />
                    )}

                    {showModalInfosProjet && (
                        <ModalInfoProjets
                            handleClose={() => handleClose()}
                            infosProjet={infosProjet}
                        ></ModalInfoProjets>
                    )}
                </MainDiv>
            </MainContainer>
        </CRMContainer>
    );
};

export default Admin;
