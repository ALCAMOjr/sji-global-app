import { useEffect } from "react";
import getExpedienteByNumero from "../../views/expedientesial/getExpedientebyNumero.js";
import getNumberToWords from "../../views/numberToWords/getNumberToWords.js"
import getFechaToWords from "../../views/fechaToWords/getFechaToWords.js"
import getNumberToWordsPesos from "../../views/numberToWords/getNumberToWordsPesos.js";
import Context from "../../context/abogados.context.jsx";
import { useContext, useState } from "react";
import { getInfobyCP } from "../../views/copomex/getInfobyCP.js";
import { getMunicipalitiesByState } from "../../views/copomex/getMunicipalitiesByState.js";
import { getColoniesbyStateMunicipalities } from "../../views/copomex/getColoniesbyStateMunicipalities.js";
import { getCP } from "../../views/copomex/getCP.js";
import trash_icon from "../../assets/basura.png"
import useCopomex from "../../hooks/compomex/UseCopomex.jsx";
import Error from "../Error.jsx";
import { Spinner } from "@nextui-org/react";

const ModalUpdate = ({ closeModal, moneda, formValues, setFormValues, handleUpdate, isUpdatingDemanda }) => {
    const [errorCredito, setErrorCredito] = useState("");
    const [errorEscritura, setErrorEscritura] = useState("");
    const [errorInscripcion, setErrorInscripcion] = useState("");
    const [errorVolumen, setErrorVolumen] = useState("");
    const [errorNumeroSs, setErrorNumeroSs] = useState("");
    const [errorFolio, setErrorFolio] = useState("");
    const [errorLibro, setErrorLibro] = useState("");
    const [errorCodigoPostal, setErrorCodigoPostal] = useState("");
    const [errorFechaRequerimiento, setErrorFechaRequerimiento] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const [isEscrituraFormatEditable, setIsEscrituraFormatEditable] = useState(false);
    const [isFechaFormatEditable, setIsFechaFormatEditable] = useState(false);
    const [isFechaEscrituraFormatEditable, setIsFechaEscrituraFormatEditable] = useState(false);
    const [isFechaRequerimientoFormatEditable, setIsFechaRequerimientoFormatEditable] = useState(false);
    const [isMontoFormatEditable, setIsMontoFormatEditable] = useState(false);
    const [isAdeudoFormatEditable, setIsAdeudoFormatEditable] = useState(false);
    const [isAdeudoPesosFormatEditable, setIsAdeudoPesosFormatEditable] = useState(false);
    const [isMunicipioEditable, setIsMunicipioEditable] = useState(false);
    const [isEstadoEditable, setIsEstadoEditable] = useState(false);
    const [colonias, setColonias] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [isMunicipioDropdown, setIsMunicipioDropdown] = useState(true);
    const [isCodigoPostalEditable, setIsCodigoPostalEditable] = useState(true);
    const [isEstadoDropdown, setIsEstadoDropdown] = useState(true);
    const [isEditingColonia, setIsEditingColonia] = useState(false);
    const { municipiosNL, loadingmunicipiosNL, errorMunicipiosNL, states, errorStates, loadingStates } = useCopomex()

    const { jwt } = useContext(Context);

    useEffect(() => {
        const validateCodigoPostal = async () => {
            const codigoPostal = formValues.codigo_postal;

            if (!codigoPostal) {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    estado: "",
                    municipio: "",
                    colonia_fraccionamiento: ""
                }));
                setColonias([]);
                setIsEstadoEditable(false);
                setIsEstadoDropdown(true);
                setIsMunicipioEditable(false);
                setIsMunicipioDropdown(true);
                return;
            }

            try {
                const data = await getInfobyCP(codigoPostal);

                if (data && data.length > 0) {
                    const respuesta = data[0].response;
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        estado: respuesta.estado,
                        municipio: respuesta.municipio
                    }));
                    const coloniasList = data.map((item) => item.response.asentamiento);
                    setColonias(coloniasList);
                    setIsEstadoEditable(true);
                    setIsMunicipioEditable(true);
                    setIsEstadoDropdown(false);
                    setIsMunicipioDropdown(false);
                    setIsCodigoPostalEditable(true);
                    setErrorCodigoPostal("");
                    setIsSubmitDisabled(false);
                } else {
                    setErrorCodigoPostal("No se encontró información para el código postal ingresado");
                    setIsSubmitDisabled(true);
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        estado: "",
                        municipio: "",
                        colonia_fraccionamiento: ""
                    }));
                    setIsEstadoEditable(false);
                    setIsEstadoDropdown(false);
                    setIsMunicipioEditable(false);
                    setIsMunicipioDropdown(false);
                }
            } catch (error) {
                console.error("Error al obtener información del código postal:", error);
                setErrorCodigoPostal("No se encontró información para el código postal ingresado");
                setFormValues((prevValues) => ({
                    ...prevValues,
                    estado: "",
                    municipio: "",
                    colonia_fraccionamiento: ""
                }));
                setIsEstadoEditable(false);
                setIsMunicipioEditable(false);
                setIsEstadoDropdown(false);
                setIsMunicipioDropdown(false);
                setIsSubmitDisabled(true);
            }
        };
        if (formValues.codigo_postal) {
            validateCodigoPostal();
        }
    }, []); 

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));

        if (name === "escritura") {
            if (value) {
                try {
                    const escrituraFormateada = await getNumberToWords({ number: parseInt(value, 10), token: jwt });
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        escritura_ft: escrituraFormateada,
                    }));
                    setIsEscrituraFormatEditable(true);
                } catch (error) {
                    console.error("Error al convertir el número a palabras:", error);
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        escritura_ft: "",
                    }));
                    setIsEscrituraFormatEditable(false);
                }
            } else {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    escritura_ft: "",
                }));
                setIsEscrituraFormatEditable(false);
            }
        }

        if (name === "fecha") {
            if (value) {
                try {
                    const fechaFormateada = await getFechaToWords({ fecha: value, token: jwt });
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        fecha_ft: fechaFormateada,
                    }));
                    setIsFechaFormatEditable(true);
                } catch (error) {
                    console.error("Error al convertir la fecha a palabras:", error);
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        fecha_ft: "",
                    }));
                    setIsFechaFormatEditable(false);
                }
            } else {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    fecha_ft: "",
                }));
                setIsFechaFormatEditable(false);
            }
        }

        if (name === "fecha_escritura") {
            if (value) {
                try {
                    const fechaFormateada = await getFechaToWords({ fecha: value, token: jwt });
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        fecha_escritura_ft: fechaFormateada,
                    }));
                    setIsFechaEscrituraFormatEditable(true);
                } catch (error) {
                    console.error("Error al convertir la fecha a palabras:", error);
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        fecha_escritura_ft: "",
                    }));
                    setIsFechaEscrituraFormatEditable(false);
                }
            } else {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    fecha_escritura_ft: "",
                }));
                setIsFechaEscrituraFormatEditable(false);
            }
        }

        if (name === "fecha_requerimiento") {
            if (value) {
                try {
                    const fechaFormateada = await getFechaToWords({ fecha: value, token: jwt });
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        fecha_requerimiento_ft: fechaFormateada,
                    }));
                    setIsFechaRequerimientoFormatEditable(true);
                } catch (error) {
                    console.error("Error al convertir la fecha a palabras:", error);
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        fecha_requerimiento_ft: "",
                    }));
                    setIsFechaRequerimientoFormatEditable(false);
                }
            } else {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    fecha_requerimiento_ft: "",
                }));
                setIsFechaRequerimientoFormatEditable(false);
            }
        }

        if (name === "monto_otorgado") {
            if (value) {
                if (moneda === "VSMM") {
                    let numberToFormat = parseFloat(value);
                    const montoFormateada = `${numberToFormat} VSMM`;
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        monto_otorgado_ft: montoFormateada,
                    }));
                    setIsMontoFormatEditable(true);
                } else if (moneda === "Pesos") {
                    try {
                        const montoFormateada = await getNumberToWordsPesos({ number: parseFloat(value), token: jwt });
                        setFormValues((prevValues) => ({
                            ...prevValues,
                            monto_otorgado_ft: montoFormateada,
                        }));
                        setIsMontoFormatEditable(true);
                    } catch (error) {
                        console.error("Error al convertir el monto a palabras:", error);
                        setFormValues((prevValues) => ({
                            ...prevValues,
                            monto_otorgado_ft: "",
                        }));
                        setIsMontoFormatEditable(false);
                    }
                }
            } else {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    monto_otorgado_ft: "",
                }));
                setIsMontoFormatEditable(false);
            }
        }

        if (name === "adeudo") {
            if (value) {
                if (moneda === "VSMM") {
                    let numberToFormat = parseFloat(value);
                    const montoFormateada = `${numberToFormat} VSMM`;
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        adeudo_ft: montoFormateada,
                    }));
                    setIsAdeudoFormatEditable(true);
                } else if (moneda === "Pesos") {
                    try {

                        const adeudoFormateada = await getNumberToWordsPesos({ number: parseFloat(value), token: jwt });
                        setFormValues((prevValues) => ({
                            ...prevValues,
                            adeudo_ft: adeudoFormateada,
                        }));
                        setIsAdeudoFormatEditable(true);
                    } catch (error) {
                        console.error("Error al convertir el monto a palabras:", error);
                        setFormValues((prevValues) => ({
                            ...prevValues,
                            adeudo_ft: "",
                        }));
                        setIsAdeudoFormatEditable(false);
                    }
                }
            } else {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    adeudo_ft: "",
                }));
                setIsAdeudoFormatEditable(false);
            }
        }


        if (name === "adeudo_pesos") {
            if (value) {
                if (moneda === "VSMM") {
                    try {
                        const montoFormateada = await getNumberToWordsPesos({ number: parseFloat(value), token: jwt });
                        setFormValues((prevValues) => ({
                            ...prevValues,
                            adeudo_pesos_ft: montoFormateada,
                        }));
                        setIsAdeudoPesosFormatEditable(true);
                    } catch (error) {
                        console.error("Error al convertir el monto a palabras:", error);
                        setFormValues((prevValues) => ({
                            ...prevValues,
                            adeudo_pesos_ft: "",
                        }));
                        setIsAdeudoPesosFormatEditable(false);
                    }
                }
            } else {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    adeudo_pesos_ft: "",
                }));
                setIsAdeudoPesosFormatEditable(false);
            }
        }
        if (name === "estado" && isEstadoDropdown) {
            if (value === "") {
                setIsCodigoPostalEditable(true);
                setIsMunicipioDropdown(true);
                setMunicipios([]);
                setColonias([]);
            } else {
                setIsCodigoPostalEditable(false);
                setIsEstadoEditable(true);

                try {
                    const municipiosData = await getMunicipalitiesByState(value);
                    if (municipiosData?.response?.municipios) {
                        setMunicipios(municipiosData.response.municipios);
                        setIsMunicipioDropdown(true);
                    } else {
                        setMunicipios([]);
                        setIsMunicipioDropdown(true);
                    }
                } catch (error) {
                    console.error("Error al obtener municipios:", error);
                    setMunicipios([]);
                    setIsMunicipioDropdown(true);
                }
            }
        }
        if (name === "municipio" && isMunicipioDropdown) {
            if (value === "") {
                setIsMunicipioEditable(false);
                setColonias([]);
            } else {
                setIsMunicipioEditable(true);
                try {
                    const coloniesData = await getColoniesbyStateMunicipalities(formValues.estado, value);
                    if (coloniesData?.response) {
                        const coloniesList = Object.keys(coloniesData.response).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
                        setColonias(coloniesList);
                    } else {
                        setColonias([]);
                    }
                } catch (error) {
                    console.error("Error al obtener colonias:", error);
                    setColonias([]);
                }
            }
        }



        if (name === 'escritura' && errorEscritura) {
            setErrorEscritura('');
            setIsSubmitDisabled(false);
        }

        if (name === 'inscripcion' && errorInscripcion) {
            setErrorInscripcion('');
            setIsSubmitDisabled(false);
        }

        if (name === 'volumen' && errorVolumen) {
            setErrorVolumen('');
            setIsSubmitDisabled(false);
        }

        if (name === 'libro' && errorLibro) {
            setErrorLibro('');
            setIsSubmitDisabled(false);
        }

        if (name === 'credito' && errorCredito) {
            setErrorCredito('');
            setIsSubmitDisabled(false);
        }

        if (name === 'codigo_postal' && errorCodigoPostal) {
            setErrorCodigoPostal('');
            setIsSubmitDisabled(false);
        }

        if (name === 'fecha_requerimiento' && errorFechaRequerimiento) {
            setErrorFechaRequerimiento('');
            setIsSubmitDisabled(false);
        }
    };

    const handleColoniaSelect = async (e) => {
        const selectedColonia = e.target.value;

        setFormValues((prevValues) => ({
            ...prevValues,
            colonia_fraccionamiento: selectedColonia,
        }));
        if (selectedColonia !== "") {
            try {
                const cpData = await getCP(formValues.estado, formValues.municipio, selectedColonia);
                if (cpData?.response?.cp) {
                    const newCodigoPostal = cpData.response.cp[0];
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        codigo_postal: newCodigoPostal,
                    }));
                } else {
                    setErrorCodigoPostal("No se encontró código postal para la información seleccionada");
                }
            } catch (error) {
                console.error("Error al obtener el código postal:", error);
                setErrorCodigoPostal("No se encontró código postal para la información seleccionada");
            }
        } else {
            setFormValues((prevValues) => ({
                ...prevValues,
                codigo_postal: "",
            }));
            setErrorCodigoPostal("");
        }

        setIsEditingColonia(true);
    };

    const handleResetColonia = () => {
        setFormValues((prevValues) => ({
            ...prevValues,
            colonia_fraccionamiento: "",
            codigo_postal: "",
        }));
        setIsEditingColonia(false);
        setErrorCodigoPostal("");
    };


    const handleCreditoBlur = async () => {
        if (formValues.credito.trim() === '') {
            setErrorCredito('');
            setIsSubmitDisabled(false);
            return;
        }
        try {
            const expediente = await getExpedienteByNumero({ numero: formValues.credito, token: jwt });
            if (expediente && expediente.num_credito) {
                setErrorCredito('');
                setIsSubmitDisabled(false);
            } else {
                setErrorCredito(`El crédito no ha sido encontrado en CreditoSIAL`);
                setIsSubmitDisabled(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setErrorCredito(`El crédito no ha sido encontrado en CreditoSIAL`);
                setIsSubmitDisabled(true);
            } else {
                console.error("Algo salió mal:", error);
                setErrorCredito(`El crédito no ha sido encontrado en CreditoSIAL`);
                setIsSubmitDisabled(true);
            }
        }
    };

    const handleEscrituraBlur = () => {
        const escrituraValue = formValues.escritura;
        if (escrituraValue && escrituraValue.includes('.')) {
            setErrorEscritura("La escritura no puede tener decimales");
            setIsSubmitDisabled(true);
        } else {
            setErrorEscritura('');
            setIsSubmitDisabled(false);
        }
    };

    const handleInscripcionBlur = () => {
        const inscripcionValue = formValues.inscripcion;
        if (inscripcionValue && inscripcionValue.includes('.')) {
            setErrorInscripcion("La inscripcion no puede tener decimales");
            setIsSubmitDisabled(true);
        } else {
            setErrorInscripcion('');
            setIsSubmitDisabled(false);
        }
    };

    const handleVolumenBlur = () => {
        const volumenValue = formValues.volumen;
        if (volumenValue && volumenValue.includes('.')) {
            setErrorVolumen("El volumen no puede tener decimales");
            setIsSubmitDisabled(true);
        } else {
            setErrorVolumen('');
            setIsSubmitDisabled(false);
        }
    };

    const handleLibroBlur = () => {
        const libroValue = formValues.libro;
        if (libroValue && libroValue.includes('.')) {
            setErrorLibro("El libro no puede tener decimales");
            setIsSubmitDisabled(true);
        } else {
            setErrorLibro('');
            setIsSubmitDisabled(false);
        }
    };

    const handleNumeroSsBlur = () => {
        const numeroSsValue = formValues.numero_ss;
        if (numeroSsValue && numeroSsValue.includes('.')) {
            setErrorNumeroSs("El número de seguro social no puede tener decimales");
            setIsSubmitDisabled(true);
        } else {
            setErrorNumeroSs('');
            setIsSubmitDisabled(false);
        }
    };
    const handleFolioBlur = () => {
        const folioValue = formValues.folio;
        if (folioValue && folioValue.includes('.')) {
            setErrorFolio("El número de folio no puede tener decimales");
            setIsSubmitDisabled(true);
        } else {
            setErrorFolio('');
            setIsSubmitDisabled(false);
        }
    };

    const handleCodigoPostalBlur = async () => {
        const codigoPostal = formValues.codigo_postal;
        if (!codigoPostal) {
            setFormValues((prevValues) => ({
                ...prevValues,
                estado: "",
                municipio: "",
                colonia_fraccionamiento: ""
            }));
            setColonias([]);
            setIsEstadoEditable(false);
            setIsEstadoDropdown(true);
            setIsMunicipioEditable(false);
            setIsMunicipioDropdown(true);
            return;
        }
        try {
            const data = await getInfobyCP(codigoPostal);

            if (data && data.length > 0) {
                const respuesta = data[0].response;
                setFormValues((prevValues) => ({
                    ...prevValues,
                    estado: respuesta.estado,
                    municipio: respuesta.municipio
                }));
                const coloniasList = data.map((item) => item.response.asentamiento);
                setColonias(coloniasList);
                setIsEstadoEditable(true);
                setIsMunicipioEditable(true);
                setIsEstadoDropdown(false);
                setIsMunicipioDropdown(false);
                setIsCodigoPostalEditable(true);
                setErrorCodigoPostal("");
                setIsSubmitDisabled(false);
            } else {
                setErrorCodigoPostal("No se encontró información para el código postal ingresado");
                setIsSubmitDisabled(true);
                setFormValues((prevValues) => ({
                    ...prevValues,
                    estado: "",
                    municipio: "",
                    colonia_fraccionamiento: ""
                }));
                setIsEstadoEditable(false);
                setIsEstadoDropdown(false);
                setIsMunicipioEditable(false);
                setIsMunicipioDropdown(false);
            }
        } catch (error) {
            console.error("Error al obtener información del código postal:", error);
            setErrorCodigoPostal("No se encontró información para el código postal ingresado");
            setFormValues((prevValues) => ({
                ...prevValues,
                estado: "",
                municipio: "",
                colonia_fraccionamiento: ""
            }));
            setIsEstadoEditable(false);
            setIsMunicipioEditable(false);
            setIsEstadoDropdown(false);
            setIsMunicipioDropdown(false);
            setIsSubmitDisabled(true);
        }
    };

    const handleFechaRequerimientoBlur = () => {
        const { mes_ultimo_adeudo, fecha_requerimiento } = formValues;
        if (!mes_ultimo_adeudo) {
            setErrorFechaRequerimiento("Debe seleccionar el último mes de adeudo antes de la fecha de requerimiento.");
            setIsSubmitDisabled(true);
            return;
        }
        const [ultimomesYear, ultimomesMonth] = mes_ultimo_adeudo.split('-').map(Number);
        const [requerimientoYear, requerimientoMonth, _] = fecha_requerimiento.split('-').map(Number);

        const ultimoAdeudoDate = new Date(ultimomesYear, ultimomesMonth - 1);
        const requerimientoDate = new Date(requerimientoYear, requerimientoMonth - 1);
        if (requerimientoDate >= ultimoAdeudoDate) {
            setErrorFechaRequerimiento("La fecha de requerimiento debe ser anterior al último mes de adeudo.");
            setIsSubmitDisabled(true);
            return;
        }
        const unMesAntes = new Date(ultimoAdeudoDate);
        unMesAntes.setMonth(unMesAntes.getMonth() - 1);

        if (requerimientoDate < unMesAntes) {
            setErrorFechaRequerimiento("La fecha de requerimiento no puede ser más de un mes anterior al último mes de adeudo.");
            setIsSubmitDisabled(true);
            return;
        }
        setErrorFechaRequerimiento('');
        setIsSubmitDisabled(false);
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            <div className="bg-white w-full max-w-[1400px] p-8 rounded-lg overflow-y-auto max-h-[95vh] min-h-[50vh] shadow-lg relative">
                <button
                    onClick={closeModal}
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                >
                    <svg
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                    </svg>
                </button>
                <h2 className="text-2xl font-semibold mt-4 mb-4">Actualizar Demanda Individual y Con Consentimiento {moneda}</h2>
                {loadingmunicipiosNL || loadingStates ? (
                    <div className="flex items-center justify-center mt-32">
                        <Spinner className="h-10 w-10" color="primary" />
                    </div>
                ) : errorMunicipiosNL ? (
                    <Error message={errorMunicipiosNL.message} />
                ) : errorStates ? (
                    <Error message={errorStates.message} />
                ) : (
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Crédito</label>
                            <input
                                type="number"
                                name="credito"
                                value={formValues.credito}
                                onChange={handleChange}
                                onBlur={handleCreditoBlur}
                                placeholder="Ingrese el crédito"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                                readOnly
                            />
                            {errorCredito && (
                                <p className="text-red-500 text-xs -mt-2">
                                    {errorCredito}
                                </p>
                            )}

                            <label className="block text-sm font-medium text-gray-700">Escritura Formateada</label>
                            <textarea
                                name="escritura_ft"
                                value={formValues.escritura_ft}
                                onChange={isEscrituraFormatEditable ? handleChange : undefined}
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 resize-y "
                                rows={1}
                                readOnly={!isEscrituraFormatEditable}
                                required
                            />

                            <label className="block text-sm font-medium text-gray-700">Volumen</label>
                            <input
                                type="number"
                                name="volumen"
                                value={formValues.volumen}
                                onBlur={handleVolumenBlur}
                                onChange={handleChange}
                                placeholder="Volumen"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />
                            {errorVolumen && (
                                <p className="text-primary text-xs -mt-2">{errorVolumen}</p>
                            )}

                            <label className="block text-sm font-medium text-gray-700">Fecha</label>
                            <input
                                type="date"
                                name="fecha"
                                value={formValues.fecha}
                                onChange={handleChange}
                                placeholder="Fecha"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />

                            <label className="block text-sm font-medium text-gray-700">Adeudo</label>
                            <input
                                type="number"
                                name="adeudo"
                                value={formValues.adeudo}
                                onChange={handleChange}
                                placeholder="Ingrese el Adeudo"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />

                            <label className="block text-sm font-medium text-gray-700">Número (SS)</label>
                            <input
                                type="number"
                                name="numero_ss"
                                value={formValues.numero_ss}
                                onBlur={handleNumeroSsBlur}
                                onChange={handleChange}
                                placeholder="Ingrese el Número"
                                required
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"

                            />
                            {errorNumeroSs && (
                                <p className="text-primary text-xs -mt-2">{errorNumeroSs}</p>
                            )}


                            <label className="block text-sm font-medium text-gray-700">Colonia/Fraccionamiento</label>
                            {!isEditingColonia ? (
                                <select
                                    name="colonia_fraccionamiento"
                                    value={formValues.colonia_fraccionamiento}
                                    onChange={handleColoniaSelect}
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                    required>
                                    <option value="">Selecciona una opción</option>
                                    {colonias.map((colonia, index) => (
                                        <option key={index} value={colonia}>
                                            {colonia}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        name="colonia_fraccionamiento"
                                        value={formValues.colonia_fraccionamiento}
                                        onChange={handleChange}
                                        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={handleResetColonia}
                                        className="absolute inset-y-0 right-2 flex items-center"
                                        title="Restablecer selección"
                                    >
                                        <img src={trash_icon} alt="Eliminar" className="w-4 h-4 -mt-1" />
                                    </button>
                                </div>
                            )}
                            <label className="block text-sm font-medium text-gray-700">Fecha Requerimiento</label>
                            <input
                                type="date"
                                name="fecha_requerimiento"
                                value={formValues.fecha_requerimiento}
                                onChange={handleChange}
                                onBlur={handleFechaRequerimientoBlur}
                                placeholder="Fecha Requerimiento"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />
                            {errorFechaRequerimiento && (
                                <p className="text-red-500 text-xs mt-1">{errorFechaRequerimiento}</p>
                            )}

                            <label className="block text-sm font-medium text-gray-700">Juzgado</label>
                            <select
                                name="juzgado"
                                value={formValues.juzgado}
                                onChange={handleChange}
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            >
                                <option value="">Selecciona un juzgado</option>
                                <option value="JUEZ DE LO CIVIL DEL PRIMER DISTRITO JUDICIAL EN EL ESTADO EN TURNO">
                                    Juez de lo Civil del Primer Distrito Judicial en el Estado en Turno
                                </option>
                                <option value="JUEZ DE LO CIVIL DEL QUINTO DISTRITO JUDICIAL EN EL ESTADO EN TURNO">
                                    Juez de lo Civil del Quinto Distrito Judicial en el Estado en Turno
                                </option>
                                <option value="JUEZ DE LO CIVIL DEL SEXTO DISTRITO JUDICIAL EN EL ESTADO EN TURNO">
                                    Juez de lo Civil del Sexto Distrito Judicial en el Estado en Turno
                                </option>
                                <option value="JUEZ DE LO CIVIL DEL OCTAVO DISTRITO JUDICIAL EN EL ESTADO EN TURNO">
                                    Juez de lo Civil del Octavo Distrito Judicial en el Estado en Turno
                                </option>
                                <option value="JUEZ DE LO CIVIL DEL NOVENO DISTRITO JUDICIAL EN EL ESTADO EN TURNO">
                                    Juez de lo Civil del Noveno Distrito Judicial en el Estado en Turno
                                </option>
                                <option value="JUEZ DE LO CIVIL DEL DÉCIMO DISTRITO JUDICIAL EN EL ESTADO EN TURNO">
                                    Juez de lo Civil del Décimo Distrito Judicial en el Estado en Turno
                                </option>
                                <option value="JUEZ DE LO CIVIL DEL DÉCIMO CUARTO DISTRITO JUDICIAL EN EL ESTADO EN TURNO">
                                    Juez de lo Civil del Décimo Cuarto Distrito Judicial en el Estado en Turno
                                </option>
                                <option value="Menor Cuantía - JUEZ DE MENOR CUANTÍA DEL PRIMER DISTRITO JUDICIAL EN EL ESTADO EN TURNO">
                                    Menor Cuantía - Juez de Menor Cuantía del Primer Distrito Judicial en el Estado en Turno
                                </option>
                            </select>

                        </div>

                        <div>

                            <label className="block text-sm font-medium text-gray-700">Demandado/Demandada</label>
                            <select
                                name="categoria"
                                value={formValues.categoria}
                                onChange={handleChange}
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            >
                                <option value="" disabled hidden>Selecciona</option>
                                <option value="Demandado">Demandado</option>
                                <option value="Demandada">Demandada</option>
                            </select>

                            <label className="block text-sm font-medium text-gray-700">Fecha Escritura</label>
                            <input
                                type="date"
                                name="fecha_escritura"
                                value={formValues.fecha_escritura}
                                onChange={handleChange}
                                placeholder="Fecha Escritura"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />

                            <label className="block text-sm font-medium text-gray-700">Libro</label>
                            <input
                                type="number"
                                name="libro"
                                value={formValues.libro}
                                onBlur={handleLibroBlur}
                                onChange={handleChange}
                                placeholder="Libro"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />
                            {errorLibro && (
                                <p className="text-primary text-xs -mt-2">{errorLibro}</p>
                            )}

                            <label className="block text-sm font-medium text-gray-700">Fecha  Formateada</label>
                            <textarea
                                name="fecha_ft"
                                value={formValues.fecha_ft}
                                onChange={isFechaFormatEditable ? handleChange : undefined}
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 resize-y"
                                rows={1}
                                readOnly={!isFechaFormatEditable}
                                required
                            />
                            <label className="block text-sm font-medium text-gray-700">Adeudo Formateado</label>
                            <textarea
                                name="adeudo_ft"
                                value={formValues.adeudo_ft}
                                onChange={isAdeudoFormatEditable ? handleChange : undefined}
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 resize-y"
                                rows={1}
                                readOnly={!isAdeudoFormatEditable}
                                required
                            />
                            <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                            <input
                                type="text"
                                name="codigo_postal"
                                value={formValues.codigo_postal}
                                onChange={handleChange}
                                onBlur={handleCodigoPostalBlur}
                                placeholder="Código Postal"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                disabled={!isCodigoPostalEditable}
                                required
                            />
                            {errorCodigoPostal && (
                                <p className="text-red-500 text-xs -mt-2">{errorCodigoPostal}</p>
                            )}

                            <label className="block text-sm font-medium text-gray-700">Calle</label>
                            <input
                                type="text"
                                name="calle"
                                value={formValues.calle}
                                onChange={handleChange}
                                placeholder="Ingrese la Calle"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />

                            <label className="block text-sm font-medium text-gray-700">Fecha Requerimiento Formateada</label>
                            <textarea
                                name="fecha_requerimiento_ft"
                                value={formValues.fecha_requerimiento_ft}
                                onChange={isFechaRequerimientoFormatEditable ? handleChange : undefined}
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 resize-y "
                                rows={1}
                                readOnly={!isFechaRequerimientoFormatEditable}
                                required
                            />

                            <label className="block text-sm font-medium text-gray-700">Folio</label>
                            <input
                                type="number"
                                name="folio"
                                value={formValues.folio}
                                onBlur={handleFolioBlur}
                                onChange={handleChange}
                                placeholder="Ingrese el Folio"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />
                            {errorFolio && (
                                <p className="text-primary text-xs -mt-2">{errorFolio}</p>
                            )}
                        </div>

                        <div>

                            <label className="block text-sm font-medium text-gray-700">Acréditado</label>
                            <input
                                type="text"
                                name="acreditado"
                                value={formValues.acreditado}
                                onChange={handleChange}
                                placeholder="Ingrese el acréditado"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />

                            <label className="block text-sm font-medium text-gray-700">Fecha Escritura Formateada</label>
                            <textarea
                                name="fecha_escritura_ft"
                                value={formValues.fecha_escritura_ft}
                                onChange={isFechaEscrituraFormatEditable ? handleChange : undefined}
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 resize-y"
                                rows={1}
                                readOnly={!isFechaEscrituraFormatEditable}
                                required
                            />

                            <label className="block text-sm font-medium text-gray-700">Seccion</label>
                            <select
                                name="seccion"
                                value={formValues.seccion}
                                onChange={handleChange}
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            >
                                <option value="" disabled hidden>Selecciona</option>
                                <option value="Propiedad">Propiedad</option>
                                <option value="Gravamen">Gravamen</option>
                            </select>

                            <label className="block text-sm font-medium text-gray-700">Monto Otorgado</label>
                            <input
                                type="number"
                                name="monto_otorgado"
                                value={formValues.monto_otorgado}
                                onChange={handleChange}
                                placeholder="Ingrese el Monto Otorgado"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />

                            <label className="block text-sm font-medium text-gray-700">Mes Primer Adeudo</label>
                            <input
                                type="month"
                                name="mes_primer_adeudo"
                                value={formValues.mes_primer_adeudo}
                                onChange={handleChange}
                                required
                                placeholder="Mes Primer Adeudo"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                            />

                            <label className="block text-sm font-medium text-gray-700">Estado</label>
                            {isEstadoDropdown ? (
                                <select
                                    name="estado"
                                    value={formValues.estado}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                    required>
                                    <option value="">Selecciona un estado</option>
                                    {states.map((estado, index) => (
                                        <option key={index} value={estado}>
                                            {estado}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="estado"
                                    value={formValues.estado}
                                    onChange={isEstadoEditable ? handleChange : undefined}
                                    placeholder="Estado"
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                    readOnly={!isEstadoEditable}
                                    required
                                />
                            )}


                            <label className="block text-sm font-medium text-gray-700">Número</label>
                            <input
                                name="numero"
                                value={formValues.numero}
                                onChange={handleChange}
                                placeholder="Ingrese el Número"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />

                            <label className="block text-sm font-medium text-gray-700">Interes Ordinario</label>
                            <input
                                type="number"
                                name="interes_ordinario"
                                value={formValues.interes_ordinario}
                                onChange={handleChange}
                                placeholder="Ingrese el Interes Ordinario"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />
                            {moneda === "VSMM" && (
                                <>
                                    <label className="block text-sm font-medium text-gray-700">Adeudo en Pesos</label>
                                    <input
                                        type="number"
                                        name="adeudo_pesos"
                                        value={formValues.adeudo_pesos}
                                        required
                                        placeholder="Ingrese el Adeudo en Pesos"
                                        onChange={handleChange}
                                        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                    />

                                </>
                            )}
                        </div>

                        <div>

                            <label className="block text-sm font-medium text-gray-700">Escritura</label>
                            <input
                                type="number"
                                name="escritura"
                                value={formValues.escritura}
                                onBlur={handleEscrituraBlur}
                                onChange={handleChange}
                                placeholder="Escritura"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />
                            {errorEscritura && (
                                <p className="text-primary text-xs -mt-2">{errorEscritura}</p>
                            )}

                            <label className="block text-sm font-medium text-gray-700">Inscripcion</label>
                            <input
                                type="number"
                                name="inscripcion"
                                value={formValues.inscripcion}
                                onChange={handleChange}
                                onBlur={handleInscripcionBlur}
                                placeholder="Inscripcion"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />
                            {errorInscripcion && (
                                <p className="text-primary text-xs -mt-2">{errorInscripcion}</p>
                            )}


                            <label className="block text-sm font-medium text-gray-700">Unidad</label>
                            <select
                                name="unidad"
                                value={formValues.unidad}
                                onChange={handleChange}
                                placeholder="Unidad"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required >
                                <option value="" disabled hidden>Selecciona un municipio</option>
                                {municipiosNL.map((municipio, index) => (
                                    <option key={index} value={municipio}>
                                        {municipio}
                                    </option>
                                ))}
                            </select>

                            <label className="block text-sm font-medium text-gray-700">Monto Otorgado Formateado</label>
                            <textarea
                                name="monto_otorgado_ft"
                                value={formValues.monto_otorgado_ft}
                                onChange={isMontoFormatEditable ? handleChange : undefined}
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-1 resize-y"
                                rows={1}
                                readOnly={!isMontoFormatEditable}
                                required
                            />

                            <label className="block text-sm font-medium text-gray-700">Mes del Ultimo Adeudo</label>
                            <input
                                type="month"
                                name="mes_ultimo_adeudo"
                                value={formValues.mes_ultimo_adeudo}
                                onChange={handleChange}
                                placeholder="Mes del Ultimo Adeudo"
                                required
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                            />

                            <label className="block text-sm font-medium text-gray-700 mt-0">Municipio</label>
                            {isMunicipioDropdown ? (
                                <select
                                    name="municipio"
                                    value={formValues.municipio}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                    required>
                                    <option value="">Selecciona un municipio</option>
                                    {municipios.map((municipio, index) => (
                                        <option key={index} value={municipio}>
                                            {municipio}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="municipio"
                                    value={formValues.municipio}
                                    onChange={isMunicipioEditable ? handleChange : undefined}
                                    placeholder="Municipio"
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                    readOnly={!isMunicipioEditable}
                                    required
                                />
                            )}

                            <label className="block text-sm font-medium text-gray-700">Hora Requerimiento</label>
                            <input
                                type="time"
                                name="hora_requerimiento"
                                value={formValues.hora_requerimiento}
                                onChange={handleChange}
                                placeholder="Hora Requerimiento"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />

                            <label className="block text-sm font-medium text-gray-700">Interes Moratorio</label>
                            <input
                                type="number"
                                name="interes_moratorio"
                                value={formValues.interes_moratorio}
                                onChange={handleChange}
                                placeholder="Ingrese el Interes Moratorio"
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 mb-2"
                                required
                            />



                            {moneda === "VSMM" && (
                                <>

                                    <label className="block text-sm font-medium text-gray-700">Adeudo en Pesos Formateado</label>
                                    <textarea
                                        name="adeudo_pesos_ft"
                                        value={formValues.adeudo_pesos_ft}
                                        onChange={isAdeudoPesosFormatEditable ? handleChange : undefined}
                                        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary w-full h-11 resize-y"
                                        rows={1}
                                        readOnly={!isAdeudoPesosFormatEditable}
                                        required
                                    />
                                </>
                            )}
                        </div>


                        <div className="col-span-1 sm:col-span-2 md:col-span-4 flex justify-end mt-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                                disabled={isSubmitDisabled}
                            >
                                {isUpdatingDemanda ? (
                                    <div role="status">
                                        <svg
                                            aria-hidden="true"
                                            className="inline w-8 h-8 text-gray-200 animate-spin"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="white" />
                                        </svg>
                                        <span className="sr-only">Actualizando...</span>
                                    </div>
                                ) : (
                                    'Actualizar'
                                )}
                            </button>
                        </div>
                    </form>
                       )}
            </div>
        </div>
    );
};

export default ModalUpdate;
