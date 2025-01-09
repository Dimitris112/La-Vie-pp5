import { axiosReq, axiosRes } from "./axiosDefaults";
import axios from "axios";

export const blockUser = async (userId) => {
  try {
    const response = await axiosReq.post("/blocks/", { blocked: userId });
    return response.data;
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
};

export const unblockUser = async (userId) => {
  try {
    const response = await axiosRes.delete(`/blocks/${userId}/`);
    return response.data;
  } catch (error) {
    console.error("Error unblocking user:", error);
    throw error;
  }
};

export const fetchBlockedUsers = async () => {
  try {
    const response = await axios.get("/api/blocks/list/");
    return response.data;
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    return [];
  }
};
