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
import { useAuth } from "@/context/AuthContext";

const SignUp = () => {
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
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const { isLoggedIn, login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, rememberMe: e.target.checked });
  };

  const validate = () => {
    let tempErrors = {};

    if (!formData.firstName) tempErrors.firstName = "First Name is required";
    if (!formData.lastName) tempErrors.lastName = "Last Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Valid Email is required";
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber))
      tempErrors.phoneNumber = "Valid 10-digit Phone Number is required";
    if (!formData.address) tempErrors.address = "Address is required";
    if (!formData.aadharNumber || !/^\d{12}$/.test(formData.aadharNumber))
      tempErrors.aadharNumber = "Valid 12-digit Aadhar Number is required";
    if (
      !formData.emergencyContact1 ||
      !/^\d{10}$/.test(formData.emergencyContact1)
    )
      tempErrors.emergencyContact1 =
        "Valid 10-digit Emergency Contact 1 is required";
    if (
      !formData.emergencyContact2 ||
      !/^\d{10}$/.test(formData.emergencyContact2)
    )
      tempErrors.emergencyContact2 =
        "Valid 10-digit Emergency Contact 2 is required";
    if (!formData.password || formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters long";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSignup = () => {
    if (validate()) {
      // Logic to handle signup (e.g., API call)
      console.log("Signup Data:", formData);
      login();
      window.location.href = "/my-reports";
      console.log(isLoggedIn);
    }
  };

  return (
    <>
      <Container sx={{ py: 8, backgroundColor: "#7bffeb40" }}>
        <Box
          sx={{
            maxWidth: 700,
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
            Create Your Account
          </Typography>
          <Divider
            sx={{ mb: 4, borderColor: "#003366", width: "50px", mx: "auto" }}
          />
          <Grid container spacing={3}>
            {[
              { label: "First Name", name: "firstName" },
              { label: "Last Name", name: "lastName" },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone Number", name: "phoneNumber", type: "tel" },
              { label: "Address", name: "address", multiline: true, rows: 3 },
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
              { label: "Create Password", name: "password", type: "password" },
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
                  required
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
            ))}
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
                onClick={handleSignup}
              >
                Sign Up
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
                Already have an account?{" "}
                <a href="/login" style={{ color: "#00509e" }}>
                  Log in
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

export default SignUp;
