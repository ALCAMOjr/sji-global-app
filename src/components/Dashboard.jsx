import React, { useState, useContext, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import { CgLogOut } from "react-icons/cg";
import { GrUserAdmin } from "react-icons/gr";
import Context from '../context/abogados.context.jsx';
import { jwtDecode } from "jwt-decode";
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import useUser from "../hooks/auth.jsx";
import { GrHome } from "react-icons/gr";
import user from "../assets/user.png";
import logo2 from "../assets/logoGde.png";
import agendalogo from "../assets/agenda.png";
import reportelogo from "../assets/reporte.png";
import expedientelogo from "../assets/expedientes.png";
import expedienteSiallogo from "../assets/expedienteSial.png";
import tasklogo from "../assets/task.png";
import positionlogo from "../assets/posicion.png";
import template from "../assets/plantillas.png"
import hogar from "../assets/hogar.png"
import demanda from "../assets/caso-legal.png"
function Dashboard() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { jwt } = useContext(Context);
    const { logout } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState("");
    const [userType, setUserType] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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


    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (isSidebarOpen && !event.target.closest("#logo-sidebar") && !event.target.closest("button[aria-controls='logo-sidebar']")) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [isSidebarOpen]);

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
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <FaBars className="w-6 h-6" />
                            </button>

                            <a className="flex ms-2 md:me-24">
                                <img src={logo2} className="me-3 rounded-full h-14 w-32" alt="FlowBite Logo" />
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
                                                <a onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Cerrar sesión</a>
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
            >
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link to="/" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname === '/' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                <img src={hogar} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                <span className="ms-3">Hogar</span>
                            </Link>
                        </li>
                        {userType === 'coordinador' && (
                            <>
                                <li>
                                    <Link to="/abogados" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname === '/abogados' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                        <GrUserAdmin className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Abogados</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/expedientesSial" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname === '/expedientesSial' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                        <img src={expedienteSiallogo} className="flex-shrink-0 w-5 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Expedientes Sial</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/expedientes" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname === '/expedientes' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                        <img src={expedientelogo} className="flex-shrink-0 w-5 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Expedientes Tv</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/positions" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname === '/positions' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                        <img src={positionlogo} className="flex-shrink-0 w-5 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Posición Expedientes</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/agenda" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname === '/agenda' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                        <img src={agendalogo} className="flex-shrink-0 w-5 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Gestión Expedientes</span>
                                    </Link>
                                </li>




                            </>
                        )}
                        {userType === 'abogado' && (
                            <li>
                                <Link to="/gestion" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname === '/gestion' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                    <img src={tasklogo} className="flex-shrink-0 w-5 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    <span className="ms-3">Tus Expedientes</span>
                                </Link>
                            </li>
                        )}
                        <li>
                            <li>
                                <Link to="/demandas" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname === '/demandas' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                    <img src={demanda} className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    <span className="flex-1 ms-3 whitespace-nowrap">Demandas</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/demandas/plantillas" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname === '/demandas/plantillas' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                    <img src={template} className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    <span className="flex-1 ms-3 whitespace-nowrap">Plantillas Demandas</span>
                                </Link>
                            </li>

                            {userType === 'coordinador' && (
                                <li>
                                    <Link to="/reporte" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname === '/reporte' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                        <img src={reportelogo} className="flex-shrink-0 w-5 h-5 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Reporte</span>
                                    </Link>
                                </li>

                            )}
                            <a onClick={handleLogout} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <CgLogOut className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Cerrar sesión</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
            <main className="ml-64 pt-20 px-4">
                <Outlet />
            </main>
        </div>
    );
}

export default Dashboard;
