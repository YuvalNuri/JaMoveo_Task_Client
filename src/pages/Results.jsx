import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import '../styles/results.css';
import { ApiContext } from '../context/ApiContext';
import { useSocket } from '../context/SocketContext';

export default function Results() {
    const { local, server } = useContext(ApiContext);
    const { connection, selectedSong } = useSocket();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';

    const [results, setResults] = useState([]);

    useEffect(() => {
        console.log('search for', query);

        fetch(local + "api/Admin/songs?query=" + query, {
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
            .then((data) => setResults(data))
            .catch((error) => console.log(error));
    }, [query]);

const handleSongSelect = (song) => {
    if (!connection) return;

    console.log("Invoking SelectSong with:", song);
    connection.invoke("SelectSong", song)
        .catch(err => console.error(err));
};

useEffect(() => {
    if (selectedSong) {
        navigate("/live");
    }
}, [selectedSong, navigate]);

    return (
        <div className='results-container'>
            <h1>Song results for: "{query}"</h1>

            <div className="results-grid">
                {results.map((song, idx) => (
                    <div key={idx} className="song-card horizontal" onClick={() => handleSongSelect(song)}>
                        <img
                            src={song.img ?? '/src/assets/default-song-cover.jpg'}
                            alt="Song cover"
                            className="song-image"
                        />
                        <div className="song-info">
                            <h3 className="song-title">{song.name}</h3>
                            <p className="song-artist">{song.artist}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
