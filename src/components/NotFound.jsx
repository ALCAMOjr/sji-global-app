import React from 'react';

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-white text-primary font-medium">
      <div className="text-center">
        <h1 className="text-4xl">404</h1>
        <p className="text-lg">No se pudo encontrar esta página.</p>
      </div>
    </div>
  );
}

export default NotFound;
