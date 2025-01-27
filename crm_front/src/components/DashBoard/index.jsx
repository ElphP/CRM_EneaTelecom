import React from "react";
import styled from "styled-components";
import colors from "../../utils/style/colors";
import formatDate from "../../utils/functions/formatDate"

const DashBoardDiv = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 30px 60px;
    h1 {
        padding: 25px 0px;
    }
`;

const ContainerInfo = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 50px;
    padding: 50px;
`;

const ColorBlock = styled.div`
    display: flex;
    flex-direction: column;

    width: 20%;
    padding: 25px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: 20px;
    font-weight: bold;
    height: 150px;

    text-align: center;
    /* Styles dynamiques basés sur la prop color */
    background-color: ${({ color }) => {
        switch (color) {
            case "red":
                return "#F44336";
            case "blue":
                return "#2986CC";
            case "yellow":
                return colors.primary;
            case "green":
                return "#4CAF50";
            default:
                return "transparent";
        }
    }};
`;
const Title = styled.p`
    font-size: 1.3rem;
`;

const Data = styled.p`
    font-size: 1.8rem;
`;
const ContainerRetard = styled.div`
    padding: 30px;
    h3 {
        font-weight: bold;
        font-size: 1.6rem;
        span {
            color: red;
        }
    }

    button {
        border: none;
        color: ${colors.secondary};
        padding: 5px;
        background-color: #e0e0e0;
        border-radius: 30px;
        padding: 15px;
        font-weight: bold;
    }
    button:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`;

const BlockInfo = styled.div`
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    padding: 15px;
    border-radius: 15px;
    margin: 10px;
    .titre {
        padding-left: 50px;
        font-weight: bold;
        font-size: 1.8rem;
        text-decoration: underline;
    }
`;

const StyledTable = styled.table`
    padding: 20px 50px;
    td {
        padding: 10px 20px;
    }
`;

const DashBoard = ({ dataObject, handleProjet }) => {
   

    const TabJour = [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
    ];
    const TabMois = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
    ];
    const date = new Date();

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
        <DashBoardDiv>
            <h3>
                Nous sommes le {TabJour[date.getDay()]} {date.getDate()}{" "}
                {TabMois[date.getMonth()]} {date.getFullYear()}
            </h3>
            <h1>Tableau de bord</h1>
            <h2>Données essentielles du CRM:</h2>
            <BlockInfo>
                <h2 className="titre">Suivi des offres et des projets</h2>
                <ContainerInfo>
                    <ColorBlock color="red">
                        <Title>Offres non retenues</Title>
                        <Data>{dataObject[0].offresOut}</Data>
                    </ColorBlock>
                    <ColorBlock color="blue">
                        <Title>Offres en cours</Title>
                        <Data>{dataObject[0].offresIn}</Data>
                    </ColorBlock>
                    <ColorBlock color="yellow">
                        <Title>Projets en cours</Title>
                        <Data>{dataObject[0].projetsIn}</Data>
                    </ColorBlock>
                    <ColorBlock color="green">
                        <Title>Projets achevés</Title>
                        <Data>{dataObject[0].projetsOut}</Data>
                    </ColorBlock>
                </ContainerInfo>
            </BlockInfo>

            <BlockInfo>
                <h2 className="titre">Suivi des retards</h2>
                <ContainerRetard>
                    {" "}
                    {dataObject[0].nbreDERetard === 0 && (
                        <h3>
                            Vous n'avez pas d'offres/projets en retard ("Date Etape"
                            fixée ce jour ou dépassée).{" "}
                        </h3>
                    )}
                    {dataObject[0].nbreDERetard > 0 && (
                        <h3>
                            Vous avez <span>{dataObject[0].nbreDERetard}</span>{" "}
                            offres ou projets en retard (avec une "Date Étape" fixée
                            à aujourd'hui ou déjà dépassée).
                        </h3>
                    )}
                    <StyledTable>
                        <tbody>
                            {Array.isArray(dataObject[0].listProjetsRetard) &&
                                dataObject[0].listProjetsRetard.map(
                                    (object, index) => {
                                       
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handleProjet(object.id)
                                                        }
                                                    >
                                                        {object.nom}
                                                    </button>
                                                </td>
                                                <td>{object.entreprise}</td>
                                                <td>
                                                    {
                                                        statutLabels[object.statut]
                                                            .label
                                                    }
                                                </td>
                                                <td>
                                                    {formatDate(
                                                        object.date_etape.date
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                        </tbody>
                    </StyledTable>
                </ContainerRetard>
            </BlockInfo>
        </DashBoardDiv>
    );
};

export default DashBoard;

// const formatDate = (dateString) => {
//     const date = new Date(dateString); // Convertit la chaîne de date en objet Date
//     const day = String(date.getDate()).padStart(2, "0"); // Jour avec zéro initial
//     const month = String(date.getMonth() + 1).padStart(2, "0"); // Mois (indexé à partir de 0, donc +1)
//     const year = String(date.getFullYear()).slice(-2); // Année sur deux chiffres
//     return `${day}/${month}/${year}`;
// };
