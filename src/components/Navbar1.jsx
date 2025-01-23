import React, { useState } from "react";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

// Logo path (replace with your local logo path)
import logo from "/logo.png";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // To open/close dropdown
  const navigate = useNavigate();

  // Handle active link selection
  const handleNavigation = (route) => {
    setActiveLink(route);
    navigate(route);
  };

  // Handle dropdown open/close
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#9ee8e3", boxShadow: 3 }}>
      <Container>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo and Company Name */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => handleNavigation("/")}>
              <img
                src={logo}
                alt="Logo"
                style={{ width: 40, height: 40, marginRight: 10 }}
              />
            </IconButton>
            <Link to={"/"}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "semibold",
                  color: "#003366",
                  fontFamily: "Smooch Sans, sans-serif",
                  fontSize: "3rem",
                }}
              >
                BharatSecure
              </Typography>
            </Link>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center" }}>
            {["/", "/about", "/blogs"].map((route, index) => {
              const label = route.slice(1) || "Home"; // Display "Home" for "/"
              return (
                <Button
                  key={index}
                  sx={{
                    color: activeLink === route ? "#003366" : "#fff",
                    fontWeight: "bold",
                    margin: "0 20px",
                    borderBottom:
                      activeLink === route ? "2px solid #003366" : "none",
                  }}
                  onClick={() => handleNavigation(route)}
                >
                  {label}
                </Button>
              );
            })}
            {/* Features Dropdown */}
            <Button
              sx={{
                color:
                  activeLink &&
                  ["/report-incident", "/heatmap", "/voice-report"].includes(
                    activeLink
                  )
                    ? "#003366"
                    : "#fff",
                fontWeight: "bold",
                margin: "0 20px",
                borderBottom:
                  activeLink &&
                  ["/report-incident", "/heatmap", "/voice-report"].includes(
                    activeLink
                  )
                    ? "2px solid #003366"
                    : "none",
              }}
              onMouseEnter={handleMenuClick}
            >
              Features
            </Button>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                onMouseLeave: handleMenuClose,
              }}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: 2,
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  minWidth: 180,
                  backgroundColor: "aliceblue",
                },
                "& .MuiMenuItem-root": {
                  padding: "10px 20px",
                  fontSize: "1rem",
                  color: "#555",
                  "&:hover": {
                    fontWeight: "bold",
                    backgroundColor: "#f0f0f0",
                    color: "#003366",
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleNavigation("/report-incident");
                  handleMenuClose();
                }}
                sx={{
                  fontWeight:
                    activeLink === "/report-incident" ? "bold" : "normal",
                  color: activeLink === "/report-incident" ? "#003366" : "#555",
                }}
              >
                Report Incident
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleNavigation("/heatmap");
                  handleMenuClose();
                }}
                sx={{
                  fontWeight: activeLink === "/heatmap" ? "bold" : "normal",
                  color: activeLink === "/heatmap" ? "#003366" : "#555",
                }}
              >
                Heatmaps
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleNavigation("/voice-report");
                  handleMenuClose();
                }}
                sx={{
                  fontWeight:
                    activeLink === "/voice-report" ? "bold" : "normal",
                  color: activeLink === "/voice-report" ? "#003366" : "#555",
                }}
              >
                Voice Report
              </MenuItem>
            </Menu>
          </Box>

          {/* Login Button */}
          <Link to={"/login"}>
            <Button
              sx={{
                color: "#003366",
                fontWeight: "bold",
                border: "2px solid #003366",
                borderRadius: 3,
              }}
              onClick={() => handleNavigation("/login")}
            >
              Login
            </Button>
          </Link>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
