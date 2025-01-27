import React from "react";
import styled from "styled-components";

const Formulaire = styled.form`
    display: flex;
    flex-direction: column;
    .row {
        display: flex;
        justify-content: space-around;
        margin: 10px;
    }
    .row > label {
        text-align: center;
        width: 100px;
        padding-right: 10px;

        display: flex;
        justify-content: space-around;
    }
    input {
        padding: 5px;
    }
    select {
        padding: 0;
    }

    .doubleRow > input {
        width: 480px;
    }
`;

function FormContact({dataContact, handleChange}) {

  return  <Formulaire>
        <div className="row">
         
            <div>
                <input
                    type="radio"
                    id="M"
                    name="sexe"
                    value="M"
                    onChange={handleChange}
                    checked={dataContact.sexe === "M" ? true : false}
                    required
                />
                <label htmlFor="M"> Homme</label>
            </div>

            <div>
                <input
                    type="radio"
                    id="F"
                    name="sexe"
                    value="F"
                    onChange={handleChange}
                    checked={dataContact.sexe === "F" ? true : false}
                    required
                />
                <label htmlFor="F"> Femme</label>
            </div>
        </div>
        <div className="row">
            <label htmlFor="nom">Nom</label>
            <input
                type="text"
                name="nom"
                id="nom"
                value={dataContact.nom}
                onChange={handleChange}
                required
            />

            <label htmlFor="prenom">Prénom</label>
            <input
                type="text"
                name="prenom"
                id="prenom"
                value={dataContact.prenom}
                onChange={handleChange}
            />
        </div>
        <div className="row">
        

            <label htmlFor="fonction">Fonction</label>
            <input
                type="text"
                name="fonction"
                id="fonction"
                value={dataContact.fonction}
                onChange={handleChange}
                required
            />
        </div>
        <div className="row">
            <label htmlFor="tel1">Téléphone 1</label>
            <input
                type="text"
                name="tel1"
                id="tel1"
                value={dataContact.tel1}
                onChange={handleChange}
            />

            <label htmlFor="tel2">Téléphone 2</label>
            <input
                type="text"
                name="tel2"
                id="tel2"
                value={dataContact.tel2}
                onChange={handleChange}
            />
        </div>
        <div className="row">
            <label htmlFor="mail1">Mail 1</label>
            <input
                type="email"
                name="mail1"
                id="mail1"
                value={dataContact.mail1}
                onChange={handleChange}
            />

            <label htmlFor="mail2">Mail 2</label>
            <input
                type="email"
                name="mail2"
                id="mail2"
                value={dataContact.mail2}
                onChange={handleChange}
            />
        </div>
        <div className="doubleRow row">
            <label htmlFor="adresse">Adresse</label>
            <input
                type="text"
                name="adresse"
                id="adresse"
                value={dataContact.adresse}
                onChange={handleChange}
            />
        </div>
        <div className="row">
            <label htmlFor="CP">CP</label>
            <input
                type="text"
                name="CP"
                id="CP"
                value={dataContact.CP}
                onChange={handleChange}
            />

            <label htmlFor="ville">Ville</label>
            <input
                type="text"
                name="ville"
                id="ville"
                value={dataContact.ville}
                onChange={handleChange}
            />
        </div>
        
    </Formulaire>;
    
}

export default FormContact;
