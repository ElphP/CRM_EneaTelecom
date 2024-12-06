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
    width: 250px;
    height: 100%;
    display: flex;
    flex-direction: column;

    /* border-right: 1px solid ${colors.gray}; */
    background-color: #d9eafc;
    font-family: Oswald, sans-serif;
`;

const StyledButton = styled.button`
    font-size: 1.5rem;
    border :none;
    margin:8px;
    background-color: transparent;
    cursor: pointer;
    color: ${colors.dark};
    flex-grow: 1;
    text-align: start;
`

const Icons = styled.img`
    width: 30px;
    height: 30px;
    flex-grow: 0;
`

const StyledLi = styled.li`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`

function Nav({ setContent }) {
    return (
        <NavContainer>
            <ul>
                <StyledLi>
                    <Icons src={dashboard} alt="iconDashBoard"></Icons>
                    <StyledButton onCLick={() => setContent("bureau")}>
                        Bureau
                    </StyledButton>
                </StyledLi>
                <StyledLi>
                    <Icons src={societe} alt="iconSociete"></Icons>
                    <StyledButton onCLick={() => setContent("societe")}>
                        Sociétés
                    </StyledButton>
                </StyledLi>
                <StyledLi>
                    <Icons src={contact} alt="iconSociete"></Icons>
                    <StyledButton onCLick={() => setContent("contacts")}>
                        Contacts
                    </StyledButton>
                </StyledLi>
                <StyledLi>
                    <Icons src={offres} alt="iconOffres"></Icons>
                    <StyledButton onCLick={() => setContent("offres")}>
                        Offres
                    </StyledButton>
                </StyledLi>
                <StyledLi>
                    <Icons src={projets} alt="iconProjets"></Icons>
                    <StyledButton onCLick={() => setContent("projets")}>
                        Projets
                    </StyledButton>
                </StyledLi>
            </ul>
        </NavContainer>
    );
}

export default Nav;
