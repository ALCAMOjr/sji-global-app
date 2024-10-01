import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Context from '../../context/abogados.context.jsx';
import { jwtDecode } from 'jwt-decode';

function RoleProtectedRoute({ element, allowedRoles }) {
  const { jwt } = useContext(Context);

  if (!jwt) {
    return <Navigate to="*" />;
  }

  const decodedToken = jwtDecode(jwt);
  const userType = decodedToken.userForToken.userType;

  return allowedRoles.includes(userType) ? element : <Navigate to="*" />;
}

export default RoleProtectedRoute;
