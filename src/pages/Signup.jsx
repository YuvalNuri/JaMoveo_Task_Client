import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiContext } from '../context/ApiContext';
import CreatableSelect from 'react-select/creatable';
import '../styles/forms.css';

export default function Signup() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { local, server } = useContext(ApiContext);
  const [instruments, setInstruments] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    instrument: "",
  });

  useEffect(() => {
    fetch(local + "api/Instruments/AllInstruments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setInstruments(data))
      .catch((error) => console.log(error));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    //strong password validate
    const strongEnough = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(form.password);
    if (!strongEnough) {
      alert("Password must be at least 6 characters long and include both letters and numbers.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const payload = {
      username: form.username,
      password: form.password,
      instrument: form.instrument,
    };

    console.log(form);
    console.log(payload);

    await fetch(local + "api/Auth/Register", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        alert('Registered successfully!');
      })
      .catch((error) => {
        console.log(error);
        alert('Signup failed. Please try again.');
      });

    await login({ 'username': form.username, 'password': form.password });
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
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

        <input
          className="form-input"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />


        <CreatableSelect
          required
          isClearable
          classNamePrefix="react-select"
          options={instruments.map(i => ({ label: i.name || i, value: i.name || i }))}
          onChange={opt => setForm({ ...form, instrument: opt?.value || '' })}
          placeholder="Instrument…"
          styles={ { container: base => ({ ...base, margin: "0.5rem 0" })}}
        />

        <button type="submit" style={{ margin: 15 }}>Finish</button>
      </form>

      <p style={{ marginTop: 20 }}>
              Allready have an account? <br /> 
              <Link to="/login">Login here</Link>
            </p>
    </div>
  );
}
