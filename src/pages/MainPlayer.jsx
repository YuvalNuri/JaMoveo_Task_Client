import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiContext } from '../context/ApiContext';
import CreatableSelect from 'react-select/creatable';
import '../styles/forms.css';
import { useSocket } from '../context/SocketContext';

export default function MainPlayer() {
    const navigate = useNavigate();
    const { local, server } = useContext(ApiContext);
    const { selectedSong } = useSocket();

    useEffect(() => {
        if (selectedSong) {
            navigate("/live");
        }
    }, [selectedSong, navigate]);

    return (
        <div>
            <h1>player</h1>
            <h3>Waiting for next song</h3>
        </div>
    );
}
