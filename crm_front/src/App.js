import "./App.css";
import Login from "./Components/LoginPage/LoginPage";


import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Admin from "./pages/Admin";
import User from "./pages/User";
import Client from "./pages/client";

function App() {
    return (
        <>
            <div className="bg"></div>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/user/:userID" element={<User />} />
                    <Route path="/client/:clientID" element={<Client />} />
                    <Route path="*" element={<Login />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
