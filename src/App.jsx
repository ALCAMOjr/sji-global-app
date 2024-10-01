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
import Reporte from './components/Reportes/Reportes.jsx';
import Tarea from './components/Tareas.jsx/Tarea.jsx';
import RoleProtectedRoute from './components/middleware/RolProtectedRouter.jsx';

function App() {
  return (
    <NextUIProvider>
      <UserContextProvider>
        <ToastContainer />
        <Routes>
  <Route path="/login" element={<Login />} />

  <Route element={<ProtectedRoute element={<Dashboard />} />}>
    <Route path="/" element={<Home />} />

    <Route
      path="/abogados"
      element={<RoleProtectedRoute element={<Abogados />} allowedRoles={['coordinador']} />}
    />
    <Route
      path="/expedientes"
      element={<RoleProtectedRoute element={<Expedientes />} allowedRoles={['coordinador']} />}
    />
    <Route
      path="/expedientesSial"
      element={<RoleProtectedRoute element={<ExpedientesSial />} allowedRoles={['coordinador']} />}
    />
    <Route
      path="/positions"
      element={<RoleProtectedRoute element={<Position />} allowedRoles={['coordinador']} />}
    />
    <Route
      path="/agenda"
      element={<RoleProtectedRoute element={<Agenda />} allowedRoles={['coordinador']} />}
    />
    <Route
      path="/reporte"
      element={<RoleProtectedRoute element={<Reporte />} allowedRoles={['coordinador']} />}
    />

    <Route
      path="/gestion"
      element={<RoleProtectedRoute element={<Tarea />} allowedRoles={['abogado']} />}
    />
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>

      </UserContextProvider>
    </NextUIProvider>
  );
}

export default App;
