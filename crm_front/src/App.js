

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import User from "./pages/User";
import Client from "./pages/Client";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import "./App.css";

const App = () => {
  const token = localStorage.getItem("authToken");

  return (
      <Router>
          <Routes>
              {/* Route publique */}
              <Route path="/login" element={<Login />} />

              {/* Routes protégées */}
              {/* <Route
          path="/Admin"
          element={<ProtectedRoute allowedRoles={['Admin']} token={token} />}
        > */}
              <Route path="/Admin" element={<Admin />} />
              {/* </Route> */}
              <Route
                  path="/User/:userID"
                  element={
                      <ProtectedRoute allowedRoles={["User"]} token={token} />
                  }
              >
                  <Route index element={<User />} />
              </Route>
              <Route
                  path="/Client/:clientID"
                  element={
                      <ProtectedRoute allowedRoles={["Client"]} token={token} />
                  }
              >
                  <Route index element={<Client />} />
              </Route>

              {/* Route pour accès non autorisé */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              {/* Redirection pour toutes les autres routes non définies */}
              <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
      </Router>
  );
};

export default App;
