import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserContextProvider } from './context/abogados.context.jsx';
import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NotFound from './components/NotFound.jsx';
import Login from "./components/login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProtectedRoute from "./components/middleware/ProtectedRoute.jsx";
import Expedientes from './components/Expediente/Expedientes.jsx';
import Abogados from './components/Abogados/Abogado.jsx';
import Home from './components/Home.jsx';
import Agenda from './components/Agenda/Agenda.jsx';
import ExpedientesSial from './components/ExpedienteSial/ExpedienteSial.jsx';
import Position from './components/Posicion/Position.jsx';
function App() {
  return (
    <NextUIProvider>
      <UserContextProvider>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute element={<Dashboard />} />}>
            <Route path="/" element={<Home />} />
            <Route path="/abogados" element={<Abogados />} />
            <Route path="/expedientes" element={<Expedientes />} />
            <Route path="/expedientesSial" element={<ExpedientesSial />} />
            <Route path="/positions" element={<Position />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/reporte" element={<Agenda />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserContextProvider>
    </NextUIProvider>
  );
}

export default App;
