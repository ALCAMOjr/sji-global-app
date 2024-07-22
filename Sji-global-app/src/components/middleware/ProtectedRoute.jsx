import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Context from '../../context/abogados.context.jsx';

function ProtectedRoute({ element }) {
  const { jwt } = useContext(Context);

  return jwt ? element : <Navigate to="/login" />;
}

export default ProtectedRoute