import { axiosReq, axiosRes, setContentType } from "./axiosDefaults";

export const blockUser = async (userId) => {
  try {
    setContentType(false); // Set Content-Type to application/json for this request
    const response = await axiosReq.post(
      "/blocks/",
      { blocked: userId },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    console.log("Block user response:", response);
    return response.data;
  } catch (error) {
    console.error(
      "Error blocking user:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

export const unblockUser = async (userId) => {
  try {
    setContentType(false);
    const response = await axiosRes.delete(`/blocks/${userId}/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    console.log("Unblock user response:", response);
    return response.data;
  } catch (error) {
    console.error(
      "Error unblocking user:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

export const fetchBlockedUsers = async () => {
  try {
    setContentType(false);
    const response = await axiosReq.get("/blocks/list/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    console.log("Blocked users:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching blocked users:",
      error.response ? error.response.data : error
    );
    return [];
  }
};
