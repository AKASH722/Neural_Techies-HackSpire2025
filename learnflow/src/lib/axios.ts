import axios from "axios";

const mlServiceApi = axios.create({
  baseURL: process.env.ML_SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default mlServiceApi;
