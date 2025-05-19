
import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://t7-notes-89-948060519163.us-central1.run.app",
  withCredentials: true,
});

export default AxiosInstance;
