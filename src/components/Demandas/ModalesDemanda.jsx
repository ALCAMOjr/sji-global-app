// src/components/ModalesDemandas.jsx
import { useState } from "react";
import PropTypes from "prop-types";

const ModalesDemandas = ({ isSelectionModalOpen, setIsSelectionModalOpen }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    credito: "",
    acreditado: "",
    escritura: "",
    fechaEscritura: "",
    inscripcion: "",
    volumen: "",
    libro: "",
    seccion: "",
    unidad: "",
    fecha: "",
    montoOtorgado: "",
    mesPrimerAdeudo: "",
    mesUltimoAdeudo: "",
    adeudoEnPesos: "",
    adeudo: "",
    calle: "",
    numero: "",
    colonia: "",
    codigoPostal: "",
    municipio: "",
    estado: "",
    nomenclatura: "",
    interesOrdinario: "",
    interesMoratorio: "",
    juzgado: "",
    horaRequerimiento: "",
    fechaRequerimiento: "",
  });

  const [selectedDemandado, setSelectedDemandado] = useState("");
  const [selectedMoneda, setSelectedMoneda] = useState("");


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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Aquí se puede hacer una solicitud al backend con formValues
    console.log("Datos enviados al backend:", formValues);
    closeCreateModal();
  };

  const fields = [
    { label: "CRÉDITO", type: "number", placeholder: "Ingrese el crédito", name: "credito" },
    { label: "ACREDITADO", type: "text", placeholder: "Nombre del acreditado", name: "acreditado", resizable: true },
    { label: "ESCRITURA", type: "text", placeholder: "Número de escritura", name: "escritura", resizable: true },
    { label: "FECHA ESCRITURA", type: "date", placeholder: "Fecha de escritura", name: "fechaEscritura" },
    { label: "INSCRIPCION", type: "text", placeholder: "Número de inscripción", name: "inscripcion" },
    { label: "VOLUMEN", type: "number", placeholder: "Ingrese el volumen", name: "volumen" },
    { label: "LIBRO", type: "text", placeholder: "Número de libro", name: "libro" },
    { label: "SECCION", type: "text", placeholder: "Sección correspondiente", name: "seccion", resizable: true },
    { label: "UNIDAD", type: "text", placeholder: "Unidad de medida", name: "unidad" },
    { label: "FECHA", type: "date", name: "fecha" },
    { label: "MONTO OTORGADO", type: "number", placeholder: "Monto otorgado en pesos", name: "montoOtorgado" },
    { label: "MES DE PRIMER ADEUDO", type: "text", placeholder: "Mes del primer adeudo", name: "mesPrimerAdeudo" },
    { label: "MES CON ULTIMO ADEUDO", type: "text", placeholder: "Mes del último adeudo", name: "mesUltimoAdeudo" },
    { label: "ADEUDO EN PESOS", type: "text", placeholder: "Monto del adeudo en pesos", name: "adeudoEnPesos", resizable: true },
    { label: "ADEUDO", type: "number", placeholder: "Ingrese el adeudo", name: "adeudo" },
    { label: "CALLE", type: "text", placeholder: "Nombre de la calle", name: "calle", resizable: true },
    { label: "NUMERO", type: "text", placeholder: "Número de la propiedad", name: "numero" },
    { label: "COLONIA/FRACCIONAMIENTO", type: "text", placeholder: "Colonia o fraccionamiento", name: "colonia", resizable: true },
    { label: "CODIGO POSTAL", type: "text", placeholder: "Código postal", name: "codigoPostal" },
    { label: "MUNICIPIO", type: "text", placeholder: "Nombre del municipio", name: "municipio" },
    { label: "ESTADO", type: "text", placeholder: "Estado", name: "estado" },
    { label: "NOMENCLATURA", type: "text", placeholder: "Nomenclatura correspondiente", name: "nomenclatura" },
    { label: "INTERES ORDINARIO", type: "number", placeholder: "Interés ordinario %", name: "interesOrdinario" },
    { label: "INTERES MORATORIO", type: "number", placeholder: "Interés moratorio %", name: "interesMoratorio" },
    { label: "JUZGADO", type: "text", placeholder: "Juzgado correspondiente", name: "juzgado", resizable: true },
    { label: "HORA REQUERIMIENTO", type: "time", name: "horaRequerimiento" },
    { label: "FECHA REQUERIMIENTO", type: "date", name: "fechaRequerimiento" }
  ];

  return (
    <>
      {isSelectionModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg shadow-lg relative">
            <button onClick={closeSelectionModal} type="button" className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center">
              <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Crear Demanda</h2>

            {/* Sección Individual y Con Consentimiento */}
            <h3 className="text-lg font-semibold mb-6">Individual y Con Consentimiento</h3>
            {/* Opciones Demandado/Demandada */}
            <div className="flex space-x-2 mb-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="demandado"
                  name="demandado"
                  value="Demandado"
                  checked={selectedDemandado === "Demandado"}
                  onChange={(e) => setSelectedDemandado(e.target.value)}
                />
                <label htmlFor="demandado" className="ml-1">Demandado</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="demandada"
                  name="demandado"
                  value="Demandada"
                  checked={selectedDemandado === "Demandada"}
                  onChange={(e) => setSelectedDemandado(e.target.value)}
                />
                <label htmlFor="demandada" className="ml-1">Demandada</label>
              </div>
            </div>


            {/* Sección Individual, Con Consentimiento y Conyugal */}
            <h3 className="text-lg font-semibold mb-2">Individual, Con Consentimiento y Conyugal</h3>
            <div className="flex space-x-12 mb-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="pesos"
                  name="moneda"
                  value="Pesos"
                  checked={selectedMoneda === "Pesos"}
                  onChange={(e) => setSelectedMoneda(e.target.value)}
                />
                <label htmlFor="pesos" className="ml-2">Pesos</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="vsmm"
                  name="moneda"
                  value="VSMM"
                  checked={selectedMoneda === "VSMM"}
                  onChange={(e) => setSelectedMoneda(e.target.value)}
                  className="bg-red-600"
                />
                <label htmlFor="vsmm" className="ml-2">VSMM</label>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={openCreateModal} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Siguiente</button>
            </div>
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
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fields.map((field) => (
                  <div key={field.name} className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                    {field.resizable ? (
                      <textarea
                        name={field.name}
                        value={formValues[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder || ""}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formValues[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder || ""}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

ModalesDemandas.propTypes = {
  isSelectionModalOpen: PropTypes.bool.isRequired,
  setIsSelectionModalOpen: PropTypes.func.isRequired,
};

export default ModalesDemandas;
