import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Container,
  Grid,
  TextField,
  Button,
  IconButton,
  Alert,
  Typography,
} from "@mui/material";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";
import { motion } from "framer-motion";
import { PhotoCamera } from "@mui/icons-material";
import styles from "../../styles/ProfileEditForm.module.css";

const ProfileEditForm = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const imageFile = useRef();

  const [profileData, setProfileData] = useState({
    name: "",
    content: "",
    image: "",
  });
  const { name, content, image } = profileData;

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleMount = async () => {
      if (currentUser?.profile_id?.toString() === id) {
        try {
          const { data } = await axiosReq.get(`/profiles/${id}/`);
          const { name, content, image } = data;
          setProfileData({ name, content, image });
        } catch (err) {
          history.push("/");
        }
      } else {
        history.push("/");
      }
    };

    handleMount();
  }, [currentUser, history, id]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("content", content);

    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }

    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image,
      }));
      history.goBack();
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="sm" className={styles.formContainer}>
        <Grid container spacing={2}>
          <Grid item xs={12} className={styles.avatarSection}>
            {image && (
              <img src={image} alt="Profile" className={styles.avatar} />
            )}
            <input
              type="file"
              ref={imageFile}
              accept="image/*"
              id="image-upload"
              hidden
              onChange={(e) => {
                if (e.target.files.length) {
                  setProfileData({
                    ...profileData,
                    image: URL.createObjectURL(e.target.files[0]),
                  });
                }
              }}
            />
            <label htmlFor="image-upload" className={styles.uploadLabel}>
              <IconButton component="span">
                <PhotoCamera />
              </IconButton>
              <Typography variant="body1" className={styles.uploadText}>
                Upload your photo
              </Typography>
            </label>
            {errors?.image?.map((message, idx) => (
              <Alert key={idx} severity="error" className={styles.errorMessage}>
                {message}
              </Alert>
            ))}
          </Grid>

          <Grid item xs={12}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Bio"
                variant="outlined"
                fullWidth
                name="content"
                value={content}
                onChange={handleChange}
                error={!!errors?.content}
                helperText={errors?.content?.join(", ")}
                multiline
                rows={4}
                margin="normal"
              />

              <div className={styles.buttonSection}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => history.goBack()}
                  className={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  className={styles.saveButton}
                >
                  Save
                </Button>
              </div>
            </form>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default ProfileEditForm;
