import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Footer from "../components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import ScaleInComponent from "@/lib/ScaleInComponent";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, rememberMe: e.target.checked });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Valid Email is required";
    if (!formData.password || formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters long";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validate()) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/login/", {
          email: formData.email,
          password: formData.password,
        });

        const {
          tokens: { access, refresh },
        } = response.data;
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("userType", response.data.user_type);
        login();
        navigate(response.data.user_type === "user" ? "/my-reports" : "/admin");
      } catch (error) {
        setErrors({
          ...errors,
          general: error.response?.data?.error || "Something went wrong!",
        });
      }
    }
  };

  return (
    <>
      <ScaleInComponent>
        <Container
          maxWidth={false} // Disables default max-width
          disableGutters // Removes padding that might be restricting width
          sx={{
            minHeight: "85vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "url('https://preview.redd.it/dark-magical-forest-desktop-wallpaper-3840x2160-v0-gtjs6enuckjd1.jpeg?auto=webp&s=29ecf260c86d42345270b3ddd35c9ba9ea7e14f4') no-repeat center center fixed",
            backgroundSize: "cover",
          }}
        >
          <Box
            sx={{
              maxWidth: 500,
              textAlign: "center",
              padding: 4,
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              boxShadow: `
      8px 8px 16px rgba(0, 0, 0, 0.6),
      -8px -8px 16px rgba(255, 255, 255, 0.05),
      0 0 15px rgba(0, 191, 255, 0.5)
    `,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                mb: 2,
                fontFamily: "'Smooch Sans', sans-serif",
                textShadow: "0 0 10px rgba(0, 191, 255, 0.8)",
              }}
            >
              Log In
            </Typography>
            <Divider
              sx={{ mb: 3, borderColor: "#bbb", width: "50px", mx: "auto" }}
            />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: 2,
                    input: {
                      color: "#fff",
                      "&::placeholder": {
                        color: "#bbb", // Change placeholder color here
                        opacity: 1, // Ensure visibility in some browsers
                      },
                    },
                    boxShadow:
                      "inset 3px 3px 6px rgba(0, 0, 0, 0.6), inset -3px -3px 6px rgba(255, 255, 255, 0.05)",
                  }}
                  InputLabelProps={{
                    sx: { color: "#bbb" }, // Label color
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: 2,
                    input: {
                      color: "#fff",
                      "&::placeholder": {
                        color: "#bbb", // Change placeholder color here
                        opacity: 1, // Ensure visibility in some browsers
                      },
                    },
                    boxShadow:
                      "inset 3px 3px 6px rgba(0, 0, 0, 0.6), inset -3px -3px 6px rgba(255, 255, 255, 0.05)",
                  }}
                  InputLabelProps={{
                    sx: { color: "#bbb" }, // Label color
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.rememberMe}
                      onChange={handleCheckboxChange}
                      sx={{ color: "#fff" }}
                    />
                  }
                  label={
                    <Typography sx={{ color: "#fff" }}>Remember Me</Typography>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#222",
                    color: "#fff",
                    borderRadius: "10px",
                    boxShadow: `
                      5px 5px 15px rgba(0, 0, 0, 0.7),
                      -5px -5px 15px rgba(255, 255, 255, 0.05),
                      0 0 10px rgba(0, 191, 255, 0.8)
                    `,
                    "&:hover": {
                      backgroundColor: "#333",
                      boxShadow: `
                        0 0 10px rgba(0, 191, 255, 0.8),
                        0 0 20px rgba(0, 191, 255, 0.6)
                      `,
                    },
                  }}
                  onClick={handleLogin}
                >
                  Log In
                </Button>
                {errors.general && (
                  <Typography color="error" sx={{ mt: 2, fontSize: "0.9rem" }}>
                    {errors.general}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    color: "#bbb",
                    fontSize: "1rem",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                  }}
                >
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    style={{
                      color: "#0bf",
                      fontWeight: "bold",
                      textDecoration: "none",
                      position: "relative",
                      transition: "color 0.3s ease-in-out",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#00ffff")}
                    onMouseLeave={(e) => (e.target.style.color = "#0bf")}
                  >
                    Sign Up
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-2px",
                        left: 0,
                        width: "100%",
                        height: "2px",
                        background: "linear-gradient(90deg, #0bf, #00ffff)",
                        transition: "transform 0.3s ease-in-out",
                        transform: "scaleX(0)",
                        transformOrigin: "right",
                      }}
                      className="signup-underline"
                    ></span>
                  </Link>
                </Typography>

                <style>
                  {`
  .signup-underline {
    display: block;
  }
  a:hover .signup-underline {
    transform: scaleX(1);
    transform-origin: left;
  }
  `}
                </style>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </ScaleInComponent>
      <Footer />
    </>
  );
};

export default Login;
