import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios.config";
export default function PostAuthRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get("/api/users/get-role");
        const role = data.role;
        if (!role) {
          console.log("Role not found");
          navigate("/not-found");
        } else if (role === "WORKER") {
          navigate("/home");
        } else {
          navigate("/");
        }
      } catch (err) {
        console.log("something went wrong while fetching user role", err);
      }
    };

    fetchUserData();
  }, [navigate]);
  return (
    <div>
      <h2>Logging in, please wait...</h2>
      <div className="spinner">Loading...</div> {/* Optional: Add a spinner */}
    </div>
  );
}
