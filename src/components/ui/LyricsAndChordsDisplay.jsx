import detectHebrew from '../../assets/utils/detectHebrew';
import '../../styles/lyrics.css';

export default function LyricsAndChordsDisplay({
  lyricsData,
  role,
  isScrolling,
  isHebrew = false,
  containerRef
}) {

  console.log("role:", role);

  if (!lyricsData) return <p>Loading lyrics...</p>;

  return (
    <div
      ref={containerRef}
      className={`lyrics-container ${isScrolling ? "scrolling" : ""}`}
      style={{
        direction: isHebrew ? "rtl" : "ltr",
        textAlign: isHebrew ? "right" : "left"
      }}
    >
      {lyricsData.map((line, idx) => {
        const isLineHebrew = line.some(word => detectHebrew(word.lyrics));

        return (
          <div
            key={idx}
            className="line"
            style={{
              direction: isLineHebrew ? "rtl" : "ltr",
              textAlign: isLineHebrew ? "right" : "left"
            }}
          >
            {line.map((word, wIdx) => (
              <span key={wIdx} className="word-block">
                {role?.toLowerCase() !== "singer" && (
                  <div className="chord">{word.chords || ""}</div>
                )}
                <div className="lyrics">{word.lyrics}</div>
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
