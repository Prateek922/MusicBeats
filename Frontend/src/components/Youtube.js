import React from "react";
import "../css/mystyles.css";

export default function Downloader() {
  return (
    <>
      <div className="text-center">
        <div className="spot">
          Paste your favourite Youtube playlist link here
        </div>
        <form className="d-flex" method="POST" action="/download_yt">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Video URL"
            name="url"
          />
          <button className="btn mx-3" type="submit">
            Download
          </button>
        </form>
      </div>
    </>
  );
}
