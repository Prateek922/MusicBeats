import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import headphone from "../images/headphone.png";
import { Link } from "react-router-dom";

function Grid() {
  return (
    <div className="container">
      <Container>
        <Row>
          <Col>
            <img className="headphone" src={headphone} alt="headphone"></img>
          </Col>
          <Col>
            <div className="grid">
              <h1 style={{ color: "#455A64" }}>PLAY WITH MUSIC </h1>
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
                mollitia, molestiae quas vel sint commodi repudiandae
                consequuntur voluptatum laborum numquam blanditiis harum
                quisquam eius sed odit fugiat iusto fuga praesentium optio,
                eaque rerum! Provident similique accusantium nemo autem.
                Veritatis obcaecati tenetur iure eius earum ut molestias
                architecto voluptate aliquam nihil, eveniet aliquid culpa
                officia aut! Impedit sit sunt quaerat, odit, tenetur error itiis
                harum quisquam eius sed odit fugiat iusto fuga praesentium
                optio, eaque rerum.
                <br /> <br />
                <Link to="/transfer">
                  <button type="button" className="btn">
                    Transfer Playlist
                  </button>
                </Link>
                <Link to="/download">
                  <button type="button" id="grid-btn" className="btn">
                    Download Playlist
                  </button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
        {/* <button className="btn">Click me</button>
      <button className="btn">Click me</button> */}
      </Container>
    </div>
  );
}

export default Grid;
