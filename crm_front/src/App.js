

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import User from "./pages/User";
// import Client from "./pages/Client";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import "./App.css";
import { useState } from "react";

const App = () => {
  const [token,setToken]= useState(null);
  const [authorizedRoutes,setAuthorizedRoutes]= useState([]);

 
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
                          <Admin />
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

              {/* Route pour accès non autorisé */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              {/* Redirection pour toutes les autres routes non définies */}
              <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
      </Router>
  
  );
};

export default App;

