import React, { useRef, useState } from "react";
import { TextField, Button, Box, Alert, Avatar } from "@mui/material";
import { useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import Asset from "../../components/Asset";
import Upload from "../../assets/upload.png";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

function PostCreateForm() {
  useRedirect("loggedOut");

  const [errors, setErrors] = useState({});
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const { title, content, image } = postData;

  const imageInput = useRef(null);
  const history = useHistory();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      const file = event.target.files[0];
      setPostData((prevData) => ({
        ...prevData,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !content || !imageInput.current.files.length) {
      setErrors({
        title: !title ? ["Title is required"] : [],
        content: !content ? ["Content is required"] : [],
        image: !imageInput.current.files.length ? ["Image is required"] : [],
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", imageInput.current.files[0]);

    try {
      const { data } = await axiosReq.post("/posts/", formData);
      history.push(`/posts/${data.id}`);
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const renderTextFields = (
    <div className="text-center">
      <TextField
        label="Title"
        name="title"
        value={title}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors?.title}
        helperText={errors?.title?.join(", ")}
        margin="normal"
      />
      <TextField
        label="Content"
        name="content"
        value={content}
        onChange={handleChange}
        fullWidth
        multiline
        rows={6}
        variant="outlined"
        error={!!errors?.content}
        helperText={errors?.content?.join(", ")}
        margin="normal"
      />

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button
          className={`${btnStyles.Button} ${btnStyles.Blue}`}
          onClick={() => history.goBack()}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          className={`${btnStyles.Button} ${btnStyles.Blue}`}
          type="submit"
          disabled={!title || !content || !imageInput.current.files.length}
          variant="contained"
        >
          Create
        </Button>
      </Box>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="row">
        <Box
          className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          flex={1}
        >
          <Box textAlign="center">
            {image ? (
              <>
                <Avatar alt="Post image" src={image} sx={{ width: 150, height: 150, mx: "auto" }} />
                <Box mt={2}>
                  <Button
                    component="label"
                    variant="contained"
                    color="primary"
                    htmlFor="image-upload"
                  >
                    Change the image
                  </Button>
                </Box>
              </>
            ) : (
              <Box
                component="label"
                htmlFor="image-upload"
                style={{ cursor: "pointer" }}
                display="flex"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
              >
                <Asset
                  src={Upload}
                  message="Click to upload an image"
                />
              </Box>
            )}

            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleChangeImage}
              ref={imageInput}
              hidden
            />
            {errors?.image?.map((message, idx) => (
              <Alert key={idx} severity="warning">
                {message}
              </Alert>
            ))}

            <Box mt={1} fontSize="0.8rem" color="text.secondary" fontStyle="italic">
              Max width & height: 4096px | Max size: 2MB
            </Box>
          </Box>

          {renderTextFields}
        </Box>
      </Box>
    </form>
  );
}

export default PostCreateForm;
