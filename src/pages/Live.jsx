import { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdArrowUpward, MdFastForward, MdScreenRotation, MdSlowMotionVideo } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import LyricsAndChordsDisplay from "../components/ui/LyricsAndChordsDisplay";
import ScrollToggle from "../components/ui/ScrollToggle";
import QuitButton from "../components/ui/QuitButton";
import { ApiContext } from "../context/ApiContext";
import '../styles/live.css';

export default function Live() {
    const { local } = useContext(ApiContext);
    const { state } = useLocation();
    const { selectedSong, resetSelectedSong, connection } = useSocket();
    const song = state?.song || selectedSong;
    const navigate = useNavigate();
    const { user } = useAuth();
    console.log(user);
    const lyricsContainerRef = useRef(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const [lyricsData, setLyricsData] = useState(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [atBottom, setAtBottom] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(110);
    const [isShortScreen, setIsShortScreen] = useState(false);

    console.log("selectedSong:", selectedSong);
    console.log("state.song:", state?.song);
    console.log("song:", song);


    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
            setIsShortScreen(window.innerHeight < 900);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (!lyricsContainerRef.current) return;

        const container = lyricsContainerRef.current;

        let intervalId;
        let timeoutId;

        if (isScrolling) {
            if (atBottom) { //if got to end and resumed - start from the begining
                container.scrollTop = 0;
                setAtBottom(false);
            }

            const startScrolling = () => {
                intervalId = setInterval(() => {
                    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
                        setIsScrolling(false);
                        setAtBottom(true);
                        return;
                    }
                    container.scrollTop += 1;
                }, scrollSpeed);
            };

            if (container.scrollTop === 0) {
                timeoutId = setTimeout(startScrolling, 1000); // 1 second delay
            } else {
                startScrolling();
            }
        }

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [isScrolling, scrollSpeed]);

    // fetch lyrics JSON
    useEffect(() => {
        if (!song?.fileName) return;

        fetch(`${local}api/Admin/song?fileName=${encodeURIComponent(song.fileName)}`)
            .then(res => res.json())
            .then(data => setLyricsData(data))
            .catch(err => console.error(err));
    }, [song?.fileName]);

    // listen for SessionQuit
    useEffect(() => {
        if (!connection) return;

        const handler = () => {
            navigate("/");
        };

        connection.on("SessionQuit", handler);

        return () => {
            connection.off("SessionQuit", handler);
        };
    }, [connection, navigate, user.role]);

    // render after hooks
    if (!song) return <p>Waiting for the song to start...</p>;
    if (!lyricsData) return <p>Loading lyrics...</p>;

    return (
        <div className="live-container">
            {isShortScreen ? (
                <h1>
                    {song.name} <small className="h3">({song.artist})</small>
                </h1>
            ) : (
                <>
                    <h1>{song.name}</h1>
                    <h3>{song.artist}</h3>
                </>
            )}

            {song.img && <img src={song.img} alt={song.name} />}

            {user.isAdmin && <div className="quit-row"><QuitButton /></div>}

            {isSmallScreen
                ? <div>
                    <MdScreenRotation size={50} />
                    <p>For the best experience, please rotate your device or use a larger screen.</p>
                </div>
                : <>
                    {isShortScreen ? (
                        <div className="lyricsnchords-container" style={{ display: 'flex', gap: '1rem' }}>
                            <LyricsAndChordsDisplay
                                lyricsData={lyricsData}
                                role={user.instrument}
                                isScrolling={isScrolling}
                                containerRef={lyricsContainerRef}
                            />
                            <div className="scroll-controls vertical">
                                <ScrollToggle
                                    isScrolling={isScrolling}
                                    onToggle={() => setIsScrolling((prev) => !prev)}
                                />

                                <button className="scroll-faster"
                                    onClick={() => setScrollSpeed(s => Math.max(50, s - 10))}
                                    disabled={scrollSpeed <= 50}
                                >
                                    <MdFastForward size={20} />
                                </button>
                                <button className="scroll-slower"
                                    onClick={() => setScrollSpeed(s => Math.min(200, s + 10))}
                                    disabled={scrollSpeed >= 200}
                                >
                                    <MdSlowMotionVideo size={20} />
                                </button>

                                <button className="scroll-top" onClick={() => {
                                    if (lyricsContainerRef.current) {
                                        lyricsContainerRef.current.scrollTop = 0;
                                        setAtBottom(false);
                                    }
                                }}>
                                    <MdArrowUpward size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="lyricsnchords-container">
                            <div className="scroll-controls">
                                <span>Scroll Control</span>
                                <ScrollToggle
                                    isScrolling={isScrolling}
                                    onToggle={() => setIsScrolling((prev) => !prev)}
                                />

                                <button className="scroll-faster"
                                    onClick={() => setScrollSpeed(s => Math.max(50, s - 10))}
                                    disabled={scrollSpeed <= 50}
                                >
                                    <MdFastForward size={20} />
                                </button>
                                <button className="scroll-slower"
                                    onClick={() => setScrollSpeed(s => Math.min(200, s + 10))}
                                    disabled={scrollSpeed >= 200}
                                >
                                    <MdSlowMotionVideo size={20} />
                                </button>

                                <button className="scroll-top" onClick={() => {
                                    if (lyricsContainerRef.current) {
                                        lyricsContainerRef.current.scrollTop = 0;
                                        setAtBottom(false);
                                    }
                                }}>
                                    <MdArrowUpward size={20} />
                                </button>
                            </div>
                            <LyricsAndChordsDisplay
                                lyricsData={lyricsData}
                                role={user.instrument}
                                isScrolling={isScrolling}
                                containerRef={lyricsContainerRef}
                            />
                        </div>

                    )}

                    {/*<div className="scroll-controls">
                        <span>Scroll Control</span>
                        <ScrollToggle
                            isScrolling={isScrolling}
                            onToggle={() => setIsScrolling((prev) => !prev)}
                        />

                        <button className="scroll-faster"
                            onClick={() => setScrollSpeed(s => Math.max(50, s - 10))}
                            disabled={scrollSpeed <= 50}
                        >
                            <MdFastForward size={20} />
                        </button>
                        <button className="scroll-slower"
                            onClick={() => setScrollSpeed(s => Math.min(200, s + 10))}
                            disabled={scrollSpeed >= 200}
                        >
                            <MdSlowMotionVideo size={20} />
                        </button>

                        <button className="scroll-top" onClick={() => {
                            if (lyricsContainerRef.current) {
                                lyricsContainerRef.current.scrollTop = 0;
                                setAtBottom(false);
                            }
                        }}>
                            <MdArrowUpward size={20} />
                        </button>
                    </div>

                    <LyricsAndChordsDisplay
                        lyricsData={lyricsData}
                        role={user.instrument}
                        isScrolling={isScrolling}
                        containerRef={lyricsContainerRef}
                    />*/}
                </>
            }
        </div>
    );
}
