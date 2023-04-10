import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Transfer from "./components/Transfer";
import Grid from "./components/Grid";
import Navbar from "./components/Navbar";
import Download from "./components/Download";
import Spotify from "./components/Spotify";
import Youtube from "./components/Youtube";
import YoutubeToSpotify from "./components/YoutubeToSpotify";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container"></div>
      <Routes>
        <Route path="/" element={<Grid />} />
      </Routes>
      <Routes>
        <Route path="/transfer" element={<Transfer />} />
      </Routes>
      <Routes>
        <Route path="/download" element={<Download />} />
      </Routes>
      <Routes>
        <Route path="/download_from_spotify" element={<Spotify />} />
      </Routes>
      <Routes>
        <Route path="/download_from_youtube" element={<Youtube />} />
      </Routes>
      <Routes>
        <Route path="/youtube_to_spotify" element={<YoutubeToSpotify />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
