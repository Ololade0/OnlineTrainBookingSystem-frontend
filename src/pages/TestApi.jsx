import React, { useEffect } from "react";
import api from "../api/axios";

const TestApi = () => {
  useEffect(() => {
    api.get("/health/") // 👈 example endpoint, adjust to your backend
      .then(res => console.log("✅ Backend Connected:", res.data))
      .catch(err => console.error("❌ Connection Failed:", err));
  }, []);

  return <h2>Check Console for API Test</h2>;
};

export default TestApi;
