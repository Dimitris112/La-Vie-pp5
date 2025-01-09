import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Switch as MaterialSwitch, FormControlLabel } from "@mui/material";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostCreateForm from "./pages/posts/PostCreateForm";
import PostPage from "./pages/posts/PostPage";
import PostsPage from "./pages/posts/PostsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import PostEditForm from "./pages/posts/PostEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import NotFound from "./components/NotFound";
import ReportsPage from "./pages/reports/ReportsPage";
import { FaSun, FaMoon } from "react-icons/fa";
import Footer from "./components/Footer";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  // Retrieve the dark mode preference from localStorage or default to false
  // https://semaphoreci.com/blog/dark-mode-reactjs-material-ui#:~:text=To%20toggle%20between%20the%20light,it%20in%20the%20App%20component.
  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  const [darkMode, setDarkMode] = useState(savedDarkMode);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    transitions: {
      duration: 300,
    },
  });

  const handleThemeChange = (event) => {
    const newDarkMode = event.target.checked;
    setDarkMode(newDarkMode);
    // Store the user's preference in localStorage
    localStorage.setItem("darkMode", newDarkMode);
    document.body.setAttribute("data-theme", newDarkMode ? "dark" : "light");
  };

  useEffect(() => {
    // console.log(`Dark Mode is ${darkMode ? "enabled" : "disabled"}`);
  }, [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className={styles.App}>
          <NavBar darkMode={darkMode} handleThemeChange={handleThemeChange} />
          <FormControlLabel
            control={
              <MaterialSwitch
                checked={darkMode}
                onChange={handleThemeChange}
                name="darkMode"
                color="default"
                className={styles.darkModeSwitch}
              />
            }
            label={
              <span className={styles.switchLabel}>
                {darkMode ? <FaMoon /> : <FaSun />}{" "}
              </span>
            }
          />
          <Container className={styles.Main}>
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <PostsPage message="No results found. Adjust the search keyword." />
                )}
              />
              <Route
                exact
                path="/feed"
                render={() => (
                  <PostsPage
                    message="No results found. Adjust the search keyword or follow a user."
                    filter={`owner__followed__owner__profile=${profile_id}&`}
                  />
                )}
              />
              <Route
                exact
                path="/liked"
                render={() => (
                  <PostsPage
                    message="No results found. Adjust the search keyword or like a post."
                    filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
                  />
                )}
              />
              <Route exact path="/signin" render={() => <SignInForm />} />
              <Route exact path="/signup" render={() => <SignUpForm />} />
              <Route
                exact
                path="/posts/create"
                render={() => <PostCreateForm />}
              />
              <Route exact path="/posts/:id" render={() => <PostPage />} />
              <Route
                exact
                path="/posts/:id/edit"
                render={() => <PostEditForm />}
              />
              <Route
                exact
                path="/profiles/:id"
                render={() => <ProfilePage />}
              />
              <Route
                exact
                path="/profiles/:id/edit"
                render={() => <ProfileEditForm />}
              />
              <Route
                exact
                path="/profiles/:id/edit/username"
                render={() => <UsernameForm />}
              />
              <Route
                exact
                path="/profiles/:id/edit/password"
                render={() => <UserPasswordForm />}
              />
              <Route exact path="/reports/:pk" render={() => <ReportsPage />} />
              <Route exact path="*" render={() => <NotFound />} />
            </Switch>
          </Container>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
