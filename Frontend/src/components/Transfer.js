import React from "react";
import "../css/mystyles.css";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bg from "../images/bg.png";

export default function SpotToyout() {
  let goTO = () => {
    window.open("http://localhost:5000/login2", "_self");
  };
  return (
    <div className="text-center">
      <div className="spot">SELECT THE SOURCE </div>
      <button className="source btn" type="button">
        <i class="fa-brands fa-spotify"></i> Spotify
      </button>
      <button type="button" className="source btn" onClick={goTO}>
        Youtube
      </button>
      {/* <img className="bottom" src={bg} alt=""/> */}
      {/* <FontAwesomeIcon icon="fa-brands fa-spotify" /> */}
    </div>
  );
}
// deselect kr
