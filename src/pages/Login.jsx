import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/forms.css';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    await login(form);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div>
      <h2 >Login</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }} className='form-container'>
        {/* username */}
        <input
          className="form-input"
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          maxLength={50}
        />

        {/* password */}
        <input
          className="form-input"
          type="password"
          name="password"
          placeholder="Password (min 6)"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
        />

        <button className='special-btn' type="submit">Finish</button>
      </form>

      <p style={{ marginTop: 20 }}>
        Don’t have an account? <br />
        <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}
