import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainAdmin from './MainAdmin';
import MainPlayer from './MainPlayer';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div>
      {user.isAdmin ? <MainAdmin /> : <MainPlayer />}
    </div>
  );
}
