import React, { useState, useEffect } from "react";
import colors from "../../utils/style/colors";
import styled from "styled-components";
import logo from "../../assets/images/logo.png";
import { useUser } from "../../utils/hooks";
import { useNavigate } from "react-router-dom";
import offButton from "../../assets/images/icones/offButton.svg";

const HeaderContainer = styled.header`
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${colors.dark};
    padding: 10px;
    .logo {
        width: 200px;
        margin-left: 100px;
        flex-grow: 0;
        border-radius: 5px;
    }
    .deconnexion {
        width: 32px;
        margin: 0 15px;
    }
    h1 {
        flex-grow: 0;
        margin-left: 15px;
        font-family: Oswald, sans-serif;
        font-weight: 400;
        color: ${colors.primary};
        font-size: 2.8rem;
    }
    h2 {
        color: white;
        font-size: 1.6rem;
        align-self: flex-end;
        padding: 5px 20px;
        font-family: Oswald, sans-serif;
        font-weight: 400;
    }
   .vide {
    flex-grow: 1;
   }
    .CaR {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        width: 80px;
        text-align: center;
        flex-grow: 0;
        padding: 5px;

        .compte {
            background-color: #fff;
            font-weight: bold;
        }
        h3 {
            color: ${colors.primary};
        }
    }
`;

const ConnexionDiv = styled.div`
    display: flex;
    flex-grow: 0;
    border: 3px solid ${colors.primary};
    border-radius: 10px;
    .deconnexion  {
        background-color: ${colors.dark};
       border: none;
    }
    .deconnexion:hover  {
        cursor: pointer;
    }
`;

function Header() {
    const { user, loading, tempsConnexion } = useUser(); // Déstructure pour obtenir 'user', 'loading', 'error'
    const [compte, setCompte] = useState(tempsConnexion);
    const navigate = useNavigate();

    useEffect(() => {
        if (compte > 0) {
            const timer = setTimeout(() => {
                setCompte((prevCompte) => prevCompte - 1); // Utilise la version fonctionnelle
            }, 60000);

            return () => clearTimeout(timer); // Nettoie le timeout pour éviter les fuites
        }
        if (compte <= 0) {
            navigate("/login");
        }
    }, [compte, navigate]); // Dépendance sur "compte"

    const handleClick=()=>  {
          navigate("/login");
    }

    return (
        <>
            <HeaderContainer>
                <img src={logo} alt="logoEneaTelecom" className="logo" />
                <h1>CRM EneaTelecom</h1>
                <div className="vide"></div>
                <h2>
                    {loading
                        ? "Chargement..."
                        : `Bonjour ${user.prenom} ${user.nom.toUpperCase()},`}
                    {!user && !loading && "Utilisateur non trouvé"}
                </h2>

                <ConnexionDiv>
                    <button className="deconnexion" onClick={()=>handleClick()}>
                        <img src={offButton} alt="boutonDeconnexion" />
                    </button>
                    <div className="CaR">
                        <h3>Temps restant</h3>
                        <div className="compte">{compte}</div>
                    </div>
                </ConnexionDiv>
            </HeaderContainer>
        </>
    );
}

export default Header;
