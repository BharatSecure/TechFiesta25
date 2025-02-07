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
} from "@mui/material";
import Footer from "../components/Footer";
import { useNavigate, Link } from "react-router-dom";
import ScaleInComponent from "@/lib/ScaleInComponent";
// import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    aadharNumber: "",
    emergencyContact1: "",
    emergencyContact2: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // const { isLoggedIn, login, logout } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.firstName) tempErrors.firstName = "First Name is required";
    if (!formData.lastName) tempErrors.lastName = "Last Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Valid Email is required";
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber))
      tempErrors.phoneNumber = "Valid 10-digit Phone Number is required";
    if (!formData.aadharNumber || !/^\d{12}$/.test(formData.aadharNumber))
      tempErrors.aadharNumber = "Valid 12-digit Aadhar Number is required";
    if (!formData.password || formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters long";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/signup/",
        formData
      );
      if (response.status === 201) {
        setMessage("User created successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          address: "",
          aadharNumber: "",
          emergencyContact1: "",
          emergencyContact2: "",
          password: "",
        });
        // login();
        navigate("/login");
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.detail || "Error occurred while signing up."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <ScaleInComponent>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            minHeight: "85vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding:"44px 0px",
            background:
              "url('https://preview.redd.it/dark-magical-forest-desktop-wallpaper-3840x2160-v0-gtjs6enuckjd1.jpeg?auto=webp&s=29ecf260c86d42345270b3ddd35c9ba9ea7e14f4') no-repeat center center fixed",
            backgroundSize: "cover",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "url('https://preview.redd.it/dark-magical-forest-desktop-wallpaper-3840x2160-v0-gtjs6enuckjd1.jpeg?auto=webp&s=29ecf260c86d42345270b3ddd35c9ba9ea7e14f4') no-repeat center center fixed",
              backgroundSize: "cover",
              opacity: 0.3,
              zIndex: -1,
            },
          }}
        >
          <Box
            sx={{
              maxWidth: 700,
              mx: "auto",
              textAlign: "center",
              padding: 4,
              borderRadius: 4,
              backdropFilter: "blur(15px)",
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
                mb: 4,
                fontFamily: "'Smooch Sans', sans-serif",
                letterSpacing: 1,
                textShadow: "0 0 10px rgba(0, 191, 255, 0.8)",
              }}
            >
              Create Your Account
            </Typography>
            <Divider
              sx={{ mb: 4, borderColor: "#bbb", width: "50px", mx: "auto" }}
            />
            {message && (
              <Typography
                sx={{ color: "#0bf", mb: 2, fontWeight: "bold" }}
                variant="body1"
              >
                {message}
              </Typography>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {[
                  { label: "First Name", name: "firstName" },
                  { label: "Last Name", name: "lastName" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Phone Number", name: "phoneNumber", type: "tel" },
                  {
                    label: "Address",
                    name: "address",
                    multiline: true,
                    rows: 3,
                  },
                  { label: "Aadhar Number", name: "aadharNumber" },
                  {
                    label: "Emergency Contact 1",
                    name: "emergencyContact1",
                    type: "tel",
                  },
                  {
                    label: "Emergency Contact 2",
                    name: "emergencyContact2",
                    type: "tel",
                  },
                  {
                    label: "Create Password",
                    name: "password",
                    type: "password",
                  },
                ].map((field, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={field.name.includes("Name") ? 6 : 12}
                    key={index}
                  >
                    <TextField
                      {...field}
                      variant="outlined"
                      fullWidth
                      value={formData[field.name]}
                      onChange={handleChange}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: 2,
                        input: {
                          color: "#fff",
                          "&::placeholder": {
                            color: "#bbb",
                            opacity: 1,
                          },
                        },
                        boxShadow:
                          "inset 3px 3px 6px rgba(0, 0, 0, 0.6), inset -3px -3px 6px rgba(255, 255, 255, 0.05)",
                      }}
                      InputLabelProps={{
                        sx: { color: "#bbb" },
                      }}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#222",
                      color: "#fff",
                      padding: "12px 20px",
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
                  >
                    Sign Up
                  </Button>
                  {error && (
                    <Typography
                      sx={{ mt: 2, fontSize: "0.9rem", color: "red" }}
                    >
                      {error}
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
                    Already have an account?{" "}
                    <Link
                      to="/login"
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
                      Log in
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
                        className="login-underline"
                      ></span>
                    </Link>
                  </Typography>

                  <style>
                    {`
                      .login-underline {
                        display: block;
                      }
                      a:hover .login-underline {
                        transform: scaleX(1);
                        transform-origin: left;
                      }
                    `}
                  </style>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Container>
      </ScaleInComponent>
      <Footer />
    </>
  );
};

export default SignUp;
