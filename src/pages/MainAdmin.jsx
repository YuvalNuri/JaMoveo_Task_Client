import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import detectHebrew from '../assets/utils/detectHebrew';
import '../styles/forms.css';

export default function MainAdmin() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const handleSubmit = e => {
        e.preventDefault();

        if (query.trim()) {
            navigate(`/results?query=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div>
            <h1>Search any song...</h1>
            <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
                <input
                    className="form-input"
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Type a song name"
                    style={{ direction: detectHebrew(query) ? "rtl" : "ltr" }}
                    required
                />
                <button type="submit" className='special-btn' style={{ margin: 15 }}>Search</button>
            </form>
        </div>
    );
}
