import axios from "axios";

axios.defaults.baseURL = "/api";
axios.defaults.withCredentials = true; // required for cookies

const setContentType = (isFileUpload) => {
  if (isFileUpload) {
    axios.defaults.headers.post["Content-Type"] = "multipart/form-data"; // for file uploads
  } else {
    axios.defaults.headers.post["Content-Type"] = "application/json"; // for regular JSON requests
  }
};

export const axiosReq = axios.create(); // requests (POST, PUT, PATCH)
export const axiosRes = axios.create(); // responses (GET, DELETE)

export { setContentType };
