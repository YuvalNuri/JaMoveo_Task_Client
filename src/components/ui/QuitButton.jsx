import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";

export default function QuitButton() {
  const navigate = useNavigate();
  const { connection } = useSocket();

  const handleQuit = () => {
    if (!connection) return;

    connection.invoke("QuitSession")
      .then(() => navigate("/"))
      .catch((err) => console.error(err));
  };

  return (
    <button className="quit-button" onClick={handleQuit}>
      Quit
    </button>
  );
}
