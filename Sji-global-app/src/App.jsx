// App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from "./components/login.jsx";
import { UserContextProvider } from './context/abogados.context.jsx';
import Dashboard from "./components/Dashboard.jsx";
import ProtectedRoute from "./components/middleware/ProtectedRoute.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextUIProvider } from "@nextui-org/react";
import { ProviderModal } from './components/Expediente/ContextModal.jsx';

function App() {
  return (
    <NextUIProvider>

<ProviderModal>
          <UserContextProvider>
            <ToastContainer />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <>
                  <ProtectedRoute element={<Dashboard />} />
                </>
              } />
            </Routes>
          </UserContextProvider>
          </ProviderModal>
    </NextUIProvider>
  );
}

export default App;
