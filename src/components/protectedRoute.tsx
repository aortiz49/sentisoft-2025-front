import { Navigate } from 'react-router-dom';

type Props = {
  children: JSX.Element;
};

export default function ProtectedRoute({ children }: Props) {
  const token = sessionStorage.getItem('token');

  return token ? children : <Navigate replace to="/" />;
}
