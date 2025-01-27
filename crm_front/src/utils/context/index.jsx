import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children, tempsConnexion }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Ajout d'un état pour gérer le chargement
    

    useEffect(() => {
       
        
        const fetchUserData = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL;
                const url = new URL(`${apiUrl}/api/connexion/info`);
                // Récupère les données utilisateur depuis l'API
                const response = await fetch(url, {
                    method: "GET",
                    credentials: "include", // Assure-toi que les cookies sont envoyés si nécessaire
                });

                if (!response.ok) {
                    throw new Error(
                        "Erreur lors de la récupération des données utilisateur"
                    );
                }

                const data = await response.json();

                setUser(data[0]); // Met à jour l'état utilisateur
            } catch (error) {
                console.error("Error");

                setUser(null); // Réinitialise l'utilisateur
            } finally {
                setLoading(false); // Fin du chargement
            }
        };

        fetchUserData();
    }, []); // Le tableau vide garantit que l'effet ne s'exécute qu'une seule fois

    return (
        <UserContext.Provider value={{ user, loading, tempsConnexion }}>
            {children}
        </UserContext.Provider>
    );
};
