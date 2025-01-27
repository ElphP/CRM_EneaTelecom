

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import User from "./pages/User";
// import Client from "./pages/Client";
import Login from "./pages/Login";

import "./App.css";
import { useState, useEffect } from "react";
import { UserProvider }  from "./utils/context";
import { jwtDecode } from "jwt-decode";

import Header from "./components/Header";

const App = () => {
  const [token,setToken]= useState(null);
  const [authorizedRoutes,setAuthorizedRoutes]= useState([]);
const [tempsConnexion, setTempsConnexion] = useState(0);

  
  useEffect(() => {
    if (typeof token === "string") {
          const decodedToken = jwtDecode(token);

          setTempsConnexion(
              Math.floor((decodedToken.exp - Math.floor(Date.now() / 1000)) / 60)
          );
    }
   
  
   
  }, [token])
  

     
  
 
  return (
      <Router>
          <Routes>
              {/* Route publique */}
              <Route
                  path="/login"
                  element={
                      <Login
                          setToken={setToken}
                          setAuthorizedRoutes={setAuthorizedRoutes}
                      />
                  }
              />

              {/* Routes protégées */}
              <Route
                  path="/admin/:content"
                  element={
                      <ProtectedRoute
                          allowedRoles={authorizedRoutes}
                          token={token}
                      >
                          <UserProvider tempsConnexion={tempsConnexion}>
                              <Header />
                              <Admin />
                          </UserProvider>
                      </ProtectedRoute>
                  }
              />
              <Route
                  path="/user/:userId"
                  element={
                      <ProtectedRoute
                          allowedRoles={authorizedRoutes}
                          token={token}
                      >
                          <User />
                      </ProtectedRoute>
                  }
              />
              {/* <Route
                  path="/Client/:clientID"
                  element={
                      <ProtectedRoute allowedRoles={["Client"]} token={token} />
                  }
              >
                  <Route index element={<Client />} />
              </Route> */}

              {/* Redirection pour toutes les autres routes non définies */}
              <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
      </Router>
  );
};

export default App;

