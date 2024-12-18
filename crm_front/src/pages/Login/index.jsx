import React from "react";
import styled from "styled-components";
import backgroundImage from "../../assets/images/background.jpg";
import logo from "../../assets/images/logo.png";
import colors from "../../utils/style/colors";
import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import {jwtDecode} from "jwt-decode";



    const GlobalPage = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    ` 
    const BackGround = styled.div`
        position: absolute;
        top: 0px;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url(${backgroundImage});
        background-size: cover;
        z-index: -50;
        opacity: 0.65;
    `;

    const StyledHeader = styled.div`
        position: relative;
        background-color: ${colors.primary};
        height: 80px;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        h1 {
            font-size: 2.2rem;
            font-family: Oswald, sans-serif;
            color: ${colors.dark};
            text-align: center;
        }
        .blue {
            color: ${colors.secondary};
        }
        .violet {
            color: ${colors.tertiary};
        }
        img {
            position: fixed;
            margin: 12px 100px;
            top: 0;
            left: 0;
            width: 200px;
        }
    `;

    const StyledLoginPage = styled.div`
        position: relative;
        width: 100vw;
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const LoginContainer = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

       
        form {
            display: flex;
            flex-direction: column;
            width: 300px;
            padding: 20px;
            border-radius: 8px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .formGroup {
            margin-bottom: 15px;
        }
        input {
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
        }
        .btnLogin {
            padding: 10px 15px;
            border-radius: 4px;
            border: none;
            background-color: ${colors.secondary};
            color: white;
            cursor: pointer;
            margin-top: 15px;
            font-size: 1.3rem;
            font-weight: bolder;
        }

        .error-message {
            padding: 10px 15px;
            margin-top: 20px;
            border-radius: 4px;
            color: red;
            font-size: 1.5rem;
            background-color: rgba(255, 255, 255, 0.6);
            white-space: pre-line;
            text-align: center;
        }

        .btnOubliMDP {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid ${colors.secondary};

            font-weight: bolder;
            cursor: pointer;
            margin-top: 30px;
            text-align: center;
            font-size: 1.1rem;
        }

        .btnOubliMDP:hover {
            background-color: ${colors.secondary};
            color: white;
        }
        .btnLogin:hover {
            color: ${colors.primary};
        }
    `;

   
const Login = ({setToken, setAuthorizedRoutes}) => {


        const navigate = useNavigate();

     const [username, setUsername] = useState("");
     const [password, setPassword] = useState("");
     const [dataToken, setDataToken] = useState("");
     

      const handleSubmit = async (event) => {
        event.preventDefault();
        //appel API pour le token
        const apiUrl = process.env.REACT_APP_API_URL;
        
        const response = await fetch(`${apiUrl}/api/login_check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
          
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const dataToken = await response.json();
            setDataToken(dataToken.token);
         
        } else if (response.status === 401 || response.status === 400) {
            navigate("/", {
                state: {
                    message: "Identifiants non reconnus.\nVeuillez réessayer.",
                },
            });
        } else if (response.status === 500) {
            navigate("/", {
                state: {
                    message:
                        "Erreur du serveur.\nVeuillez réessayer plus tard.",
                },
            });
        } else {
            navigate("/", {
                state: {
                    message: "Erreur.\nVeuillez réessayer plus tard.",
                },
            });
        }
    }

    useEffect(() => {
        if (dataToken) {
            const decodedPayload = jwtDecode(dataToken, { payload: true });
            
            if (decodedPayload.roles[0] === "ROLE_ADMIN") {
                setToken(dataToken);
                setAuthorizedRoutes(decodedPayload.roles); 
                navigate("/admin/dashboard");
            }
            if (decodedPayload.roles[0] === "ROLE_USER") {
                setToken(dataToken);
                setAuthorizedRoutes(decodedPayload.roles); 
                navigate("/user/dashboard/"+decodedPayload.username);
            }
        }
    }, [dataToken, navigate, setToken, setAuthorizedRoutes]);
    

    return (

        <GlobalPage>
            
            <StyledHeader>
                <img src={logo} alt="logoEneaTelecom" />
                <h1>
                    Connexion au CRM{" "}
                    <span className="blue">Enea Teleco</span>
                    <span className="violet">m</span>
                </h1>
            </StyledHeader>
            <StyledLoginPage>
                <BackGround></BackGround>
                <LoginContainer>
                    
                    <form
                      onSubmit={handleSubmit}
                    >
                        <div className="formGroup">
                            <label htmlFor="username">Email de connexion</label>
                            <input
                                type="text"
                                id="username"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="formGroup">
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className="btnLogin" type="submit">
                            Se connecter
                        </button>
                        <div
                            className="btnOubliMDP"
                            data-title="Cliquez ici pour obtenir un mail de réinitialisation (en indiquant bien votre email de connexion)."
                            //   onClick={handleForgottenPassword}
                        >
                            <p>Mot de passe oublié?</p>
                        </div>
                    </form>
                    <div>
                        {/* {message && <div className="error-message">{message}</div>} */}
                    </div>
                </LoginContainer>
            </StyledLoginPage>
        </GlobalPage>
    );
};

export default Login;
