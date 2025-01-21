import React, { useState } from "react";
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

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

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

  const handleLogin = () => {
    if (validate()) {
      // Logic to handle login (e.g., API call)
      console.log("Login Data:", formData);
    }
  };

  return (
    <>
      <Container sx={{ py: 8, backgroundColor: "#7bffeb40" }}>
        <Box
          sx={{
            maxWidth: 500,
            mx: "auto",
            textAlign: "center",
            padding: 4,
            borderRadius: 2,
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fffff2fc",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#003366",
              mb: 4,
              fontFamily: "'Smooch Sans', sans-serif",
              letterSpacing: 1,
            }}
          >
            Log In to Your Account
          </Typography>
          <Divider
            sx={{ mb: 4, borderColor: "#003366", width: "50px", mx: "auto" }}
          />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                required
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                required
                error={!!errors.password}
                helperText={errors.password}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.rememberMe}
                    onChange={handleCheckboxChange}
                    color="primary"
                  />
                }
                label="Remember Me"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#003366",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#00509e",
                  },
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                }}
                onClick={handleLogin}
              >
                Log In
              </Button>
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  color: "#003366",
                  fontFamily: "'Ubuntu', 'Smooch Sans', sans-serif",
                  fontSize: "1.2rem",
                }}
              >
                Don't have an account?{" "}
                <a href="/signup" style={{ color: "#00509e" }}>
                  Sign Up
                </a>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Login;
