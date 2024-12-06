import React from 'react'
import colors from "../../utils/style/colors";
import styled from "styled-components";
import logo from "../../assets/images/logo.png";



const HeaderContainer = styled.header`
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${colors.dark};
    img {
        width: 200px;
        margin-left: 100px;
        flex-grow: 0;
        border-radius: 5px;
        
    }
    h1  {
        flex-grow: 0;
        margin-left: 15px;
        font-family: Roboto, sans-serif;
        font-weight: 400;
        color: ${colors.primary};
    }
    div  {
        flex-grow: 1;
    }
`;

export default function Header() {
  return (
      <>
          <HeaderContainer>
          
                  <img src={logo} alt="logoEneaTelecom" />
                  <h1>CRM Enea Telecom</h1>
                  <div></div>
              
          </HeaderContainer>
      </>
  );
}
