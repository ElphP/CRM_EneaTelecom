import React from "react";
import styled from "styled-components";

import colors from "../../utils/style/colors";
import dashboard from "../../assets/images/icones/dashboard.png";
import societe from "../../assets/images/icones/societe.png";
import contact from "../../assets/images/icones/contact.png";
import offres from "../../assets/images/icones/offres.png";
import projets from "../../assets/images/icones/projet.png";

const NavContainer = styled.nav`
    padding: 50px;
    width: 350px;
    
    display: flex;
    flex-direction: column;

    /* border-right: 1px solid ${colors.gray}; */
    background-color: #d9eafc;
    font-family: Oswald, sans-serif;
`;

const StyledButton = styled.button`
    font-size: 1.2rem;
    border: none;
    margin: 8px;
    background-color: transparent;
    cursor: pointer;
    color: ${colors.dark};
    flex-grow: 1;
    text-align: start;
`;

const Icons = styled.img`
    width: 30px;
    height: 30px;
    flex-grow: 0;
`;

const StyledLi = styled.li`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

function Nav({ handleClick }) {
    const buttons = [
        {
            src: dashboard,
            alt: "iconDashBoard",
            id: "dashboard",
            label: "Tableau de bord",
        },
        {
            src: societe,
            alt: "iconDashBoard",
            id: "societe",
            label: "Entreprises",
        },
        {
            src: contact,
            alt: "iconDashBoard",
            id: "contact",
            label: "Contacts",
        },
        {
            src: offres,
            alt: "iconDashBoard",
            id: "offres",
            label: "Offres",
        },
        {
            src: projets,
            alt: "iconDashBoard",
            id: "projets",
            label: "Projets",
        },
    ];
    return (
        <NavContainer>
            <ul>
                {buttons.map((btn) => (
                    <StyledLi key={btn.id}>
                        <Icons src={btn.src} alt={btn.alt}></Icons>
                        <StyledButton onClick={() => handleClick(btn.id)}>
                            {btn.label}
                        </StyledButton>
                    </StyledLi>
                ))}
                {/* <StyledLi>
                    <Icons src={dashboard} alt="iconDashBoard"></Icons>
                    <StyledButton onClick={() => handleClick(btn.id)}></StyledButton>
                    <StyledButton onClick={(event) => fetchContent(event)}>
                        Tableau de bord
                    </StyledButton>
                </StyledLi>
                <StyledLi>
                    <Icons src={societe} alt="iconSociete"></Icons>
                    <StyledButton >
                        Sociétés
                    </StyledButton>
                </StyledLi>
                <StyledLi>
                    <Icons src={contact} alt="iconSociete"></Icons>
                    <StyledButton >
                        Contacts
                    </StyledButton>
                </StyledLi>
                <StyledLi>
                    <Icons src={offres} alt="iconOffres"></Icons>
                    <StyledButton>
                        Offres
                    </StyledButton>
                </StyledLi>
                <StyledLi>
                    <Icons src={projets} alt="iconProjets"></Icons>
                    <StyledButton >
                        Projets
                    </StyledButton>
                </StyledLi> */}
            </ul>
        </NavContainer>
    );
}

export default Nav;
