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
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { setTokenTimestamp } from "../../utils/utils";

function SignInForm() {
  const setCurrentUser = useSetCurrentUser();
  useRedirect("loggedIn");

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      setTokenTimestamp(data);
      history.goBack();
    } catch (err) {
      setErrors(err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
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
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ mb: 3, color: theme.palette.text.secondary }}
            >
              Please sign in to continue.
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
                name="password"
                value={password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password?.[0]}
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
                  "Sign In"
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
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: theme.palette.secondary.main,
                  textDecoration: "none",
                }}
              >
                Sign up now!
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
              "url('https://codeinstitute.s3.amazonaws.com/AdvancedReact/hero.jpg')",
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

export default SignInForm;
