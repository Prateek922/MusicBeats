import React from "react";
import "../css/mystyles.css";
import { Link } from "react-router-dom";

export default function Downloader() {
  let goTO = () => {
    window.open("http://localhost:5000/login", "_self");
  };
  return (
    <>
      <div className="text-center">
        <div className="spot">
          Download your favourite artists from Youtube and Spotify
        </div>
        <button type="button" class="source btn btn-lg" onClick={goTO}>
          Download from Spotify
        </button>
        <Link to="/download_from_youtube">
          <button type="button" class="source btn btn-lg">
            Download from Youtube
          </button>
        </Link>
      </div>
    </>
  );
}
