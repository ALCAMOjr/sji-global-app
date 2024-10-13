// src/components/ModalesDemandas.jsx
import { useState } from "react";

const ModalesDemandas = ({ isSelectionModalOpen, setIsSelectionModalOpen }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const closeSelectionModal = () => {
    setIsSelectionModalOpen(false);
  };

  const openCreateModal = () => {
    setIsSelectionModalOpen(false);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const fields = [
    { label: "CRÉDITO", type: "number", placeholder: "Ingrese el crédito" },
    { label: "ACREDITADO", type: "text", placeholder: "Nombre del acreditado", resizable: true },
    { label: "ESCRITURA", type: "text", placeholder: "Número de escritura", resizable: true },
    { label: "FECHA ESCRITURA", type: "text", placeholder: "Fecha de escritura", resizable: true },
    { label: "INSCRIPCION", type: "text", placeholder: "Número de inscripción" },
    { label: "VOLUMEN", type: "number", placeholder: "Ingrese el volumen" },
    { label: "LIBRO", type: "text", placeholder: "Número de libro" },
    { label: "SECCION", type: "text", placeholder: "Sección correspondiente", resizable: true },
    { label: "UNIDAD", type: "text", placeholder: "Unidad de medida" },
    { label: "FECHA", type: "date" },
    { label: "MONTO OTORGADO", type: "number", placeholder: "Monto otorgado en pesos" },
    { label: "MES DE PRIMER ADEUDO", type: "text", placeholder: "Mes del primer adeudo" },
    { label: "MES CON ULTIMO ADEUDO", type: "text", placeholder: "Mes del último adeudo" },
    { label: "ADEUDO EN PESOS", type: "text", placeholder: "Monto del adeudo en pesos", resizable: true  },
    { label: "ADEUDO", type: "number", placeholder: "Ingrese el adeudo" },
    { label: "CALLE", type: "text", placeholder: "Nombre de la calle", resizable: true },
    { label: "NUMERO", type: "text", placeholder: "Número de la propiedad" },
    { label: "COLONIA/FRACCIONAMIENTO", type: "text", placeholder: "Colonia o fraccionamiento", resizable: true },
    { label: "CODIGO POSTAL", type: "text", placeholder: "Código postal" },
    { label: "MUNICIPIO", type: "text", placeholder: "Nombre del municipio" },
    { label: "ESTADO", type: "text", placeholder: "Estado" },
    { label: "NOMENCLATURA", type: "text", placeholder: "Nomenclatura correspondiente" },
    { label: "INTERES ORDINARIO", type: "number", placeholder: "Interés ordinario %" },
    { label: "INTERES MORATORIO", type: "number", placeholder: "Interés moratorio %" },
    { label: "JUZGADO", type: "text", placeholder: "Juzgado correspondiente", resizable: true},
    { label: "HORA REQUERIMIENTO", type: "time" },
    { label: "FECHA REQUERIMIENTO", type: "date" }
  ];

  return (
    <>
      {/* Selection Modal */}
      {isSelectionModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg shadow-lg relative">
            <button onClick={closeSelectionModal} type="button" className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center">
              <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Crear Demanda</h2>
            <ul className="space-y-4">
              <li>
                <button onClick={openCreateModal} className="w-full text-left px-4 py-2 border rounded-md hover:bg-gray-100">
                  Individual: Demandada / Demandado
                </button>
              </li>
              <li>
                <button onClick={openCreateModal} className="w-full text-left px-4 py-2 border rounded-md hover:bg-gray-100">
                  Con consentimiento: Demandada / Demandado
                </button>
              </li>
              <li>
                <button onClick={openCreateModal} className="w-full text-left px-4 py-2 border rounded-md hover:bg-gray-100">
                  Conyugal: Pesos / VSMM
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-5xl overflow-y-auto max-h-screen shadow-lg relative">
            <button onClick={closeCreateModal} type="button" className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center">
              <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Crear Demanda</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fields.map((field) => (
                  <div key={field.label} className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                    {field.resizable ? (
                      <textarea
                        placeholder={field.placeholder || ""}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                      />
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder || ""}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button type="button" onClick={closeCreateModal} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalesDemandas;
