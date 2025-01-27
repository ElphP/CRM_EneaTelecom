import React from 'react'
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
        text-align: left;
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
        width: 460px;
    }
`;
function FormEntreprise({dataEntreprise, handleChange}) {
  return (
      <Formulaire>
          <div className="row">
              <label htmlFor="antenne_enea">Antenne EneaTelecom</label>
              <select
                  name="antenne_enea"
                  id="antenne_enea"
                  value={dataEntreprise.antenne_enea || "All"}
                  onChange={handleChange}
              >
                  <option value="All">Toutes</option>
                  <option value="CI">Côte d'Ivoire</option>
                  <option value="To">Togo</option>
                  <option value="Be">Bénin</option>
              </select>
              <label htmlFor="cat">Catégorie</label>
              <select
                  name="cat"
                  id="cat"
                  value={dataEntreprise.cat || "Prospect"}
                  onChange={handleChange}
              >
                  <option value="Prospect">Prospect</option>
                  <option value="Client">Client</option>
                  <option value="Fournisseur">Fournisseur</option>
                  <option value="EneaTelecom">EneaTelecom</option>
              </select>
          </div>
          <div className="doubleRow row">
              <label htmlFor="nom">Nom</label>
              <input
                  type="text"
                  name="nom"
                  id="nom"
                  value={dataEntreprise.nom}
                  onChange={handleChange}
                  required
              />
          </div>
          <div className="doubleRow row">
              <label htmlFor="adresse">Adresse</label>
              <input
                  type="text"
                  name="adresse"
                  id="adresse"
                  value={dataEntreprise.adresse || ""}
                  onChange={handleChange}
              />
          </div>
          <div className="row">
              <label htmlFor="CP">CP</label>
              <input
                  type="text"
                  name="CP"
                  id="CP"
                  value={dataEntreprise.CP || ""}
                  onChange={handleChange}
              />

              <label htmlFor="ville">Ville</label>
              <input
                  type="text"
                  name="ville"
                  id="ville"
                  value={dataEntreprise.ville || ""}
                  onChange={handleChange}
              />
          </div>
      </Formulaire>
  );
}

export default FormEntreprise
