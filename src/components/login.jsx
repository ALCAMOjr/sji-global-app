import { useState, useEffect } from 'react';
import useUser from "../hooks/auth.jsx";
import logo from "../assets/logoGde.png";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Spinner } from "@nextui-org/react";
import FooterPageLogin from './Footer_Login.jsx';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
    const [isLoading, setIsLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const { isLoginLoading, hasLoginError, setHasLoginError, login, isLogged, isCoordinador } = useUser();
    const navigate = useNavigate();
    const [shouldRenderFooter, setShouldRenderFooter] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
    const [email, setEmail] = useState(""); // Para el input del correo en el modal
    const [emailError, setEmailError] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerHeight < 700) {
                setShouldRenderFooter(false);
            } else {
                setShouldRenderFooter(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setIsLoading(true);

        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 0);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (isLogged) {
            navigate('/');
            onLogin && onLogin();
        }
    }, [isLogged, isCoordinador, navigate, onLogin]);

    const handleShowPassword = (event) => {
        event.preventDefault();
        setShowPassword(!showPassword);
    };

    const handleInputChange = (e, setInput, setError) => {
        setFormSubmitted(false);
        setInput(e.target.value);
        setError(false);
        if (hasLoginError) setHasLoginError(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        if (username.trim() === "") {
            setUsernameError(true);
        } else {
            setUsernameError(false);
        }
        if (password.trim() === "") {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
        if (username.trim() !== "" && password.trim() !== "") {
            if (hasLoginError) setHasLoginError(false);
            login({ username, password }).then(() => {
                navigate('/');
            });
        }
    };

    const handleForgotPassword = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEmail("");
        setEmailError(false);
    };

    const handleSendPasswordReset = () => {
        if (email.trim() === "") {
            setEmailError(true);
        } else {
            // Aquí iría la lógica para enviar el correo
            console.log("Enviando correo de recuperación a:", email);
            closeModal();
        }
    };

    const showPasswordError = formSubmitted && passwordError;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner className="h-10 w-10 ml-4" color="primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 z-99">
            <div className="max-w-lg mb-auto relative" style={{ width: '100%', maxWidth: '500px', marginTop: '80px' }}>
                <div className="flex justify-center mb-8">
                    <img src={logo} className="h-24 w-44 me-3" />
                </div>
                <div className="bg-white w-full rounded-lg p-8 mb-8 relative flex flex-col items-center">
                    <div className="flex flex-col items-center gap-1 mb-8">
                        <h1 className="text-xl text-gray-900">Bienvenido</h1>
                        <p className="text-gray-400 text-sm">
                            Ingresa con tu usuario y tu contraseña
                        </p>
                    </div>
                    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                        <div className="w-full">
                            <input
                                type="text"
                                className={`w-full border py-2 px-4 rounded-md outline-none ${usernameError ? 'border-red-500' : ''}`}
                                placeholder="Usuario"
                                onChange={(e) => handleInputChange(e, setUsername, setUsernameError)}
                                value={username}
                            />
                            {formSubmitted && usernameError && <span className="text-red-500 text-xs">Este campo es obligatorio</span>}
                        </div>
                        <div className="w-full relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`w-full border py-2 px-4 rounded-md outline-none ${showPasswordError ? 'border-red-500' : ''}`}
                                placeholder="Contraseña"
                                onChange={(e) => handleInputChange(e, setPassword, setPasswordError)}
                                value={password}
                            />
                            <button
                                onClick={handleShowPassword}
                                className="absolute right-2 top-[50%] transform -translate-y-1/2"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                            {showPasswordError && <span className="text-red-500 text-xs">Este campo es obligatorio</span>}
                        </div>
                        <div className="w-full">
                            <button
                                type="submit"
                                className="w-full bg-primary py-2 px-4 text-white rounded-md hover:bg-[#e6534e] transition-colors"
                            >
                                {isLoginLoading ? <Spinner size="sm" color="default" /> : 'Iniciar sesión'}
                            </button>
                        </div>
                    </form>
                    <div className="w-full text-center mt-4">
                        <button
                            onClick={handleForgotPassword}
                            className="text-sm text-gray-500 hover:text-primary transition-colors"
                        >
                            ¿Olvidó Contraseña?
                        </button>
                    </div>
                    {formSubmitted && hasLoginError && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 sm:-bottom-3 md:bottom-1 lg:bottom-1 text-sm">
                            <strong>Usuario o contraseña inválido</strong>
                        </div>
                    )}
                </div>
            </div>
            {shouldRenderFooter && <FooterPageLogin />}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl mb-4">Recuperar contraseña</h2>
                        <input
                            type="email"
                            className={`w-full border py-2 px-4 rounded-md outline-none ${emailError ? 'border-red-500' : ''}`}
                            placeholder="Escribe tu correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <span className="text-red-500 text-xs">Este campo es obligatorio</span>}
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-md"
                                onClick={closeModal}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-primary text-white rounded-md"
                                onClick={handleSendPasswordReset}
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
