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
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import logo from "/logo.png";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu
  const [drawerOpen, setDrawerOpen] = useState(false); // For side drawer
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const { isLoggedIn } = useAuth();

  // Set active link based on the current route
  const getActiveLink = () => {
    if (location.pathname === "/") return "/"; // If the current URL is '/', mark home as active
    return location.pathname;
  };

  const activeLink = getActiveLink();

  // Handle dropdown open/close
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle drawer toggle
  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  // Handle active link selection and navigate
  const handleNavigation = (route) => {
    navigate(route);
  };

  const sideMenu = (
    <Box
      sx={{
        width: 250,
        height: "100%",
        backgroundColor: "#f5f5f5",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onClick={() => toggleDrawer(false)}
    >
      <List>
        {["/", "/about", "/blogs"].map((route, index) => {
          const label = route.slice(1) || "Home";
          return (
            <ListItem
              button
              key={index}
              onClick={() => handleNavigation(route)}
              sx={{
                marginBottom: 1,
                borderRadius: 2,
                backgroundColor: activeLink === route ? "#003366" : "#fff",
                color: activeLink === route ? "#fff" : "#555",
                "&:hover": {
                  backgroundColor: "#003366",
                  color: "#fff",
                },
              }}
            >
              <ListItemText
                primary={label}
                sx={{ textAlign: "center", fontWeight: "bold" }}
              />
            </ListItem>
          );
        })}
        {/* Features Section */}
        <ListItem
          button
          onClick={handleMenuClick}
          sx={{
            marginBottom: 1,
            borderRadius: 2,
            backgroundColor: "#fff",
            color: "#555",
            "&:hover": {
              backgroundColor: "#003366",
              color: "#fff",
            },
          }}
        >
          <ListItemText primary="Features" sx={{ textAlign: "center" }} />
        </ListItem>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          MenuListProps={{ onMouseLeave: handleMenuClose }}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: 2,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              minWidth: 180,
              backgroundColor: "#fff",
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
          >
            Report Incident
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleNavigation("/heatmap");
              handleMenuClose();
            }}
          >
            Heatmaps
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleNavigation("/voice-report");
              handleMenuClose();
            }}
          >
            Voice Report
          </MenuItem>
        </Menu>
      </List>
      {/* Footer Section */}
      <Box sx={{ textAlign: "center", paddingTop: 2 }}>
        <Typography variant="caption" sx={{ color: "#777" }}>
          BharatSecure © 2025
        </Typography>
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#9ee8e3",
        boxShadow: 3,
        padding: "0 20px",
        "@media (max-width: 450px)": {
          padding: "0",
        },
      }}
    >
      <Container
        sx={{
          "@media (max-width: 450px)": {
            padding: "0",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            "@media (max-width: 450px)": {
              padding: "0",
            },
          }}
        >
          {/* Logo and Company Name */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => handleNavigation("/")} sx={{ p: 0 }}>
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
                  "@media (max-width: 450px)": {
                    fontSize: "2rem",
                  },
                }}
              >
                BharatSecure
              </Typography>
            </Link>
          </Box>

          {/* Navigation Links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            {["/", "/about", "/blogs"].map((route, index) => {
              const label = route.slice(1) || "Home";
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
                  {label.toUpperCase()}
                </Button>
              );
            })}
            {/* Features Button */}
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
              onMouseLeave={(event) => {
                const isOverMenu =
                  event.relatedTarget?.closest(".MuiMenu-root");
                if (!isOverMenu) handleMenuClose();
              }}
            >
              Features
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                onMouseEnter: () => setAnchorEl(anchorEl), // Keep menu open on hover
                onMouseLeave: handleMenuClose, // Close when leaving the menu
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
              >
                Report Incident
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleNavigation("/heatmap");
                  handleMenuClose();
                }}
              >
                Heatmaps
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleNavigation("/voice-report");
                  handleMenuClose();
                }}
              >
                Voice Report
              </MenuItem>
            </Menu>
          </Box>

          {/* Login Button */}
          {!isLoggedIn ? (
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
          ) : (
            <Button
              sx={{
                color: "#003366",
                fontWeight: "bold",
                border: "2px solid #003366",
                borderRadius: 3,
              }}
              onClick={() => {
                const user_type = localStorage.getItem("userType");
                if (user_type == "user") {
                  handleNavigation("/my-reports");
                } else {
                  handleNavigation("/admin");
                }
              }}
            >
              Dash Board
            </Button>
          )}

          {/* Mobile Drawer Icon */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon sx={{ color: "#003366" }} />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Drawer for mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        {sideMenu}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
