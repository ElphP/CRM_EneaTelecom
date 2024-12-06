
import Header from "../../components/Header";
import Nav from "../../components/Nav";

import React from 'react';
import styled from "styled-components";

const AdminContainer = styled.body`
display: flex;
flex-direction: column;
height: 100vh;
width: 100vw;
`

function Admin() {
  return (
    <AdminContainer>
      <Header>        
      </Header>
        <Nav></Nav>
    </AdminContainer>
  )
}

export default Admin
