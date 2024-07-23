import React, { useState, useContext, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import { CgLogOut } from "react-icons/cg";
import { GrUserAdmin } from "react-icons/gr";
import { LiaSellsy } from "react-icons/lia";
import Context from '../context/abogados.context.jsx';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import useUser from "../hooks/auth.jsx";
import { GrHome } from "react-icons/gr";
import Home from './Home.jsx';
import user from "../assets/user.png"
import logo2 from "../assets/sji.png";
import Abogados from './Abogados/Abogado.jsx';
import expedientelogo from "../assets/expedientes.png"
import tasklogo from "../assets/task.png"
import Expedientes from './Expediente/Expedientes.jsx';
function Dashboard() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { jwt } = useContext(Context);
    const { logout } = useUser()
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [userType, setUserType] = useState("");
    const [isHomeActive, setIsHomeActive] = useState(true);
    const [isAbogadosActive, setIsAbogadosActive] = useState(false);
    const [isExpedienteActive, setIsExpedienteActive] = useState(false);
    const [isTaskActive, setIsTaskActive] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if (jwt) {
            const decodedToken = jwtDecode(jwt);
            setUsername(decodedToken.userForToken.username);
            setUserType(decodedToken.userForToken.userType);
        }
    }, [jwt]);


    const handleLogout = () => {
        logout();
        navigate('/login'); 
    };


    const handleHomeClick = () => {
        setIsHomeActive(true); 
        setIsAbogadosActive(false); 
        setIsExpedienteActive(false); 
        setIsTaskActive(false)
    };

    const handleAbogadosClick = () => {
        setIsHomeActive(false); 
        setIsAbogadosActive(true); 
        setIsExpedienteActive(false); 
        setIsTaskActive(false)
    };

    const handleExpedienteClick = () => {
        setIsHomeActive(false); 
        setIsAbogadosActive(false); 
        setIsExpedienteActive(true); 
        setIsTaskActive(false)
    };

    const handleTaskClick = () => {
        setIsHomeActive(false); 
        setIsAbogadosActive(false); 
        setIsExpedienteActive(false); 
        setIsTaskActive(true)
    };




    const handleDynamicClick = () => {
        if (userType === 'coordinador') {
            handleExpedienteClick();
        } else if (userType === 'abogado') {
            handleTaskClick();
        }
    };

    useEffect(() => {
        
        const handleDocumentClick = (event) => {
            if (isMenuOpen && !event.target.closest("#logo-sidebar")) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [isMenuOpen]);

    const handlerSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }


    return (
        <div>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button
                                onClick={handlerSidebar}
                                aria-controls="logo-sidebar"
                                type="button"
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg xl:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <FaBars className="w-6 h-6" />
                            </button>

                            <a href="https://gateway.pinata.cloud/ipfs/QmfDd1ht7GD3jcmtzNuNvc8xgLWcmy4jtendDAtf58vVMK" className="flex ms-2 md:me-24">
                                <img src={logo2} className="h-8 me-3 rounded-full" alt="FlowBite Logo" />
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">SJI Global</span>
                            </a>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ms-3 relative">
                                {isMenuOpen && (
                                    <div className="absolute bg-white mt-48 ml-[-220%] sm:ml-[-200%] md:ml-[-220%] xs:ml-[-230%]s py-2 w-25 sm:w-26 md:w-28 xs:w-36 border rounded-lg shadow-lg">
                                        <div className="px-4 py-3" role="none">
                                            <p className="text-sm text-gray-900 dark:text-white" role="none">
                                                {username}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                                {userType}
                                            </p>
                                        </div>
                                        <ul>
                                            <li>
                                                <a onClick={handleLogout}  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Cerrar sesión</a>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                <div>
                                    <button
                                        onClick={(e) => {
                                            toggleMenu();
                                            e.stopPropagation(); 
                                        }}
                                        type="button"
                                        className="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 hover:scale-110 transition-transform duration-200"
                                        aria-expanded={isMenuOpen}
                                        data-dropdown-toggle="dropdown-user"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <div className="p-1 bg-white rounded-full">
                                            <img src={user} className="w-12 h-12" alt="User Icon" />
                                        </div>
                                    </button>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-gray-200 lg:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
                aria-label="Sidebar"
            >   <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <a className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isHomeActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`} onClick={handleHomeClick}>
                                <GrHome className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                <span className="ms-3">Hogar</span>
                            </a>
                        </li>
                        
                        <li>
                            {userType === 'coordinador' && (
                                <a className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isAbogadosActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`} onClick={handleAbogadosClick}>
                                    <GrUserAdmin className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    <span className="flex-1 ms-3 whitespace-nowrap">Abogados</span>
                                </a>
                            )}
                        </li>
                        <li>
                            {userType === 'coordinador' && (
                                <a className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isExpedienteActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`} onClick={handleExpedienteClick}>

                                    <img src={expedientelogo} className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    <span className="flex-1 ms-3 whitespace-nowrap">Expedientes</span>
                                </a>
                            )}
                        </li>
                        <li>
                            <a className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isTaskActive ? 'bg-gray-100 dark:bg-gray-700' : ''}`} onClick={handleTaskClick}>
                            <img src={tasklogo} className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                            <span className="ms-3">Tareas</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={handleLogout} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <CgLogOut className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Cerrar sesión</span>
                            </a>
                        </li>
                  

                    </ul>
                </div>
            </aside>
            <div className="flex justify-center items-center h-full">
            <div className="mt-40">
                    {isHomeActive && <Home handleDynamicClick={handleDynamicClick}  />}
                    {isAbogadosActive && <Abogados />} 
                    {isExpedienteActive && <Expedientes />} 
                    {isTaskActive && <Home />} 
                </div>
            </div>

        
        </div>
    );
}

export default Dashboard;
