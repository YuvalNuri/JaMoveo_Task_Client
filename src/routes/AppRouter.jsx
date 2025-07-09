import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import Results from '../pages/Results';
import Live from '../pages/Live';

export default function AppRouter() {
  return (
    <div className='general-container'>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/results" element={<Results/>}/>
      <Route path="/live" element={<Live/>}/>
      {/* דוגמה למסך שמורשה רק למשתמשים מחוברים 
      <Route
        path="/dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />*/}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </div>
  );
}
