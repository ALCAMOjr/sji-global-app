import { Spinner } from "@nextui-org/react";

const ModalDelete = ({ handleDelete, closeModalDelete, isDeleting }) => {

    return (
        <div id="popup-modal" tabIndex="-1" className={`'hidden' fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50`}>
        <div className="bg-white rounded-lg shadow w-full max-w-md">
            <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500">Esta seguro que quieres eliminar esta Demanda??</h3>
                <button onClick={handleDelete} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-3">
                    {isDeleting ? <Spinner size='sm' color="default" /> : 'Si, estoy seguro'}
                </button>
                <button onClick={closeModalDelete} type="button" className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-4 focus:ring-gray-100">No, cancelar</button>
            </div>
        </div>
    </div>
    );
};

export default ModalDelete;
