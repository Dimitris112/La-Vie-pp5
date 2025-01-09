import React, { useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { useRedirect } from "../../hooks/useRedirect";

function SignUpForm() {
  useRedirect("loggedIn");

  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  const { username, password1, password2 } = signUpData;

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/dj-rest-auth/registration/", signUpData);
      history.push("/signin");
    } catch (err) {
      setErrors(err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
        component={motion.div}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: 4,
              backgroundColor: theme.palette.background.paper,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                color: theme.palette.primary.main,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Sign Up
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ mb: 3, color: theme.palette.text.secondary }}
            >
              Create a new account to get started.
            </Typography>
            <form
              onSubmit={handleSubmit}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <TextField
                fullWidth
                margin="normal"
                label="Username"
                name="username"
                value={username}
                onChange={handleChange}
                error={Boolean(errors.username)}
                helperText={errors.username?.[0]}
                autoFocus
                variant="outlined"
                InputLabelProps={{
                  style: { color: theme.palette.text.primary },
                }}
                inputProps={{
                  style: { color: theme.palette.text.primary },
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                type="password"
                label="Password"
                name="password1"
                value={password1}
                onChange={handleChange}
                error={Boolean(errors.password1)}
                helperText={errors.password1?.[0]}
                variant="outlined"
                InputLabelProps={{
                  style: { color: theme.palette.text.primary },
                }}
                inputProps={{
                  style: { color: theme.palette.text.primary },
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                type="password"
                label="Confirm Password"
                name="password2"
                value={password2}
                onChange={handleChange}
                error={Boolean(errors.password2)}
                helperText={errors.password2?.[0]}
                variant="outlined"
                InputLabelProps={{
                  style: { color: theme.palette.text.primary },
                }}
                inputProps={{
                  style: { color: theme.palette.text.primary },
                }}
              />
              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} severity="warning" sx={{ mt: 2 }}>
                  {message}
                </Alert>
              ))}

              <div style={{ marginTop: "16px" }}>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  <ul style={{ paddingLeft: "1.2rem", listStyleType: "none" }}>
                    <li>Includes both uppercase and lowercase letters</li>
                    <li>At least 8 characters</li>
                    <li>At least one number</li>
                    <li>At least one special character (!, @, #, $, % etc.)</li>
                  </ul>
                </Typography>
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{
                  mt: 2,
                  p: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  backgroundColor: theme.palette.primary.main,
                  ":hover": {
                    backgroundColor: theme.palette.secondary.main,
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
            <Typography
              align="center"
              sx={{ mt: 2, color: theme.palette.text.secondary }}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Already have an account?{" "}
              <Link
                to="/signin"
                style={{
                  color: theme.palette.secondary.main,
                  textDecoration: "none",
                }}
              >
                Sign in now!
              </Link>
            </Typography>
          </Box>
        </Container>
      </Grid>

      {isDesktop && (
        <Grid
          item
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage:
              "url('https://codeinstitute.s3.amazonaws.com/AdvancedReact/hero2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          component={motion.div}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </Grid>
  );
}

export default SignUpForm;
