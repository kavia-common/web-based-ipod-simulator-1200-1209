import React, { useState } from "react";
import "./iPodClassic.css";

// Demo Playlist
const demoTracks = [
  { title: "Song One", artist: "Artist A", album: "Album X", art: "https://upload.wikimedia.org/wikipedia/en/9/97/The_Slim_Shady_LP.png" },
  { title: "Song Two", artist: "Artist B", album: "Album Y", art: "https://upload.wikimedia.org/wikipedia/en/4/4b/RedHotChiliPeppersByTheWayAlbumCover.jpg" },
  { title: "Song Three", artist: "Artist C", album: "Album Z", art: "https://upload.wikimedia.org/wikipedia/en/f/fd/Taylor_Swift_-_1989.png" }
];

const MAIN_MENU = [
  "Music",
  "Videos",
  "Photos",
  "Podcasts",
  "Extras",
  "Settings",
  "Shuffle Songs",
  "Now Playing"
];

// App navigation stack, menu system, and play state
function getMenu(menuKey, state) {
  switch (menuKey) {
    case "root":
      return { header: "iPod", items: MAIN_MENU };
    case "Music":
      return { header: "Music", items: ["Playlists", "Artists", "Albums", "Songs"] };
    case "Now Playing":
      return { header: "Now Playing", items: [] };
    case "Playlists":
      return { header: "Playlists", items: ["Playlist 1", "Playlist 2", "All Songs"] };
    default:
      return { header: menuKey, items: [] };
  }
}

function getAlbumArt(playIdx) {
  if (playIdx == null) return null;
  return demoTracks[playIdx].art;
}

/** 
 * PUBLIC_INTERFACE
 * Fully interactive iPod Classic component (UI and core functionality)
 */
function IpodClassic() {
  // App state: stack = [{menu, selectedIdx}]
  const [stack, setStack] = useState([{ menu: "root", idx: 0 }]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playIdx, setPlayIdx] = useState(null);

  const current = stack[stack.length - 1];
  const menuData = getMenu(current.menu, { playIdx });
  const selIdx = current.idx;
  const inNowPlaying = current.menu === "Now Playing";

  // Menu selection logic
  const selectItem = (index) => {
    if (menuData.items.length === 0) return;
    setStack(st => [...st.slice(0, st.length - 1), { ...st[st.length - 1], idx: index }]);
  };

  // Wheel navigation
  const handleWheel = (direction) => {
    if (inNowPlaying) return; // No up/down in Now Playing
    const max = menuData.items.length;
    let newIdx = selIdx;
    if (direction === "up") newIdx = (selIdx - 1 + max) % max;
    if (direction === "down") newIdx = (selIdx + 1) % max;
    selectItem(newIdx);
  };

  // Enter/select logic
  const handleCenterPress = () => {
    if (inNowPlaying) return;
    const selLabel = menuData.items[selIdx];
    if (selLabel === "Now Playing" || current.menu === "Now Playing") {
      setStack(st => [...st, { menu: "Now Playing", idx: 0 }]);
      setIsPlaying(true);
      setPlayIdx(playIdx == null ? 0 : playIdx);
      return;
    }
    if (selLabel === "Shuffle Songs") {
      setIsPlaying(true);
      setPlayIdx(Math.floor(Math.random() * demoTracks.length));
      setStack(st => [...st, { menu: "Now Playing", idx: 0 }]);
      return;
    }
    if (selLabel === "Music") {
      setStack(st => [...st, { menu: "Music", idx: 0 }]);
      return;
    }
    // Simulate submenus where items exist
    if (["Playlists", "Artists", "Albums", "Songs"].includes(selLabel)) {
      setStack(st => [...st, { menu: selLabel, idx: 0 }]);
      return;
    }
    // For demo, selecting a song in "All Songs" plays it
    if (current.menu === "Playlists" && selLabel === "All Songs") {
      setIsPlaying(true);
      setPlayIdx(0);
      setStack(st => [...st, { menu: "Now Playing", idx: 0 }]);
      return;
    }
  };

  // Back/menu logic
  const handleBack = () => {
    if (stack.length > 1) {
      setStack(st => st.slice(0, st.length - 1));
    }
  };

  // Skip/Previous track (when playing)
  const handleSkip = (direction) => {
    if (!inNowPlaying || playIdx == null) return;
    let newIdx = playIdx;
    if (direction === "prev") {
      newIdx = (playIdx - 1 + demoTracks.length) % demoTracks.length;
    } else {
      newIdx = (playIdx + 1) % demoTracks.length;
    }
    setPlayIdx(newIdx);
    setIsPlaying(true);
  };

  // Play/Pause Button
  const handlePlayPause = () => {
    if (inNowPlaying) setIsPlaying(val => !val);
  };

  // Keyboard navigation demo (optional but nice)
  React.useEffect(() => {
    const onKeyDown = (ev) => {
      if (ev.repeat) return;
      switch (ev.key) {
        case "ArrowUp":
          handleWheel("up");
          break;
        case "ArrowDown":
          handleWheel("down");
          break;
        case "Enter":
        case " ":
          handleCenterPress();
          break;
        case "Escape":
        case "Backspace":
          handleBack();
          break;
        case "ArrowLeft":
          handleSkip("prev");
          break;
        case "ArrowRight":
          handleSkip("next");
          break;
        case "p":
          handlePlayPause();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line
  }, [stack, selIdx, playIdx, inNowPlaying, isPlaying]);

  // Wheel click handlers
  const wheel = {
    onMenu: handleBack,
    onPrev: () => handleSkip("prev"),
    onNext: () => handleSkip("next"),
    onPlayPause: handlePlayPause,
    onCenter: handleCenterPress,
    onUp: () => handleWheel("up"),
    onDown: () => handleWheel("down")
  };

  // Render iPod UI according to visual specs
  return (
    <div className="ipod-container">
      <div className="ipod-device">
        <div className="ipod-screen">
          {/* Left pane: Menu(s) */}
          <div className="ipod-menu-pane">
            <div className="ipod-menu-header">{menuData.header}</div>
            <ul className="ipod-menu-list">
              {menuData.items && menuData.items.map((label, i) => (
                <li
                  key={label}
                  className={i === selIdx ? "active" : ""}
                  onClick={() => { selectItem(i); if (!inNowPlaying) handleCenterPress(); }}
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
          {/* Divider */}
          <div className="ipod-screen-divider" />
          {/* Right pane: Album art or Now Playing */}
          <div className="ipod-album-art">
            {inNowPlaying && playIdx != null ? (
              <div className="album-art-nowplaying">
                <img src={getAlbumArt(playIdx)} alt="Now Playing" />
                <div className="nowplaying-songinfo">
                  <div className="nowplaying-title">{demoTracks[playIdx].title}</div>
                  <div className="nowplaying-artist">{demoTracks[playIdx].artist} &ndash; {demoTracks[playIdx].album}</div>
                  <div className="nowplaying-status">{isPlaying ? "▶ Playing" : "⏸ Paused"}</div>
                </div>
              </div>
            ) : (
              <div className="album-art-placeholder">
                <span role="img" aria-label="no album art">🎵</span>
              </div>
            )}
          </div>
        </div>
        {/* Flexible vertical spacer to help center wheel beneath screen */}
        <div className="click-wheel-vertical-spacer"></div>
        {/* Click Wheel */}
        <div className="click-wheel-holder">
          <div className="click-wheel"
            tabIndex={0}
            aria-label="Click wheel"
          >
            {/* Compass points - lay out with polar absolute positioning */}
            <div className="wheel-btn wheel-menu" onClick={wheel.onMenu}>
              MENU
            </div>
            <div className="wheel-btn wheel-prev" onClick={wheel.onPrev}>
              <span>&#60;&#60;</span>
            </div>
            <div className="wheel-btn wheel-next" onClick={wheel.onNext}>
              <span>&#62;&#62;</span>
            </div>
            <div className="wheel-btn wheel-play" onClick={wheel.onPlayPause}>
              {/* Always show both Play and Pause for authenticity */}
              <span style={{ fontSize: "15px", verticalAlign: "middle" }}>
                <span style={{ marginRight: "4px", position: "relative", top: "1px" }}>►</span>
                <span style={{ fontWeight: "bold" }}>&#10073;&#10073;</span>
              </span>
            </div>
            {/* (Optional) up/down overlays */}
            <div className="click-wheel-up" onClick={wheel.onUp}></div>
            <div className="click-wheel-down" onClick={wheel.onDown}></div>
            {/* Center button */}
            <div className="wheel-center" onClick={wheel.onCenter}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IpodClassic;
