import React from "react";
import styled from "styled-components";
import colors from "../../utils/style/colors";
import iconeTel from "../../assets/images/icones/phone.png";
import iconeMail from "../../assets/images/icones/mail.png";
import iconeLocation from "../../assets/images/icones/location.png";
import imgTrash from "../../assets/images/icones/trash.png";
import imgModify from "../../assets/images/icones/modify.png";

const StyledContactCard = styled.div`
    display: flex;
    padding: 20px;
    justify-content: space-between;
`;
const ContactBlock1 = styled.div`
    display: flex;
  width: 35%;
`;

const Identity = styled.div`
    padding-left: 20px;
    width: 60%;
`;

const StyledTel = styled.div`
    width: 10%;
    padding-top: 5px;
    font-weight: bold;
`;
const StyledMail = styled.div`
   width: 24%;
    padding-top: 5px;
    font-weight: bold;
`;
const StyledLocation = styled.div`
    width: 30%;
    padding-top: 5px;
    font-weight: bold;
`;

const NomComplet = styled.p`
    color: ${colors.dark};
    font-weight: bold;
    font-size: 1.6rem;
    span {
        font-weight: 100;
        font-size: 1.4rem;
    }
`;
const Entreprise = styled.p`
    color: ${colors.secondary};
    font-weight: bold;
    font-size: 1.2rem;
`;
const Antenne = styled.p`
    color: ${colors.tertiary};
    font-size:1.2rem;
    font-weight: bold;
`;
const ContactTrash = styled.div`
    button {
        background-color: rgb(249, 64, 64);
        width: 50px;
        height: 50px;
        border-radius: 10px;
        border: none;
        margin: 0 5px 5px 5px;
        cursor:pointer;
    }
`;
const ContactModify = styled.div`
    button {
        background-color: #007bff;
        width: 50px;
        height: 50px;
        border-radius: 10px;
        border: none;
        margin: 0 5px 5px 5px;
        cursor: pointer;
    }
`;

const ContactCard = ({
    contactModal, 
    dataObject
}) => {
    //* CI =0, To=1, Be=2
    let antenne_enea="";
    switch (dataObject.antenne_enea) {
        case "CI":
            antenne_enea = "Côte d'Ivoire";
            break;
        case "To":
            antenne_enea = "Togo";
            break;
        case "Be":
            antenne_enea = "Bénin";
            break;

        default:
            break;
    }


    const nom = dataObject.nom?.toUpperCase() ?? "Nom indisponible";

    return (
        <StyledContactCard>
            <ContactBlock1>
                <div>
                    <ContactTrash>
                        <button
                            onClick={() => contactModal("suppr", dataObject)}
                            id={dataObject.id}
                        >
                            <img
                                className="trash"
                                src={imgTrash}
                                alt="poubelle"
                                height="32px"
                            />
                        </button>
                    </ContactTrash>
                    <ContactModify>
                        <button
                            onClick={() => contactModal("update", dataObject)}
                            id={dataObject.id}
                        >
                            <img
                                className="modify"
                                src={imgModify}
                                alt="modification"
                                height="32px"
                            />
                        </button>
                    </ContactModify>
                </div>
                <Identity>
                    <NomComplet>
                        {nom} {dataObject.prenom} <span>({dataObject.sexe})</span>
                    </NomComplet>
                    <Entreprise>{dataObject.entreprise}</Entreprise>
                    <p>{dataObject.fonction}</p>
                    <Antenne>{antenne_enea}</Antenne>
                </Identity>
            </ContactBlock1>
            <StyledTel>
                <img src={iconeTel} alt="iconeTel" width={"32px"} />
                <div>
                    <p>{dataObject.tel1}</p>
                    <p>{dataObject.tel2}</p>
                </div>
            </StyledTel>
            <StyledMail>
                <img src={iconeMail} alt="iconeMail" width={"32px"} />
                <div>
                    <p>{dataObject.mail1}</p>
                    <p>{dataObject.mail2}</p>
                </div>
            </StyledMail>
            <StyledLocation>
                <img src={iconeLocation} alt="iconeLocation" width={"32px"} />
                <div>
                    <p>{dataObject.adresse}</p>
                    <p>
                        {dataObject.CP} - {dataObject.ville}
                    </p>
                </div>
            </StyledLocation>
        </StyledContactCard>
    );
};

export default ContactCard;
