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
import logo from "/image.png";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const getActiveLink = () => {
    if (location.pathname === "/") return "/";
    return location.pathname;
  };

  const activeLink = getActiveLink();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  const sideMenu = (
    <Box
      sx={{
        width: 250,
        height: "100%",
        backgroundColor: "#0f192c",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onClick={() => toggleDrawer(false)}
    >
      <List>
        {["/", "/About", "/Blogs"].map((route, index) => {
          const label = route.slice(1) || "Home";
          return (
            <ListItem
              button
              key={index}
              onClick={() => handleNavigation(route)}
              sx={{
                marginBottom: 1,
                borderRadius: 2,
                backgroundColor:
                  activeLink === route ? "#22d3ee" : "transparent",
                color: activeLink === route ? "#0f192c" : "#fff",
                "&:hover": {
                  backgroundColor: "#22d3ee",
                  color: "#0f192c",
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
        <ListItem
          button
          onClick={handleMenuClick}
          sx={{
            marginBottom: 1,
            borderRadius: 2,
            backgroundColor: "transparent",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#22d3ee",
              color: "#0f192c",
            },
          }}
        >
          <ListItemText primary="Features" sx={{ textAlign: "center" }} />
        </ListItem>
      </List>
      <Box sx={{ textAlign: "center", paddingTop: 2 }}>
        <Typography variant="caption" sx={{ color: "#22d3ee" }}>
          BharatSecure © {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#0f192c",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => handleNavigation("/")}
              sx={{
                p: 1,
                "&:hover": {
                  backgroundColor: "rgba(34, 211, 238, 0.1)",
                },
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ width: 40, height: 40, marginRight: 10, borderRadius:"50%" }}
              />
            </IconButton>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "semibold",
                  color: "#22d3ee",
                  fontFamily: "Smooch Sans, sans-serif",
                  fontSize: "3rem",
                  "&:hover": {
                    color: "#0891b2",
                  },
                  "@media (max-width: 450px)": {
                    fontSize: "2rem",
                  },
                }}
              >
                BharatSecure
              </Typography>
            </Link>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            {["/", "/About", "/InciLog"].map((route, index) => {
              const label = route.slice(1) || "Home";
              return (
                <Button
                  key={index}
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    margin: "0 20px",
                    borderBottom:
                      activeLink === route ? "2px solid #22d3ee" : "none",
                    "&:hover": {
                      color: "#22d3ee",
                      backgroundColor: "transparent",
                    },
                  }}
                  onClick={() => handleNavigation(route)}
                >
                  {label.toUpperCase()}
                </Button>
              );
            })}
            <Button
              sx={{
                color: "#fff",
                fontWeight: "bold",
                margin: "0 20px",
                borderBottom: [
                  "/report-incident",
                  "/heatmap",
                  "/voice-report",
                ].includes(activeLink)
                  ? "2px solid #22d3ee"
                  : "none",
                "&:hover": {
                  color: "#22d3ee",
                  backgroundColor: "transparent",
                },
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
          </Box>

          {!isLoggedIn ? (
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  color: "#22d3ee",
                  fontWeight: "bold",
                  border: "2px solid #22d3ee",
                  borderRadius: 3,
                  "&:hover": {
                    backgroundColor: "#22d3ee",
                    color: "#0f192c",
                  },
                }}
              >
                Login
              </Button>
            </Link>
          ) : (
            <Button
              sx={{
                color: "#22d3ee",
                fontWeight: "bold",
                border: "2px solid #22d3ee",
                borderRadius: 3,
                "&:hover": {
                  backgroundColor: "#22d3ee",
                  color: "#0f192c",
                },
              }}
              onClick={() => {
                const user_type = localStorage.getItem("userType");
                handleNavigation(
                  user_type === "user" ? "/my-reports" : "/admin"
                );
              }}
            >
              Dashboard
            </Button>
          )}

          <IconButton
            sx={{
              display: { xs: "block", md: "none" },
              color: "#22d3ee",
              "&:hover": {
                backgroundColor: "rgba(34, 211, 238, 0.1)",
              },
            }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          onMouseEnter: () => setAnchorEl(anchorEl),
          onMouseLeave: handleMenuClose,
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#0f192c",
            borderRadius: 2,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
            minWidth: 180,
          },
          "& .MuiMenuItem-root": {
            padding: "10px 20px",
            fontSize: "1rem",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#22d3ee",
              color: "#0f192c",
              fontWeight: "bold",
            },
          },
        }}
      >
        {[
          { route: "/report-incident", label: "Report Incident" },
          { route: "/heatmap", label: "Heatmaps" },
          { route: "/voice-report", label: "Voice Report" },
          { route: "/chatbot", label: "Saathi AI" },
        ].map((item) => (
          <MenuItem
            key={item.route}
            onClick={() => {
              handleNavigation(item.route);
              handleMenuClose();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>

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
