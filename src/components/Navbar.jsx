import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { IncidentsContext } from "../context/IncidentsContext"; // Adjust the path as necessary

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Navbar = () => {
  const navigate = useNavigate();
  const { incidents } = useContext(IncidentsContext);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClose = () => setShowModal(false);
  const handleShow = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleLogin = () => {
    if (modalType === "admin") {
      if (username === "admin" && password === "12345") {
        navigate("/admin");
      } else {
        alert("Invalid credentials. Access denied.");
      }
    } else if (modalType === "user") {
      const validUsers = {
        "David Lee": "12345",
        "Emily Chen": "12345",
        "Maria Garcia": "12345",
      };

      if (validUsers[username] === password) {
        const userReports = incidents.filter(
          (incident) => incident.Name === username
        );
        navigate("/my-reports", { state: { userReports } });
      } else {
        alert("Invalid credentials. Access denied.");
      }
    }
    handleClose();
  };

  return (
    <>
      <nav style={styles.navbar}>
        <div  className="font-smooch text-5xl font-semibold">BharatSecure</div>
        <ul style={styles.navLinks}>
          <li style={styles.navItem}>
            <NavLink
              exact="true"
              to="/"
              style={({ isActive }) => ({
                ...styles.navLink,
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "red" : "#fff",
              })}
            >
              Home
            </NavLink>
          </li>
          <li style={styles.navItem}>
            <NavLink
              to="/report-incident"
              style={({ isActive }) => ({
                ...styles.navLink,
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "red" : "#fff",
              })}
            >
              Report Incident
            </NavLink>
          </li>
          <li style={styles.navItem}>
            <a
              href="/my-reports"
              onClick={(e) => {
                e.preventDefault();
                handleShow("user");
              }}
              style={styles.navLink}
            >
              My Reports
            </a>
          </li>
          <li style={styles.navItem}>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                handleShow("admin");
              }}
              style={styles.navLink}
            >
              All Reports
            </a>
          </li>
        </ul>
        <button style={styles.loginButton} disabled={true}>
          Login
        </button>
      </nav>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "admin" ? "Admin Login" : "User Login"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "#fff",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginLeft: "20px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
  },
  loginButton: {
    backgroundColor: "#555",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",  
  },
};

export default Navbar;
