import { MdPause, MdPlayArrow } from 'react-icons/md';
import '../../styles/live.css';

export default function ScrollToggle({ isScrolling, onToggle }) {
  return (
    <button className="floating-toggle scroll-toggle" onClick={onToggle}>
      {isScrolling ? <MdPause size={20} /> : <MdPlayArrow size={20}/>}
    </button>
  );
}
