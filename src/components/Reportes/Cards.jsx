import React from "react";
import { Card } from "flowbite-react";
import { colorMap } from "../../utils/Colors.js"; // Import the shared colorMap

const Cards = ({ reportesDetalles }) => {
  return (
    <div className="mt-24 mb-4 flex justify-center items-center">
      <div className="w-full max-w-4xl">
        <Card className="bg-white text-black transform transition duration-500 ease-in-out hover:scale-105">
          <div className="mb-4 flex items-center justify-between">
            <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white">
              Reporte Final
            </h5>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <li className="py-3 sm:py-4 flex justify-between font-bold text-gray-900 dark:text-white">
                <div className="w-1/3 text-xs flex items-center">
                  <span>Color</span>
                </div>
                <div className="w-1/3 text-xs flex justify-start">
                  <span>Etapa</span>
                </div>
                <div className="w-1/3 text-xs flex justify-end">
                  <span>Total de Créditos</span>
                </div>
              </li>
              {reportesDetalles.map((reporte, index) => {
                const etapa = reporte.Etapa;
                const totalCreditos = reporte.Total_Creditos;
                const color = colorMap[etapa] || '#FFFFFF';

                return (
                  <li key={index} className="py-3 sm:py-4 flex justify-between">
                    <div className="w-1/3 flex items-center">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                    <div className="w-1/3 flex justify-center">
                      <p className="text-sm font-medium text-gray-500 dark:text-white">{etapa}</p>
                    </div>
                    <div className="w-1/3 flex justify-end">
                      <p className="text-sm font-medium text-gray-500 dark:text-white">{totalCreditos}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Cards;
